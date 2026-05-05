'use client';

import Link from 'next/link';
import Image from 'next/image';
import Footer from '../Footer';
import CorporateNav from '../CorporateNav';

/* ─────────────────────────────────────────────────────────────
   CorporateHomeClient — /corporate

   Layout sections in order:
     1. CorporateNav (sticky)
     2. Hero — full-bleed image with overlay text and CTA links.
        Top-right of the hero has a chevron-CTA "Download our
        employer PDF" so the most-likely user goal (employer
        getting info to share internally) is visible immediately.
     3. Company-clients logo strip (Spotify, Cambridge, Amazon,
        Redgate). Same marquee-on-mobile pattern as the splash.
     4. Credibility intro — two centered paragraphs introducing
        the corporate massage offering.
     5. Two-column "duty of care" zone:
        - Left col: bordered box with the duty-of-care narrative
          + "Download our employer PDF" chevron CTA at bottom
        - Right col: plain text "what is corporate massage" copy
          + "Enquire About your team here" underlined CTA
     6. Services strip — three image cards linking to the
        individual service pages
     7. Two-column testimonial block (Cambridge testimonials,
        currently duplicated as placeholders)
     8. Find-us-on logos (BookingPage, Tripadvisor, SimplyBook,
        LinkedIn, Wheree)
     9. Footer

   Mobile collapses the two-column zones into single-column
   stacks. The hero text sits over a darker gradient overlay so
   it stays legible against the photographed image.
   ───────────────────────────────────────────────────────────── */

// ── COMPANY CLIENT LOGOS ──────────────────────────────────────
const companyClients = [
  { name: 'Spotify',                 src: '/spotify.png' },
  { name: 'University of Cambridge', src: '/university-cambridge.png' },
  { name: 'Amazon',                  src: '/amazon.png' },
  { name: 'Redgate',                 src: '/redgate-logo.png' },
];

// ── FIND-US-ON LOGOS ──────────────────────────────────────────
const findUsLogos = [
  { src: '/booking-page-logo.png', alt: 'Booking Page' },
  { src: '/tripadisvor.svg',       alt: 'Tripadvisor' },
  { src: '/SBM-logo.png',          alt: 'SimplyBook.me' },
  { src: '/linked_in.png',         alt: 'LinkedIn' },
  { src: '/where-logo.png',        alt: 'Wheree' },
];

// ── SERVICES ──────────────────────────────────────────────────
const services = [
  {
    n: '1',
    title: 'Display screen equipment Assessments',
    cta: 'DCS Assessments >>',
    href: '/corporate/dsc-assessments',
    img: '/corporate-dsc.jpg',
  },
  {
    n: '2',
    title: 'In-Office Chair Massage',
    cta: 'Chair Massage >>',
    href: '/corporate/in-chair-massage',
    img: '/corporate-chair-massage.jpg',
  },
  {
    n: '3',
    title: 'Assessments & Posture Consultations',
    cta: 'Assessments >>',
    href: '/corporate/posture-consultations',
    img: '/corporate-posture.jpg',
  },
];

// ── TESTIMONIALS ──────────────────────────────────────────────
// Currently duplicated as placeholders. Replace with real corp
// testimonial content as it comes in.
const corpTestimonials = [
  {
    body:
      '“Lucy provided corporate massage at our offices giving targeted help with specific discomfort or general relaxation from the all too real strains of a desk job. Unfailingly polite and supportive she also provided advice and guidance on exercises and posture outside of treatment. Her attentive and interested attitude to her clients was exceptional and quickly changed the sessions from a nice treat to an essential part of self care and well being.”',
    attribution: 'University of Cambridge',
    logo: '/university-cambridge.png',
  },
  {
    body:
      '“Lucy provided corporate massage at our offices giving targeted help with specific discomfort or general relaxation from the all too real strains of a desk job. Unfailingly polite and supportive she also provided advice and guidance on exercises and posture outside of treatment. Her attentive and interested attitude to her clients was exceptional and quickly changed the sessions from a nice treat to an essential part of self care and well being.”',
    attribution: 'University of Cambridge',
    logo: '/university-cambridge.png',
  },
];

// ── ARROWS ────────────────────────────────────────────────────
const ChevronRight = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── MAIN ──────────────────────────────────────────────────────

