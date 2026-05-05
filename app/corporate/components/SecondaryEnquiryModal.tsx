'use client';

import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   SecondaryEnquiryModal — lightbox shown after the user submits
   the initial corporate enquiry form. Captures additional
   detail from the people willing to give it.

   Pre-filled from initial submission:
     - Name, Email, Mobile

   New fields:
     - Phone (additional/work line)
     - Company, Domain, Postcode, Position Held
     - Special Arrangements needed (Yes / No / Maybe)
     - Ideal method of initial contact (multi-select)
     - Size of Team (Small / Medium / Large)

   Submit posts to /api/corporate-enquiry with secondary:true.
   The API treats this as a "lead enriched" event, sends a
   follow-up email to Steve with all the extra fields.

   Dismiss via click-outside, X button, or ESC key.

   Three-state submit button:
     - GREEN — at least one new field filled beyond pre-filled
       Name/Email/Mobile (button is essentially always usable
       since secondary form is for adding extra info)
     - GREY  — no new info added (avoids empty submissions)
   ───────────────────────────────────────────────────────────── */

const COLOR_GREY  = '#808080';
const COLOR_GREEN = '#2cd12c';

interface SecondaryEnquiryModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Called when user dismisses (X button, click-outside, ESC). */
  onClose: () => void;
  /** Pre-fill values from the initial form submission. */
  initialName: string;
  initialEmail: string;
  initialMobile: string;
}

const CONTACT_METHODS = [
  { id: 'phone',  label: 'Phone call' },
  { id: 'mobile', label: 'Mobile call' },
  { id: 'sms',    label: 'SMS/whatsapp' },
  { id: 'email',  label: 'Email' },
];

const SPECIAL_OPTIONS = [
  { id: 'yes',   label: 'Yes' },
  { id: 'no',    label: 'No' },
  { id: 'maybe', label: 'Maybe' },
];

const TEAM_SIZES = [
  { id: 'small',  label: 'Small (2-10)' },
  { id: 'medium', label: 'Medium (10-25)' },
  { id: 'large',  label: 'Large (25+)' },
];

