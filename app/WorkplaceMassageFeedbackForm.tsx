'use client';

import { useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   WorkplaceMassageFeedbackForm — corp feedback form used at
   /workplace-massage-feedback. Submitted by clients who have
   received in-office massage to evaluate the service.

   19 fields total:
     - 4 contact (name, email, mobile, company) — all required
     - 10 rating sliders (3-point each) — all "required" but with
       a sensible middle default; user-submittable as-is, matching
       WellbeingForm UX
     - 4 free-text (areas / manage / liked / better) — all optional
     - 1 yes/no recommend pill pair — required
   Plus the declarationConsent checkbox in the parent column.

   Slider style mirrors WellbeingForm exactly but with 3 tick
   positions instead of 4. Solid green thumb (feedback is
   positive-direction; no severity gradient).

   Submit colour: grey -> orange (mandatory met) -> green
   (mandatory + any optional free-text filled).

   CSS prefix `wmf-` to avoid colliding with qf- / wf- / intake-.
   ───────────────────────────────────────────────────────────── */

// ── SLIDER DEFINITIONS ────────────────────────────────────────

type SliderQuestion = {
  id: string;
  label: string;
  options: [string, string, string];
};

const SLIDERS: SliderQuestion[] = [
  { id: 'experience',        label: 'How would you rate your overall experience?',                                       options: ['Average', 'Good', 'Excellent'] },
  { id: 'feelAfter',         label: 'How do you feel after your massage session?',                                       options: ['No change', 'Slightly better', 'Much better'] },
  { id: 'painRelief',        label: 'Did the session help relieve any pain or discomfort?',                              options: ['No change', 'Somewhat', 'Significantly'] },
  { id: 'posture',           label: 'Did the session improve your posture or awareness of it?',                          options: ['No', 'Somewhat', 'Yes'] },
  { id: 'workdayDifference', label: 'Has this service made a positive difference to your working day?',                  options: ['No difference', 'A little difference', 'A big difference'] },
  { id: 'benefitsLasted',    label: 'Have the benefits of your session lasted beyond the treatment itself?',             options: ['Not really', 'Somewhat', 'Significantly'] },
  { id: 'supportValue',      label: 'How valuable is having access to ongoing support and advice in the workplace?',     options: ['Not valuable', 'Somewhat valuable', 'Significantly valuable'] },
  { id: 'companyBenefit',    label: 'Do you feel this service is a valuable benefit provided by your company?',          options: ['Not valuable', 'Somewhat valuable', 'Significantly valuable'] },
  { id: 'staffWellbeing',    label: 'Do you see workplace massage as an important part of staff wellbeing?',             options: ['Yes', 'Maybe', 'No'] },
  { id: 'missIt',            label: 'If this service was no longer available, would you miss it?',                       options: ['Yes, a lot', 'Yes, a little', 'No'] },
];

// ── BUTTON COLOURS ────────────────────────────────────────────
const BUTTON_GREY   = '#808080';
const BUTTON_ORANGE = '#ff8c00';
const BUTTON_GREEN  = '#2cd12c';

// ── PROPS ─────────────────────────────────────────────────────
type Props = {
  declarationConsent: boolean;
  showValidation: boolean;
  setShowValidation: (v: boolean) => void;
};

// ── STYLES (shared, defined once outside component) ───────────
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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  borderRadius: 14,
  minHeight: 90,
  resize: 'vertical',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '1rem',
  fontWeight: 400,
  color: '#ffffff',
  marginBottom: 10,
  lineHeight: 1.4,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: '#ffffff',
  opacity: 0.6,
  margin: '32px 0 18px',
  paddingBottom: 10,
  borderBottom: '1px solid rgba(255,255,255,0.15)',
};

// ── COMPONENT ─────────────────────────────────────────────────

