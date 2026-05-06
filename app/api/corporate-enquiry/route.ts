import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/send-email';

/* ─────────────────────────────────────────────────────────────
   POST /api/corporate-enquiry

   Receives a JSON body with:
     - name
     - email
     - mobile
     - contactMethods (array of strings, optional)
     - recaptchaToken

   Verifies the reCAPTCHA token, then sends two emails:
     1. Internal notification to steve@lucyhallmassage.com
     2. Autoresponder to enquirer with employer PDF download link

   The flow forces enquirers to provide their details before
   they can grab the PDF, so every download is also a captured
   lead.
   ───────────────────────────────────────────────────────────── */

const NOTIFICATION_RECIPIENT =
  process.env.CORPORATE_ENQUIRY_TO || 'steve@lucyhallmassage.com';
const PDF_URL = 'https://www.lucyhallmassage.com/employer-info.pdf';
const RECAPTCHA_THRESHOLD = 0.5;
const RECAPTCHA_EXPECTED_ACTION = 'corporate_enquiry';

const METHOD_LABELS: Record<string, string> = {
  phone:  'Phone call',
  sms:    'SMS/WhatsApp',
  mobile: 'Mobile call',
  email:  'Email',
};

// ── reCAPTCHA verification ────────────────────────────────────
async function verifyRecaptcha(token: string): Promise<{
  ok: boolean;
  score?: number;
  reason?: string;
}> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('[corporate-enquiry] RECAPTCHA_SECRET_KEY missing - skipping verification');
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
  mobile: string;
  contactMethods: string[];
  recaptchaScore?: number;
}) {
  const { name, email, mobile, contactMethods, recaptchaScore } = opts;
  const methodsLabels = contactMethods
    .map((m) => METHOD_LABELS[m] || m)
    .join(', ');
  const methodsDisplay = methodsLabels || '<em style="color: #888;">none specified</em>';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000;">
      <h2 style="color: #000; margin: 0 0 24px;">New Corporate Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; width: 180px; vertical-align: top;">Name:</td>
          <td style="padding: 8px 0;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mobile:</td>
          <td style="padding: 8px 0;"><a href="tel:${escapeHtml(mobile)}">${escapeHtml(mobile)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Preferred contact:</td>
          <td style="padding: 8px 0;">${methodsDisplay}</td>
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
    `Mobile: ${mobile}`,
    `Preferred contact: ${methodsLabels || 'none specified'}`,
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
    '07765 555078 - info@lucyhallmassage.com',
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

function isValidMobile(mobile: string): boolean {
  return /^[\d\s+()-]{7,}$/.test(mobile);
}

// ── Route handler ─────────────────────────────────────────────
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    mobile?: string;
    contactMethods?: string[];
    recaptchaToken?: string;
    // Secondary (enriched-lead) submission fields
    secondary?: boolean;
    detailed?: boolean;
    // Legacy secondary fields (kept for backward compat)
    phone?: string;
    company?: string;
    domain?: string;
    postcode?: string;
    position?: string;
    specialArrangements?: string;
    teamSize?: string;
    // NEW detailed lead capture fields
    officeLocation?: string;
    employeeCount?: string;
    serviceTypes?: string[];
    timing?: string;
    budget?: string;
    enquiryDetails?: string;
    heardAbout?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name   = (body.name   || '').trim();
  const email  = (body.email  || '').trim();
  const mobile = (body.mobile || '').trim();
  const contactMethods = Array.isArray(body.contactMethods)
    ? body.contactMethods.filter((m) => typeof m === 'string')
    : [];

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }
  if (!mobile || !isValidMobile(mobile)) {
    return NextResponse.json({ error: 'A valid mobile number is required' }, { status: 400 });
  }

  // ── Handle DETAILED (qualified-lead) submission ──────
  // The rebuilt SecondaryEnquiryModal posts with detailed:true.
  // We send Steve a richer "Detailed Lead Capture" email with
  // the new field set.
  if (body.secondary === true && body.detailed === true) {
    const officeLocation = (body.officeLocation || '').trim();
    const employeeCount  = (body.employeeCount  || '').trim();
    const serviceTypes   = Array.isArray(body.serviceTypes) ? body.serviceTypes : [];
    const timing         = (body.timing         || '').trim();
    const budget         = (body.budget         || '').trim();
    const enquiryDetails = (body.enquiryDetails || '').trim();
    const heardAbout     = (body.heardAbout     || '').trim();

    const employeeLabels: Record<string, string> = {
      'under-20':  'Under 20',
      '20-50':     '20-50',
      '50-100':    '50-100',
      '100-250':   '100-250',
      '250-plus':  '250+',
    };
    const employeeLabel = employeeLabels[employeeCount] || employeeCount || 'not specified';

    const serviceLabels: Record<string, string> = {
      'one-off':       'One-off wellbeing day',
      'event-massage': 'Event massage',
      'monthly':       'Monthly workplace massage',
      'quarterly':     'Quarterly wellbeing sessions',
      'weekly':        'Weekly onsite massage',
      'unsure':        'Unsure / would like recommendations',
    };
    const serviceLabelsList = serviceTypes.map((s) => serviceLabels[s] || s).join(', ') || 'not specified';

    const timingLabels: Record<string, string> = {
      'asap':           'ASAP',
      'within-1-month': 'Within 1 month',
      '1-3-months':     '1-3 months',
      '3-plus-months':  '3+ months',
      'exploring':      'Just exploring options',
    };
    const timingLabel = timingLabels[timing] || timing || 'not specified';

    const budgetLabels: Record<string, string> = {
      'under-500':  'Under £500',
      '500-1000':   '£500-£1,000',
      '1000-2500':  '£1,000-£2,500',
      '2500-plus':  '£2,500+',
      'unsure':     'Unsure',
    };
    const budgetLabel = budgetLabels[budget] || budget || 'not specified';

    const heardAboutLabels: Record<string, string> = {
      'google':           'Google search',
      'referral':         'Referral',
      'linkedin':         'LinkedIn',
      'social-media':     'Social media',
      'existing-client':  'Existing client recommendation',
      'event':            'Event',
      'other':            'Other',
    };
    const heardAboutLabel = heardAboutLabels[heardAbout] || heardAbout || 'not specified';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000;">
        <h2 style="color: #000; margin: 0 0 8px;">Detailed Lead Capture</h2>
        <p style="color: #888; font-size: 13px; margin: 0 0 24px;">
          ${escapeHtml(name)} provided detailed qualifying information after their initial enquiry.
        </p>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #555; margin: 24px 0 8px;">Contact</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: 600; width: 200px; vertical-align: top;">Name:</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Mobile:</td><td style="padding: 6px 0;"><a href="tel:${escapeHtml(mobile)}">${escapeHtml(mobile)}</a></td></tr>
        </table>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #555; margin: 24px 0 8px;">Company &amp; Office</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: 600; width: 200px; vertical-align: top;">Office Location:</td><td style="padding: 6px 0;">${escapeHtml(officeLocation) || '<em>not specified</em>'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Employees Onsite:</td><td style="padding: 6px 0;">${escapeHtml(employeeLabel)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Service Interest:</td><td style="padding: 6px 0;">${escapeHtml(serviceLabelsList)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Timing:</td><td style="padding: 6px 0;">${escapeHtml(timingLabel)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Budget:</td><td style="padding: 6px 0;">${escapeHtml(budgetLabel)}</td></tr>
        </table>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #555; margin: 24px 0 8px;">Enquiry Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: 600; width: 200px; vertical-align: top;">What prompted enquiry:</td><td style="padding: 6px 0;">${escapeHtml(enquiryDetails) || '<em>not specified</em>'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Heard about us via:</td><td style="padding: 6px 0;">${escapeHtml(heardAboutLabel)}</td></tr>
        </table>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px; margin: 0;">
          Submitted via the detailed enquiry modal on lucyhallmassage.com.
        </p>
      </div>
    `;

    const text = [
      'Detailed Lead Capture',
      '',
      `${name} provided detailed qualifying information after their initial enquiry.`,
      '',
      '--- Contact ---',
      `Name: ${name}`,
      `Email: ${email}`,
      `Mobile: ${mobile}`,
      '',
      '--- Company & Office ---',
      `Office Location: ${officeLocation || 'not specified'}`,
      `Employees Onsite: ${employeeLabel}`,
      `Service Interest: ${serviceLabelsList}`,
      `Timing: ${timingLabel}`,
      `Budget: ${budgetLabel}`,
      '',
      '--- Enquiry Details ---',
      `What prompted enquiry: ${enquiryDetails || 'not specified'}`,
      `Heard about us via: ${heardAboutLabel}`,
      '',
      'Submitted via the detailed enquiry modal on lucyhallmassage.com.',
    ].join('\n');

    try {
      await sendEmail({
        to:      NOTIFICATION_RECIPIENT,
        replyTo: email,
        subject: `Detailed Lead Capture - ${name}`,
        html,
        text,
      });
    } catch (err) {
      console.error('[corporate-enquiry] Detailed lead notification email failed:', err);
      return NextResponse.json(
        { error: 'Could not save your details, please try again or email info@lucyhallmassage.com directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  // ── Handle SECONDARY (enriched-lead) submission ─────────────
  // The secondary form is triggered after the user has already
  // submitted the initial enquiry (so we already have their basic
  // details + sent the PDF). This is the optional follow-up where
  // they can provide richer info. We send Steve a follow-up email
  // tagged so he can spot it and link it back to the original lead.
  if (body.secondary === true) {
    const phone    = (body.phone    || '').trim();
    const company  = (body.company  || '').trim();
    const domain   = (body.domain   || '').trim();
    const postcode = (body.postcode || '').trim();
    const position = (body.position || '').trim();
    const special  = (body.specialArrangements || '').trim();
    const teamSize = (body.teamSize || '').trim();

    const methodsLabels = contactMethods
      .map((m) => METHOD_LABELS[m] || m)
      .join(', ') || 'not specified';

    const teamSizeLabels: Record<string, string> = {
      small:  'Small (2-10)',
      medium: 'Medium (10-25)',
      large:  'Large (25+)',
    };
    const teamSizeLabel = teamSizeLabels[teamSize] || teamSize || 'not specified';

    const specialLabels: Record<string, string> = {
      yes:   'Yes',
      no:    'No',
      maybe: 'Maybe',
    };
    const specialLabel = specialLabels[special] || special || 'not specified';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #000;">
        <h2 style="color: #000; margin: 0 0 8px;">Lead Enriched</h2>
        <p style="color: #888; font-size: 13px; margin: 0 0 24px;">
          ${escapeHtml(name)} provided additional details after their initial enquiry.
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 600; width: 200px; vertical-align: top;">Name:</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mobile:</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(mobile)}">${escapeHtml(mobile)}</a></td></tr>
          ${phone    ? `<tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>` : ''}
          ${company  ? `<tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Company:</td><td style="padding: 8px 0;">${escapeHtml(company)}</td></tr>` : ''}
          ${domain   ? `<tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Domain:</td><td style="padding: 8px 0;">${escapeHtml(domain)}</td></tr>` : ''}
          ${postcode ? `<tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Postcode:</td><td style="padding: 8px 0;">${escapeHtml(postcode)}</td></tr>` : ''}
          ${position ? `<tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Position:</td><td style="padding: 8px 0;">${escapeHtml(position)}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Preferred contact:</td><td style="padding: 8px 0;">${escapeHtml(methodsLabels)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Team size:</td><td style="padding: 8px 0;">${escapeHtml(teamSizeLabel)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Special arrangements:</td><td style="padding: 8px 0;">${escapeHtml(specialLabel)}</td></tr>
        </table>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px; margin: 0;">
          Submitted via the secondary enquiry modal on lucyhallmassage.com.
        </p>
      </div>
    `;

    const text = [
      'Lead Enriched',
      '',
      `${name} provided additional details after their initial enquiry.`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Mobile: ${mobile}`,
      phone    ? `Phone: ${phone}` : '',
      company  ? `Company: ${company}` : '',
      domain   ? `Domain: ${domain}` : '',
      postcode ? `Postcode: ${postcode}` : '',
      position ? `Position: ${position}` : '',
      `Preferred contact: ${methodsLabels}`,
      `Team size: ${teamSizeLabel}`,
      `Special arrangements: ${specialLabel}`,
      '',
      'Submitted via the secondary enquiry modal on lucyhallmassage.com.',
    ].filter(Boolean).join('\n');

    try {
      await sendEmail({
        to:      NOTIFICATION_RECIPIENT,
        replyTo: email,
        subject: `Lead Enriched - ${name} (additional details)`,
        html,
        text,
      });
    } catch (err) {
      console.error('[corporate-enquiry] Secondary notification email failed:', err);
      return NextResponse.json(
        { error: 'Could not save your details, please try again or email info@lucyhallmassage.com directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  }


  const recaptcha = await verifyRecaptcha(body.recaptchaToken || '');
  if (!recaptcha.ok) {
    console.warn('[corporate-enquiry] reCAPTCHA rejected:', recaptcha.reason);
    return NextResponse.json(
      { error: 'Verification failed, please try again.' },
      { status: 400 }
    );
  }

  const notification  = buildNotificationEmail({ name, email, mobile, contactMethods, recaptchaScore: recaptcha.score });
  const autoresponder = buildAutoresponderEmail({ name });

  try {
    await sendEmail({
      to:      NOTIFICATION_RECIPIENT,
      replyTo: email,
      subject: `New Corporate Enquiry - ${name}`,
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
    console.error('[corporate-enquiry] Autoresponder email failed:', err);
  }

  return NextResponse.json({ ok: true });
}
