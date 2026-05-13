/**
 * POST /api/submit-wellbeing
 *
 * Handles the WellbeingForm submission (used on /start-your-journey AND
 * /tips-download). Three side effects:
 *
 *   1. Send Lucy a notification email via Resend (so she sees the lead
 *      immediately in her inbox).
 *   2. Send the USER an autoresponder email via Resend — thank-you with
 *      the tips PDF link. Sets relationship up before the MailerLite
 *      nurture sequence kicks in 1 day later.
 *   3. Add the subscriber to MailerLite group "Wellbeing leads" with a
 *      computed `segment` field — MailerLite then runs the nurture
 *      automation (Welcome +1d, Article +8d branched on segment,
 *      Meet the team +15d, Check-in +22d).
 *
 * Side effects are best-effort: if any one fails we still attempt the
 * others, so a partial failure doesn't lose the lead. Only if BOTH the
 * Lucy notification AND MailerLite enrolment fail do we return an error
 * to the user (the autoresponder is "nice to have" — if it fails alone
 * the user still sees the on-page confirmation).
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
      'User autoresponder sent (Resend).',
      'Nurture sequence: Welcome (+1d) → Article (+8d, segment-branched) → Meet the team (+15d) → Check-in (+22d).',
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

  // ── 2. User autoresponder (Resend) ───────────────────────────────────────
  // Instant thank-you email to the user with the tips PDF link.
  // Fires before the MailerLite nurture sequence starts (+1 day).
  // Best-effort: failure here doesn't block the MailerLite enrolment.
  const userReplyTo = process.env.USER_AUTORESPONDER_REPLY_TO || 'steve@lucyhallmassage.com';
  const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lhm-six.vercel.app';
  let autoresponderResult: { success: boolean; error?: string } = { success: false, error: 'not attempted' };

  const autoresponderText = [
    `Hi ${body.firstName},`,
    '',
    "Thanks for getting in touch — we've received your details.",
    '',
    `Your free copy of "5 Tips to a Healthy Body" is here: ${siteBaseUrl}/5-tips-to-a-healthy-body.pdf`,
    '',
    "Over the coming weeks I'll send you a couple of practical, useful things — articles tailored to what you mentioned, a brief introduction to the team, and how we work.",
    '',
    'No spam, no pressure. Just useful stuff.',
    '',
    `If you'd like to book in directly, you can do so anytime here: ${siteBaseUrl}/book-online`,
    '',
    "Or just reply to this email if you'd like to chat.",
    '',
    'Warmly,',
    'Lucy',
    '',
    '— Lucy Hall Massage Therapy',
    'Thoday Street & Cromwell Road, Cambridge',
  ].join('\n');

  const autoresponderEmail = await sendEmail({
    to: body.email!.trim(),
    subject: 'Thanks for getting in touch with Lucy Hall Massage Therapy',
    text: autoresponderText,
    replyTo: userReplyTo,
  });
  autoresponderResult = autoresponderEmail.success
    ? { success: true }
    : { success: false, error: autoresponderEmail.error };

  // ── 3. Add subscriber to MailerLite ──────────────────────────────────────
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
  if (!autoresponderResult.success) {
    console.error('User autoresponder failed:', autoresponderResult.error);
  }
  if (!mailerliteResult.success) {
    console.error('MailerLite enrolment failed:', mailerliteResult.error);
  }

  // Return success if EITHER Lucy notification OR MailerLite enrolment worked.
  // The autoresponder is "nice to have" — failure alone doesn't block success.
  // Better to lose one side-effect than make the user think their submission
  // failed when they're actually in the nurture sequence.
  if (!notificationResult.success && !mailerliteResult.success) {
    return NextResponse.json(
      { success: false, error: 'Both notification and enrolment failed. Please try again or contact us directly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
