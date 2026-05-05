'use client';

import Image from 'next/image';
import Link from 'next/link';
import CorporateNav from '../../CorporateNav';
import Footer from '../../Footer';
import InlineEnquiryForm from './InlineEnquiryForm';

/* ─────────────────────────────────────────────────────────────
   CorporateServicePage — shared layout for the three corporate
   service detail pages:

     /corporate/in-chair-massage
     /corporate/dsc-assessments
     /corporate/posture-consultations

   The page composition is identical across all three; only the
   hero image, headline, sub-copy, and the two text blocks
   ("What is X" + "Benefits of X") differ. Those vary via the
   props below.

   Layout (top to bottom):
     1. CorporateNav
     2. Hero — image background, headline + sub-copy left,
        InlineEnquiryForm right (drops below on mobile)
     3. "What is X" + "Benefits" two-column block
     4. Single Cambridge testimonial
     5. Other Services strip (3 cards back to /corporate/...)
     6. Footer
   ───────────────────────────────────────────────────────────── */

// ── SERVICES STRIP DATA ───────────────────────────────────────
// All three service entries are shown at the bottom of every
// service page so visitors can navigate between them. The
// current page filters itself out.
const services = [
  {
    n: 1,
    title: 'In-Office Chair Massage',
    href: '/corporate/in-chair-massage',
    img:  '/corporate-chair-massage.jpg',
  },
  {
    n: 2,
    title: 'Display Screen Equipment Assessments',
    href: '/corporate/dsc-assessments',
    img:  '/corporate-dsc.jpg',
  },
  {
    n: 3,
    title: 'Assessments & Posture Consultations',
    href: '/corporate/posture-consultations',
    img:  '/corporate-posture.jpg',
  },
];

// ── SHARED TESTIMONIAL ─────────────────────────────────────────
// Same on all 3 service pages per Steve's call. Sourced from
// the corp testimonials — Maria Slater @ Spotify is the most
// chair-massage-relevant entry.
const testimonial = {
  body:
    '“Lucy provided corporate massage at our offices giving targeted help with specific discomfort or general relaxation from the all too real strains of a desk job. Unfailingly polite and supportive she also provided advice and guidance on exercises and posture outside of treatment. Her attentive and interested attitude to her clients was exceptional and quickly changed the sessions from a nice treat to an essential part of self care and well being.”',
  attribution: 'University of Cambridge',
  logo: '/university-cambridge.png',
};

// ── PROPS ─────────────────────────────────────────────────────
export interface CorporateServicePageProps {
  /** Slug for filtering this page out of the "other services"
   *  strip at the bottom. e.g. 'in-chair-massage'. */
  currentSlug: 'in-chair-massage' | 'dsc-assessments' | 'posture-consultations';
  /** Hero background image path. */
  heroImage: string;
  /** Hero h1. */
  headline: string;
  /** Hero sub-copy paragraph(s). Pass a single string; line
   *  breaks via \n become paragraph breaks. */
  heroCopy: string;
  /** Title of the left column (e.g. "What is a Chair Massage?"). */
  whatIsTitle: string;
  /** Body of the left column. */
  whatIsBody: string;
  /** Title of the right column (e.g. "The Benefits of In-Office Massage"). */
  benefitsTitle: string;
  /** Sub-section heads + bodies under benefits. */
  benefits: { title: string; body: string }[];
}

