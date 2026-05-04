/**
 * MailerLite — thin wrapper around MailerLite's REST API for adding subscribers.
 *
 * Reads MAILERLITE_API_KEY from env. The API key needs "subscribers:write"
 * permission at minimum.
 *
 * MailerLite handles upsert semantics automatically — POSTing an existing
 * email updates the existing subscriber rather than erroring.
 *
 * API docs: https://developers.mailerlite.com/docs/subscribers.html
 */

export type AddSubscriberOptions = {
  /** Subscriber's email — unique key in MailerLite. */
  email: string;
  /** Subscriber's first name (maps to MailerLite's built-in `name` field). */
  firstName: string;
  /** Subscriber's last name (maps to MailerLite's built-in `last_name` field). */
  lastName?: string;
  /** Mobile number (maps to MailerLite's built-in `phone` field). */
  mobile?: string;
  /** Custom field: segment for nurture routing (e.g. "desk" or "active"). */
  segment?: string;
  /** Goal text (the "magic wand" answer from the form). */
  goal?: string;
  /** Severity score 1-4. */
  severity?: number;
  /** Group ID to add this subscriber to (numeric, as a string). */
  groupId: string;
};

export type AddSubscriberResult =
  | { success: true; id: string }
  | { success: false; error: string };

/**
 * Add (or update) a subscriber in MailerLite and assign them to a group.
 *
 * Returns success with the subscriber ID on success, or failure with a
 * stringified error message.
 */
export async function addSubscriber(options: AddSubscriberOptions): Promise<AddSubscriberResult> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'MAILERLITE_API_KEY env var is not set' };
  }

  // Build the fields payload. Only include keys with values — MailerLite
  // will preserve existing field values for keys we don't send.
  const fields: Record<string, string | number> = {
    name: options.firstName,
  };
  if (options.lastName) fields.last_name = options.lastName;
  if (options.mobile) fields.phone = options.mobile;
  if (options.segment) fields.segment = options.segment;
  if (options.goal) fields.goal = options.goal;
  if (typeof options.severity === 'number') fields.severity = options.severity;

  const payload = {
    email: options.email,
    fields,
    groups: [options.groupId],
    // status: 'active' = bypass double opt-in (account-level setting also matters).
    // Since we asked the user to disable double opt-in for API integrations,
    // this combined with that setting ensures subscribers go straight into
    // the automation rather than waiting on a confirmation click.
    status: 'active',
  };

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // MailerLite returns errors as { message: '...', errors: { field: [...] } }
      const errMsg = data.message || `HTTP ${res.status}`;
      const fieldErrors = data.errors
        ? Object.entries(data.errors).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('; ')
        : '';
      return { success: false, error: fieldErrors ? `${errMsg} (${fieldErrors})` : errMsg };
    }

    if (!data.data?.id) {
      return { success: false, error: 'MailerLite returned no subscriber ID' };
    }
    return { success: true, id: String(data.data.id) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
