// app/corporate/page.tsx
//
// PLACEHOLDER — corporate homepage proper will be built in Step 6 of
// the build order. For now this stub exists so:
//
//   1. The splash page's "My Team" / Corporate panel doesn't 404
//   2. Returning visitors with lhm-side="corporate" cookie don't 404
//   3. We can confirm the routing/middleware works end to end
//
// Replace this file with the real corporate homepage when we get to it.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Massage | Lucy Hall Massage Therapy',
  description:
    'Workplace wellbeing programmes from Lucy Hall Massage Therapy — chair massage, DSC assessments and posture consultations for Cambridge teams.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/corporate' },
};

export default function CorporateHomePagePlaceholder() {
  return (
    <main style={{
      background: '#000000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
        fontWeight: 600,
        color: '#ffffff',
        lineHeight: 1.2,
        marginBottom: 20,
      }}>
        Corporate massage in Cambridge
      </h1>

      <p style={{
        fontSize: '1.1rem',
        fontWeight: 300,
        color: '#ffffff',
        lineHeight: 1.6,
        opacity: 0.85,
        maxWidth: 540,
        marginBottom: 32,
      }}>
        Our corporate site is being rebuilt. In the meantime, please get in touch directly and we&rsquo;ll come back to you within one working day.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        alignItems: 'center',
      }}>
        <a
          href="mailto:info@lucyhallmassage.com"
          style={{
            color: '#ffffff',
            fontSize: '1rem',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          info@lucyhallmassage.com
        </a>
        <a
          href="tel:07765555078"
          style={{
            color: '#ffffff',
            fontSize: '1rem',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          07765 555078
        </a>
      </div>

      <a
        href="/"
        style={{
          marginTop: 48,
          color: '#ffffff',
          opacity: 0.6,
          fontSize: '0.78rem',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          textDecoration: 'none',
        }}
      >
        ← Back to the splash
      </a>
    </main>
  );
}
