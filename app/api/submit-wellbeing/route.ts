/**
 * POST /api/submit-wellbeing
 *
 * Handles the WellbeingForm submission (used on /start-your-journey AND
 * /tips-download). Two side effects:
 *
 *   1. Send Lucy a notification email via Resend (so she sees the lead
 *      immediately in her inbox).
 *   2. Add the subscriber to MailerLite group "Wellbeing leads" with a
 *      computed `segment` field — MailerLite then runs the nurture
 *      automation (Welcome +12hr, Article +7d branched on segment,
 *      Check-in +21d).
 *
 * Both side effects are best-effort: if MailerLite fails we still notify
 * Lucy, and vice versa, so a partial failure doesn't lose the lead.
 *
 * Spam protection: honeypot field (hidden input named `website`).
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/send-email';
import { addSubscriber } from '@/app/lib/mailerlite';

// Force this route to run on Node.js runtime (not Edge) — Resend SDK
// uses some Node APIs internally.
export const runtime = 'nodejs';

// ── REQUEST SHAPE ─────────────────────────────────────────────────────────────

type RequestBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  /** Multi-select of issue areas, e.g. ["Lower back", "Ankle"]. */
  issues?: string[];
  /** Magic-wand goal text, free-form. */
  goal?: string;
  /** Severity score 1-4 (1 = Tolerable, 4 = Unbearable). */
  severity?: number;
  /** GDPR consent — must be true. */
  consent?: boolean;
  /** Honeypot — must be empty for a real user. */
  website?: string;
};

// ── SEGMENT INFERENCE ─────────────────────────────────────────────────────────

/**
 * Issues that indicate an "active" lifestyle (sport / running / overuse).
 * These get routed to the gait analysis article in email 2.
 */
const ACTIVE_ISSUES = new Set([
  'Ankle',
  'Feet',
  'Wrist',
  'Quads',
  'Thighs',
]);

/**
 * Compute segment for nurture branching. Active wins if ANY active issue
 * is selected — even if desk issues are also selected, we err toward
 * "active" because someone with both desk pain AND ankle pain is more
 * likely to be a runner with secondary office stiffness than a desk
 * worker who happens to twist an ankle.
 *
 * If no issue is identifiable as active, default to "desk" — most
 * Wellbeing form submissions come from sedentary lifestyles.
 */
function computeSegment(issues: string[]): 'active' | 'desk' {
  for (const issue of issues) {
    if (ACTIVE_ISSUES.has(issue)) return 'active';
  }
  return 'desk';
}

// ── VALIDATION ────────────────────────────────────────────────────────────────

function validateRequiredFields(body: RequestBody): string | null {
  if (!body.firstName?.trim()) return 'First name is required';
  if (!body.email?.trim()) return 'Email is required';
  if (!body.email.includes('@')) return 'Email is invalid';
  if (!body.consent) return 'Consent is required';
  // Note: issues, goal, severity are optional. Form may have tightened
  // requirements client-side but server is permissive — we still want to
  // accept partial submissions and let the nurture flow handle them.
  return null;
}

// ── DATE HELPERS ──────────────────────────────────────────────────────────────

function formatDateYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── ROUTE HANDLER ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  // Honeypot — silently succeed if filled
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  // Validate
  const validationError = validateRequiredFields(body);
  if (validationError) {
    return NextResponse.json({ success: false, error: validationError }, { status: 400 });
  }

  const submittedAt = new Date();
  const issues = body.issues || [];
  const segment = computeSegment(issues);
  const fullName = `${body.firstName} ${body.lastName || ''}`.trim();
  const dateYMD = formatDateYMD(submittedAt);

  // ── 1. Notify Lucy (Resend) ──────────────────────────────────────────────
  const notificationRecipient = process.env.NOTIFICATION_EMAIL_TO;
  let notificationResult: { success: boolean; error?: string } = { success: false, error: 'not attempted' };

  if (notificationRecipient) {
    const subject = `[Nurture Enrolment] ${fullName} - ${dateYMD}`;
    const text = [
      'New wellbeing lead enrolled in nurture sequence.',
      '',
      `Name: ${fullName}`,
      `Email: ${body.email}`,
      `Mobile: ${body.mobile || '(not provided)'}`,
      `Segment: ${segment}`,
      '',
      `Issues: ${issues.length > 0 ? issues.join(', ') : '(none selected)'}`,
      `Severity: ${body.severity ?? '(not provided)'} / 4`,
      `Goal: ${body.goal || '(not provided)'}`,
      '',
      'Subscriber added to MailerLite "Wellbeing leads" group.',
      'Nurture sequence: Welcome (+12hr) → Article (+7d) → Check-in (+21d).',
    ].join('\n');

    const emailResult = await sendEmail({
      to: notificationRecipient,
      subject,
      text,
      replyTo: body.email,
    });
    notificationResult = emailResult.success
      ? { success: true }
      : { success: false, error: emailResult.error };
  } else {
    console.error('NOTIFICATION_EMAIL_TO env var is not set');
  }

  // ── 2. Add subscriber to MailerLite ──────────────────────────────────────
  const groupId = process.env.MAILERLITE_GROUP_ID;
  let mailerliteResult: { success: boolean; error?: string } = { success: false, error: 'not attempted' };

  if (groupId) {
    const subResult = await addSubscriber({
      email: body.email!.trim(),
      firstName: body.firstName!.trim(),
      lastName: body.lastName?.trim(),
      mobile: body.mobile?.trim(),
      segment,
      goal: body.goal?.trim(),
      severity: body.severity,
      groupId,
    });
    mailerliteResult = subResult.success
      ? { success: true }
      : { success: false, error: subResult.error };
  } else {
    console.error('MAILERLITE_GROUP_ID env var is not set');
  }

  // Log any failures server-side for debugging
  if (!notificationResult.success) {
    console.error('Lucy notification failed:', notificationResult.error);
  }
  if (!mailerliteResult.success) {
    console.error('MailerLite enrolment failed:', mailerliteResult.error);
  }

  // Return success if EITHER side worked. Better to lose Lucy's notification
  // than to make the user think their submission failed when they're in the
  // nurture sequence — and vice versa. Only error if BOTH failed.
  if (!notificationResult.success && !mailerliteResult.success) {
    return NextResponse.json(
      { success: false, error: 'Both notification and enrolment failed. Please try again or contact us directly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
