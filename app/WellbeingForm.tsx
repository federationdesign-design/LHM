'use client';

import { useState, useRef, ReactNode } from 'react';

/* ─────────────────────────────────────────────────────────────
   WellbeingForm — shared intake form used on /start-your-journey
   and /tips-download. Both pages consume this component with
   their own copy variations (heading, intro, button text,
   confirmation message). All form state, field markup, and
   styling lives here — single source of truth.

   Every submission triggers a PDF download via hidden anchor
   click. The confirmation message customises per-page to either
   focus on the download, the well-being follow-up, or both.

   Dummy submit for v1 — replace the setTimeout in handleSubmit
   with an actual POST to ESP/email backend when wired up.
   ───────────────────────────────────────────────────────────── */

export type WellbeingFormProps = {
  // Form heading shown at the top of the form card
  heading: string;
  // Short intro paragraph below the heading. Optional — defaults to the
  // standard well-being copy if not provided.
  intro?: string;
  // Text shown on the submit button (e.g. "Submit" or "Download the guide")
  submitButtonText: string;
  // Title shown on the confirmation card after successful submit. Optional —
  // defaults to "Thank you" if not provided.
  confirmationTitle?: string;
  // Body shown on the confirmation card. ReactNode to allow inline links.
  confirmationMessage: ReactNode;
  // Optional second paragraph shown below the main confirmation message.
  // Useful for follow-up notes (e.g. "We'll also be in touch...")
  confirmationFooter?: ReactNode;
  // Path to the PDF file that downloads on submit
  pdfPath: string;
  // Filename to use when saving the PDF (browser download attribute)
  pdfFilename: string;
};

// Default intro text — used when no `intro` prop is supplied
const DEFAULT_INTRO = "Tell us a little about you and your situation. We'll send the guide straight to you and follow up with tailored advice.";

// Symptom pill options — uniform across all pages using this form
const PILL_OPTIONS = [
  'Shoulders',
  'Upper back',
  'Neck',
  'Lower back',
  'Core',
  'Quads',
  'Thighs',
  'Ankle',
  'Feet',
  'Wrist',
  'Other',
];

const SEVERITY_LABELS = ['Tolerable', 'Intense', 'Distressing', 'Unbearable'];
// Thumb colours — green (mild) → red (severe)
const SEVERITY_COLOURS = ['#2cd12c', '#f5d300', '#ff8c00', '#dc2626'];

