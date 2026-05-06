'use client';

import { useState, useEffect } from 'react';
import SecondaryEnquiryModal from './SecondaryEnquiryModal';

/* ─────────────────────────────────────────────────────────────
   InlineEnquiryForm — corporate enquiry form for use inside
   service page heroes.

   Visual styling matches WellbeingForm exactly:
     - Panel bg #0a0908 with subtle white border, 4px corners
     - 1.6rem centered heading, sub text opacity 0.8
     - White pill inputs that invert to black-on-white border on focus
     - 24px white checkbox with SVG tick
     - Full-width pill submit button with uppercase letter-spacing

   Fields:
     - Name    (required)
     - Email   (required, validated)
     - Mobile  (required, validated)
     - Contact methods (optional multi-select, 4 options)

   Three-state submit button:
     - GREY   #808080  — name/email/mobile incomplete
     - ORANGE #ff8c00  — required filled, no contact method picked
     - GREEN  #2cd12c  — required + at least 1 contact method picked

   Posts to /api/corporate-enquiry. The API route accepts the
   contactMethods array and sends a notification email + the
   PDF autoresponder.
   ───────────────────────────────────────────────────────────── */

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const COLOR_GREY   = '#808080';
const COLOR_ORANGE = '#ff8c00';
const COLOR_GREEN  = '#2cd12c';

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[\d\s+()-]{6,}$/;

const CONTACT_METHODS = [
  { id: 'phone',  label: 'Phone call' },
  { id: 'sms',    label: 'SMS/WhatsApp' },
  { id: 'mobile', label: 'Mobile call' },
  { id: 'email',  label: 'Email' },
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
  const [modalOpen,  setModalOpen]  = useState(false);
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

  const emailValid  = EMAIL_RE.test(email.trim());
  const mobileValid = MOBILE_RE.test(mobile.trim());
  const requiredOK  = name.trim().length > 0 && emailValid && mobileValid;
  const allOK       = requiredOK && methods.length > 0;

  const buttonColor = !requiredOK ? COLOR_GREY : allOK ? COLOR_GREEN : COLOR_ORANGE;
  const canSubmit   = requiredOK && !submitting;

  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

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
      setModalOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Shared inline styles — match WellbeingForm exactly
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    fontSize: '1.05rem',
    fontWeight: 300,
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: 999,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 400,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 1.4,
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    background: 'rgba(255,255,255,0.2)',
    marginBottom: 22,
  };

  // ── Success state ───────────────────────────────────────────
  if (success) {
    return (
      <>
        <div style={{
          background: '#0a0908',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: '48px 32px',
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: 560,
          width: '100%',
        }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>
            Thanks, {name.split(' ')[0] || 'there'}!
          </h3>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.92, margin: 0 }}>
            Your enquiry is in. The employer PDF is on its way to <strong>{email}</strong>. Lucy will be in touch within one working day.
          </p>
        </div>
        <SecondaryEnquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialName={name}
          initialEmail={email}
          initialMobile={mobile}
        />
      </>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      <div style={{
        background: '#0a0908',
        border: '1px solid rgba(255,255,255,0.25)',
        padding: '40px 32px',
        borderRadius: 4,
        maxWidth: 560,
        width: '100%',
      }}>
        <h3 style={{
          fontSize: '1.6rem',
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: 14,
          marginTop: 0,
        }}>
          {heading}
        </h3>
        <p style={{
          fontSize: '1rem',
          fontWeight: 300,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.5,
          opacity: 0.8,
          marginBottom: 24,
          marginTop: 0,
        }}>
          {subheading}
        </p>

        <div style={dividerStyle} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="intake-input"
            style={inputStyle}
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="intake-input"
            style={inputStyle}
            autoComplete="email"
          />
          <input
            type="tel"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="intake-input"
            style={inputStyle}
            autoComplete="tel"
          />
        </div>

        <div style={dividerStyle} />

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Ideal method of initial contact</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px 16px',
          }}>
            {CONTACT_METHODS.map((m) => (
              <label key={m.id} className="intake-checkbox-wrap" style={{ alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={methods.includes(m.id)}
                  onChange={() => toggleMethod(m.id)}
                  className="intake-checkbox-input"
                />
                <span className="intake-checkbox-box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" className="intake-checkbox-tick">
                    <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.4 }}>
                  {m.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom: 16,
            padding: '12px 16px',
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            borderRadius: 4,
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 400, color: '#ff8c8c', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '14px 22px',
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#ffffff',
            background: buttonColor,
            border: 'none',
            borderRadius: 999,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            transition: 'background 0.2s ease',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>

      {/* Reuses .intake-input + .intake-checkbox-* styles from WellbeingForm.
          Defined again here in case this form ever renders without
          WellbeingForm on the same page. */}
      <style>{`
        .intake-input {
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          border: 1px solid transparent !important;
        }
        .intake-input:focus {
          outline: none;
          background: #000000 !important;
          color: #ffffff !important;
          border: 1px solid #ffffff !important;
        }
        .intake-input:focus::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .intake-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          width: 100%;
        }
        .intake-checkbox-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .intake-checkbox-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          min-width: 24px;
          border: 2px solid #ffffff;
          border-radius: 6px;
          background: transparent;
          margin-top: 1px;
          flex-shrink: 0;
          transition: border-color 0.2s ease;
        }
        .intake-checkbox-tick {
          width: 18px;
          height: 18px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .intake-checkbox-input:checked + .intake-checkbox-box .intake-checkbox-tick {
          opacity: 1;
        }
        .intake-checkbox-input:focus-visible + .intake-checkbox-box {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }
      `}</style>
    <SecondaryEnquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialName={name}
        initialEmail={email}
        initialMobile={mobile}
      />
      </>
  );
}
