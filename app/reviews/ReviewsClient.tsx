'use client';

/* ─────────────────────────────────────────────────────────────
   ReviewsClient.tsx

   Corporate reviews page at /reviews. Renders:
     1. Hero: breadcrumb + H1 + intro
     2. Cards section using shared Testimonials component with
        corporateTestimonials data set (14 entries)
     3. LinkedIn CTA section with link out to Lucy's profile
        recommendations page

   LinkedIn recommendations are NOT piped in via API — LinkedIn
   does not expose recommendations through any public API and
   scraping violates their TOS. The CTA below the cards points
   visitors to Lucy's LinkedIn profile recommendations page for
   the full curated list.

   Uses CorporateNav + CorporateFooter to keep the page within
   the corporate side's chrome (linked from corp nav).
   ───────────────────────────────────────────────────────────── */

import CorporateNav from '../CorporateNav';
import CorporateFooter from '../CorporateFooter';
import Testimonials from '../components/Testimonials/Testimonials';
import { corporateTestimonials } from '../components/Testimonials/corporate-testimonials-data';

const LINKEDIN_RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/lucy-hall-47369141/';

export default function ReviewsClient() {
  return (
    <>
      <CorporateNav />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{ padding: '120px 48px 40px', maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/corporate" style={{ color: '#ffffff', textDecoration: 'none' }}>Corporate</a> / Reviews
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 18 }}>
            Trusted by leading Cambridge companies and businesses including Cambridge University
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, maxWidth: 640 }}>
            Reviews and recommendations from HR teams, wellbeing leads and individual employees across the corporate clients we work with — from global names like Spotify and Amazon to fast-growing teams across Cambridge.
          </p>
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* Testimonial cards (shared component) */}
        <section style={{ padding: '60px 0 60px' }}>
          <Testimonials items={corporateTestimonials} useLogos />
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* LinkedIn CTA */}
        <section style={{ padding: '80px 48px 120px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            More recommendations
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: 20 }}>
            Read more recommendations on LinkedIn
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 36, opacity: 0.85 }}>
            Lucy maintains an active LinkedIn profile with dozens of recommendations from corporate clients, HR partners and collaborators across the wellbeing industry. Read the full list of recommendations on LinkedIn.
          </p>
          <a
            href={LINKEDIN_RECOMMENDATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 36px',
              background: '#ffffff',
              color: '#000000',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 999,
              transition: 'transform 0.25s ease',
            }}
          >
            {/* Inline LinkedIn glyph */}
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden="true">
              <path
                fill="currentColor"
                d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.57h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
              />
            </svg>
            View on LinkedIn
          </a>
        </section>

        <CorporateFooter />
      </main>
    </>
  );
}
