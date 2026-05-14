/**
 * POST /api/submit-workplace-feedback
 *
 * Receives workplace feedback form submissions and emails them to
 * lucy@lucyhallmassage.com via Resend.
 *
 * Spam protection: honeypot field (`website`) — real users leave it
 * blank, bots fill it. If non-empty we silently return success.
 *
 * No PDF generation, no DB write — pure email notification. Subject
 * prefix `[Workplace Feedback]` so Lucy can filter inbox-side.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/app/lib/send-email';

export const runtime = 'nodejs';

type RequestBody = {
  name?:           string;
  company?:        string;
  ratings?:        Record<string, string>;
  areasImproved?:  string | null;
  manageIssues?:   string | null;
  likedMost?:      string | null;
  doBetter?:       string | null;
  recommend?:      'yes' | 'no' | '';
  website?:        string; // honeypot
};

// Human-readable labels for each rating field in the email body.
// Order matters — defines the order in the email.
const RATING_LABELS: Array<[string, string]> = [
  ['experience',        'Overall experience'],
  ['feelAfter',         'How they feel after the session'],
  ['painRelief',        'Pain / discomfort relief'],
  ['posture',           'Posture or awareness improvement'],
  ['workdayDifference', 'Positive difference to working day'],
  ['benefitsLasted',    'Benefits lasting beyond the treatment'],
  ['supportValue',      'Value of ongoing workplace support'],
  ['companyBenefit',    'Valuable benefit from their company'],
  ['staffWellbeing',    'Important part of staff wellbeing'],
  ['missIt',            'Would miss it if no longer available'],
];

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDate(): string {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    // ── HONEYPOT ────────────────────────────────────────────
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true });
    }

    // ── VALIDATION ──────────────────────────────────────────
    if (!body.company?.trim())                             return NextResponse.json({ success: false, error: 'Company name is required' },      { status: 400 });
    if (body.recommend !== 'yes' && body.recommend !== 'no') {
      return NextResponse.json({ success: false, error: 'Please choose Yes or No to the recommend question' }, { status: 400 });
    }
    if (!body.ratings || RATING_LABELS.some(([id]) => !body.ratings![id])) {
      return NextResponse.json({ success: false, error: 'All rating questions must be answered' }, { status: 400 });
    }

    const name    = body.name?.trim() || 'Anonymous';
    const company = body.company!.trim();
    const ratings = body.ratings as Record<string, string>;

    // ── EMAIL BODY (PLAIN TEXT) ─────────────────────────────
    const ratingsText = RATING_LABELS
      .map(([id, label]) => `${label}\n  -> ${ratings[id]}`)
      .join('\n\n');

    const optionalEntries: Array<[string, string]> = [
      ['Areas that improved most',                     body.areasImproved || ''],
      ['Helped manage / prevent ongoing issues',       body.manageIssues  || ''],
      ['Liked most about the session',                 body.likedMost     || ''],
      ['Anything we could do better',                  body.doBetter      || ''],
    ].filter(([, v]) => v.trim().length > 0) as Array<[string, string]>;

    const optionalText = optionalEntries
      .map(([k, v]) => `${k}:\n  ${v}`)
      .join('\n\n');

    const textBody = [
      'Workplace Massage Feedback',
      '==========================',
      '',
      `Submitted: ${formatDate()}`,
      '',
      `Name:     ${name}`,
      `Company:  ${company}`,
      '',
      `Would recommend to colleagues: ${body.recommend!.toUpperCase()}`,
      '',
      '--- Ratings ---',
      '',
      ratingsText,
      ...(optionalText ? ['', '--- Additional Comments ---', '', optionalText] : []),
    ].join('\n');

    // ── EMAIL BODY (HTML) ───────────────────────────────────
    const detailsRows = [
      ['Name',                          name],
      ['Company',                       company],
      ['Would recommend to colleagues', body.recommend!.toUpperCase()],
    ].map(([k, v]) =>
      `<tr><td style="padding:8px 14px;border-bottom:1px solid #e5e5e5;font-weight:600;width:42%;">${escapeHtml(k)}</td><td style="padding:8px 14px;border-bottom:1px solid #e5e5e5;">${escapeHtml(v)}</td></tr>`
    ).join('');

    const ratingsRows = RATING_LABELS
      .map(([id, label]) =>
        `<tr><td style="padding:8px 14px;border-bottom:1px solid #e5e5e5;width:60%;">${escapeHtml(label)}</td><td style="padding:8px 14px;border-bottom:1px solid #e5e5e5;font-weight:600;">${escapeHtml(ratings[id])}</td></tr>`
      ).join('');

    const optionalHtml = optionalEntries
      .map(([k, v]) =>
        `<p style="margin:0 0 14px;"><strong>${escapeHtml(k)}:</strong><br>${escapeHtml(v).replace(/\n/g, '<br>')}</p>`
      ).join('');

    const html = `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:680px;color:#1a1a1a;">
        <h2 style="margin:0 0 6px;">Workplace Massage Feedback</h2>
        <p style="color:#777;font-size:13px;margin:0 0 22px;">Submitted ${formatDate()}</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:24px;">${detailsRows}</table>
        <h3 style="margin:0 0 10px;">Ratings</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:24px;">${ratingsRows}</table>
        ${optionalHtml ? `<h3 style="margin:0 0 10px;">Additional Comments</h3>${optionalHtml}` : ''}
      </div>
    `;

    // ── SEND ────────────────────────────────────────────────
    const result = await sendEmail({
      to:      'lucy@lucyhallmassage.com',
      cc:      'steve@lucyhallmassage.com',
      subject: `[Workplace Feedback] ${name} - ${company} - ${formatDate()}`,
      text:    textBody,
      html,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Could not send email: ' + result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('submit-workplace-feedback error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
