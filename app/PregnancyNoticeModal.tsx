'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   PregnancyNoticeModal (August 2026)

   Auto-opening informational popup shown on arrival at the
   pregnancy massage pages. Advises clients that pregnancy
   massage can only take place after the first trimester and a
   successful first scan.

   Behaviour:
     - Opens automatically on mount (every visit, no persistence)
     - Dismiss via X button, Got it button, click-outside, or ESC
     - Matches the site dark modal styling (#0a0908 panel,
       white text/borders), mirroring LongMassageModal.
   ───────────────────────────────────────────────────────────── */

export default function PregnancyNoticeModal() {
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
          Before Booking Your Pregnancy Massage
        </h3>

        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, margin: '0 0 24px' }}>
          Pregnancy massage appointments can only take place once you have completed your first trimester (12 weeks) and have had your first successful scan.
        </p>

        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            padding: '16px 24px',
            fontSize: '1.05rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#0a0908',
            background: '#ffffff',
            border: '1px solid #ffffff',
            borderRadius: 999,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
