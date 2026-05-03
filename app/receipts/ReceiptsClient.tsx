'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';

/* ─────────────────────────────────────────────────────────────
   Receipt request form. Dummy submit for v1 — wire to email/ESP
   later. Submission would ideally route to the LH team inbox so
   someone can pull the receipt from SimplyBook and send to the
   client.
   ───────────────────────────────────────────────────────────── */
function ReceiptForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
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
          We&rsquo;ve received your receipt request and will email it to you within 1-2 working days.
        </p>
        <p style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, opacity: 0.65 }}>
          If you don&rsquo;t see it in your inbox, please check your spam or junk folder.
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
    }}>

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
          I agree to Lucy Hall Massage Therapy contacting me in response to this request. My data will be handled in accordance with the <a href="/legal/privacy-policy" style={{ color: '#ffffff', textDecoration: 'underline' }}>privacy policy</a>.
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
            Need a receipt for your treatment for insurance, expenses, or your own records? Fill out the form below and we&rsquo;ll email it to you within 1-2 working days.
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
