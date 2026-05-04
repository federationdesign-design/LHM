/**
 * POST /api/contact
 *
 * Handles contact form submissions from /contact.
 *
 * Flow:
 *   1. Parse JSON body
 *   2. Honeypot check — silently return success if the hidden `website`
 *      field is non-empty (bots fill it; humans don't)
 *   3. Verify the reCAPTCHA v3 token server-side against Google. Reject
 *      if score is below threshold (0.5) or verification fails.
 *   4. Validate required fields and length caps
 *   5. Send notification email to Lucy + Steve, with Reply-To set to the
 *      client's email so replies go straight back to them
 *   6. Send autoresponder email to the client
 *   7. Return { success, error } JSON
 *
 * The two emails are sent sequentially. If the autoresponder fails, the
 * notification has already gone — we still report success to the client
 * because Lucy has the message and can respond manually. Logging
 * captures the autoresponder failure for follow-up.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/send-email';

// Force this route to run on Node.js runtime (not Edge) — reCAPTCHA
// verification needs server-side fetch with a secret, and we want
// consistency with the questionnaire route.
export const runtime = 'nodejs';

// ── REQUEST SHAPE ─────────────────────────────────────────────────────────────

type RequestBody = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: boolean;
  /** reCAPTCHA v3 token from the client */
  recaptchaToken?: string;
  /** Honeypot — must be empty string. Bots will fill it. */
  website?: string;
};

// ── FIELD LENGTH CAPS ─────────────────────────────────────────────────────────
// Server-side guard against abuse: arbitrarily long submissions waste
// Resend quota and clutter the inbox. Caps are generous enough that no
// real user should hit them.

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_PHONE = 30;
const MAX_MESSAGE = 5000;

// reCAPTCHA v3 score threshold. Google returns 0.0 (very likely a bot)
// to 1.0 (very likely a human). 0.5 is Google's recommended default.
// Lower values let more borderline traffic through; higher values risk
// blocking real users.
const RECAPTCHA_MIN_SCORE = 0.5;

// ── VALIDATION ────────────────────────────────────────────────────────────────

function validate(body: RequestBody): string | null {
  if (!body.name?.trim()) return 'Please enter your name.';
  if (body.name.length > MAX_NAME) return 'Name is too long.';

  if (!body.email?.trim()) return 'Please enter your email address.';
  if (body.email.length > MAX_EMAIL) return 'Email address is too long.';
  if (!body.email.includes('@')) return 'Please enter a valid email address.';

  if (body.phone && body.phone.length > MAX_PHONE) return 'Phone number is too long.';

  if (!body.message?.trim()) return 'Please enter a message.';
  if (body.message.length > MAX_MESSAGE) return 'Message is too long. Please keep it under 5000 characters.';

  if (!body.consent) return 'Please tick the consent box to continue.';

  if (!body.recaptchaToken) return 'Security check failed. Please refresh the page and try again.';

  return null;
}

// ── reCAPTCHA VERIFICATION ────────────────────────────────────────────────────

type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

async function verifyRecaptcha(token: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('RECAPTCHA_SECRET_KEY env var is not set');
    return { ok: false, reason: 'Server configuration error.' };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data: RecaptchaVerifyResponse = await res.json();

    if (!data.success) {
      console.warn('reCAPTCHA verification failed:', data['error-codes']);
      return { ok: false, reason: 'Security check failed. Please refresh and try again.' };
    }

    if (typeof data.score === 'number' && data.score < RECAPTCHA_MIN_SCORE) {
      console.warn(`reCAPTCHA score ${data.score} below threshold ${RECAPTCHA_MIN_SCORE}`);
      return { ok: false, reason: 'Security check failed. Please refresh and try again.' };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('reCAPTCHA fetch error:', message);
    return { ok: false, reason: 'Security check could not be completed. Please try again.' };
  }
}

