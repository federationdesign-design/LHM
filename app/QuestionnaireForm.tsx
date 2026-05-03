'use client';

import { useState, useRef, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   QuestionnaireForm — new client medical intake form.
   Used at /questionnaire and sent to clients after they book
   their first appointment. Submitted data should be reviewed
   by the therapist ahead of treatment.

   Self-contained component with all state, markup and styling.
   Dummy submit for v1 — replace setTimeout in handleSubmit with
   a real POST to backend (storing securely as it includes
   medical/sensitive data).

   Includes a custom signature pad built on HTML5 canvas with
   mouse and touch event handlers — no external library
   dependency. Captured as base64 PNG for storage/transmission.

   CSS class prefix `qf-` to avoid colliding with `wf-` (the
   wellbeing form) since both share visual conventions but are
   structurally and purposefully different.
   ───────────────────────────────────────────────────────────── */

// ── OPTION LISTS ──────────────────────────────────────────────────────────────

const PREGNANCY_OPTIONS = ['No', 'Yes', 'Prefer not to say'];
const TRIMESTER_OPTIONS = ['1st trimester', '2nd trimester', '3rd trimester'];

const MUSCULOSKELETAL_OPTIONS = [
  'Arthritis',
  'Herniated disc',
  'Joint replacements',
  'Tennis elbow / Frozen shoulder',
  'RSI (Repetitive Strain Injury)',
  'Sciatica',
  'Whiplash recovery',
  'Sports injury (recent)',
  'Lower back pain',
  'None of the above',
];

const SYMPTOMS_OPTIONS = [
  'Currently breastfeeding',
  'Period pain (severe / dysmenorrhea)',
  'Endometriosis',
  'Anxiety / depression (active)',
  'Insomnia / sleep disturbance',
  'Recent surgery (within last 6 months)',
  'Recent injury',
  'Numbness',
  'Breathing difficulties',
  'Headaches / migraines',
  'Rapid weight loss',
  'Chronic fatigue syndrome',
  'Restless legs',
  'Bowel / bladder problems',
  'None of the above',
];

const HISTORY_OPTIONS = [
  'Skin conditions',
  'Pacemaker',
  'Stroke (history of)',
  'Diabetes',
  "Raynaud's",
  'Osteoporosis',
  'Epilepsy',
  'High blood pressure',
  'Heart disease',
  'Fibroids',
  'Asthma',
  'Multiple sclerosis',
  'Lupus',
  'Allergies (severe)',
  'None of the above',
];

const HEAR_ABOUT_OPTIONS = ['Google', 'Website', 'Facebook', 'Instagram', 'LinkedIn', 'Word of mouth', 'Other'];

const CANCER_OPTIONS = ['No', 'Yes'];

// ── SIGNATURE PAD COMPONENT ───────────────────────────────────────────────────

type SignaturePadProps = {
  onChange: (dataUrl: string) => void;
};

function SignaturePad({ onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);

  // Set up canvas dimensions and styling on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      // Maintain pixel-perfect rendering on Retina by scaling internal resolution
      const ratio = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = cssWidth * ratio;
      canvas.height = cssHeight * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPoint = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    lastPoint.current = getPoint(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const point = getPoint(e);
    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    lastPoint.current = point;
    if (!hasInk) setHasInk(true);
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastPoint.current = null;
    // Emit base64 PNG when stroke finishes
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange('');
  };

  return (
    <div>
      <div style={{
        position: 'relative',
        background: '#000000',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 4,
        height: 160,
        overflow: 'hidden',
        touchAction: 'none',
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />
        {!hasInk && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            color: '#ffffff',
            opacity: 0.4,
            fontSize: '0.9rem',
            fontWeight: 300,
          }}>
            Sign above using your mouse or finger
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          type="button"
          onClick={clear}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            opacity: 0.7,
            padding: '4px 8px',
            fontFamily: 'inherit',
          }}
        >
          Clear signature
        </button>
      </div>
    </div>
  );
}

