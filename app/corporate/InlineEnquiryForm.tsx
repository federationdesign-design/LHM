'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   InlineEnquiryForm — compact enquiry form for use inside hero
   overlays on service pages.

   Same backend as the standalone /corporate/enquire page (POSTs
   to /api/corporate-enquiry, same three-state submit button).
   Just packaged tighter for inline use.

   Same fields:
     - Name (required)
     - Email (required, validated)
     - Company (required)
     - Phone (optional)

   Three-state button:
     - GREY (#808080)  — name OR email OR company missing
     - ORANGE (#ff8c00) — required filled, can submit
     - GREEN (#2cd12c) — all fields including phone filled

   On success, the form swaps to a thank-you message in the same
   space.
   ───────────────────────────────────────────────────────────── */

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const COLOR_GREY   = '#808080';
const COLOR_ORANGE = '#ff8c00';
const COLOR_GREEN  = '#2cd12c';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

interface InlineEnquiryFormProps {
  /** Heading shown above the form, e.g. "Enquire now about corporate massages" */
  heading?: string;
  /** Sub-text below heading, e.g. "Get a call or email back from us" */
  subheading?: string;
}

export default function InlineEnquiryForm({
  heading = 'Enquire now about corporate massages',
  subheading = 'Get a call or email back from us',
}: InlineEnquiryFormProps) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [company, setCompany] = useState('');
  const [phone,   setPhone]   = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    const existing = document.querySelector(
      `script[src*="recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}"]`
    );
    if (existing) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const emailValid = EMAIL_RE.test(email.trim());
  const requiredOK = name.trim().length > 0 && emailValid && company.trim().length > 0;
  const allOK      = requiredOK && phone.trim().length > 0;

  const buttonColor = !requiredOK ? COLOR_GREY : allOK ? COLOR_GREEN : COLOR_ORANGE;
  const canSubmit = requiredOK && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      let recaptchaToken = '';
      if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve, reject) => {
          window.grecaptcha!.ready(async () => {
            try {
              const token = await window.grecaptcha!.execute(
                RECAPTCHA_SITE_KEY,
                { action: 'corporate_enquiry' }
              );
              resolve(token);
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      const res = await fetch('/api/corporate-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          phone: phone.trim(),
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="inline-enq inline-enq--success">
        <h3 className="inline-enq-heading">Thanks, {name.split(' ')[0] || 'there'}!</h3>
        <p className="inline-enq-success-body">
          Your enquiry is in. The employer PDF is on its way to <strong>{email}</strong>. Lucy will be in touch within one working day.
        </p>
        <style>{`
          .inline-enq--success {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 32px 28px;
            border-radius: 6px;
            color: #ffffff;
            max-width: 360px;
          }
          .inline-enq-heading {
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0 0 16px;
            line-height: 1.3;
          }
          .inline-enq-success-body {
            font-size: 0.95rem;
            line-height: 1.5;
            margin: 0;
            opacity: 0.92;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="inline-enq">
      <h3 className="inline-enq-heading">{heading}</h3>
      <p className="inline-enq-sub">{subheading}</p>
      <div className="inline-enq-rule" />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="inline-enq-input"
        autoComplete="name"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="inline-enq-input"
        autoComplete="email"
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="inline-enq-input"
        autoComplete="organization"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="inline-enq-input"
        autoComplete="tel"
      />

      {error && <p className="inline-enq-error">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="inline-enq-submit"
        style={{
          background: buttonColor,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? 'Sending…' : 'SUBMIT'}
      </button>

      <style>{`
        .inline-enq {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 24px 22px;
          border-radius: 6px;
          color: #ffffff;
          max-width: 360px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .inline-enq-heading {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
          text-align: center;
        }
        .inline-enq-sub {
          font-size: 0.85rem;
          font-weight: 300;
          margin: 0;
          opacity: 0.9;
          text-align: center;
        }
        .inline-enq-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
          margin: 4px 0 8px;
        }
        .inline-enq-input {
          width: 100%;
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 12px 14px;
          font-family: inherit;
          font-size: 0.9rem;
          border-radius: 999px;
          outline: none;
        }
        .inline-enq-input::placeholder {
          color: #888;
        }
        .inline-enq-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
        }
        .inline-enq-error {
          color: #ff9b9b;
          font-size: 0.82rem;
          margin: 4px 0 0;
          line-height: 1.4;
        }
        .inline-enq-submit {
          margin-top: 6px;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #ffffff;
          padding: 12px 20px;
          border: none;
          border-radius: 999px;
          align-self: flex-end;
          width: auto;
          min-width: 100px;
          transition: background 0.3s ease, opacity 0.2s ease;
        }
        .inline-enq-submit:hover:not(:disabled) {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}
