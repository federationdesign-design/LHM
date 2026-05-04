'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';

/* ─────────────────────────────────────────────────────────────
   ContactClient — /contact page.

   Wires the message form to /api/contact, which handles:
     - reCAPTCHA v3 verification
     - notification email to Lucy + Steve (Reply-To = sender)
     - autoresponder email to the sender
     - honeypot spam filtering
     - field validation and length caps

   The submit button uses the same three-state colour pattern as
   WellbeingForm (grey → orange → green) for consistency across
   the site's forms. See the buttonColour computation below.
   ───────────────────────────────────────────────────────────── */

// Button state colours — match WellbeingForm and QuestionnaireForm
const BUTTON_COLOUR_GREY = '#808080';
const BUTTON_COLOUR_ORANGE = '#ff8c00';
const BUTTON_COLOUR_GREEN = '#2cd12c';

// reCAPTCHA v3 needs a global on window — declare it for TypeScript
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const HOURS: Record<number, [number, number, number, number] | null> = {
  0: [10, 0, 17, 0],  // Sunday
  1: [9, 0, 20, 0],   // Monday
  2: [9, 0, 20, 0],   // Tuesday
  3: [9, 0, 20, 0],   // Wednesday
  4: [9, 0, 20, 0],   // Thursday
  5: [9, 0, 18, 0],   // Friday
  6: [9, 0, 17, 30],  // Saturday
};

function getOpenStatus() {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMins = h * 60 + m;
  const todayHours = HOURS[day];

  if (!todayHours) {
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextDay = (day + i) % 7;
      if (HOURS[nextDay]) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return { label: `Closed — opens ${dayNames[nextDay]} at 9am`, color: '#ff4444' };
      }
    }
  }

  const [oh, om, ch, cm] = todayHours!;
  const openMins = oh * 60 + om;
  const closeMins = ch * 60 + cm;

  if (totalMins < openMins) {
    return { label: `Closed — opens today at ${oh}am`, color: '#ff4444' };
  }
  if (totalMins >= closeMins) {
    // Find next open day
    for (let i = 1; i <= 7; i++) {
      const nextDay = (day + i) % 7;
      const nextHours = HOURS[nextDay];
      if (nextHours) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const label = i === 1 ? `Closed — opens tomorrow at ${nextHours[0]}am` : `Closed — opens ${dayNames[nextDay]} at ${nextHours[0]}am`;
        return { label, color: '#ff4444' };
      }
    }
  }
  if (closeMins - totalMins <= 60) {
    return { label: 'Closing soon', color: '#f5a623' };
  }
  return { label: 'Open Now', color: '#2cd12c' };
}

function OpenStatus() {
  const [status, setStatus] = useState(getOpenStatus());
  useEffect(() => {
    const interval = setInterval(() => setStatus(getOpenStatus()), 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: '1.1rem', fontWeight: 300, color: '#ffffff' }}>{status.label}</span>
    </div>
  );
}

