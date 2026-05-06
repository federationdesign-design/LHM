'use client';

import { useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   Lightbox — fullscreen image overlay.

   Opens centred image scaled to fit viewport, dark backdrop,
   X button + ESC key + click-outside dismiss.

   Used by the corp homepage gallery for click-to-enlarge.

   Renders as a fixed overlay; pass `open` + `src` + `onClose`
   from the parent. When `open` is false, returns null.
   ───────────────────────────────────────────────────────────── */

interface LightboxProps {
  open: boolean;
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ open, src, onClose }: LightboxProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC to dismiss
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !src) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        cursor: 'zoom-out',
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          fontSize: '2rem',
          cursor: 'pointer',
          padding: 8,
          lineHeight: 1,
          opacity: 0.85,
          transition: 'opacity 0.2s ease',
          zIndex: 1,
        }}
        onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.85'; }}
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '95vw',
          maxHeight: '95vh',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          cursor: 'default',
        }}
        draggable={false}
      />
    </div>
  );
}