// ── COMPONENT ─────────────────────────────────────────────────
export default function CorporateServicePage(props: CorporateServicePageProps) {
  const otherServices = services.filter(
    (s) => !props.currentSlug || !s.href.endsWith(props.currentSlug)
  );

  return (
    <>
      <CorporateNav />

      <main className="cs-main">

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="cs-hero">
          <div className="cs-hero-image">
            <Image
              src={props.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="cs-hero-overlay" aria-hidden="true" />
          </div>

          <div className="cs-hero-content">
            <div className="cs-hero-text">
              <h1 className="cs-hero-headline">{props.headline}</h1>
              {props.heroCopy.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="cs-hero-copy">{para}</p>
              ))}
              <Link href="/corporate/enquire" className="cs-hero-link">
                Enquire about your team here &gt;
              </Link>
            </div>

            <div className="cs-hero-form">
              <InlineEnquiryForm />
            </div>
          </div>
        </section>

        {/* ── WHAT IS / BENEFITS ─────────────────────────────── */}
        <section className="cs-detail">
          <div className="cs-detail-inner">

            {/* Left col: bordered "What is X" */}
            <div className="cs-what">
              <h2 className="cs-what-title">{props.whatIsTitle}</h2>
              <p className="cs-what-body">{props.whatIsBody}</p>
            </div>

            {/* Right col: benefits with sub-headings */}
            <div className="cs-benefits">
              <h2 className="cs-benefits-title">{props.benefitsTitle}</h2>
              {props.benefits.map((b) => (
                <div key={b.title} className="cs-benefit-item">
                  <h3 className="cs-benefit-head">{b.title}</h3>
                  <p className="cs-benefit-body">{b.body}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── TESTIMONIAL ────────────────────────────────────── */}
        <section className="cs-testimonial">
          <h2 className="cs-testimonial-heading">Credibility:</h2>
          <div className="cs-testimonial-box">
            <p className="cs-testimonial-body">{testimonial.body}</p>
            <img
              src={testimonial.logo}
              alt={testimonial.attribution}
              className="cs-testimonial-logo"
              draggable={false}
            />
          </div>
        </section>

        {/* ── OTHER SERVICES STRIP ──────────────────────────── */}
        <section className="cs-services">
          <h2 className="cs-services-heading">Our Other Services</h2>
          <div className="cs-services-grid">
            {otherServices.map((s) => (
              <Link key={s.n} href={s.href} className="cs-service-card">
                <div className="cs-service-image">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="cs-service-overlay" />
                </div>
                <div className="cs-service-content">
                  <p className="cs-service-n">Service {s.n}:</p>
                  <h3 className="cs-service-title">{s.title}</h3>
                  <span className="cs-service-cta">Learn more &gt;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </main>

      <style>{`
        .cs-main {
          background: #000000;
          color: #ffffff;
        }

        /* ── HERO ──────────────────────────────────────────── */
        .cs-hero {
          position: relative;
          width: 100%;
          min-height: 540px;
          overflow: hidden;
        }
        .cs-hero-image {
          position: absolute;
          inset: 0;
        }
        .cs-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.5) 100%);
          z-index: 1;
        }
        .cs-hero-content {
          position: relative;
          z-index: 2;
          padding: 80px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .cs-hero-text {
          max-width: 700px;
        }
        .cs-hero-headline {
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          font-weight: 600;
          line-height: 1.1;
          margin: 0 0 24px;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .cs-hero-copy {
          font-size: clamp(1rem, 1.2vw, 1.1rem);
          font-weight: 300;
          line-height: 1.6;
          margin: 0 0 16px;
          opacity: 0.95;
        }
        .cs-hero-link {
          display: inline-block;
          font-size: 0.95rem;
          font-weight: 400;
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
          margin-top: 12px;
          opacity: 0.92;
        }
        .cs-hero-link:hover { opacity: 1; }

        .cs-hero-form {
          width: 100%;
          max-width: 360px;
        }

        @media (min-width: 1024px) {
          .cs-hero {
            min-height: 640px;
          }
          .cs-hero-content {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            padding: 100px 80px 80px;
            gap: 48px;
          }
          .cs-hero-text {
            flex: 1 1 60%;
          }
          .cs-hero-form {
            flex: 0 0 360px;
          }
        }

        /* ── WHAT IS / BENEFITS ────────────────────────────── */
        .cs-detail {
          padding: 60px 24px;
        }
        .cs-detail-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .cs-what {
          padding: 32px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 4px;
        }
        .cs-what-title {
          font-size: clamp(1.3rem, 1.8vw, 1.6rem);
          font-weight: 600;
          margin: 0 0 16px;
          line-height: 1.3;
        }
        .cs-what-body {
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          font-weight: 300;
          line-height: 1.7;
          margin: 0;
          opacity: 0.92;
        }
        .cs-benefits {
          padding: 0 8px;
        }
        .cs-benefits-title {
          font-size: clamp(1.3rem, 1.8vw, 1.6rem);
          font-weight: 600;
          margin: 0 0 24px;
          line-height: 1.3;
        }
        .cs-benefit-item {
          margin-bottom: 24px;
        }
        .cs-benefit-head {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 6px;
          letter-spacing: 0.01em;
        }
        .cs-benefit-body {
          font-size: clamp(0.95rem, 1.05vw, 1.02rem);
          font-weight: 300;
          line-height: 1.6;
          margin: 0;
          opacity: 0.92;
        }
        @media (min-width: 1024px) {
          .cs-detail {
            padding: 100px 80px;
          }
          .cs-detail-inner {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
          }
          .cs-what {
            padding: 48px;
          }
        }

        /* ── TESTIMONIAL ───────────────────────────────────── */
        .cs-testimonial {
          padding: 60px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .cs-testimonial-heading {
          font-size: 1.3rem;
          font-weight: 400;
          margin: 0 0 24px;
        }
        .cs-testimonial-box {
          padding: 32px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .cs-testimonial-body {
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          font-weight: 300;
          line-height: 1.7;
          margin: 0;
          opacity: 0.92;
        }
        .cs-testimonial-logo {
          max-height: 48px;
          width: auto;
          align-self: flex-start;
          filter: brightness(0) invert(1);
          opacity: 0.85;
        }
        @media (min-width: 1024px) {
          .cs-testimonial {
            padding: 80px 80px;
          }
          .cs-testimonial-box {
            padding: 48px;
          }
        }

        /* ── OTHER SERVICES STRIP ──────────────────────────── */
        .cs-services {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .cs-services-heading {
          font-size: clamp(1.3rem, 1.8vw, 1.6rem);
          font-weight: 400;
          text-align: center;
          margin: 0 0 40px;
        }
        .cs-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .cs-service-card {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          color: #ffffff;
          text-decoration: none;
        }
        .cs-service-image {
          position: absolute;
          inset: 0;
        }
        .cs-service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
          transition: background 0.3s ease;
        }
        .cs-service-card:hover .cs-service-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);
        }
        .cs-service-content {
          position: relative;
          z-index: 2;
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .cs-service-n {
          font-size: 0.85rem;
          opacity: 0.8;
          margin: 0 0 4px;
        }
        .cs-service-title {
          font-size: clamp(1.1rem, 1.4vw, 1.3rem);
          font-weight: 600;
          margin: 0 0 8px;
          line-height: 1.2;
        }
        .cs-service-cta {
          font-size: 0.85rem;
          opacity: 0.9;
        }
        @media (min-width: 768px) {
          .cs-services-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .cs-services {
            padding: 80px 80px;
          }
        }
      `}</style>
    </>
  );
}