// ── HTML ESCAPING ─────────────────────────────────────────────────────────────
// User input goes into the notification email body. Escape it so a
// pasted bit of HTML or an attempt at injecting markup renders as text
// rather than executing in the email client.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── ROUTE HANDLER ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Parse body
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot — silently succeed if filled. Bots think they got through.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  // Validate fields
  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ success: false, error: validationError }, { status: 400 });
  }

  // Verify reCAPTCHA token
  const recaptchaResult = await verifyRecaptcha(body.recaptchaToken!);
  if (!recaptchaResult.ok) {
    return NextResponse.json({ success: false, error: recaptchaResult.reason }, { status: 400 });
  }

  // Trim values now that we know they're present
  const name = body.name!.trim();
  const email = body.email!.trim();
  const phone = body.phone?.trim() || '';
  const message = body.message!.trim();

  // ── NOTIFICATION EMAIL TO TEAM ──────────────────────────────────────────────
  // Comma-separated list of recipients from env so Lucy can change them
  // without a code deploy. Falls back to a sensible default if unset.
  const toEnv = process.env.CONTACT_EMAIL_TO || 'info@lucyhallmassage.com,steve@lucyhallmassage.com';
  const toList = toEnv.split(',').map(s => s.trim()).filter(Boolean);

  const submittedAt = new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const notificationSubject = `[Contact form] ${name}`;

  const notificationText = [
    'New contact form submission.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '(not provided)'}`,
    `Submitted: ${submittedAt}`,
    '',
    'Message:',
    message,
    '',
    '---',
    'Reply to this email to respond directly to the sender.',
  ].join('\n');

  const notificationHtml = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 600px;">
  <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 16px;">New contact form submission</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top; width: 100px;">Name</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #1a1a1a;">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Phone</td><td style="padding: 6px 0;">${phone ? escapeHtml(phone) : '<em style="color: #888;">not provided</em>'}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Submitted</td><td style="padding: 6px 0;">${escapeHtml(submittedAt)}</td></tr>
  </table>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
  <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 10px;">Message</h3>
  <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.5; padding: 14px 16px; background: #f6f6f6; border-radius: 4px;">${escapeHtml(message)}</div>
  <p style="font-size: 12px; color: #888; margin-top: 24px;">Reply to this email to respond directly to the sender.</p>
</div>`.trim();

  const notificationResult = await sendEmail({
    to: toList,
    subject: notificationSubject,
    text: notificationText,
    html: notificationHtml,
    replyTo: email,
  });

  if (!notificationResult.success) {
    console.error('Contact notification email failed:', notificationResult.error);
    return NextResponse.json(
      { success: false, error: 'Failed to send your message. Please try again, or email info@lucyhallmassage.com directly.' },
      { status: 500 }
    );
  }

  // ── AUTORESPONDER EMAIL TO CLIENT ───────────────────────────────────────────
  // Best-effort: if this fails, we've already notified Lucy and she can
  // reply manually. Don't surface the error to the user — the message
  // got through, which is what matters.

  // First name only for greeting — splits on whitespace, takes the first
  // chunk. If they typed "Mr Smith" we'd greet "Mr" which is mildly odd
  // but harmless. Keeps things simple.
  const firstName = name.split(/\s+/)[0] || name;

  const autoresponderSubject = 'Thanks for getting in touch';

  const autoresponderText = [
    `Hi ${firstName},`,
    '',
    `Thanks for your message — it's landed safely with the team and we'll come back to you within one working day.`,
    '',
    `If you were trying to book an appointment, you can do that any time at https://www.lucyhallmassage.com — it tends to be quicker than waiting for us to reply.`,
    '',
    `If your message is urgent, please call us on 07765 555078.`,
    '',
    `Speak soon,`,
    `Lucy Hall Massage Therapy`,
  ].join('\n');

  const autoresponderHtml = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 560px; font-size: 15px; line-height: 1.6;">
  <p>Hi ${escapeHtml(firstName)},</p>
  <p>Thanks for your message — it&rsquo;s landed safely with the team and we&rsquo;ll come back to you within one working day.</p>
  <p>If you were trying to book an appointment, you can do that any time at <a href="https://www.lucyhallmassage.com" style="color: #1a1a1a;">lucyhallmassage.com</a> — it tends to be quicker than waiting for us to reply.</p>
  <p>If your message is urgent, please call us on <a href="tel:07765555078" style="color: #1a1a1a;">07765 555078</a>.</p>
  <p style="margin-top: 28px;">Speak soon,<br />Lucy Hall Massage Therapy</p>
</div>`.trim();

  const autoresponderResult = await sendEmail({
    to: email,
    subject: autoresponderSubject,
    text: autoresponderText,
    html: autoresponderHtml,
  });

  if (!autoresponderResult.success) {
    // Notification already sent, so the form submission is functionally
    // a success. Log the autoresponder failure for follow-up but don't
    // surface to the user.
    console.error('Contact autoresponder email failed:', autoresponderResult.error);
  }

  return NextResponse.json({ success: true });
}
