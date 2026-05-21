'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   SecondaryEnquiryModal — REBUILT (May 2026)

   Lightbox shown after the user submits the initial corporate
   enquiry form. Captures DETAILED qualifying information.

   Pre-filled from initial submission:
     - Name, Email, Mobile

   New fields (per client spec):
     COMPANY & OFFICE INFORMATION
     - Office Location (text)                  [REQUIRED]
     - Approximate Number of Employees         [REQUIRED]
     - Service type interested in (multi)      [REQUIRED]
     - Timing (when looking to organise)       [REQUIRED]
     - Approximate budget (optional)
     ENQUIRY DETAILS
     - What prompted your enquiry (textarea)   [optional]
     - How did you hear about us               [optional]

   Submit button enables only when 4 required fields filled.
   On success, posts to /api/corporate-enquiry with
   { secondary: true, detailed: true, ...fields } so the API
   can route to "Detailed Lead Capture - [Name]" email subject.

   Dismiss via click-outside, X button, ESC key.
   ───────────────────────────────────────────────────────────── */

const COLOR_GREY  = '#808080';
const COLOR_GREEN = '#2cd12c';

interface SecondaryEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
  initialEmail: string;
  initialMobile: string;
  initialCompany?: string;
  initialJobTitle?: string;
}

const EMPLOYEE_RANGES = [
  { id: 'under-20',   label: 'Under 20' },
  { id: '20-50',      label: '20–50' },
  { id: '50-100',     label: '50–100' },
  { id: '100-250',    label: '100–250' },
  { id: '250-plus',   label: '250+' },
];

const SERVICE_TYPES = [
  { id: 'one-off',          label: 'One-off wellbeing day' },
  { id: 'event-massage',    label: 'Event massage' },
  { id: 'monthly',          label: 'Monthly workplace massage' },
  { id: 'quarterly',        label: 'Quarterly wellbeing sessions' },
  { id: 'weekly',           label: 'Weekly onsite massage' },
  { id: 'unsure',           label: 'Unsure / would like recommendations' },
];

const TIMING_OPTIONS = [
  { id: 'asap',             label: 'ASAP' },
  { id: 'within-1-month',   label: 'Within 1 month' },
  { id: '1-3-months',       label: '1–3 months' },
  { id: '3-plus-months',    label: '3+ months' },
  { id: 'exploring',        label: 'Just exploring options' },
];

const BUDGET_OPTIONS = [
  { id: 'under-500',        label: 'Under £500' },
  { id: '500-1000',         label: '£500–£1,000' },
  { id: '1000-2500',        label: '£1,000–£2,500' },
  { id: '2500-plus',        label: '£2,500+' },
  { id: 'unsure',           label: 'Unsure' },
];

const CONTACT_PREFERENCE_OPTIONS = [
  { id: 'phone',   label: 'Phone call' },
  { id: 'email',   label: 'Email' },
  { id: 'text',    label: 'Text message' },
  { id: 'either',  label: 'Either is fine' },
];

const HEARD_ABOUT_OPTIONS = [
  { id: 'google',           label: 'Google search' },
  { id: 'referral',         label: 'Referral' },
  { id: 'linkedin',         label: 'LinkedIn' },
  { id: 'social-media',     label: 'Social media' },
  { id: 'existing-client',  label: 'Existing client recommendation' },
  { id: 'event',            label: 'Event' },
  { id: 'other',            label: 'Other' },
];

