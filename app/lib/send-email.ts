/**
 * Send Email — thin wrapper around Resend SDK.
 *
 * Reads RESEND_API_KEY and NOTIFICATION_EMAIL_FROM from env vars.
 * Used by API routes for transactional email (questionnaire submissions,
 * receipts, contact form, etc.).
 *
 * Resend free tier: 3000 emails/month, 100/day. We expect ~50/month
 * across all forms so we're comfortable inside the free tier.
 */

import { Resend } from 'resend';

export type SendEmailOptions = {
  /** Recipient email. Can be a single address or an array. */
  to: string | string[];
  /** Subject line. */
  subject: string;
  /** Plain text body. Used as fallback for clients that don't render HTML. */
  text: string;
  /** Optional HTML body. If omitted, recipients see plain text only. */
  html?: string;
  /** Optional file attachments. */
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
  /** Optional reply-to address. Useful for contact-form submissions where
   *  the submitter's email should populate the reply field. */
  replyTo?: string;
};

export type SendEmailResult =
  | { success: true; id: string }
  | { success: false; error: string };

/**
 * Send a transactional email via Resend.
 *
 * Returns a discriminated union so callers can handle success/failure
 * without try/catch. Errors are caught internally and stringified.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_EMAIL_FROM;

  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY env var is not set' };
  }
  if (!from) {
    return { success: false, error: 'NOTIFICATION_EMAIL_FROM env var is not set' };
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
      replyTo: options.replyTo,
    });

    if (result.error) {
      return { success: false, error: result.error.message || 'Unknown Resend error' };
    }
    if (!result.data?.id) {
      return { success: false, error: 'Resend returned no message ID' };
    }
    return { success: true, id: result.data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
