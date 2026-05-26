'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CorporateNav from '../../CorporateNav';
import Testimonials from '../../components/Testimonials/Testimonials';
import { corporateTestimonials } from '../../components/Testimonials/corporate-testimonials-data';
import CorporateFooter from '../../CorporateFooter';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import InlineEnquiryForm from './InlineEnquiryForm';

/* ─────────────────────────────────────────────────────────────
   CorporateServicePage — shared layout for the three corporate
   service detail pages:

     /corporate/services/in-chair-massage
     /corporate/services/dse-assessments
     /corporate/services/posture-consultations

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
    href: '/corporate/services/in-chair-massage',
    img:  '/chair-massage-services-portrait.jpg',
  },
  {
    n: 2,
    title: 'Display Screen Equipment Assessments',
    href: '/corporate/services/dse-assessments',
    img:  '/corporate-dse.jpg',
  },
  {
    n: 3,
    title: 'Assessments & Posture Consultations',
    href: '/corporate/services/posture-consultations',
    img:  '/posture-consultations-portrait.jpg',
  },
];

// ── SHARED TESTIMONIAL ─────────────────────────────────────────
// Same on all 3 service pages per Steve's call. Sourced from
// the corp testimonials — Maria Slater @ Spotify is the most
// chair-massage-relevant entry.
// ── PROPS ─────────────────────────────────────────────────────
export interface CorporateServicePageProps {
  /** Slug for filtering this page out of the "other services"
   *  strip at the bottom. e.g. 'in-chair-massage'. */
  currentSlug: 'in-chair-massage' | 'dse-assessments' | 'posture-consultations';
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
  /** Optional gallery images shown below the hero. */
  gallery?: string[];
  /** Index into corporateTestimonials to start displaying from. Defaults to 0. */
  testimonialStartIndex?: number;
}

