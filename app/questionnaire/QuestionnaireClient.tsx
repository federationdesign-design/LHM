'use client';

import { useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import QuestionnaireForm from '../QuestionnaireForm';

/* ─────────────────────────────────────────────────────────────
   QuestionnaireClient — page shell for /questionnaire.

   Layout:
   - Mobile (<1024px): single column, intro stacks above form.
   - Desktop (≥1024px): two columns side by side, intro on left,
     form on right. Intro is sticky on desktop so it stays in view
     as the form scrolls.
   - Ultra-wide (≥1450px): wider total max-width, more breathing
     room between columns.

   State is lifted to this component so the declaration consent
   checkbox (rendered in the intro column) can be required by the
   form's submit gating. `showValidation` is also lifted so both
   columns can show inline errors in sync after a submit attempt.

   The declaration checkbox reuses the `.qf-checkbox-*` CSS classes
   defined inside QuestionnaireForm — these styles bubble up to the
   page scope so the intro column can use them directly without
   duplication.
   ───────────────────────────────────────────────────────────── */

export default function QuestionnaireClient() {
  // Declaration consent — required to submit. Lives here (not in the form)
  // because the visible checkbox sits in the intro column.
  const [declarationConsent, setDeclarationConsent] = useState(false);
  // Validation flag — flips true on first submit attempt so both columns
  // start showing inline error messages.
  const [showValidation, setShowValidation] = useState(false);

  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* Outer wrapper — provides top padding (clears Nav) and centers the grid */}
        <div style={{ padding: '120px 24px 100px' }}>
          <div className="qf-page-grid">

            {/* ── INTRO COLUMN ───────────────────────────────────── */}
            <div className="qf-intro-col">
              <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
                <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Questionnaire
              </p>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 28 }}>
                Massage New Patient Medical Form
              </h1>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, marginBottom: 14 }}>
                Patient consent to release of information
              </h2>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 28 }}>
                All patient information is considered confidential and used solely for the purpose of providing care and management of your account. Lucy Hall Massage may have to contact some of the following people to allow successful injury recovery and payment of account: GP, specialist, insurance company and/or employer. I agree to let Lucy Hall Massage communicate as needed with individuals above regarding my care and payment of the account (if applicable).
              </p>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, marginBottom: 14 }}>
                Payment and cancellation policy
              </h2>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 18 }}>
                Payment is made with the therapist after each treatment, unless monthly invoicing has been agreed with management or you are paying for a package treatment. We do directly bill certain insurance companies. It is your responsibility to keep track of the treatments attended so you do not exceed your coverage. Please check with your insurance provider. Any payment not covered by the insurance company will be your responsibility.
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 28 }}>
                If you miss or cancel an appointment with less than 24 hours notice you will be charged 50% of the cost of the treatment. If you are on a package, the session will be forfeited.
              </p>

              {/* DECLARATION CHECKBOX — required to submit. Replaces the static
                  declaration paragraph. Uses .qf-checkbox-* classes defined
                  inside QuestionnaireForm. The --xl modifier inflates the box
                  to roughly 5x the standard consent checkbox size for visual
                  prominence. */}
              <label htmlFor="qf-declaration" className="qf-checkbox-wrap qf-checkbox-wrap--xl">
                <input
                  type="checkbox"
                  id="qf-declaration"
                  checked={declarationConsent}
                  onChange={e => setDeclarationConsent(e.target.checked)}
                  className="qf-checkbox-input"
                />
                <span className="qf-checkbox-box qf-checkbox-box--xl" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" className="qf-checkbox-tick qf-checkbox-tick--xl">
                    <path d="M5 12l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, opacity: 0.9 }}>
                  I hereby declare that the information I have provided is accurate at the time of writing, and it is my (the client&rsquo;s) responsibility to inform the massage therapist of any changes.
                </span>
              </label>
              {showValidation && !declarationConsent && (
                <p style={{ fontSize: '0.85rem', color: '#ff8c8c', marginTop: 10, fontWeight: 400 }}>
                  Please tick the declaration to continue.
                </p>
              )}
            </div>

            {/* ── FORM COLUMN ────────────────────────────────────── */}
            <div className="qf-form-col">
              <QuestionnaireForm
                declarationConsent={declarationConsent}
                showValidation={showValidation}
                onSubmitAttempt={() => setShowValidation(true)}
              />
            </div>

          </div>
        </div>

        <Footer />

      </main>

      {/* Layout styles — mobile-first with desktop and ultra-wide overrides */}
      <style>{`
        /* MOBILE (default): single column, intro on top, form below */
        .qf-page-grid {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 760px;
          margin: 0 auto;
        }
        .qf-intro-col,
        .qf-form-col {
          width: 100%;
        }

        /* DESKTOP (1024px+): two columns side by side, intro left, form right */
        @media (min-width: 1024px) {
          .qf-page-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            max-width: 1180px;
            align-items: start;
          }
          /* Sticky intro column — stays in view as the form scrolls.
             top: 224px gives generous clearance below the nav so the
             heading doesn't sit underneath the dark nav fill on scroll.
             align-self: start ensures it snaps to the top of the grid
             cell rather than stretching. */
          .qf-intro-col {
            position: sticky;
            top: 224px;
            align-self: start;
          }
        }

        /* ULTRA-WIDE (1450px+): more breathing room, wider columns */
        @media (min-width: 1450px) {
          .qf-page-grid {
            max-width: 1320px;
            gap: 80px;
          }
        }

        /* === XL DECLARATION CHECKBOX MODIFIERS ===
           Roughly 5x the standard consent checkbox. Used only on the
           declaration checkbox in the intro column. */
        .qf-checkbox-wrap--xl {
          gap: 24px !important;
          align-items: center !important;
          margin-top: 8px;
        }
        .qf-checkbox-box--xl {
          width: 120px !important;
          height: 120px !important;
          min-width: 120px !important;
          border-width: 4px !important;
          border-radius: 16px !important;
          margin-top: 0 !important;
        }
        .qf-checkbox-tick--xl {
          width: 80px !important;
          height: 80px !important;
        }
        /* Make the tick stroke proportionally thicker so it doesn't look
           wispy at the larger size. SVG stroke-width is in viewBox units so
           we override via CSS rather than touching the SVG markup. */
        .qf-checkbox-box--xl .qf-checkbox-tick--xl path {
          stroke-width: 2.5;
        }
      `}</style>
    </>
  );
}
