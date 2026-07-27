'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   LongMassageModal (May 2026)

   Auto-opening popup shown on arrival at the 90-minute and
   120-minute treatment pages. SimplyBook cannot accommodate
   these longer bookings online, so this directs the client to
   text the clinic instead.

   Behaviour:
     - Opens automatically on mount (every visit, no persistence)
     - Dismiss via X button, click-outside, or ESC key
     - Matches the site dark modal styling (#0a0908 panel,
       white text/borders), mirroring SecondaryEnquiryModal.
   ───────────────────────────────────────────────────────────── */

const PHONE_DISPLAY = '07765 555078';
const PHONE_SMS = '+447765555078';

export default function LongMassageModal() {
  const [open, setOpen] = useState(false);

  // Open automatically on mount, every visit.
  useEffect(() => {
    setOpen(true);
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC to dismiss.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0a0908',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: '40px 32px',
          borderRadius: 4,
          maxWidth: 560,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          color: '#ffffff',
        }}
      >
        {/* Close X */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 8,
            lineHeight: 1,
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            zIndex: 1,
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.7'; }}
        >
          ✕
        </button>

        <h3 style={{
          fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
          fontWeight: 600,
          color: '#ffffff',
          margin: '0 0 20px',
          lineHeight: 1.3,
          paddingRight: 24,
        }}>
          Need a Longer Massage?
        </h3>

        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, margin: '0 0 18px' }}>
          If you would like to extend your massage beyond the appointment lengths available online, we also offer 90-minute and 120-minute massages. Simply send us a text with:
        </p>

        <ul style={{ margin: '0 0 18px', padding: '0 0 0 20px', listStyle: 'disc' }}>
          <li style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, marginBottom: 6 }}>The therapist you would like to see</li>
          <li style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, marginBottom: 6 }}>Your preferred day</li>
          <li style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, marginBottom: 6 }}>Your preferred time slot</li>
          <li style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92 }}>Whether you would like a 90-minute or 120-minute massage</li>
        </ul>

        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, margin: '0 0 24px' }}>
          We will check availability, send you the available options, and get you booked in.
        </p>

        <a
          href={`sms:${PHONE_SMS}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '16px 24px',
            fontSize: '1.05rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#0a0908',
            background: '#ffffff',
            border: '1px solid #ffffff',
            borderRadius: 999,
            textDecoration: 'none',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
        >
          Text us on {PHONE_DISPLAY}
        </a>

        <p style={{ fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.5, opacity: 0.6, margin: '20px 0 0', textAlign: 'center' }}>
          This keeps the booking system simple while allowing us to fit in longer appointments wherever possible.
        </p>
      </div>
    </div>
  );
}
