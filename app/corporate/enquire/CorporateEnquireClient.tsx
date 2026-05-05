'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../Footer';
import CorporateNav from '../../CorporateNav';

/* ─────────────────────────────────────────────────────────────
   CorporateEnquireClient — /corporate/enquire

   Standalone enquiry form. Reached from any "Download our
   employer PDF" / "Enquire about your team here" CTA across
   the corporate site.

   Flow:
     1. User fills name + email + company + phone
     2. Submit → reCAPTCHA v3 token (action: corporate_enquiry)
     3. POSTs to /api/corporate-enquiry with form data + token
     4. API verifies reCAPTCHA, sends notification email to
        steve@lucyhallmassage.com, sends autoresponder to the
        user with the employer PDF download link
     5. UI shows success state thanking them and confirming
        the PDF link is on its way

   Three-state button pattern (matches the wellbeing form):
     - GREY (#808080)  — not enough info to submit
     - ORANGE (#ff8c00) — required fields filled (name + valid
       email + company), can submit
     - GREEN (#2cd12c) — all fields including phone are filled,
       full follow-up possible

   Submitting in either ORANGE or GREEN state is fine; the
   colour just signals data quality.
   ───────────────────────────────────────────────────────────── */

// ── reCAPTCHA SITE KEY ────────────────────────────────────────
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

// ── CONSTANTS ─────────────────────────────────────────────────
const COLOR_GREY   = '#808080';
const COLOR_ORANGE = '#ff8c00';
const COLOR_GREEN  = '#2cd12c';

// Quick email validator — same pattern used elsewhere on the site
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export default function CorporateEnquireClient() {
  // Form state
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [company, setCompany] = useState('');
  const [phone,   setPhone]   = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Load reCAPTCHA v3 script on mount. Idempotent — checks
  // for existing script tag before adding.
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

  // ── Button colour state machine ───────────────────────────
  const emailValid = EMAIL_RE.test(email.trim());
  const requiredOK = name.trim().length > 0 && emailValid && company.trim().length > 0;
  const allOK      = requiredOK && phone.trim().length > 0;

  const buttonColor = !requiredOK
    ? COLOR_GREY
    : allOK
    ? COLOR_GREEN
    : COLOR_ORANGE;
  const canSubmit = requiredOK && !submitting;

  // ── Submit handler ────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      // Get reCAPTCHA token
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

      // POST to API
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

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <CorporateNav />

      <main className="enq-main">

        <section className="enq-section">
          <div className="enq-container">

            <Link href="/corporate" className="enq-back">&lt; Back to Corporate</Link>

            {!success ? (
              <>
                <h1 className="enq-headline">Get our Employer PDF</h1>
                <p className="enq-intro">
                  Tell us a little about you and your team. We&rsquo;ll email the employer PDF straight away, and Lucy will follow up within one working day to discuss how we can help.
                </p>

                <div className="enq-form">

                  <label className="enq-field">
                    <span className="enq-label">Name *</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="enq-input"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label className="enq-field">
                    <span className="enq-label">Email *</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="enq-input"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="enq-field">
                    <span className="enq-label">Company *</span>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="enq-input"
                      autoComplete="organization"
                      required
                    />
                  </label>

                  <label className="enq-field">
                    <span className="enq-label">Phone <span className="enq-optional">(optional, helps us follow up)</span></span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="enq-input"
                      autoComplete="tel"
                    />
                  </label>

                  {error && (
                    <p className="enq-error">{error}</p>
                  )}

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
                    {submitting ? 'Sending…' : 'Send my enquiry'}
                  </button>

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

        /* ── FORM ──────────────────────────────────────────── */
        .enq-form {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .enq-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .enq-label {
          font-size: 0.9rem;
          font-weight: 500;
          opacity: 0.85;
          letter-spacing: 0.02em;
        }
        .enq-optional {
          font-weight: 400;
          opacity: 0.55;
          font-size: 0.85rem;
        }

        .enq-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.2);
          color: #ffffff;
          font-family: inherit;
          font-size: 1rem;
          padding: 14px 16px;
          border-radius: 4px;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .enq-input:focus {
          outline: none;
          border-color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.08);
        }

        .enq-error {
          color: #ff6b6b;
          font-size: 0.95rem;
          margin: 0;
          padding: 12px 16px;
          background: rgba(255, 107, 107, 0.08);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 4px;
        }

        .enq-submit {
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          padding: 16px 32px;
          border: none;
          border-radius: 4px;
          margin-top: 8px;
          letter-spacing: 0.02em;
          transition: background 0.3s ease, opacity 0.2s ease;
        }
        .enq-submit:hover:not(:disabled) {
          filter: brightness(1.08);
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

        /* ── SUCCESS STATE ─────────────────────────────────── */
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

        /* ── DESKTOP ───────────────────────────────────────── */
        @media (min-width: 1024px) {
          .enq-section {
            padding: 100px 60px 120px;
          }
        }
      `}</style>
    </>
  );
}
