import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/send-email';

/* ─────────────────────────────────────────────────────────────
   POST /api/corporate-enquiry

   Receives a JSON body with name, email, company, phone, and a
   reCAPTCHA v3 token. Verifies the token with Google, then
   sends two emails via Resend:

     1. Internal notification to steve@lucyhallmassage.com
        (initially — will expand to lucy@ once Lucy is set up
        with an inbox)
     2. Autoresponder to the enquirer with a download link to
        the employer PDF

   The flow forces enquirers to provide their details before
   they can grab the PDF, so every download is also a captured
   lead.
   ───────────────────────────────────────────────────────────── */

// ── CONFIG ────────────────────────────────────────────────────
const NOTIFICATION_RECIPIENT =
  process.env.CORPORATE_ENQUIRY_TO || 'steve@lucyhallmassage.com';
const FROM_ADDRESS = 'noreply@lucyhallmassage.com';
const PDF_URL = 'https://www.lucyhallmassage.com/employer-info.pdf';
const RECAPTCHA_THRESHOLD = 0.5;
const RECAPTCHA_EXPECTED_ACTION = 'corporate_enquiry';

// ── reCAPTCHA verification ────────────────────────────────────
async function verifyRecaptcha(token: string): Promise<{
  ok: boolean;
  score?: number;
  reason?: string;
}> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    // No secret set means we're in dev or misconfigured — let
    // the request through but flag it in the logs.
    console.warn('[corporate-enquiry] RECAPTCHA_SECRET_KEY missing — skipping verification');
    return { ok: true };
  }
  if (!token) {
    return { ok: false, reason: 'No reCAPTCHA token provided' };
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await verifyRes.json();

    if (!data.success) {
      return { ok: false, reason: `reCAPTCHA failed: ${(data['error-codes'] || []).join(', ')}` };
    }
    if (data.action !== RECAPTCHA_EXPECTED_ACTION) {
      return { ok: false, reason: `reCAPTCHA action mismatch: got "${data.action}"` };
    }
    if (typeof data.score === 'number' && data.score < RECAPTCHA_THRESHOLD) {
      return { ok: false, score: data.score, reason: `reCAPTCHA score ${data.score} below threshold` };
    }
    return { ok: true, score: data.score };
  } catch (err) {
    console.error('[corporate-enquiry] reCAPTCHA verification error:', err);
    return { ok: false, reason: 'reCAPTCHA verification failed' };
  }
}

// ── Email body builders ───────────────────────────────────────
function buildNotificationEmail(opts: {
  name: string;
  email: string;
  company: string;
  phone: string;
  recaptchaScore?: number;
}) {
  const { name, email, company, phone, recaptchaScore } = opts;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000;">
      <h2 style="color: #000; margin: 0 0 24px;">New Corporate Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; width: 120px; vertical-align: top;">Name:</td>
          <td style="padding: 8px 0;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Company:</td>
          <td style="padding: 8px 0;">${escapeHtml(company)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Phone:</td>
          <td style="padding: 8px 0;">${phone ? `<a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>` : '<em style="color: #888;">not provided</em>'}</td>
        </tr>
      </table>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="color: #888; font-size: 12px; margin: 0;">
        Submitted via the corporate enquiry form on lucyhallmassage.com.<br />
        The enquirer was sent the employer PDF link automatically.
        ${recaptchaScore !== undefined ? `<br />reCAPTCHA score: ${recaptchaScore}` : ''}
      </p>
    </div>
  `;

  const text = [
    'New Corporate Enquiry',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Phone: ${phone || 'not provided'}`,
    '',
    'Submitted via the corporate enquiry form on lucyhallmassage.com.',
    'The enquirer was sent the employer PDF link automatically.',
    recaptchaScore !== undefined ? `reCAPTCHA score: ${recaptchaScore}` : '',
  ].filter(Boolean).join('\n');

  return { html, text };
}

function buildAutoresponderEmail(opts: { name: string }) {
  const { name } = opts;
  const firstName = (name.split(' ')[0] || name).trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000;">
      <h2 style="color: #000; margin: 0 0 24px;">Hi ${escapeHtml(firstName)},</h2>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Thanks for getting in touch about corporate massage. As promised, here&rsquo;s the employer PDF with everything you need to share internally:
      </p>

      <p style="margin: 32px 0;">
        <a href="${PDF_URL}" style="display: inline-block; background: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: 600;">
          Download the Employer PDF
        </a>
      </p>

      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Lucy will be in touch within one working day to chat about how we can support your team. In the meantime, if you&rsquo;ve got any questions, just hit reply.
      </p>

      <p style="font-size: 16px; line-height: 1.6; margin: 32px 0 0;">
        Looking forward to it,<br />
        <strong>The Lucy Hall Massage team</strong>
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

      <p style="color: #888; font-size: 12px; margin: 0;">
        Lucy Hall Massage Therapy &middot; 2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU<br />
        <a href="tel:07765555078" style="color: #888;">07765 555078</a> &middot;
        <a href="mailto:info@lucyhallmassage.com" style="color: #888;">info@lucyhallmassage.com</a>
      </p>
    </div>
  `;

  const text = [
    `Hi ${firstName},`,
    '',
    'Thanks for getting in touch about corporate massage. As promised, here is the employer PDF with everything you need to share internally:',
    '',
    PDF_URL,
    '',
    'Lucy will be in touch within one working day to chat about how we can support your team. In the meantime, if you have any questions, just hit reply.',
    '',
    'Looking forward to it,',
    'The Lucy Hall Massage team',
    '',
    '---',
    'Lucy Hall Massage Therapy',
    '2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU',
    '07765 555078 — info@lucyhallmassage.com',
  ].join('\n');

  return { html, text };
}

// ── Helpers ───────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Route handler ─────────────────────────────────────────────
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    recaptchaToken?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name    = (body.name    || '').trim();
  const email   = (body.email   || '').trim();
  const company = (body.company || '').trim();
  const phone   = (body.phone   || '').trim();

  // Validate required fields
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }
  if (!company) {
    return NextResponse.json({ error: 'Company is required' }, { status: 400 });
  }

  // Verify reCAPTCHA
  const recaptcha = await verifyRecaptcha(body.recaptchaToken || '');
  if (!recaptcha.ok) {
    console.warn('[corporate-enquiry] reCAPTCHA rejected:', recaptcha.reason);
    return NextResponse.json(
      { error: 'Verification failed, please try again.' },
      { status: 400 }
    );
  }

  // Build emails
  const notification  = buildNotificationEmail({ name, email, company, phone, recaptchaScore: recaptcha.score });
  const autoresponder = buildAutoresponderEmail({ name });

  // Send both emails. Notification is critical (we need to know
  // about the lead). Autoresponder is best-effort — if it fails
  // we still want to confirm to the user, since the lead is in.
  try {
    await sendEmail({
      to:      NOTIFICATION_RECIPIENT,
      replyTo: email,
      subject: `New Corporate Enquiry — ${company} (${name})`,
      html:    notification.html,
      text:    notification.text,
    });
  } catch (err) {
    console.error('[corporate-enquiry] Notification email failed:', err);
    return NextResponse.json(
      { error: 'Could not send your enquiry, please try again or email info@lucyhallmassage.com directly.' },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      to:      email,
      replyTo: 'info@lucyhallmassage.com',
      subject: 'Your Lucy Hall Massage Employer PDF',
      html:    autoresponder.html,
      text:    autoresponder.text,
    });
  } catch (err) {
    // Non-fatal — log it but still return success to user
    console.error('[corporate-enquiry] Autoresponder email failed:', err);
  }

  return NextResponse.json({ ok: true });
}