export default function SecondaryEnquiryModal({
  open,
  onClose,
  initialName,
  initialEmail,
  initialMobile,
}: SecondaryEnquiryModalProps) {
  // Pre-filled
  const [name,   setName]   = useState(initialName);
  const [email,  setEmail]  = useState(initialEmail);
  const [mobile, setMobile] = useState(initialMobile);

  // New fields
  const [phone,    setPhone]    = useState('');
  const [company,  setCompany]  = useState('');
  const [domain,   setDomain]   = useState('');
  const [postcode, setPostcode] = useState('');
  const [position, setPosition] = useState('');
  const [methods,  setMethods]  = useState<string[]>([]);
  const [special,  setSpecial]  = useState<string>('');
  const [teamSize, setTeamSize] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Sync pre-fill values if they change while modal is open
  useEffect(() => {
    if (open) {
      setName(initialName);
      setEmail(initialEmail);
      setMobile(initialMobile);
      // Reset success state when modal reopens
      setSuccess(false);
      setError(null);
    }
  }, [open, initialName, initialEmail, initialMobile]);

  // Lock body scroll when open. Cleanup ensures we don't leave
  // the body locked if the component unmounts.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC key to dismiss
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Has the user added any new info beyond pre-filled name/email/mobile?
  const hasNewInfo =
    phone.trim().length > 0 ||
    company.trim().length > 0 ||
    domain.trim().length > 0 ||
    postcode.trim().length > 0 ||
    position.trim().length > 0 ||
    methods.length > 0 ||
    special !== '' ||
    teamSize !== '';

  const buttonColor = hasNewInfo ? COLOR_GREEN : COLOR_GREY;
  const canSubmit   = hasNewInfo && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/corporate-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secondary: true,
          name:     name.trim(),
          email:    email.trim(),
          mobile:   mobile.trim(),
          phone:    phone.trim(),
          company:  company.trim(),
          domain:   domain.trim(),
          postcode: postcode.trim(),
          position: position.trim(),
          contactMethods: methods,
          specialArrangements: special,
          teamSize: teamSize,
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

  if (!open) return null;

  // Shared inline styles for fields
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    fontSize: '1rem',
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
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 1.4,
  };

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
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
        {/* Modal panel — stop click from bubbling to backdrop */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#0a0908',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '40px 32px',
            borderRadius: 4,
            maxWidth: 1100,
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
            onClick={onClose}
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
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.7'; }}
          >
            ✕
          </button>

          {success ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: 16, marginTop: 0 }}>
                Thank you, {name.split(' ')[0] || 'there'}!
              </h3>
              <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.6, opacity: 0.92, margin: 0 }}>
                Lucy will be in touch within one working day to discuss how we can support your team.
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{
                  marginTop: 24,
                  padding: '12px 28px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: '#ffffff',
                  background: 'transparent',
                  border: '1px solid #ffffff',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Headlines */}
              <h2 style={{
                fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)',
                fontWeight: 400,
                lineHeight: 1.4,
                textAlign: 'center',
                margin: '0 auto 24px',
                maxWidth: 800,
              }}>
                Choose a specialist corporate massage to enhance your employee wellness programs, relieve stress, and create a more positive &amp; productive work environment.
              </h2>

              <h3 style={{
                fontSize: '1.6rem',
                fontWeight: 600,
                textAlign: 'center',
                margin: '0 0 8px',
                lineHeight: 1.2,
              }}>
                Enquire now
              </h3>
              <p style={{
                fontSize: '1rem',
                fontWeight: 300,
                textAlign: 'center',
                opacity: 0.8,
                margin: '0 0 24px',
                lineHeight: 1.5,
              }}>
                Get a call or email back from us
              </p>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 28 }} />

              {/* Three-column layout on desktop, stacked on mobile */}
              <div className="sef-grid">

                {/* Column 1 — personal contact */}
                <div className="sef-col">
                  <input
                    type="text" placeholder="Name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="intake-input" style={inputStyle}
                  />
                  <input
                    type="email" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="intake-input" style={inputStyle}
                  />
                  <input
                    type="tel" placeholder="Mobile"
                    value={mobile} onChange={(e) => setMobile(e.target.value)}
                    className="intake-input" style={inputStyle}
                  />
                  <input
                    type="tel" placeholder="Phone"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="intake-input" style={inputStyle}
                  />

                  {/* Methods */}
                  <div style={{ marginTop: 8 }}>
                    <p style={labelStyle}>Ideal method of initial contact</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                          <span style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.4 }}>
                            {m.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2 — company info */}
                <div className="sef-col">
                  <input
                    type="text" placeholder="Company"
                    value={company} onChange={(e) => setCompany(e.target.value)}
                    className="intake-input" style={inputStyle}
                    autoComplete="organization"
                  />
                  <input
                    type="text" placeholder="Domain"
                    value={domain} onChange={(e) => setDomain(e.target.value)}
                    className="intake-input" style={inputStyle}
                  />
                  <input
                    type="text" placeholder="Postcode"
                    value={postcode} onChange={(e) => setPostcode(e.target.value)}
                    className="intake-input" style={inputStyle}
                    autoComplete="postal-code"
                  />
                  <input
                    type="text" placeholder="Position Held"
                    value={position} onChange={(e) => setPosition(e.target.value)}
                    className="intake-input" style={inputStyle}
                    autoComplete="organization-title"
                  />

                  {/* Team size */}
                  <div style={{ marginTop: 8 }}>
                    <p style={labelStyle}>Size of Team</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {TEAM_SIZES.map((t) => (
                        <label key={t.id} className="intake-checkbox-wrap" style={{ alignItems: 'center' }}>
                          <input
                            type="radio"
                            name="team-size"
                            checked={teamSize === t.id}
                            onChange={() => setTeamSize(t.id)}
                            className="intake-checkbox-input"
                          />
                          <span className="intake-checkbox-box" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" className="intake-checkbox-tick">
                              <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.4 }}>
                            {t.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 3 — special arrangements + submit */}
                <div className="sef-col">
                  <p style={labelStyle}>Special Arrangements needed</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {SPECIAL_OPTIONS.map((s) => (
                      <label key={s.id} className="intake-checkbox-wrap" style={{ alignItems: 'center' }}>
                        <input
                          type="radio"
                          name="special-arr"
                          checked={special === s.id}
                          onChange={() => setSpecial(s.id)}
                          className="intake-checkbox-input"
                        />
                        <span className="intake-checkbox-box" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" className="intake-checkbox-tick">
                            <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.4 }}>
                          {s.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div style={{
                  marginTop: 16,
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

              {/* Submit row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    padding: '14px 36px',
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
            </>
          )}
        </div>
      </div>

      <style>{`
        .sef-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .sef-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .sef-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </>
  );
}