// ── PILL TOGGLE GROUP ─────────────────────────────────────────────────────────

type PillGroupProps = {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
};

function PillGroup({ options, selected, onToggle }: PillGroupProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className="qf-pill"
            aria-pressed={isSelected}
            data-selected={isSelected}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── MAIN FORM ─────────────────────────────────────────────────────────────────

export type QuestionnaireFormProps = {
  // The declaration consent checkbox lives in QuestionnaireClient's intro
  // column (sticky on desktop, above-the-form on mobile). Its state is
  // passed in here so the form's canSubmit gating can require it.
  declarationConsent: boolean;
  // Whether validation messages should show. Lifted to client so both
  // columns can stay in sync (declaration column shows its own message
  // when this is true).
  showValidation: boolean;
  // Called the moment the user attempts to submit. Client uses this to
  // flip showValidation to true.
  onSubmitAttempt: () => void;
};

export default function QuestionnaireForm({ declarationConsent, showValidation, onSubmitAttempt }: QuestionnaireFormProps) {
  // Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [postcode, setPostcode] = useState('');

  // Pregnancy
  const [pregnancy, setPregnancy] = useState<string | null>(null);
  const [trimester, setTrimester] = useState<string | null>(null);

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');

  // GP
  const [gpName, setGpName] = useState('');
  const [gpPractice, setGpPractice] = useState('');

  // Medications
  const [medications, setMedications] = useState('');

  // Conditions multi-selects
  const [musculoskeletal, setMusculoskeletal] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Cancer follow-up
  const [cancer, setCancer] = useState<string | null>(null);
  const [cancerDetails, setCancerDetails] = useState('');

  // How did you hear about us
  const [hearAbout, setHearAbout] = useState<string | null>(null);
  const [hearAboutOther, setHearAboutOther] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  // Consent + signature
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);
  const [signature, setSignature] = useState('');

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // showValidation is now lifted to the parent (QuestionnaireClient) so the
  // intro column's declaration checkbox can also show validation in sync.

  // Toggle helper for multi-select pill groups
  const makeToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (opt: string) => {
    setter(prev => {
      if (opt === 'None of the above') {
        // 'None' is mutually exclusive with everything else
        return prev.includes(opt) ? [] : [opt];
      }
      // Selecting any other option clears 'None'
      const withoutNone = prev.filter(p => p !== 'None of the above');
      return withoutNone.includes(opt)
        ? withoutNone.filter(p => p !== opt)
        : [...withoutNone, opt];
    });
  };

  const allConsentsChecked = consent1 && consent2 && consent3;
  const hasSignature = signature.length > 0;
  const hasMusculoskeletal = musculoskeletal.length > 0;
  const hasSymptoms = symptoms.length > 0;
  const hasHistory = history.length > 0;
  const allConditionsAnswered = hasMusculoskeletal && hasSymptoms && hasHistory;
  const canSubmit = allConsentsChecked && hasSignature && allConditionsAnswered && declarationConsent && !submitting;

  // Comprehensive check — once `canSubmit` is true (orange), the button
  // turns GREEN if the user has also filled in the key optional fields:
  // mobile, dob, both emergency contact fields, and both GP fields.
  // Postcode, medications, pregnancy, cancer, hear-about and notes are
  // excluded — leaving these blank is reasonable and shouldn't hold the
  // green state hostage.
  const isComprehensive = canSubmit
    && mobile.trim().length > 0
    && dob.trim().length > 0
    && emergencyName.trim().length > 0
    && emergencyNumber.trim().length > 0
    && gpName.trim().length > 0
    && gpPractice.trim().length > 0;

  // Determine button colour state:
  //   GREY   — minimum required fields not yet met (canSubmit false)
  //   ORANGE — minimum met, but optional comprehensive fields not yet filled
  //   GREEN  — minimum met AND key optional fields all filled
  const buttonColour = isComprehensive ? '#2cd12c' : canSubmit ? '#ff8c00' : '#808080';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAttempt();
    if (!canSubmit) return;
    setSubmitting(true);
    // TODO: replace with real backend POST
    // Submission payload would include all field state above plus signature data URL
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  // Shared input style (matches WellbeingForm conventions)
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

  // Square-cornered variant for date / textarea
  const inputStyleSquare: React.CSSProperties = {
    ...inputStyle,
    borderRadius: 8,
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
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 18,
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    background: 'rgba(255,255,255,0.2)',
    marginBottom: 22,
  };

  if (submitted) {
    return (
      <div style={{
        background: '#0a0908',
        border: '1px solid rgba(255,255,255,0.25)',
        padding: '48px 32px',
        borderRadius: 4,
      }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: 18, textAlign: 'center' }}>Thank you</h3>
        <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.92, marginBottom: 28, textAlign: 'center' }}>
          Your questionnaire has been received. We&rsquo;ll review your responses ahead of your appointment.
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: 24 }} />

        <h4 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, marginBottom: 18 }}>
          Payment and cancellation policy
        </h4>
        <p style={{ fontSize: '1.2rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.55, opacity: 0.85 }}>
          Payment is made with the therapist after each treatment, unless monthly invoicing has been agreed with management or you are paying for a package treatment. We do directly bill certain insurance companies. It is your responsibility to keep track of the treatments attended so you do not exceed your coverage. Please check with your insurance provider. Any payment not covered by the insurance company will be your responsibility.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{
        background: '#000000',
        border: '1px solid rgba(255,255,255,0.25)',
        padding: '32px 28px',
        borderRadius: 4,
      }}>

        {/* ── PERSONAL DETAILS ────────────────────────────────── */}
        <p style={sectionLabelStyle}>Personal details</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
          <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required style={inputStyle} className="qf-input" />
          <input type="text" placeholder="Last name (optional)" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} className="qf-input" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} className="qf-input" />
          <input type="tel" placeholder="Mobile (optional)" value={mobile} onChange={e => setMobile(e.target.value)} style={inputStyle} className="qf-input" />
          <div>
            <label style={{ ...labelStyle, fontSize: '0.85rem', opacity: 0.7, marginBottom: 6 }} htmlFor="qf-dob">Date of birth (optional)</label>
            <input id="qf-dob" type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyleSquare} className="qf-input" />
          </div>
          <input type="text" placeholder="Postcode (optional)" value={postcode} onChange={e => setPostcode(e.target.value)} style={inputStyle} className="qf-input" />
        </div>

        <div style={dividerStyle} />

        {/* ── EMERGENCY CONTACT ──────────────────────────────── */}
        <p style={sectionLabelStyle}>Emergency contact</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
          <input type="text" placeholder="Emergency contact name (optional)" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} style={inputStyle} className="qf-input" />
          <input type="tel" placeholder="Emergency contact number (optional)" value={emergencyNumber} onChange={e => setEmergencyNumber(e.target.value)} style={inputStyle} className="qf-input" />
        </div>

        <div style={dividerStyle} />

        {/* ── GP DETAILS ─────────────────────────────────────── */}
        <p style={sectionLabelStyle}>GP details</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
          <input type="text" placeholder="GP name (optional)" value={gpName} onChange={e => setGpName(e.target.value)} style={inputStyle} className="qf-input" />
          <input type="text" placeholder="GP practice (optional)" value={gpPractice} onChange={e => setGpPractice(e.target.value)} style={inputStyle} className="qf-input" />
        </div>

        <div style={dividerStyle} />

        {/* ── CURRENT MEDICATIONS ────────────────────────────── */}
        <p style={sectionLabelStyle}>Current medications</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Please list any medications you are currently taking, including dosage if known.</label>
          <textarea
            value={medications}
            onChange={e => setMedications(e.target.value)}
            placeholder="e.g. Ibuprofen 200mg as needed, Sertraline 50mg daily…"
            rows={4}
            style={{ ...inputStyleSquare, resize: 'vertical', fontFamily: 'inherit', minHeight: 100 }}
            className="qf-input"
          />
        </div>

        <div style={dividerStyle} />

        {/* ── MUSCULOSKELETAL ────────────────────────────────── */}
        <p style={sectionLabelStyle}>Musculoskeletal &amp; pain issues</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Do any of the following apply? Select all that apply.</label>
          <PillGroup options={MUSCULOSKELETAL_OPTIONS} selected={musculoskeletal} onToggle={makeToggle(setMusculoskeletal)} />
          {showValidation && !hasMusculoskeletal && (
            <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>Please select at least one option (or &lsquo;None of the above&rsquo;).</p>
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── SYMPTOMS ───────────────────────────────────────── */}
        <p style={sectionLabelStyle}>Symptoms &amp; current conditions</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Are you currently experiencing any of the following? Select all that apply.</label>
          <PillGroup options={SYMPTOMS_OPTIONS} selected={symptoms} onToggle={makeToggle(setSymptoms)} />
          {showValidation && !hasSymptoms && (
            <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>Please select at least one option (or &lsquo;None of the above&rsquo;).</p>
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── MEDICAL HISTORY ────────────────────────────────── */}
        <p style={sectionLabelStyle}>Medical history &amp; illnesses</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Do you have a diagnosis of any of the following? Select all that apply.</label>
          <PillGroup options={HISTORY_OPTIONS} selected={history} onToggle={makeToggle(setHistory)} />
          {showValidation && !hasHistory && (
            <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>Please select at least one option (or &lsquo;None of the above&rsquo;).</p>
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── PREGNANCY ──────────────────────────────────────── */}
        <p style={sectionLabelStyle}>Pregnancy</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Are you currently pregnant?</label>
          <PillGroup
            options={PREGNANCY_OPTIONS}
            selected={pregnancy ? [pregnancy] : []}
            onToggle={(opt) => setPregnancy(prev => prev === opt ? null : opt)}
          />
          {pregnancy === 'Yes' && (
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Which trimester?</label>
              <PillGroup
                options={TRIMESTER_OPTIONS}
                selected={trimester ? [trimester] : []}
                onToggle={(opt) => setTrimester(prev => prev === opt ? null : opt)}
              />
            </div>
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── CANCER ─────────────────────────────────────────── */}
        <p style={sectionLabelStyle}>Cancer / malignancy</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Do you have a current or past diagnosis of cancer or malignancy?</label>
          <PillGroup
            options={CANCER_OPTIONS}
            selected={cancer ? [cancer] : []}
            onToggle={(opt) => setCancer(prev => prev === opt ? null : opt)}
          />
          {cancer === 'Yes' && (
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>If you are comfortable sharing, you can tell us more here.</label>
              <textarea
                value={cancerDetails}
                onChange={e => setCancerDetails(e.target.value)}
                placeholder="Please provide as much detail as you&rsquo;re comfortable sharing…"
                rows={3}
                style={{ ...inputStyleSquare, resize: 'vertical', fontFamily: 'inherit', minHeight: 80 }}
                className="qf-input"
              />
            </div>
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── HOW DID YOU HEAR ABOUT US ──────────────────────── */}
        <p style={sectionLabelStyle}>How did you hear about us?</p>
        <div style={{ marginBottom: 22 }}>
          <PillGroup
            options={HEAR_ABOUT_OPTIONS}
            selected={hearAbout ? [hearAbout] : []}
            onToggle={(opt) => setHearAbout(prev => prev === opt ? null : opt)}
          />
          {hearAbout === 'Other' && (
            <input
              type="text"
              placeholder="Please specify…"
              value={hearAboutOther}
              onChange={e => setHearAboutOther(e.target.value)}
              style={{ ...inputStyle, marginTop: 12 }}
              className="qf-input"
            />
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── NOTES ──────────────────────────────────────────── */}
        <p style={sectionLabelStyle}>Anything else we should know?</p>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Optional. Use this space for anything not covered above.</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional notes…"
            rows={4}
            style={{ ...inputStyleSquare, resize: 'vertical', fontFamily: 'inherit', minHeight: 100 }}
            className="qf-input"
          />
        </div>

        <div style={dividerStyle} />

        {/* ── CONSENT ────────────────────────────────────────── */}
        <p style={sectionLabelStyle}>Consent</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 22 }}>
          {[
            { state: consent1, setter: setConsent1, id: 'qf-consent-1', text: 'Please tick to confirm Lucy Hall Massage can use your data to send you appointment reminders.' },
            { state: consent2, setter: setConsent2, id: 'qf-consent-2', text: 'Please tick to confirm Lucy Hall Massage can send you exercises, advice, offers, news and updates related to the clinic.' },
            { state: consent3, setter: setConsent3, id: 'qf-consent-3', text: 'Please tick to confirm you are aware that in the future we may change our privacy policy. If we do so we will publish the new privacy policy on our website and either email or text you a link so you may read the amendments to the policy.' },
          ].map(({ state, setter, id, text }) => (
            <label key={id} htmlFor={id} className="qf-checkbox-wrap">
              <input
                type="checkbox"
                id={id}
                checked={state}
                onChange={e => setter(e.target.checked)}
                className="qf-checkbox-input"
              />
              <span className="qf-checkbox-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="qf-checkbox-tick">
                  <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, opacity: 0.85 }}>
                {text}
              </span>
            </label>
          ))}
          {showValidation && !allConsentsChecked && (
            <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 4, fontWeight: 400 }}>Please tick all three boxes to consent.</p>
          )}
        </div>

        <div style={dividerStyle} />

        {/* ── SIGNATURE ──────────────────────────────────────── */}
        <p style={sectionLabelStyle}>Signature</p>
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Please sign below to confirm the information you have provided is accurate.</label>
          <SignaturePad onChange={setSignature} />
          {showValidation && !hasSignature && (
            <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>Please sign above to confirm.</p>
          )}
        </div>

        {/* ── SUBMIT ─────────────────────────────────────────── */}
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
          {submitting ? 'Submitting…' : 'Submit questionnaire'}
        </button>

        {showValidation && !canSubmit && !submitting && (
          <p style={{ fontSize: '0.85rem', fontWeight: 400, color: '#ff8c8c', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
            Please complete all required fields. Required: first name, email, the three condition sections, the three consent boxes, your signature, and the declaration tickbox above.
          </p>
        )}

      </form>

      {/* Form-internal styles — qf prefix to avoid colliding with wf */}
      <style>{`
        /* === INPUT FIELDS — focus inverts colours === */
        .qf-input {
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          border: 1px solid transparent !important;
        }
        .qf-input:focus {
          outline: none;
          background: #000000 !important;
          color: #ffffff !important;
          border: 1px solid #ffffff !important;
        }
        .qf-input:focus::placeholder {
          color: rgba(255,255,255,0.5);
        }
        textarea.qf-input {
          line-height: 1.5;
        }

        /* === PILL TOGGLE BUTTONS === */
        .qf-pill {
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
          text-align: center;
        }
        .qf-pill:hover {
          border-color: rgba(255,255,255,0.8);
        }
        .qf-pill[data-selected="true"] {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        /* === CUSTOM CHECKBOX — stroke outline only, white tick when checked === */
        .qf-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          width: 100%;
        }
        .qf-checkbox-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .qf-checkbox-box {
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
        .qf-checkbox-tick {
          width: 18px;
          height: 18px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .qf-checkbox-input:checked + .qf-checkbox-box .qf-checkbox-tick {
          opacity: 1;
        }
        .qf-checkbox-input:focus-visible + .qf-checkbox-box {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
