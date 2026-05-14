/**
 * POST /api/submit-receipt-request
 *
 * Sends two emails on a successful submission:
 *   1. Notification to info@lucyhallmassage.com so the team can
 *      pull the receipt from SimplyBook and forward to the client.
 *   2. Friendly auto-responder to the user confirming we got it.
 *
 * Spam protection: honeypot field 'website'. Real users leave it
 * blank; bots fill it. We silently return success on a hit.
 *
 * Subject prefix [Receipt Request] so info@ can filter the inbox.
 */
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/send-email';
import { services } from '@/app/data/services';
export const runtime = 'nodejs';
type RequestBody = {
  name?:          string;
  email?:         string;
  orderNumber?:   string;
  treatmentDate?: string;
  treatment?:     string;
  addressLine1?:  string;
  town?:          string;
  postcode?:      string;
  notes?:         string | null;
  website?:       string; // honeypot
};
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function formatDate(): string {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}
// Format an ISO date string (YYYY-MM-DD from <input type=date>) into DD/MM/YYYY
// for the email body. Falls back to the raw value if it doesn't parse.
function formatTreatmentDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}
// Convert a treatment slug back into a human-readable title for the email.
// Falls back to the slug itself if it's not in services.ts.
function treatmentLabel(slug: string): string {
  const svc = services[slug];
  return svc ? svc.title : slug;
}
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    // ── HONEYPOT ────────────────────────────────────────────
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true });
    }
    // ── VALIDATION ──────────────────────────────────────────
    if (!body.name?.trim())                                return NextResponse.json({ success: false, error: 'Name is required' },         { status: 400 });
    if (!body.email?.trim() || !body.email.includes('@'))  return NextResponse.json({ success: false, error: 'Valid email required' },     { status: 400 });
    if (!body.orderNumber?.trim())                         return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    if (!body.treatmentDate?.trim())                       return NextResponse.json({ success: false, error: 'Treatment date is required' }, { status: 400 });
    if (!body.treatment?.trim())                           return NextResponse.json({ success: false, error: 'Treatment is required' },    { status: 400 });
    if (!body.addressLine1?.trim())                        return NextResponse.json({ success: false, error: 'Address is required' },      { status: 400 });
    if (!body.town?.trim())                                return NextResponse.json({ success: false, error: 'Town/City is required' },    { status: 400 });
    if (!body.postcode?.trim())                            return NextResponse.json({ success: false, error: 'Postcode is required' },     { status: 400 });
    const name          = body.name.trim();
    const email         = body.email.trim();
    const orderNumber   = body.orderNumber.trim();
    const treatmentDate = body.treatmentDate.trim();
    const treatment     = treatmentLabel(body.treatment.trim());
    const addressLine1  = body.addressLine1.trim();
    const town          = body.town.trim();
    const postcode      = body.postcode.trim();
    const notes         = (body.notes || '').trim();
    const submittedAt   = formatDate();
    const treatmentFmt  = formatTreatmentDate(treatmentDate);
    // ── 1. TEAM NOTIFICATION (to info@) ─────────────────────
    const teamText = [
      'Receipt Request',
      '===============',
      '',
      `Submitted: ${submittedAt}`,
      '',
      `Name:           ${name}`,
      `Email:          ${email}`,
      `Order number:   ${orderNumber}`,
      `Treatment date: ${treatmentFmt}`,
      `Treatment:      ${treatment}`,
      `Address:        ${addressLine1}`,
      `Town/City:      ${town}`,
      `Postcode:       ${postcode}`,
      ...(notes ? ['', 'Notes:', notes] : []),
      '',
      '---',
      'Action: pull the matching receipt from SimplyBook and forward to the email above.',
    ].join('\n');
    const detailsRows = [
      ['Name',           name],
      ['Email',          email],
      ['Order number',   orderNumber],
      ['Treatment date', treatmentFmt],
      ['Treatment',      treatment],
      ['Address',        addressLine1],
      ['Town/City',      town],
      ['Postcode',       postcode],
    ].map(([k, v]) =>
      `<tr><td style="padding:8px 14px;border-bottom:1px solid #e5e5e5;font-weight:600;width:42%;">${escapeHtml(k)}</td><td style="padding:8px 14px;border-bottom:1px solid #e5e5e5;">${escapeHtml(v)}</td></tr>`
    ).join('');
    const teamHtml = `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;color:#1a1a1a;">
        <h2 style="margin:0 0 6px;">Receipt Request</h2>
        <p style="color:#777;font-size:13px;margin:0 0 22px;">Submitted ${submittedAt}</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:20px;">${detailsRows}</table>
        ${notes ? `<p style="margin:0 0 14px;"><strong>Notes:</strong><br>${escapeHtml(notes).replace(/\n/g, '<br>')}</p>` : ''}
        <p style="font-size:13px;color:#555;margin-top:22px;border-top:1px solid #e5e5e5;padding-top:14px;">
          <strong>Action:</strong> pull the matching receipt from SimplyBook and forward to <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>.
        </p>
      </div>
    `;
    const teamResult = await sendEmail({
      to:      'info@lucyhallmassage.com',
      subject: `[Receipt Request] ${name} - ${treatmentFmt}`,
      text:    teamText,
      html:    teamHtml,
      replyTo: email,
    });
    if (!teamResult.success) {
      // Team email failed: bail out before sending the user a confirmation
      // they might never get a receipt for.
      return NextResponse.json({ success: false, error: 'Could not send notification: ' + teamResult.error }, { status: 500 });
    }
    // ── 2. USER AUTO-RESPONDER ──────────────────────────────
    const userText = [
      `Hi ${name.split(/\s+/)[0]},`,
      '',
      'Thanks for your receipt request. Got it.',
      '',
      `We process receipt requests every Friday. We'll pull the receipt for your treatment on ${treatmentFmt} and email it back to you. If you do not hear from us by the following Monday, please check your spam or junk folder before getting in touch.`,
      '',
      'Best wishes,',
      'Lucy Hall Massage Therapy',
      '',
      '---',
      '2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU',
      'lucyhallmassage.com',
    ].join('\n');
    const userHtml = `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;color:#1a1a1a;line-height:1.6;">
        <p style="margin:0 0 14px;">Hi ${escapeHtml(name.split(/\s+/)[0])},</p>
        <p style="margin:0 0 14px;">Thanks for your receipt request. Got it.</p>
        <p style="margin:0 0 14px;">
          We process receipt requests every Friday. We&rsquo;ll pull the receipt for your treatment on
          <strong>${escapeHtml(treatmentFmt)}</strong> and email it back to you.
          If you do not hear from us by the following Monday, please check your spam or junk folder
          before getting in touch.
        </p>
        <p style="margin:0 0 22px;">Best wishes,<br>Lucy Hall Massage Therapy</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;">
        <p style="font-size:12px;color:#777;margin:0;">
          2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU<br>
          <a href="https://www.lucyhallmassage.com" style="color:#777;">lucyhallmassage.com</a>
        </p>
      </div>
    `;
    // User auto-responder. We don't bail if this fails — the team
    // notification already landed, the user will still get their
    // receipt manually even if this confirmation didn't reach them.
    await sendEmail({
      to:      email,
      subject: 'Receipt request received - Lucy Hall Massage Therapy',
      text:    userText,
      html:    userHtml,
      replyTo: 'info@lucyhallmassage.com',
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('submit-receipt-request error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}