export default function WorkplaceMassageFeedbackForm({ declarationConsent, showValidation, setShowValidation }: Props) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [mobile, setMobile]     = useState('');
  const [company, setCompany]   = useState('');

  // Sliders default to the middle option. Matches WellbeingForm UX.
  const [sliderValues, setSliderValues] = useState<Record<string, string>>(
    Object.fromEntries(SLIDERS.map(s => [s.id, s.options[1]]))
  );

  const [areasImproved, setAreasImproved] = useState('');
  const [manageIssues, setManageIssues]   = useState('');
  const [likedMost, setLikedMost]         = useState('');
  const [doBetter, setDoBetter]           = useState('');

  const [recommend, setRecommend] = useState<'yes' | 'no' | ''>('');

  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot]       = useState('');

  // ── VALIDATION ──────────────────────────────────────────────
  const mandatoryFilled =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    email.includes('@') &&
    mobile.trim().length > 0 &&
    company.trim().length > 0 &&
    declarationConsent &&
    recommend !== '';

  const anyOptionalFilled =
    areasImproved.trim().length > 0 ||
    manageIssues.trim().length > 0 ||
    likedMost.trim().length > 0 ||
    doBetter.trim().length > 0;

  const buttonColour = !mandatoryFilled
    ? BUTTON_GREY
    : anyOptionalFilled
    ? BUTTON_GREEN
    : BUTTON_ORANGE;

  // ── SUBMIT ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    if (!mandatoryFilled) return;
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      name:    name.trim(),
      email:   email.trim(),
      mobile:  mobile.trim(),
      company: company.trim(),
      ratings: sliderValues,
      areasImproved: areasImproved.trim() || null,
      manageIssues:  manageIssues.trim() || null,
      likedMost:     likedMost.trim() || null,
      doBetter:      doBetter.trim() || null,
      recommend,
      website: honeypot,
    };

    try {
      const res  = await fetch('/api/submit-workplace-feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  // ── CONFIRMATION STATE ──────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: '#0a0908', border: '1px solid rgba(255,255,255,0.25)', padding: '48px 32px', borderRadius: 4, textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>Thank you</h3>
        <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.92 }}>
          Your feedback has been received. Lucy and the team really appreciate you taking the time. Your responses help us improve the service for everyone.
        </p>
      </div>
    );
  }

  // ── SLIDER RENDERER (closure over state) ────────────────────
  const renderSlider = (id: string) => {
    const q = SLIDERS.find(s => s.id === id)!;
    const currentIndex = q.options.indexOf(sliderValues[id]);
    return (
      <div key={id} style={{ marginBottom: 26 }}>
        <label style={labelStyle}>{q.label}</label>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={currentIndex}
          onChange={e => setSliderValues(prev => ({ ...prev, [id]: q.options[parseInt(e.target.value, 10)] }))}
          className="wmf-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
          {q.options.map((opt, i) => (
            <span
              key={opt}
              style={{
                fontSize: '0.85rem',
                fontWeight: i === currentIndex ? 600 : 400,
                color: '#ffffff',
                opacity:    i === currentIndex ? 1 : 0.55,
                textAlign:  i === 0 ? 'left' : i === 1 ? 'center' : 'right',
                flex: 1,
                transition: 'opacity 0.2s ease, font-weight 0.2s ease',
              }}
            >
              {opt}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ── FORM ────────────────────────────────────────────────────
  return (
    <>
      <form onSubmit={handleSubmit} style={{
        background:   '#0a0908',
        border:       '1px solid rgba(255,255,255,0.25)',
        padding:      '40px 32px',
        borderRadius: 4,
        position:     'relative',
      }}>
        {/* HONEYPOT */}
        <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
          <label htmlFor="wmf-website">
            Website (leave blank)
            <input type="text" id="wmf-website" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', textAlign: 'center', lineHeight: 1.2, marginBottom: 14 }}>
          Tell us about your session
        </h2>
        <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', textAlign: 'center', lineHeight: 1.5, opacity: 0.8, marginBottom: 24 }}>
          Slide each rating to match your experience. Free-text questions are optional.
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 22 }} />

        {/* CONTACT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text"  placeholder="Name"         value={name}    onChange={e => setName(e.target.value)}    required style={inputStyle} className="intake-input" />
          <input type="email" placeholder="Email"        value={email}   onChange={e => setEmail(e.target.value)}   required style={inputStyle} className="intake-input" />
          <input type="tel"   placeholder="Mobile"       value={mobile}  onChange={e => setMobile(e.target.value)}  required style={inputStyle} className="intake-input" />
          <input type="text"  placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)} required style={inputStyle} className="intake-input" />
        </div>

        {/* ── ABOUT YOUR EXPERIENCE ───────────────────────────── */}
        <p style={sectionLabelStyle}>About Your Experience</p>
        {renderSlider('experience')}
        {renderSlider('feelAfter')}

        {/* ── IMPACT ON PAIN & POSTURE ───────────────────────── */}
        <p style={sectionLabelStyle}>Impact on Pain &amp; Posture</p>
        {renderSlider('painRelief')}
        {renderSlider('posture')}
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>What areas improved the most? <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <textarea
            placeholder="e.g. Neck, shoulders, back, posture, stress, other"
            value={areasImproved}
            onChange={e => setAreasImproved(e.target.value)}
            style={textareaStyle}
            className="intake-input"
          />
        </div>

        {/* ── IMPACT ON YOUR WORKDAY ─────────────────────────── */}
        <p style={sectionLabelStyle}>Impact on Your Workday</p>
        {renderSlider('workdayDifference')}

        {/* ── LONGER-TERM IMPACT & SUPPORT ───────────────────── */}
        <p style={sectionLabelStyle}>Longer-Term Impact &amp; Support</p>
        {renderSlider('benefitsLasted')}
        {renderSlider('supportValue')}
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Has this service helped you manage or prevent ongoing issues? <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <textarea
            placeholder="e.g. Headaches, repetitive strain injury, etc"
            value={manageIssues}
            onChange={e => setManageIssues(e.target.value)}
            style={textareaStyle}
            className="intake-input"
          />
        </div>

        {/* ── VALUE TO YOU & YOUR COMPANY ────────────────────── */}
        <p style={sectionLabelStyle}>Value to You &amp; Your Company</p>
        {renderSlider('companyBenefit')}
        {renderSlider('staffWellbeing')}
        {renderSlider('missIt')}

        {/* ── FINAL THOUGHTS ─────────────────────────────────── */}
        <p style={sectionLabelStyle}>Final Thoughts</p>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>What did you like most about the session? <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <textarea value={likedMost} onChange={e => setLikedMost(e.target.value)} style={textareaStyle} className="intake-input" />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Is there anything we could do better? <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <textarea value={doBetter} onChange={e => setDoBetter(e.target.value)} style={textareaStyle} className="intake-input" />
        </div>

        {/* RECOMMEND */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Would you recommend this service to colleagues?</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => setRecommend('yes')}
              className="intake-pill"
              data-selected={recommend === 'yes'}
              style={{ flex: 1, padding: '14px 18px', fontSize: '1rem' }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setRecommend('no')}
              className="intake-pill"
              data-selected={recommend === 'no'}
              style={{ flex: 1, padding: '14px 18px', fontSize: '1rem' }}
            >
              No
            </button>
          </div>
          {showValidation && recommend === '' && (
            <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>Please choose Yes or No.</p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '14px 22px',
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#ffffff',
            background: buttonColour,
            border: 'none',
            borderRadius: 999,
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.2s ease',
          }}
        >
          {submitting ? 'Submitting…' : 'Submit feedback'}
        </button>

        {showValidation && !mandatoryFilled && !submitting && (
          <p style={{ fontSize: '0.85rem', fontWeight: 400, color: '#ff8c8c', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
            Please complete all mandatory fields and tick the declaration in the left column.
          </p>
        )}

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

      {/* Input/pill/slider CSS. Reuses .intake-* classes from
          WellbeingForm conventions. Slider tick marks placed at
          0% / 50% / 100% for 3-position scale. */}
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
        .intake-input:focus::placeholder { color: rgba(255,255,255,0.5); }

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
        .intake-pill:hover { border-color: rgba(255,255,255,0.8); }
        .intake-pill[data-selected="true"] {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .wmf-slider {
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
              transparent 1.5%, transparent 50%,
              rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.6) 51.5%,
              transparent 51.5%, transparent 98.5%,
              rgba(255,255,255,0.6) 98.5%, rgba(255,255,255,0.6) 100%
            ),
            rgba(255,255,255,0.2);
        }
        .wmf-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2cd12c;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.15s ease;
        }
        .wmf-slider::-webkit-slider-thumb:hover,
        .wmf-slider::-webkit-slider-thumb:active { transform: scale(1.1); }
        .wmf-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2cd12c;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.15s ease;
        }
        .wmf-slider::-moz-range-thumb:hover,
        .wmf-slider::-moz-range-thumb:active { transform: scale(1.1); }
        .wmf-slider::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }
      `}</style>
    </>
  );
}
