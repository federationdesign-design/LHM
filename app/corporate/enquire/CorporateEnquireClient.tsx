'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../Footer';
import CorporateNav from '../../CorporateNav';

/* ─────────────────────────────────────────────────────────────
   CorporateEnquireClient — /corporate/enquire

   Same fields and validation as the inline form on service
   pages, just laid out as a full standalone page rather than
   a hero overlay.

   Three-state submit button:
     - GREY   #808080  — required incomplete
     - ORANGE #ff8c00  — required filled, no contact method
     - GREEN  #2cd12c  — required + at least one method picked

   Submits to /api/corporate-enquiry. On success swaps to a
   thank-you state with confirmation that the PDF is on its way.
   ───────────────────────────────────────────────────────────── */

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const COLOR_GREY   = '#808080';
const COLOR_ORANGE = '#ff8c00';
const COLOR_GREEN  = '#2cd12c';

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[\d\s+()-]{7,}$/;

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

export default function CorporateEnquireClient() {
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CorporateNav />

      <main className="enq-main">
        <section className="enq-section">
          <div className="enq-container">

            <Link href="/corporate" className="enq-back">&lt; Back to Corporate</Link>

            {!success ? (
              <>
                <h1 className="enq-headline">Get our employer PDF</h1>
                <p className="enq-intro">
                  Tell us a little about you and your team. We&rsquo;ll email the employer PDF straight away, and Lucy will follow up within one working day to discuss how we can help.
                </p>

                <div className="enq-form">
                  <div className="enq-rule" />

                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="enq-input"
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="enq-input"
                    autoComplete="email"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="enq-input"
                    autoComplete="tel"
                  />

                  <div className="enq-methods">
                    <p className="enq-methods-label">Ideal method of initial contact</p>
                    <div className="enq-methods-grid">
                      {CONTACT_METHODS.map((m) => (
                        <label key={m.id} className="enq-checkbox">
                          <input
                            type="checkbox"
                            checked={methods.includes(m.id)}
                            onChange={() => toggleMethod(m.id)}
                          />
                          <span className="enq-checkbox-box" aria-hidden="true" />
                          <span className="enq-checkbox-label">{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {error && <p className="enq-error">{error}</p>}

                  <div className="enq-actions">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="enq-submit"
                      style={{
                        background: buttonColor,
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        opacity: submitting ? 0.7 : 1,
                      }}
                    >
                      {submitting ? 'SENDING…' : 'SUBMIT'}
                    </button>
                  </div>

                  <p className="enq-recaptcha-notice">
                    This site is protected by reCAPTCHA and the Google{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>{' '}and{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
                  </p>
                </div>
              </>
            ) : (
              <div className="enq-success">
                <h1 className="enq-headline">Thanks, {name.split(' ')[0] || 'there'}!</h1>
                <p className="enq-intro">
                  Your enquiry is in. The employer PDF is on its way to <strong>{email}</strong> &mdash; check your inbox in a minute or two (and the spam folder, just in case).
                </p>
                <p className="enq-intro">
                  Lucy will be in touch within one working day to chat about how we can support your team.
                </p>
                <Link href="/corporate" className="enq-success-cta">
                  &lt; Back to Corporate
                </Link>
              </div>
            )}

          </div>
        </section>

        <Footer />
      </main>

      <style>{`
        .enq-main {
          background: #000000;
          color: #ffffff;
          min-height: 100vh;
        }
        .enq-section {
          padding: 60px 24px 80px;
        }
        .enq-container {
          max-width: 640px;
          margin: 0 auto;
        }
        .enq-back {
          display: inline-block;
          color: #ffffff;
          font-size: 0.95rem;
          text-decoration: none;
          opacity: 0.7;
          margin-bottom: 32px;
          transition: opacity 0.2s ease;
        }
        .enq-back:hover { opacity: 1; }

        .enq-headline {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 600;
          line-height: 1.2;
          margin: 0 0 24px;
          letter-spacing: -0.01em;
        }
        .enq-intro {
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          font-weight: 300;
          line-height: 1.6;
          margin: 0 0 20px;
          opacity: 0.92;
        }

        /* ── FORM ────────────────────────────────────────────── */
        .enq-form {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .enq-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.4);
          margin: 0 0 8px;
        }
        .enq-input {
          width: 100%;
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 16px 24px;
          font-family: inherit;
          font-size: 1rem;
          border-radius: 999px;
          outline: none;
        }
        .enq-input::placeholder {
          color: #999;
          opacity: 1;
        }
        .enq-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
        }

        /* ── CHECKBOXES ─────────────────────────────────────── */
        .enq-methods {
          margin-top: 16px;
        }
        .enq-methods-label {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 14px;
          color: #ffffff;
        }
        .enq-methods-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
        }
        .enq-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .enq-checkbox input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .enq-checkbox-box {
          width: 24px;
          height: 24px;
          border: 1.5px solid #ffffff;
          border-radius: 4px;
          background: transparent;
          flex-shrink: 0;
          position: relative;
          transition: background 0.15s ease;
        }
        .enq-checkbox input:checked + .enq-checkbox-box {
          background: #ffffff;
        }
        .enq-checkbox input:checked + .enq-checkbox-box::after {
          content: '';
          position: absolute;
          left: 7px;
          top: 3px;
          width: 7px;
          height: 13px;
          border: solid #000000;
          border-width: 0 2.5px 2.5px 0;
          transform: rotate(45deg);
        }
        .enq-checkbox input:focus-visible + .enq-checkbox-box {
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }
        .enq-checkbox-label {
          font-size: 0.95rem;
          color: #ffffff;
        }

        /* ── ERROR ───────────────────────────────────────────── */
        .enq-error {
          color: #ff9b9b;
          font-size: 0.95rem;
          margin: 0;
          padding: 12px 16px;
          background: rgba(255, 107, 107, 0.08);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 4px;
        }

        /* ── SUBMIT ──────────────────────────────────────────── */
        .enq-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
        .enq-submit {
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #ffffff;
          padding: 16px 40px;
          border: none;
          border-radius: 999px;
          min-width: 160px;
          transition: background 0.3s ease, opacity 0.2s ease;
        }
        .enq-submit:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        .enq-recaptcha-notice {
          font-size: 0.75rem;
          opacity: 0.6;
          margin: 8px 0 0;
          line-height: 1.5;
        }
        .enq-recaptcha-notice a {
          color: #ffffff;
          text-decoration: underline;
        }

        /* ── SUCCESS ─────────────────────────────────────────── */
        .enq-success {
          padding: 20px 0;
        }
        .enq-success-cta {
          display: inline-block;
          color: #ffffff;
          font-size: 0.95rem;
          text-decoration: none;
          opacity: 0.85;
          margin-top: 16px;
          padding: 12px 0;
          transition: opacity 0.2s ease;
        }
        .enq-success-cta:hover { opacity: 1; }

        @media (min-width: 1024px) {
          .enq-section {
            padding: 100px 60px 120px;
          }
        }
      `}</style>
    </>
  );
}