export default function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  // Honeypot — invisible field that real users won't fill, but bots will.
  // If non-empty at submit time, the API silently rejects.
  const [honeypot, setHoneypot] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Flips true on first submit attempt — drives whether the inline
  // validation message under the button is shown.
  const [showValidation, setShowValidation] = useState(false);

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Load the reCAPTCHA v3 script on mount. It exposes window.grecaptcha
  // which we call at submit time to get a fresh token. The script self-
  // injects a small badge in the bottom-right of the page; that's fine.
  useEffect(() => {
    if (!recaptchaSiteKey) {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set — contact form will fail at submit.');
      return;
    }
    // Don't double-inject if the script is already on the page (e.g. on
    // client-side navigation back to this page).
    if (document.querySelector('script[data-recaptcha="true"]')) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    document.body.appendChild(script);
  }, [recaptchaSiteKey]);

  // ── BUTTON STATE LOGIC ──────────────────────────────────────────────────
  // Three-state colour pattern matching WellbeingForm:
  //   GREY   — required fields not yet filled
  //   ORANGE — required fields filled (name, valid email, message, consent)
  //   GREEN  — required + optional phone filled
  //
  // Phone is the only optional field, so it's the sole gate between
  // orange and green. Without phone, leaving the button stuck at orange
  // forever would feel wrong; this lets users see their progress.

  const requiredFilled =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    email.includes('@') &&
    message.trim().length > 0 &&
    consent;

  const allFilled = requiredFilled && phone.trim().length > 0;

  const buttonColour = allFilled
    ? BUTTON_COLOUR_GREEN
    : requiredFilled
    ? BUTTON_COLOUR_ORANGE
    : BUTTON_COLOUR_GREY;

  const handleSubmit = async () => {
    setShowValidation(true);
    setSubmitError(null);

    if (!requiredFilled) return;
    if (submitting) return;

    setSubmitting(true);

    // Get a fresh reCAPTCHA v3 token. The token is single-use and
    // expires after 2 minutes, so we always grab a new one at submit
    // time rather than caching it.
    let recaptchaToken = '';
    try {
      if (!window.grecaptcha || !recaptchaSiteKey) {
        throw new Error('reCAPTCHA not ready');
      }
      await new Promise<void>((resolve) => window.grecaptcha!.ready(resolve));
      recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
    } catch (err) {
      console.error('reCAPTCHA execution failed:', err);
      setSubmitError('Security check failed to load. Please refresh the page and try again.');
      setSubmitting(false);
      return;
    }

    const payload = {
      name,
      email,
      phone,
      message,
      consent,
      recaptchaToken,
      website: honeypot,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      setSent(true);
    } catch (err) {
      setSubmitError('Network error — please check your connection and try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Nav solid />

      <main className={styles.page} style={{ paddingTop: 56 }}>

        {/* HEADER */}
        <div style={{ borderBottom: '1px solid #ffffff', padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 16 }}>
              <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Contact
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 16 }}>Get in Touch</h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, maxWidth: 600 }}>
              We&rsquo;re always happy to hear from you. For bookings, please use our online booking system &mdash; for everything else, drop us a message below.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* Contact info row */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 6, opacity: 0.6 }}>Email</p>
                  <a href="mailto:info@lucyhallmassage.com" style={{ fontSize: '1.1rem', fontWeight: 300, color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid #ffffff', paddingBottom: 2 }}>info@lucyhallmassage.com</a>
                </div>
                <div style={{ marginLeft: 40 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 6, opacity: 0.6 }}>Phone</p>
                  <a href="tel:07765555078" style={{ fontSize: '1.1rem', fontWeight: 300, color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid #ffffff', paddingBottom: 2 }}>07765 555078</a>
                </div>
                <div style={{ marginLeft: 40 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 6, opacity: 0.6 }}>Open / Closed</p>
                  <OpenStatus />
                </div>
                <div style={{ marginLeft: 40 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 10, opacity: 0.6 }}>Follow Us</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {[
                      { href: 'https://www.facebook.com/lucyhallmassage', label: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 20, height: 20 }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                      { href: 'https://www.instagram.com/lucyhallmassage/', label: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                      { href: 'https://twitter.com/lucyhallmassage', label: 'X / Twitter', icon: <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 20, height: 20 }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                      { href: 'https://www.linkedin.com/in/lucy-hall-massage-47369141/', label: 'LinkedIn', icon: <svg viewBox="0 0 24 24" fill="#ffffff" style={{ width: 20, height: 20 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                    ].map(({ href, label, icon }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}>{icon}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TWO MAPS side by side with gutter */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 64 }}>

              {/* Thoday Street */}
              <div style={{ border: '1px solid #ffffff' }}>
                <div style={{ padding: '24px 24px 20px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 8, opacity: 0.6 }}>Thoday Street &mdash; Main Clinic</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7 }}>2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', opacity: 0.6, marginTop: 4 }}>Open Monday &ndash; Sunday</p>
                </div>
                <iframe
                  title="Thoday Street Clinic"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.1!2d0.1358!3d52.1985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d87097e01e7a2b%3A0x1!2s2+Antwerp+Cottages%2C+Thoday+St%2C+Cambridge+CB1+3AU!5e0!3m2!1sen!2suk!4v1"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: 'block', filter: 'grayscale(100%) invert(85%) contrast(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Cromwell Road */}
              <div style={{ border: '1px solid #ffffff' }}>
                <div style={{ padding: '24px 24px 20px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 8, opacity: 0.6 }}>Cromwell Road &mdash; Wednesdays &amp; Fridays</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7 }}>96 Cromwell Road, Cambridge, CB1 3EG</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', opacity: 0.6, marginTop: 4, fontStyle: 'italic' }}>Exact address confirmed at time of booking</p>
                </div>
                <iframe
                  title="Cromwell Road Clinic"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.5!2d0.1392!3d52.1948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s96+Cromwell+Rd%2C+Cambridge+CB1+3EG!5e0!3m2!1sen!2suk!4v1"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: 'block', filter: 'grayscale(100%) invert(85%) contrast(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* CONTACT FORM — centred below maps */}
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #ffffff', textAlign: 'center' }}>Send a Message</h2>

              {sent ? (
                <div style={{ padding: '40px', border: '1px solid #ffffff', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Message sent!</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7 }}>
                    Thanks for getting in touch. We&rsquo;ll come back to you within one working day. A confirmation has been sent to your email &mdash; please check your junk folder if you don&rsquo;t see it.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* HONEYPOT — visually hidden field. Real users won't fill it;
                      bots that auto-fill forms will, and the API silently
                      rejects those submissions. */}
                  <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="contact-website">
                      Website (leave blank)
                      <input
                        type="text"
                        id="contact-website"
                        name="website"
                        value={honeypot}
                        onChange={e => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 8 }}>Your name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      maxLength={100}
                      style={{ width: '100%', background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', fontSize: '1.1rem', fontWeight: 300, padding: '14px 16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 8 }}>Email address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      maxLength={200}
                      style={{ width: '100%', background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', fontSize: '1.1rem', fontWeight: 300, padding: '14px 16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 8 }}>Phone number (optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      maxLength={30}
                      style={{ width: '100%', background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', fontSize: '1.1rem', fontWeight: 300, padding: '14px 16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 8 }}>Message *</label>
                    <textarea
                      rows={6}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      maxLength={5000}
                      style={{ width: '100%', background: 'transparent', border: '1px solid #ffffff', color: '#ffffff', fontSize: '1.1rem', fontWeight: 300, padding: '14px 16px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <input
                      type="checkbox"
                      id="gdpr-consent"
                      checked={consent}
                      onChange={e => setConsent(e.target.checked)}
                      style={{ marginTop: 3, flexShrink: 0, accentColor: '#ffffff', width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <label htmlFor="gdpr-consent" style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, cursor: 'pointer' }}>
                      I agree to Lucy Hall Massage Therapy contacting me in response to this enquiry. My data will be handled in accordance with the <a href="/legal/privacy-policy" style={{ color: '#ffffff' }}>Privacy Policy</a>. *
                    </label>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{
                        background: buttonColour,
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        padding: '16px 48px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {submitting ? 'Sending…' : 'Send Message'}
                    </button>
                  </div>

                  {showValidation && !requiredFilled && !submitting && (
                    <p style={{ fontSize: '0.85rem', fontWeight: 400, color: '#ff8c8c', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                      Please fill in your name, a valid email, a message, and tick the consent box.
                    </p>
                  )}

                  {submitError && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(220, 38, 38, 0.15)',
                      border: '1px solid rgba(220, 38, 38, 0.5)',
                      borderRadius: 4,
                    }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 400, color: '#ff8c8c', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                        {submitError}
                      </p>
                    </div>
                  )}

                  {/* reCAPTCHA disclosure — required by Google's TOS when
                      using the invisible v3 widget. Uses small grey text
                      below the form. */}
                  <p style={{ fontSize: '0.72rem', fontWeight: 300, color: '#ffffff', opacity: 0.5, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                    Protected by reCAPTCHA. Google&rsquo;s <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', opacity: 0.8 }}>Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', opacity: 0.8 }}>Terms of Service</a> apply.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