export default function CorporateHomeClient() {
  return (
    <>
      <CorporateNav />

      <main className="corp-main">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="corp-hero">
          <div className="corp-hero-image">
            <Image
              src="/corporate-hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="corp-hero-overlay" aria-hidden="true" />
          </div>

          {/* Top-right "Download our employer PDF" chevron CTA */}
          <Link href="/corporate/enquire" className="corp-hero-pdf">
            <ChevronRight size={28} />
            <span>Download our employer PDF</span>
          </Link>

          {/* Bottom-left text + enquire link */}
          <div className="corp-hero-text">
            <h1 className="corp-hero-headline">
              Making Your Workplace Happier &amp; Healthier
            </h1>
            <p className="corp-hero-sub">
              Transforming the way people feel and are treated at work, through the power of massage and mindfulness.
            </p>
            <div className="corp-hero-rule" />
            <Link href="/corporate/enquire" className="corp-hero-enquire">
              Enquire now &gt;&gt;
            </Link>
          </div>
        </section>

        {/* ── COMPANY CLIENTS STRIP ────────────────────────── */}
        <section className="corp-clients">
          <div className="corp-clients-marquee">
            <div className="corp-clients-marquee-track">
              {[...companyClients, ...companyClients].map((c, i) => (
                <div key={`${c.name}-${i}`} className="corp-client-item">
                  <img
                    src={c.src}
                    alt={c.name}
                    className="corp-client-logo"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CREDIBILITY INTRO ────────────────────────────── */}
        <section className="corp-intro">
          <p className="corp-intro-para">
            Our clients agree that the benefits of in workplace corporate massage services are incredible, and this rejuvenating and relaxing form of occupational health therapy is guaranteed to get your employees excited to come into work every day.
          </p>
          <p className="corp-intro-para">
            Our expertly trained therapists will revitalise and invigorate your staff with our in-house massage treatments &mdash; They fit in effortlessly with your daily schedule and are easy to set up in your premises.
          </p>
        </section>

        <div className="corp-divider" />

        {/* ── DUTY OF CARE / WHAT IS CORPORATE MASSAGE ─────── */}
        <section className="corp-twocol">
          <div className="corp-twocol-grid">

            {/* Left: bordered duty-of-care box */}
            <div className="corp-twocol-card corp-twocol-card--bordered">
              <h2 className="corp-twocol-heading">
                As an employer you have a duty of care to your staff, but, of course, massage isn&rsquo;t legally required. So, why invest in the physical wellbeing of your staff?
              </h2>
              <p className="corp-twocol-body">
                The health risks associated with prolonged desk use has been confirmed by the NHS and is a major cause for concern for employees in the office workplace. The NHS has its own guidelines on the health impacts of sitting, and some of the potential problems.
              </p>
              <Link href="/corporate/enquire" className="corp-twocol-chevron-cta">
                <ChevronRight size={28} />
                <span>Download our employer PDF</span>
              </Link>
            </div>

            {/* Right: what is corporate massage */}
            <div className="corp-twocol-card">
              <p className="corp-twocol-body corp-twocol-body--lead">
                Corporate massage is an cost-effective way to alleviate physical and mental tension and is very popular with employees.
              </p>
              <p className="corp-twocol-body">
                By adding corporate massage services to your employee benefits, you will see a major boost to staff wellbeing and create a happier work environment, leading to increased motivation and productivity long term.
              </p>
              <Link href="/corporate/enquire" className="corp-twocol-link-cta">
                Enquire About your team here
              </Link>
            </div>

          </div>
        </section>

        <div className="corp-divider" />

        {/* ── SERVICES STRIP ───────────────────────────────── */}
        <section className="corp-services">
          <h2 className="corp-services-heading">Services</h2>
          <div className="corp-services-grid">
            {services.map((s) => (
              <Link key={s.n} href={s.href} className="corp-service-card">
                <div className="corp-service-image">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div className="corp-service-overlay" />
                </div>
                <div className="corp-service-content">
                  <p className="corp-service-n">Service {s.n}:</p>
                  <h3 className="corp-service-title">{s.title}</h3>
                  <div className="corp-service-rule" />
                  <span className="corp-service-cta">{s.cta}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="corp-divider" />

        {/* ── CREDIBILITY TESTIMONIALS ─────────────────────── */}
        <section className="corp-credibility">
          <h2 className="corp-credibility-heading">Credibility:</h2>
          <div className="corp-credibility-grid">
            {corpTestimonials.map((t, i) => (
              <div key={i} className="corp-credibility-item">
                <p className="corp-credibility-body">{t.body}</p>
                <img
                  src={t.logo}
                  alt={t.attribution}
                  className="corp-credibility-logo"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── FIND US ON ───────────────────────────────────── */}
        <div className="corp-findus">
          <div className="corp-findus-marquee">
            <div className="corp-findus-marquee-track">
              {[...findUsLogos, ...findUsLogos].map((logo, i) => (
                <img
                  key={`${logo.alt}-${i}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="corp-findus-logo"
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <style>{`
        .corp-main {
          background: #000000;
          color: #ffffff;
          min-height: 100vh;
        }

        /* ── HERO ────────────────────────────────────────────── */
        .corp-hero {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 480px;
          overflow: hidden;
          background: #000000;
        }
        .corp-hero-image {
          position: absolute;
          inset: 0;
        }
        .corp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.45) 35%,
            rgba(0,0,0,0.15) 100%
          );
        }
        .corp-hero-pdf {
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          transition: opacity 0.2s ease;
        }
        .corp-hero-pdf:hover { opacity: 0.85; }

        .corp-hero-text {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 2;
          padding: 0 60px 60px;
          max-width: 720px;
          width: 100%;
          color: #ffffff;
        }
        .corp-hero-headline {
          font-size: clamp(1.6rem, 3.2vw, 2.4rem);
          font-weight: 600;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.01em;
        }
        .corp-hero-sub {
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 28px;
          opacity: 0.92;
          max-width: 520px;
        }
        .corp-hero-rule {
          height: 1px;
          background: rgba(255,255,255,0.6);
          margin-bottom: 18px;
          width: 90%;
          max-width: 520px;
        }
        .corp-hero-enquire {
          display: inline-block;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-decoration: none;
          padding-left: calc(50% - 80px);
          transition: opacity 0.2s ease;
        }
        .corp-hero-enquire:hover { opacity: 0.85; }

        /* Mobile + tablet hero */
        @media (max-width: 1023px) {
          .corp-hero {
            height: auto;
            min-height: 0;
          }
          .corp-hero-image {
            position: relative;
            inset: auto;
            width: 100%;
            height: 60vh;
            min-height: 380px;
          }
          .corp-hero-pdf {
            position: relative;
            top: auto;
            right: auto;
            display: none;
          }
          .corp-hero-text {
            position: relative;
            left: auto;
            bottom: auto;
            padding: 32px 24px 32px;
            max-width: 100%;
          }
          .corp-hero-headline {
            font-size: 1.7rem;
          }
          .corp-hero-sub {
            font-size: 1rem;
          }
          .corp-hero-rule {
            width: 100%;
          }
          .corp-hero-enquire {
            padding-left: 0;
            display: block;
            text-align: center;
          }
        }

        /* ── COMPANY CLIENTS ─────────────────────────────────── */
        .corp-clients {
          padding: 40px 24px;
          overflow: hidden;
        }
        .corp-clients-marquee {
          width: 100%;
          overflow: hidden;
        }
        .corp-clients-marquee-track {
          display: flex;
          align-items: center;
          gap: 40px;
          width: max-content;
          animation: corp-marquee 25s linear infinite;
        }
        @keyframes corp-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .corp-client-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          padding: 0 8px;
        }
        .corp-client-logo {
          max-height: 40px;
          max-width: 130px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        @media (min-width: 1024px) {
          .corp-clients {
            padding: 60px 80px;
          }
          .corp-clients-marquee-track {
            justify-content: space-between;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            animation: none;
            transform: none !important;
          }
          .corp-clients-marquee-track > .corp-client-item:nth-child(n+5) {
            display: none;
          }
          .corp-client-item { height: 80px; }
          .corp-client-logo {
            max-height: 60px;
            max-width: 240px;
          }
        }

        /* ── CREDIBILITY INTRO ───────────────────────────────── */
        .corp-intro {
          padding: 40px 24px 60px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }
        .corp-intro-para {
          font-size: clamp(1.1rem, 1.4vw, 1.35rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0 0 28px;
          opacity: 0.92;
        }
        .corp-intro-para:last-child {
          margin-bottom: 0;
        }
        @media (min-width: 1024px) {
          .corp-intro {
            padding: 80px 80px 80px;
          }
        }

        /* ── DIVIDER ─────────────────────────────────────────── */
        .corp-divider {
          height: 1px;
          background: rgba(255,255,255,0.2);
          margin: 0 48px;
        }
        @media (min-width: 1024px) {
          .corp-divider { margin: 0 80px; }
        }

        /* ── TWO-COLUMN BLOCK ────────────────────────────────── */
        .corp-twocol {
          padding: 60px 24px;
        }
        .corp-twocol-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .corp-twocol-card {
          padding: 32px;
        }
        .corp-twocol-card--bordered {
          border: 1px solid rgba(255,255,255,0.4);
        }
        .corp-twocol-heading {
          font-size: clamp(1.05rem, 1.2vw, 1.2rem);
          font-weight: 400;
          color: #ffffff;
          line-height: 1.5;
          margin: 0 0 24px;
          letter-spacing: 0.005em;
        }
        .corp-twocol-body {
          font-size: clamp(1rem, 1.1vw, 1.1rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0 0 24px;
          opacity: 0.9;
        }
        .corp-twocol-body--lead {
          font-size: clamp(1.2rem, 1.4vw, 1.35rem);
          opacity: 1;
          font-weight: 400;
        }
        .corp-twocol-chevron-cta {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 400;
          margin-top: 24px;
          transition: opacity 0.2s ease;
        }
        .corp-twocol-chevron-cta:hover { opacity: 0.85; }
        .corp-twocol-link-cta {
          display: inline-block;
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-size: 1.5rem;
          font-weight: 400;
          margin-top: 16px;
          transition: opacity 0.2s ease;
        }
        .corp-twocol-link-cta:hover { opacity: 0.85; }

        @media (min-width: 1024px) {
          .corp-twocol {
            padding: 80px 80px;
          }
          .corp-twocol-grid {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
          .corp-twocol-card {
            padding: 40px;
          }
        }

        /* ── SERVICES STRIP ──────────────────────────────────── */
        .corp-services {
          padding: 60px 24px;
        }
        .corp-services-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 32px;
          letter-spacing: 0.02em;
        }
        .corp-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-service-card {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          text-decoration: none;
          color: #ffffff;
          transition: transform 0.3s ease;
        }
        .corp-service-card:hover {
          transform: scale(1.01);
        }
        .corp-service-image {
          position: absolute;
          inset: 0;
        }
        .corp-service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
        }
        .corp-service-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
        }
        .corp-service-n {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 4px;
          color: #ffffff;
        }
        .corp-service-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 16px;
          color: #ffffff;
          line-height: 1.2;
        }
        .corp-service-rule {
          height: 1px;
          background: rgba(255,255,255,0.6);
          margin-bottom: 12px;
          width: 100%;
        }
        .corp-service-cta {
          font-size: 0.85rem;
          font-weight: 400;
          color: #ffffff;
          text-align: right;
          display: block;
        }

        @media (min-width: 1024px) {
          .corp-services {
            padding: 80px 80px;
          }
          .corp-services-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0;
          }
          .corp-service-card {
            aspect-ratio: 1 / 1;
          }
        }

        /* ── CREDIBILITY TESTIMONIALS ────────────────────────── */
        .corp-credibility {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-credibility-heading {
          font-size: 1.5rem;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 32px;
        }
        .corp-credibility-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .corp-credibility-item {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .corp-credibility-body {
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0;
          opacity: 0.92;
        }
        .corp-credibility-logo {
          max-height: 36px;
          width: auto;
          height: auto;
          object-fit: contain;
          align-self: flex-start;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        @media (min-width: 1024px) {
          .corp-credibility {
            padding: 80px 80px;
          }
          .corp-credibility-grid {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
        }

        /* ── FIND US ON ──────────────────────────────────────── */
        .corp-findus {
          padding: 40px 24px 60px;
          overflow: hidden;
        }
        .corp-findus-marquee {
          width: 100%;
          overflow: hidden;
        }
        .corp-findus-marquee-track {
          display: flex;
          align-items: center;
          gap: 40px;
          width: max-content;
          animation: corp-marquee 25s linear infinite;
        }
        .corp-findus-logo {
          flex: 0 0 auto;
          height: 36px;
          width: auto;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
          opacity: 0.85;
        }
        @media (min-width: 1024px) {
          .corp-findus {
            padding: 60px 80px;
          }
          .corp-findus-marquee-track {
            justify-content: center;
            gap: 60px;
            width: 100%;
            animation: none;
            transform: none !important;
          }
          .corp-findus-marquee-track > .corp-findus-logo:nth-child(n+6) {
            display: none;
          }
          .corp-findus-logo {
            height: 50px;
          }
        }
      `}</style>
    </>
  );
}