// ── COMPONENT ─────────────────────────────────────────────────
export default function CorporateServicePage(props: CorporateServicePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const scrollOverlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current, overlay = scrollOverlayRef.current;
      if (!hero || !overlay) return;
      const h = hero.offsetHeight, s = window.scrollY, start = h * 0.1, range = h * 0.55;
      overlay.style.opacity = s <= start ? '0' : String(Math.min((s - start) / range, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const testimonialStartIndex = props.testimonialStartIndex ?? 0;
  const otherServices = services.filter(
    (s) => !props.currentSlug || !s.href.endsWith(props.currentSlug)
  );

  return (
    <>
      <CorporateNav transparent scrollRef={heroRef} />

      <main className="cs-main">

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="cs-hero" ref={heroRef}>
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
          <div ref={scrollOverlayRef} className="cs-hero-scroll-overlay" aria-hidden="true" />
          </div>

          <div className="cs-hero-breadcrumbs">
            <Breadcrumbs items={[
              { label: 'Home', href: '/corporate' },
              { label: 'Services', href: '/corporate/services' },
              { label: props.headline },
            ]} />
          </div>
          <div className="cs-hero-content">
            <div className="cs-hero-text">
              <h1 className="cs-hero-headline">{props.headline}</h1>
              {props.heroCopy.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="cs-hero-copy">{para}</p>
              ))}
              <Link href="/corporate/enquire" className="cs-hero-link cs-hero-link--desktop">
                Enquire about your team here &gt;
              </Link>
              <a href="#corp-enquire-form" className="cs-hero-link cs-hero-link--mobile">
                Enquire about your team here &gt;
              </a>
            </div>

            <div className="cs-hero-form">
              <a href="/employer-info.pdf" target="_blank" rel="noopener noreferrer" className="cs-hero-employer-pdf">
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22, flexShrink: 0 }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Download our employer PDF</span>
              </a>
              <InlineEnquiryForm />
            </div>
          </div>
        </section>

        {/* Mobile-only standalone form section.
            On desktop, the form sits inside the hero (above).
            On mobile, the in-hero copy is hidden via CSS and
            this version renders as its own block below. */}
        <section id="corp-enquire-form" className="cs-hero-form-mobile">
          <InlineEnquiryForm />
        </section>

        {/* ── GALLERY ────────────────────────────────────────── */}
        {props.gallery && props.gallery.length > 0 && (
          <section className="corp-gallery">
            <div className="corp-gallery-grid">
              {props.gallery.map((src, i) => (
                <div key={i} className="corp-gallery-item">
                  <Image
                    src={src}
                    alt={`${props.headline} ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
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
                  <img
                    src="/tick-svg.svg"
                    alt=""
                    className="cs-benefit-tick"
                    aria-hidden="true"
                  />
                  <div className="cs-benefit-text">
                    <h3 className="cs-benefit-head">{b.title}</h3>
                    <p className="cs-benefit-body">{b.body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────── */}
        <section style={{ padding: '40px 0 20px' }}>
          <Testimonials
            heading="Trusted by leading Cambridge companies and businesses including Cambridge University"
            items={corporateTestimonials}
            useLogos
            initialVisible={3}
            startIndex={testimonialStartIndex}
          />
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

        <CorporateFooter />
      </main>

      <style>{`
        .cs-main {
          background: #000000;
          color: #ffffff;
        }
        .cs-hero-link--mobile { display: none; }
        @media (max-width: 1023px) {
          .cs-main {
            display: flex;
            flex-direction: column;
          }
          .cs-hero { order: 1; }
          .cs-detail { order: 2; }
          .corp-gallery { order: 3; }
          .cs-main > section:nth-of-type(5) { order: 4; }
          .cs-hero-form-mobile { order: 5; }
          .cs-services { order: 6; }
          .cs-hero-link--desktop { display: none; }
          .cs-hero-link--mobile { display: inline-flex; }
        }

        /* ── HERO ──────────────────────────────────────────── */
        .cs-hero-breadcrumbs {
          position: absolute;
          top: 80px;
          left: 20px;
          right: 20px;
          z-index: 3;
        }
        @media (min-width: 768px) {
          .cs-hero-breadcrumbs {
            top: 88px;
            left: 68px;
            right: 68px;
          }
        }
        @media (min-width: 1025px) {
          .cs-hero-breadcrumbs {
            left: 60px;
            right: 60px;
          }
        }
        .cs-hero {
          position: relative;
          width: 100%;
          min-height: 540px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
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
        .cs-hero-scroll-overlay {
          position: absolute;
          inset: 0;
          background: #000000;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
        }
        .cs-hero-content {
          position: relative;
          z-index: 2;
          padding: 40px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
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
        .cs-hero-employer-pdf {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.4;
          margin-bottom: 18px;
          opacity: 0.9;
          transition: opacity 0.2s ease;
        }
        .cs-hero-employer-pdf:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .cs-hero-form {
          width: 100%;
          max-width: 540px;
          align-self: flex-start;
          margin-top: 164px;
          margin-left: auto;
        }
        /* Mobile: hide the in-hero form, show the standalone one below */
        .cs-hero-form-mobile {
          display: block;
          padding: 32px 24px 16px;
          background: #000000;
        }
        @media (min-width: 1024px) {
          .cs-hero-form-mobile {
            display: none;
          }
        }
        @media (max-width: 1023px) {
          .cs-hero-form {
            display: none;
          }
        }

        @media (min-width: 1024px) {
          .cs-hero {
            min-height: 1000px;
          }
          .cs-hero-content {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            padding: 60px 0 60px 60px;
            gap: 48px;
            align-self: stretch;
            min-height: 1000px;
          }
          .cs-hero-text {
            flex: 1 1 50%;
          }
          .cs-hero-form {
            position: absolute;
            top: 120px;
            right: 60px;
            width: 540px;
            max-width: 540px;
            flex: none;
            margin: 0;
            align-self: auto;
            z-index: 5;
          }
        }

        /* ── GALLERY ────────────────────────────────────────── */
        .corp-gallery {
          padding: 8px;
          background: #000000;
        }
        .corp-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-gallery-item {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .corp-gallery {
            padding: 12px;
          }
          .corp-gallery-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
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
          font-size: clamp(1.8rem, 3vw, 2.4rem);
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
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 600;
          margin: 0 0 24px;
          line-height: 1.3;
        }
        .cs-benefit-item {
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .cs-benefit-tick {
          width: 88px;
          height: 88px;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .cs-benefit-text {
          flex: 1;
          min-width: 0;
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
        
        
        
        
        
        @media (min-width: 1024px) {
          
          
        }

        /* ── OTHER SERVICES STRIP ──────────────────────────── */
        .cs-services {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .cs-services-heading {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 600;
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
        /* B&W by default, fades to colour on hover */
        .cs-service-image img {
          filter: grayscale(100%);
          transition: filter 0.4s ease;
        }
        .cs-service-card:hover .cs-service-image img {
          filter: grayscale(0%);
        }
        .cs-service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
          transition: background 0.3s ease;
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
