'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import { services } from '../data/services';

/* ─────────────────────────────────────────────────────────────
   Receipt request form. Submits to /api/submit-receipt-request,
   which forwards to info@lucyhallmassage.com for the team to
   process from SimplyBook on Fridays.
   ───────────────────────────────────────────────────────────── */
function ReceiptForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [treatment, setTreatment] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [town, setTown] = useState('');
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/submit-receipt-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:          name.trim(),
          email:         email.trim(),
          orderNumber:   orderNumber.trim(),
          treatmentDate: treatmentDate.trim(),
          treatment,
          addressLine1:  addressLine1.trim(),
          town:          town.trim(),
          postcode:      postcode.trim(),
          notes:         notes.trim() || null,
          website:       honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  // Shared input style — matches start-your-journey form for consistency
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

  // Textarea uses square corners (pill-shape doesn't work for multi-line)
  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    borderRadius: 12,
    minHeight: 120,
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: 1.5,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 400,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 1.4,
  };

  if (submitted) {
    return (
      <div style={{ background: '#0a0908', border: '1px solid rgba(255,255,255,0.25)', padding: '48px 32px', borderRadius: 4, textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>Thank you</h3>
        <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.85, marginBottom: 12 }}>
          We&rsquo;ve received your receipt request and will process it on Friday.
        </p>
        <p style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, opacity: 0.65 }}>
          If you don&rsquo;t see it in your inbox by the following Monday, please check your spam or junk folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#0a0908',
      border: '1px solid rgba(255,255,255,0.25)',
      padding: '40px 32px',
      borderRadius: 4,
      position: 'relative',
    }}>

      {/* HONEYPOT — visually hidden. Bots fill it; users don't. */}
      <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="rec-website">
          Website (leave blank)
          <input type="text" id="rec-website" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-name">Full name</label>
        <input id="rec-name" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-email">Email address</label>
        <input id="rec-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-order">Order number</label>
        <input
          id="rec-order"
          type="text"
          placeholder="e.g. 123456"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
          required
          style={inputStyle}
        />
        <p style={{ fontSize: '0.82rem', fontWeight: 300, color: '#ffffff', opacity: 0.6, marginTop: 8, lineHeight: 1.4 }}>
          You&rsquo;ll find this in your booking confirmation email.
        </p>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-date">Date of treatment</label>
        <input
          id="rec-date"
          type="date"
          value={treatmentDate}
          onChange={e => setTreatmentDate(e.target.value)}
          required
          style={{ ...inputStyle, colorScheme: 'light' }}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-treatment">Treatment</label>
        <select
          id="rec-treatment"
          value={treatment}
          onChange={e => setTreatment(e.target.value)}
          required
          style={{ ...inputStyle, colorScheme: 'light' }}
        >
          <option value="" disabled>Select treatment</option>
          {Object.values(services).map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
        </select>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-address">Address line 1</label>
        <input
          id="rec-address"
          type="text"
          placeholder="House number and street"
          value={addressLine1}
          onChange={e => setAddressLine1(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-town">City / Town</label>
        <input
          id="rec-town"
          type="text"
          placeholder="e.g. Cambridge"
          value={town}
          onChange={e => setTown(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-postcode">Postcode</label>
        <input
          id="rec-postcode"
          type="text"
          placeholder="e.g. CB1 3AU"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="rec-notes">Additional notes (optional)</label>
        <textarea
          id="rec-notes"
          placeholder="Anything else you'd like us to know?"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={textareaStyle}
        />
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
        <input
          type="checkbox"
          id="rec-consent"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          required
          style={{ accentColor: '#ffffff', width: 18, height: 18, marginTop: 3, flexShrink: 0 }}
        />
        <label htmlFor="rec-consent" style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, cursor: 'pointer', opacity: 0.85 }}>
          By submitting this form, you agree to us processing your information to provide your receipt. Your data will be handled in accordance with our <a href="/legal/privacy-policy" style={{ color: '#ffffff', textDecoration: 'underline' }}>Privacy Policy</a>.
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting || !consent}
        style={{
          width: '100%',
          padding: '14px 22px',
          fontSize: '0.95rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: '#ffffff',
          background: consent ? '#2cd12c' : 'rgba(44, 209, 44, 0.4)',
          border: 'none',
          borderRadius: 999,
          cursor: consent ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
          transition: 'background 0.2s ease',
        }}
      >
        {submitting ? 'Submitting…' : 'Request receipt'}
      </button>

      {submitError && (
        <div style={{
          marginTop: 16,
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
    </form>
  );
}

export default function ReceiptsClient() {
  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* Header section */}
        <section style={{ padding: '120px 24px 40px', maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Receipts
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 24 }}>
            Request Your Receipt
          </h1>
          <p style={{ fontSize: '1.05rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 18 }}>
            Fill out the form below and we&rsquo;ll process your request on Fridays only.
          </p>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.75 }}>
            You&rsquo;ll find your order number in the confirmation email we sent when you booked. If you can&rsquo;t find it, no problem &mdash; provide as much detail as you can in the notes section and we&rsquo;ll track it down.
          </p>
        </section>

        {/* Form section */}
        <section style={{ padding: '20px 24px 100px', maxWidth: 760, margin: '0 auto' }}>
          <ReceiptForm />
        </section>

        <Footer />
      </main>
    </>
  );
}