'use client';

import { useState } from 'react';
import Nav from '../Nav';
import CorporateFooter from '../CorporateFooter';
import WorkplaceMassageFeedbackForm from '../WorkplaceMassageFeedbackForm';

/* ─────────────────────────────────────────────────────────────
   WorkplaceMassageFeedbackClient — page shell for
   /workplace-massage-feedback.

   2-column layout (mirrors /questionnaire):
   - Mobile (<1024px): single column, intro stacks above form
   - Desktop (>=1024px): intro left, form right, intro sticky

   Declaration consent lives in the intro column (the big tick
   box) and is lifted to this component so the form's submit
   gating can depend on it.

   PLACEHOLDER CONTENT in intro column — Steve to replace with
   final copy. Search for "TODO" below.
   ───────────────────────────────────────────────────────────── */

export default function WorkplaceMassageFeedbackClient() {
  const [declarationConsent, setDeclarationConsent] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>
        <div style={{ padding: '120px 24px 100px' }}>
          <div className="wmf-page-grid">

            {/* ── INTRO COLUMN (LEFT) ─────────────────────────────── */}
            <div className="wmf-intro-col">
              <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
                <a href="/corporate" style={{ color: '#ffffff', textDecoration: 'none' }}>Corporate</a> / Workplace Massage Feedback
              </p>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 28 }}>
                Workplace Massage Feedback
              </h1>

              {/* ════════════════════════════════════════════════════════════
                  TODO STEVE: Replace this placeholder with the real intro
                  copy. Add as many <h2>/<p> blocks as needed above the
                  declaration checkbox. The big tick box at the bottom stays
                  — it gates form submission.
                  ════════════════════════════════════════════════════════════ */}
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 28, opacity: 0.85 }}>
                [Placeholder] Your introduction copy goes here. Context about the workplace massage programme, why feedback matters, what happens with submissions, and anything else relevant. Replace this paragraph and add more blocks above the declaration checkbox as needed.
              </p>

              {/* DECLARATION CHECKBOX — required to submit. */}
              <label htmlFor="wmf-declaration" className="wmf-checkbox-wrap wmf-checkbox-wrap--xl">
                <input
                  type="checkbox"
                  id="wmf-declaration"
                  checked={declarationConsent}
                  onChange={e => setDeclarationConsent(e.target.checked)}
                  className="wmf-checkbox-input"
                />
                <span className="wmf-checkbox-box wmf-checkbox-box--xl" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" className="wmf-checkbox-tick wmf-checkbox-tick--xl">
                    <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, opacity: 0.9 }}>
                  I agree to my feedback being shared with Lucy Hall Massage Therapy for the purpose of evaluating and improving the workplace wellbeing service. My data will be handled in accordance with the <a href="/legal/privacy-policy" style={{ color: '#ffffff' }}>privacy policy</a>.
                </span>
              </label>
              {showValidation && !declarationConsent && (
                <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>
                  Please tick the declaration to continue.
                </p>
              )}
            </div>

            {/* ── FORM COLUMN (RIGHT) ─────────────────────────────── */}
            <div>
              <WorkplaceMassageFeedbackForm
                declarationConsent={declarationConsent}
                showValidation={showValidation}
                setShowValidation={setShowValidation}
              />
            </div>

          </div>
        </div>
      </main>
      <CorporateFooter />

      {/* Page-level grid + tick-box CSS. Mirrors qf- styles. */}
      <style>{`
        .wmf-page-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          max-width: 1180px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .wmf-page-grid {
            grid-template-columns: 1fr 1.1fr;
            gap: 60px;
          }
        }
        @media (min-width: 1450px) {
          .wmf-page-grid {
            max-width: 1320px;
            gap: 80px;
          }
        }
        @media (min-width: 1024px) {
          .wmf-intro-col {
            position: sticky;
            top: 120px;
            align-self: start;
            max-height: calc(100vh - 140px);
            overflow-y: auto;
            padding-right: 8px;
          }
        }

        .wmf-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          cursor: pointer;
          width: 100%;
        }
        .wmf-checkbox-wrap--xl { gap: 22px; align-items: center; }
        .wmf-checkbox-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        .wmf-checkbox-box {
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
          transition: background 0.2s ease;
        }
        .wmf-checkbox-box--xl {
          width: 110px;
          height: 110px;
          min-width: 110px;
          border-width: 3px;
          border-radius: 14px;
          margin-top: 0;
        }
        .wmf-checkbox-tick {
          width: 18px;
          height: 18px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .wmf-checkbox-tick--xl {
          width: 84px;
          height: 84px;
        }
        .wmf-checkbox-input:checked + .wmf-checkbox-box .wmf-checkbox-tick {
          opacity: 1;
        }
        .wmf-checkbox-input:focus-visible + .wmf-checkbox-box {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }
      `}</style>
    </>
  );
}