export default function WellbeingForm({
  heading,
  intro = DEFAULT_INTRO,
  submitButtonText,
  confirmationTitle = 'Thank you',
  confirmationMessage,
  confirmationFooter,
  pdfPath,
  pdfFilename,
}: WellbeingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [condition, setCondition] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [magicWand, setMagicWand] = useState('');
  const [severity, setSeverity] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Hidden anchor used to trigger the PDF download programmatically
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null);

  const toggleCondition = (opt: string) => {
    setCondition(prev =>
      prev.includes(opt) ? prev.filter(c => c !== opt) : [...prev, opt]
    );
  };

  const triggerDownload = () => {
    if (downloadAnchorRef.current) {
      downloadAnchorRef.current.click();
    }
  };

  // Map severity index → thumb colour for the slider
  const severityIndex = severity === null ? 0 : SEVERITY_LABELS.indexOf(severity);
  const severityThumbColour = severity === null ? SEVERITY_COLOURS[0] : SEVERITY_COLOURS[severityIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    // Dummy submit — replace with actual POST to ESP/email when wired
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // Trigger PDF download immediately after showing confirmation
      setTimeout(triggerDownload, 200);
    }, 800);
  };

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

  if (submitted) {
    return (
      <>
        {/* Hidden download anchor — triggered programmatically by triggerDownload() */}
        <a
          ref={downloadAnchorRef}
          href={pdfPath}
          download={pdfFilename}
          style={{ display: 'none' }}
          aria-hidden="true"
        >
          Download
        </a>
        <div style={{ background: '#0a0908', border: '1px solid rgba(255,255,255,0.25)', padding: '48px 32px', borderRadius: 4, textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>{confirmationTitle}</h3>
          <div style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.92, marginBottom: confirmationFooter ? 14 : 0 }}>
            {confirmationMessage}
          </div>
          {confirmationFooter && (
            <div style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, opacity: 0.65 }}>
              {confirmationFooter}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{
        background: '#0a0908',
        border: '1px solid rgba(255,255,255,0.25)',
        padding: '40px 32px',
        borderRadius: 4,
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', textAlign: 'center', lineHeight: 1.2, marginBottom: 14 }}>
          {heading}
        </h2>
        <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', textAlign: 'center', lineHeight: 1.5, opacity: 0.8, marginBottom: 24 }}>
          {intro}
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} className="intake-input" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} className="intake-input" />
          <input type="tel" placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} style={inputStyle} className="intake-input" />
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>What is your main symptom or injury?</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PILL_OPTIONS.map(opt => {
              const isSelected = condition.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleCondition(opt)}
                  className="intake-pill"
                  aria-pressed={isSelected}
                  data-selected={isSelected}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {condition.includes('Other') && (
            <input
              type="text"
              placeholder="Please describe..."
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              className="intake-input"
              style={{ ...inputStyle, marginTop: 12 }}
            />
          )}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>If you could wave a magic wand &mdash; what would you wish for?</label>
          <input type="text" placeholder="Enter a short statement" value={magicWand} onChange={e => setMagicWand(e.target.value)} style={inputStyle} className="intake-input" />
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle} htmlFor="intake-severity">Pick a symptom (physical or mental) that bothers you most. Now consider how bad that symptom has been over recent weeks and score it.</label>

          <div style={{ padding: '8px 4px 0' }}>
            <input
              id="intake-severity"
              type="range"
              min={0}
              max={3}
              step={1}
              value={severityIndex}
              onChange={e => setSeverity(SEVERITY_LABELS[parseInt(e.target.value, 10)])}
              className="intake-slider"
              style={{ width: '100%', ['--thumb-color' as string]: severityThumbColour }}
              aria-label="Symptom severity"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              {SEVERITY_LABELS.map(opt => (
                <span
                  key={opt}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: severity === opt ? 600 : 300,
                    color: '#ffffff',
                    opacity: severity === opt ? 1 : 0.6,
                    textAlign: 'center',
                    flex: '1 1 auto',
                    transition: 'opacity 0.2s ease, font-weight 0.2s ease',
                  }}
                >
                  {opt}
                </span>
              ))}
            </div>

            {severity === null && (
              <p style={{ fontSize: '0.82rem', fontWeight: 300, color: '#ffffff', opacity: 0.5, marginTop: 12, textAlign: 'center' }}>
                Drag the slider to score your symptom
              </p>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 22 }}>
          <label htmlFor="intake-consent" className="intake-checkbox-wrap">
            <input
              type="checkbox"
              id="intake-consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              required
              className="intake-checkbox-input"
            />
            <span className="intake-checkbox-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="intake-checkbox-tick">
                <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, opacity: 0.85 }}>
              I agree to Lucy Hall Massage Therapy contacting me in response to this enquiry. My data will be handled in accordance with the <a href="/legal/privacy-policy" style={{ color: '#ffffff', textDecoration: 'underline' }}>privacy policy</a>.
            </span>
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
          {submitting ? 'Submitting…' : submitButtonText}
        </button>
      </form>

      {/* Form CSS — focus invert, pill toggles, custom checkbox, slider */}
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

        .intake-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          font-size: 0.9rem;
          font-weight: 400;
          font-family: inherit;
          color: #ffffff;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          line-height: 1.2;
        }
        .intake-pill:hover {
          border-color: rgba(255,255,255,0.8);
        }
        .intake-pill[data-selected="true"] {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
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

        .intake-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          margin: 0;
          padding: 0;
          background:
            linear-gradient(to right,
              rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) 1.5%,
              transparent 1.5%, transparent 33.33%,
              rgba(255,255,255,0.6) 33.33%, rgba(255,255,255,0.6) 34.83%,
              transparent 34.83%, transparent 66.66%,
              rgba(255,255,255,0.6) 66.66%, rgba(255,255,255,0.6) 68.16%,
              transparent 68.16%, transparent 98.5%,
              rgba(255,255,255,0.6) 98.5%, rgba(255,255,255,0.6) 100%
            ),
            rgba(255,255,255,0.2);
        }
        .intake-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--thumb-color, #2cd12c);
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.15s ease, background 0.25s ease;
        }
        .intake-slider::-webkit-slider-thumb:hover,
        .intake-slider::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        .intake-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--thumb-color, #2cd12c);
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.15s ease, background 0.25s ease;
        }
        .intake-slider::-moz-range-thumb:hover,
        .intake-slider::-moz-range-thumb:active {
          transform: scale(1.1);
        }
        .intake-slider::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }
      `}</style>
    </>
  );
}