export default function SecondaryEnquiryModal({
  open,
  onClose,
  initialName,
  initialEmail,
  initialMobile,
  initialCompany = '',
  initialJobTitle = '',
}: SecondaryEnquiryModalProps) {
  // Pre-filled
  const [name,   setName]   = useState(initialName);
  const [email,  setEmail]  = useState(initialEmail);
  const [mobile, setMobile] = useState(initialMobile);
  const [company, setCompany] = useState(initialCompany);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);

  // Required new fields
  const [officeLocation, setOfficeLocation] = useState('');
  const [employeeCount,  setEmployeeCount]  = useState('');
  const [serviceTypes,   setServiceTypes]   = useState<string[]>([]);
  const [timing,         setTiming]         = useState('');

  // Optional new fields
  const [budget,         setBudget]         = useState('');
  const [enquiryDetails, setEnquiryDetails] = useState('');
  const [heardAbout,     setHeardAbout]     = useState('');
  const [contactPref,    setContactPref]    = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Sync pre-fill when modal opens
  useEffect(() => {
    if (open) {
      setName(initialName);
      setEmail(initialEmail);
      setMobile(initialMobile);
      setSuccess(false);
      setError(null);
    }
  }, [open, initialName, initialEmail, initialMobile]);

  // Lock body scroll when open
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

  const toggleService = (id: string) => {
    setServiceTypes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Required fields check — Office Location, Employee Count, Service Type, Timing
  const requiredFilled =
    officeLocation.trim().length > 0 &&
    employeeCount !== '' &&
    serviceTypes.length > 0 &&
    timing !== '';

  const buttonColor = requiredFilled ? COLOR_GREEN : COLOR_GREY;
  const canSubmit   = requiredFilled && !submitting;

  const handleSubmit = async () => {
    setShowValidation(true);
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/corporate-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secondary: true,
          detailed: true,
          name:   name.trim(),
          email:  email.trim(),
          mobile: mobile.trim(),
          company: company.trim(),
          jobTitle: jobTitle.trim(),
          // New fields
          officeLocation: officeLocation.trim(),
          employeeCount,
          serviceTypes,
          timing,
          budget,
          enquiryDetails: enquiryDetails.trim(),
          heardAbout,
          contactPref,
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

  // Shared input styles
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

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 18px center',
    backgroundSize: '18px',
    paddingRight: 44,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 1.4,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 16px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    opacity: 0.85,
  };

  return (
    <>
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
              zIndex: 1,
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
              {/* PDF download link box (opens in new tab) */}
              <a
                href="/employer-info.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  maxWidth: 600,
                  margin: '0 auto 32px',
                  padding: '16px 24px',
                  border: '1px solid rgba(255,255,255,0.6)',
                  borderRadius: 4,
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
              >
                <img src="/pdf-icon.png" alt="" style={{ width: 48, height: 'auto', flexShrink: 0 }} />
                <span style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.3 }}>
                  View the Staff wellbeing employer PDF now
                </span>
              </a>
              <p style={{
                fontSize: '1rem',
                fontWeight: 300,
                textAlign: 'center',
                opacity: 0.85,
                margin: '0 auto 24px',
                maxWidth: 700,
                lineHeight: 1.5,
              }}>
                If you have the time you can tell us more about your enquiry here
              </p>
              <p style={{
                fontSize: '0.85rem',
                fontWeight: 300,
                textAlign: 'center',
                opacity: 0.6,
                margin: '0 0 24px',
                lineHeight: 1.5,
              }}>
                Required fields marked *
              </p>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 28 }} />

              {/* Name/email/mobile carried over from the first form — hidden so the
                  user doesn't re-enter, but state stays in sync via the pre-fill props. */}
              <div className="sef-row sef-row--2col" style={{ marginBottom: 18 }}>
                <input
                  type="text" placeholder="Company name"
                  value={company} onChange={(e) => setCompany(e.target.value)}
                  className="sef-input"
                  style={inputStyle}
                  autoComplete="organization"
                  maxLength={120}
                />
                <input
                  type="text" placeholder="Job title"
                  value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                  className="sef-input"
                  style={inputStyle}
                  autoComplete="organization-title"
                  maxLength={120}
                />
              </div>

              {/* ── COMPANY & OFFICE INFORMATION ─────────────── */}
              {/* Row: Office Location + Employee Count */}
              <div className="sef-row sef-row--2col" style={{ marginBottom: 18 }}>
                <div>
                  <label style={labelStyle}>Office Location <span style={{ color: '#ff8c8c' }}>*</span></label>
                  <input
                    type="text" placeholder="Town/city or postcode"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Approximate Number of Employees Onsite <span style={{ color: '#ff8c8c' }}>*</span></label>
                  <select
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">Select range</option>
                    {EMPLOYEE_RANGES.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service type — full width because checkboxes need room */}
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>What type of service are you interested in? <span style={{ color: '#ff8c8c' }}>*</span></label>
                <div className="sef-checkbox-grid">
                  {SERVICE_TYPES.map((s) => (
                    <label key={s.id} className="intake-checkbox-wrap" style={{ alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={serviceTypes.includes(s.id)}
                        onChange={() => toggleService(s.id)}
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

              {/* Row: Timing + Budget */}
              <div className="sef-row sef-row--2col" style={{ marginBottom: 22 }}>
                <div>
                  <label style={labelStyle}>When are you looking to organise this? <span style={{ color: '#ff8c8c' }}>*</span></label>
                  <select
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">Select timing</option>
                    {TIMING_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Do you have an approximate budget in mind?</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">Select budget</option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── ENQUIRY DETAILS ──────────────────────────── */}
              <div className="sef-row sef-row--2col" style={{ marginBottom: 22 }}>
                {/* LEFT: What prompted your enquiry — textarea */}
                <div>
                  <label style={labelStyle}>What prompted your enquiry?</label>
                  <textarea
                    value={enquiryDetails}
                    onChange={(e) => setEnquiryDetails(e.target.value)}
                    placeholder="e.g. Employee wellbeing initiative, staff appreciation, workplace stress support, event or awareness week, retention &amp; morale, general wellbeing support…"
                    rows={8}
                    style={{
                      ...inputStyle,
                      borderRadius: 16,
                      resize: 'vertical',
                      minHeight: 200,
                      paddingTop: 14,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* RIGHT: contact pref + heard about us, stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  {/* How would you prefer to be contacted — pill row */}
                  <div>
                    <label style={labelStyle}>How would you prefer to be contacted?</label>
                    <div className="sef-pill-row">
                      {CONTACT_PREFERENCE_OPTIONS.map((opt) => {
                        const active = contactPref === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setContactPref(active ? '' : opt.id)}
                            className="sef-pill"
                            style={{
                              background: active ? '#ffffff' : 'transparent',
                              color: active ? '#000000' : '#ffffff',
                              borderColor: active ? '#ffffff' : 'rgba(255,255,255,0.5)',
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* How did you hear about us */}
                  <div>
                    <label style={labelStyle}>How did you hear about us?</label>
                    <select
                      value={heardAbout}
                      onChange={(e) => setHeardAbout(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">Select an option</option>
                      {HEARD_ABOUT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
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
        .sef-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 22px;
        }
        @media (min-width: 768px) {
          .sef-row--3col {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .sef-row--2col {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }
        .sef-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .sef-pill {
          padding: 10px 22px;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 999px;
          background: transparent;
          color: #ffffff;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }
        .sef-pill:hover {
          border-color: #ffffff;
        }
        .sef-checkbox-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .sef-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .sef-pill {
          padding: 10px 22px;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 999px;
          background: transparent;
          color: #ffffff;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }
        .sef-pill:hover {
          border-color: #ffffff;
        }
        .sef-checkbox-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px 24px;
          }
        }
        .sef-input[data-invalid="true"] {
          box-shadow: 0 0 0 2px #ff8c00;
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
      `}</style>
    </>
  );
}
