/**
 * POST /api/submit-questionnaire
 *
 * Receives the questionnaire form submission, validates it, generates a PDF,
 * emails it to info@ via Resend, and returns success/error JSON.
 *
 * Power Automate watches the inbox, filters by subject prefix `[Questionnaire]`,
 * parses the subject for client name + date, creates a OneDrive folder, and
 * saves the attached PDF.
 *
 * Spam protection: honeypot field (hidden input named `website`). Real users
 * leave it blank. Bots fill all visible fields. If `website` is non-empty we
 * silently return success without doing anything.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateQuestionnairePdf, type QuestionnaireData } from '@/app/lib/generate-questionnaire-pdf';
import { sendEmail } from '@/app/lib/send-email';

// Force this route to run on Node.js runtime (not Edge) — pdf-lib needs Node APIs
export const runtime = 'nodejs';

// ── REQUEST SHAPE ─────────────────────────────────────────────────────────────

type RequestBody = Partial<Omit<QuestionnaireData, 'submittedAt'>> & {
  /** Honeypot — must be empty string. Bots will fill it. */
  website?: string;
};

// ── VALIDATION ────────────────────────────────────────────────────────────────

function validateRequiredFields(body: RequestBody): string | null {
  if (!body.firstName?.trim()) return 'First name is required';
  if (!body.email?.trim()) return 'Email is required';
  if (!body.email.includes('@')) return 'Email is invalid';
  if (!Array.isArray(body.musculoskeletal) || body.musculoskeletal.length === 0) {
    return 'Please answer the musculoskeletal section';
  }
  if (!Array.isArray(body.symptoms) || body.symptoms.length === 0) {
    return 'Please answer the symptoms section';
  }
  if (!Array.isArray(body.history) || body.history.length === 0) {
    return 'Please answer the medical history section';
  }
  if (!body.consent1 || !body.consent2 || !body.consent3) {
    return 'All three consent boxes must be ticked';
  }
  if (!body.declarationConsent) {
    return 'The declaration must be ticked';
  }
  if (!body.signature || body.signature.length < 100) {
    return 'A signature is required';
  }
  return null;
}

// ── FILENAME / SUBJECT FORMATTING ─────────────────────────────────────────────

/**
 * Sanitise a name component for use in a filename.
 * Removes characters that are problematic on Windows/OneDrive: \ / : * ? " < > |
 * Also collapses whitespace and trims.
 */
function sanitiseForFilename(s: string): string {
  return s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Format submission date as YYYY-MM-DD.
 */
function formatDateYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format submission time as HHMM (24h, no separator). Used as filename suffix
 * so Power Automate / OneDrive don't collide on duplicate same-day submissions.
 */
function formatTimeHM(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}${m}`;
}

// ── ROUTE HANDLER ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  // Honeypot check — silently succeed if filled. Bots think they got through.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  // Validate required fields
  const validationError = validateRequiredFields(body);
  if (validationError) {
    return NextResponse.json({ success: false, error: validationError }, { status: 400 });
  }

  // Build complete data object with submission timestamp
  const submittedAt = new Date();
  const data: QuestionnaireData = {
    firstName: body.firstName!.trim(),
    lastName: body.lastName?.trim() || '',
    email: body.email!.trim(),
    mobile: body.mobile?.trim() || '',
    dob: body.dob?.trim() || '',
    postcode: body.postcode?.trim() || '',
    pregnancy: body.pregnancy || null,
    trimester: body.trimester || null,
    emergencyName: body.emergencyName?.trim() || '',
    emergencyNumber: body.emergencyNumber?.trim() || '',
    gpName: body.gpName?.trim() || '',
    gpPractice: body.gpPractice?.trim() || '',
    medications: body.medications?.trim() || '',
    musculoskeletal: body.musculoskeletal!,
    symptoms: body.symptoms!,
    history: body.history!,
    cancer: body.cancer || null,
    cancerDetails: body.cancerDetails?.trim() || '',
    hearAbout: body.hearAbout || null,
    hearAboutOther: body.hearAboutOther?.trim() || '',
    notes: body.notes?.trim() || '',
    consent1: body.consent1!,
    consent2: body.consent2!,
    consent3: body.consent3!,
    declarationConsent: body.declarationConsent!,
    signature: body.signature!,
    submittedAt,
  };

  // Generate PDF
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateQuestionnairePdf(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('PDF generation failed:', msg);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF — please try again' },
      { status: 500 }
    );
  }

  // Build filename and subject for Power Automate parsing
  const dateYMD = formatDateYMD(submittedAt);
  const timeHM = formatTimeHM(submittedAt);
  const fullName = `${data.firstName} ${data.lastName || ''}`.trim();
  const safeName = sanitiseForFilename(fullName) || 'Anonymous';
  // Filename: "2026-05-03 - John Smith - questionnaire 1430.pdf"
  // Time suffix avoids collisions on duplicate same-day submissions.
  const filename = `${dateYMD} - ${safeName} - questionnaire ${timeHM}.pdf`;

  // Subject: "[Questionnaire] John Smith - 2026-05-03"
  // Power Automate filters on "[Questionnaire]" and parses out name + date.
  const subject = `[Questionnaire] ${safeName} - ${dateYMD}`;

  // Email body — short plain-text summary
  const text = [
    'New questionnaire received.',
    '',
    `Client: ${fullName}`,
    `Date: ${dateYMD}`,
    `Email: ${data.email}`,
    `Mobile: ${data.mobile || '(not provided)'}`,
    '',
    'Full questionnaire attached as PDF.',
  ].join('\n');

  // Send email
  const recipient = process.env.NOTIFICATION_EMAIL_TO;
  if (!recipient) {
    console.error('NOTIFICATION_EMAIL_TO env var is not set');
    return NextResponse.json(
      { success: false, error: 'Server configuration error — please contact support' },
      { status: 500 }
    );
  }

  const result = await sendEmail({
    to: recipient,
    subject,
    text,
    replyTo: data.email,
    attachments: [{ filename, content: pdfBuffer }],
  });

  if (!result.success) {
    console.error('Email send failed:', result.error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notification — please try again' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
