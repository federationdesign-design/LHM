'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import QuestionnaireForm from '../QuestionnaireForm';

/* ─────────────────────────────────────────────────────────────
   QuestionnaireClient — page shell for /questionnaire.

   Layout:
   - Mobile (<1024px): single column, intro stacks above form.
   - Desktop (≥1024px): two columns side by side, intro on left,
     form on right. Both scroll naturally (no sticky).
   - Ultra-wide (≥1450px): wider total max-width, more breathing
     room between columns.

   The 2-column layout is enforced via the `.qf-page-grid` class
   in the embedded <style> block at the bottom.
   ───────────────────────────────────────────────────────────── */

export default function QuestionnaireClient() {
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

              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.85, fontStyle: 'italic' }}>
                I hereby declare that the information I have provided is accurate at the time of writing, and it is my (the client&rsquo;s) responsibility to inform the massage therapist of any changes.
              </p>
            </div>

            {/* ── FORM COLUMN ────────────────────────────────────── */}
            <div className="qf-form-col">
              <QuestionnaireForm />
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
        }

        /* ULTRA-WIDE (1450px+): more breathing room, wider columns */
        @media (min-width: 1450px) {
          .qf-page-grid {
            max-width: 1320px;
            gap: 80px;
          }
        }
      `}</style>
    </>
  );
}
