'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   InlineEnquiryForm — restyled per the new mockup.

   Fields:
     - Name    (required)
     - Email   (required, validated)
     - Mobile  (required)
     - Contact methods (optional multi-select):
         Phone call, SMS/WhatsApp, Mobile call, Email

   Three-state submit button:
     - GREY   #808080  — name/email/mobile incomplete
     - ORANGE #ff8c00  — required fields filled, no contact method picked
     - GREEN  #2cd12c  — required fields + at least 1 contact method picked

   Posts to /api/corporate-enquiry. The API route accepts the
   contactMethods array and includes it in both the notification
   email to Steve and the autoresponder PDF email.
   ───────────────────────────────────────────────────────────── */

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const COLOR_GREY   = '#808080';
const COLOR_ORANGE = '#ff8c00';
const COLOR_GREEN  = '#2cd12c';

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[\d\s+()-]{7,}$/;

const CONTACT_METHODS = [
  { id: 'phone',     label: 'Phone call' },
  { id: 'sms',       label: 'SMS/WhatsApp' },
  { id: 'mobile',    label: 'Mobile call' },
  { id: 'email',     label: 'Email' },
];

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

interface InlineEnquiryFormProps {
  heading?: string;
  subheading?: string;
}

export default function InlineEnquiryForm({
  heading = 'Enquire now about corporate massages',
  subheading = 'Get a call or email back from us',
}: InlineEnquiryFormProps) {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [mobile, setMobile] = useState('');
  const [methods, setMethods] = useState<string[]>([]);

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

  // ── Validation ──────────────────────────────────────────────
  const emailValid  = EMAIL_RE.test(email.trim());
  const mobileValid = MOBILE_RE.test(mobile.trim());
  const requiredOK  = name.trim().length > 0 && emailValid && mobileValid;
  const allOK       = requiredOK && methods.length > 0;

  const buttonColor = !requiredOK ? COLOR_GREY : allOK ? COLOR_GREEN : COLOR_ORANGE;
  const canSubmit   = requiredOK && !submitting;

  // ── Toggle method handler ───────────────────────────────────
  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // ── Submit handler ──────────────────────────────────────────
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
          mobile: mobile.trim(),
          contactMethods: methods,
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

  // ── Success state ───────────────────────────────────────────
  if (success) {
    return (
      <div className="inline-enq inline-enq--success">
        <h3 className="inline-enq-heading">Thanks, {name.split(' ')[0] || 'there'}!</h3>
        <p className="inline-enq-success-body">
          Your enquiry is in. The employer PDF is on its way to <strong>{email}</strong>. Lucy will be in touch within one working day.
        </p>
        <style>{`
          .inline-enq--success {
            background: #000000;
            padding: 36px 32px;
            color: #ffffff;
            max-width: 560px;
            width: 100%;
          }
          .inline-enq-heading {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 16px;
            line-height: 1.3;
            text-align: center;
          }
          .inline-enq-success-body {
            font-size: 1rem;
            line-height: 1.5;
            margin: 0;
            opacity: 0.92;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
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
        type="tel"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="inline-enq-input"
        autoComplete="tel"
      />

      <div className="inline-enq-methods">
        <p className="inline-enq-methods-label">Ideal method of initial contact</p>
        <div className="inline-enq-methods-grid">
          {CONTACT_METHODS.map((m) => (
            <label key={m.id} className="inline-enq-checkbox">
              <input
                type="checkbox"
                checked={methods.includes(m.id)}
                onChange={() => toggleMethod(m.id)}
              />
              <span className="inline-enq-checkbox-box" aria-hidden="true" />
              <span className="inline-enq-checkbox-label">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="inline-enq-error">{error}</p>}

      <div className="inline-enq-actions">
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
          {submitting ? 'SENDING…' : 'SUBMIT'}
        </button>
      </div>

      <style>{`
        .inline-enq {
          background: #000000;
          padding: 36px 32px;
          color: #ffffff;
          max-width: 560px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .inline-enq-heading {
          font-size: clamp(1.4rem, 1.8vw, 1.7rem);
          font-weight: 600;
          margin: 0;
          line-height: 1.25;
          text-align: center;
          letter-spacing: -0.005em;
        }
        .inline-enq-sub {
          font-size: clamp(0.95rem, 1.05vw, 1.05rem);
          font-weight: 400;
          margin: 0;
          opacity: 0.92;
          text-align: center;
        }
        .inline-enq-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
          margin: 6px 0 4px;
          width: 100%;
        }

        /* ── INPUTS ──────────────────────────────────────────── */
        .inline-enq-input {
          width: 100%;
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 14px 22px;
          font-family: inherit;
          font-size: 0.95rem;
          border-radius: 999px;
          outline: none;
        }
        .inline-enq-input::placeholder {
          color: #999;
          opacity: 1;
        }
        .inline-enq-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        /* ── CHECKBOXES ─────────────────────────────────────── */
        .inline-enq-methods {
          margin-top: 8px;
        }
        .inline-enq-methods-label {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 12px;
          color: #ffffff;
        }
        .inline-enq-methods-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
        }
        .inline-enq-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .inline-enq-checkbox input {
          /* Hide the native checkbox visually, but keep it
             accessible to screen readers + keyboard nav */
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .inline-enq-checkbox-box {
          width: 22px;
          height: 22px;
          border: 1.5px solid #ffffff;
          border-radius: 4px;
          background: transparent;
          flex-shrink: 0;
          position: relative;
          transition: background 0.15s ease;
        }
        .inline-enq-checkbox input:checked + .inline-enq-checkbox-box {
          background: #ffffff;
        }
        .inline-enq-checkbox input:checked + .inline-enq-checkbox-box::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 2px;
          width: 7px;
          height: 12px;
          border: solid #000000;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .inline-enq-checkbox input:focus-visible + .inline-enq-checkbox-box {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }
        .inline-enq-checkbox-label {
          font-size: 0.9rem;
          color: #ffffff;
        }

        /* ── ERROR ───────────────────────────────────────────── */
        .inline-enq-error {
          color: #ff9b9b;
          font-size: 0.85rem;
          margin: 0;
          line-height: 1.4;
        }

        /* ── SUBMIT ──────────────────────────────────────────── */
        .inline-enq-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
        }
        .inline-enq-submit {
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #ffffff;
          padding: 14px 32px;
          border: none;
          border-radius: 999px;
          min-width: 140px;
          transition: background 0.3s ease, opacity 0.2s ease;
        }
        .inline-enq-submit:hover:not(:disabled) {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}
