'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Footer from './Footer';
import SplashNav from './SplashNav';

/* ─────────────────────────────────────────────────────────────
   SplashClient — the disambiguation page rendered at /.

   Updates in this revision:

     1. SPINE EXTENDS HIGHER. top: -55px → -85px so the line
        reaches up through the gap between the My Body / My Team
        labels to the bottom of the full Lucy Hall logo.

     2. "Happy company clients include" h3 now uses the same
        styles.testimonialsHeading class as "Happy private clients
        include" — they auto-stay in sync.

     3. COMPANY LOGOS SPREAD OUT. The .splash-clients-row uses
        justify-content: space-between with no max-width on
        desktop, mirroring the spread-out layout of the find-us-on
        booking logos below. Logos sit at evenly-spaced intervals
        across the full available width.

     4. TESTIMONIAL CARDS WIDER on desktop. The grid view (visible
        on desktop, hidden on mobile in favour of the carousel)
        gets a wider container via a .splash-wider-testimonials
        wrapper class which overrides the page-module styles with
        a larger max-width.
   ───────────────────────────────────────────────────────────── */

// ── CONFIG ────────────────────────────────────────────────────
const COOKIE_NAME = 'lhm-side';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

const PRIVATE_FALLBACK = '#9d4149';
const CORPORATE_FALLBACK = '#9f879d';

type Side = 'private' | 'corporate';

// ── TESTIMONIALS ──────────────────────────────────────────────
const testimonials = [
  { name: 'Sarah Cater', title: 'Fantastic Swedish massage with Antonia', body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date: '30/03/2026', avatar: 'S' },
  { name: 'Suleyman Adanir', title: 'Swedish massage with Antonia', body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date: '04/02/2026', avatar: 'S' },
  { name: 'Alice W', title: 'Orla is brilliant', body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date: '10/12/2025', avatar: 'A' },
];

// ── COMPANY CLIENT LOGOS ──────────────────────────────────────
const companyClients = [
  { name: 'Spotify',                src: '/spotify.png' },
  { name: 'University of Cambridge', src: '/university-cambridge.png' },
  { name: 'Amazon',                 src: '/amazon.png' },
  { name: 'Redgate',                src: '/redgate-logo.png' },
];

// ── FIND-US-ON LOGOS ──────────────────────────────────────────
const findUsLogos = [
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png',    alt: 'SimplyBook.me' },
  { src: '/linked_in.png',   alt: 'LinkedIn' },
  { src: '/where-logo.png',  alt: 'Wheree' },
];

// ── ARROWS ────────────────────────────────────────────────────
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 120, height: 120 }}>
    <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 120, height: 120 }}>
    <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── MAIN ──────────────────────────────────────────────────────

export default function SplashClient() {
  const router = useRouter();

  const choose = (side: Side) => {
    document.cookie = `${COOKIE_NAME}=${side}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    const target = side === 'private' ? '/private' : '/corporate';

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };

    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => {
        router.push(target);
      });
    } else {
      router.push(target);
    }
  };

  // ── TESTIMONIAL CAROUSEL STATE ──
  const total = testimonials.length;
  const extended = [testimonials[total - 1], ...testimonials, testimonials[0]];
  const [tIndex, setTIndex] = useState(1);
  const [tAnimate, setTAnimate] = useState(true);
  const tStartX = useRef(0);
  const goT = (n: number) => { setTAnimate(true); setTIndex(n); };
  const onTTransitionEnd = () => {
    if (tIndex === 0) { setTAnimate(false); setTIndex(total); }
    else if (tIndex === total + 1) { setTAnimate(false); setTIndex(1); }
  };
  const tRealIndex = tIndex === 0 ? total - 1 : tIndex === total + 1 ? 0 : tIndex - 1;

  return (
    <>
      <SplashNav onSelect={choose} />

      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* ── DECISION ZONE ────────────────────────────────── */}
        <div className="splash-decision-zone">

          <div className="splash-spine" aria-hidden="true" />

          {/* ── ZONE 1 — TWO HERO PANELS ────────────────────── */}
          <section className="splash-panels">

            <button
              type="button"
              className="splash-panel splash-panel--left"
              style={{ background: PRIVATE_FALLBACK }}
              onClick={() => choose('private')}
              aria-label="Choose private — feeling injured? Don't let poor posture, stress, or injury hold you back"
            >
              <Image
                src="/Physiotherapy-desktop.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  viewTransitionName: 'hero-image',
                }}
              />
              <div className="splash-panel-overlay" />
              <div className="splash-panel-content">
                <h2 className="splash-panel-heading">Feeling Injured?</h2>
                <p className="splash-panel-sub">
                  Don&rsquo;t let poor posture, stress,<br />or injury hold you back
                </p>
                <div className="splash-panel-rule" />
                <div className="splash-panel-link splash-panel-link--left">
                  &lt;&lt;&nbsp;Private
                </div>
              </div>
            </button>

            <div className="splash-panels-gutter" aria-hidden="true" />

            <button
              type="button"
              className="splash-panel splash-panel--right"
              style={{ background: CORPORATE_FALLBACK }}
              onClick={() => choose('corporate')}
              aria-label="Choose corporate — work in HR? We can reduce sickness and absenteeism at work"
            >
              <Image
                src="/corporate-signature-img.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div className="splash-panel-overlay" />
              <div className="splash-panel-content">
                <h2 className="splash-panel-heading">Work in HR?</h2>
                <p className="splash-panel-sub">
                  We can reduce sickness &amp;<br />absenteeism at work?
                </p>
                <div className="splash-panel-rule" />
                <div className="splash-panel-link splash-panel-link--right">
                  Corporate&nbsp;&gt;&gt;
                </div>
              </div>
            </button>

          </section>

          {/* ── ZONE 2 — TWO-COLUMN ELABORATION ─────────────── */}
          <section className="splash-elaborate">
            <div className="splash-elaborate-grid">

              <div className="splash-elaborate-col splash-elaborate-col--left">
                <button
                  type="button"
                  className="splash-elaborate-arrow splash-elaborate-arrow--left"
                  onClick={() => choose('private')}
                  aria-label="Continue as private client"
                >
                  <span className="splash-elaborate-arrow-spacer" />
                  <span className="splash-elaborate-arrow-label">Private client</span>
                  <ChevronLeft />
                </button>
                <p className="splash-elaborate-lead">
                  Our experienced team are specialised in physiotherapist and provide: Deep Tissue, Swedish massage and pregnancy
                </p>
                <p className="splash-elaborate-body">
                  Whether you&rsquo;re recovering from an injury, managing ongoing tension, or simply in need of time to reset, our tailored treatments are designed around your body and your lifestyle. From deep tissue massage to pregnancy massage and physiotherapy, we help you move better, feel better, and get back to doing the things you love.
                </p>
                <a href="/tips-download" className="splash-elaborate-cta">
                  Download our 5 tips to a healthy body
                </a>
              </div>

              <div className="splash-elaborate-gutter" aria-hidden="true" />

              <div className="splash-elaborate-col splash-elaborate-col--right">
                <button
                  type="button"
                  className="splash-elaborate-arrow splash-elaborate-arrow--right"
                  onClick={() => choose('corporate')}
                  aria-label="Continue as corporate enquiry"
                >
                  <ChevronRight />
                  <span className="splash-elaborate-arrow-label">Corporate</span>
                  <span className="splash-elaborate-arrow-spacer" />
                </button>
                <p className="splash-elaborate-lead">
                  Incorporating our wellness initiatives into your employee benefits can lead to a happier, more focused workforce.
                </p>
                <p className="splash-elaborate-body">
                  Transform your workplace into a hub of positivity and productivity by partnering with Lucy Hall Massage in Cambridge! In today&rsquo;s fast-paced environment, it&rsquo;s more important than ever to prioritise the well-being of your team. Imagine an atmosphere where employees feel energised, supported, and motivated to give their best every day.
                </p>
                <a href="/corporate/enquire" className="splash-elaborate-cta">
                  Download our employer PDF
                </a>
              </div>

            </div>
          </section>

        </div>

        {/* ── ZONE 3a — HAPPY COMPANY CLIENTS ─────────────────── */}
        {/* Heading now uses styles.testimonialsHeading to match the
            "Happy private clients include" h3 style below. The logo
            row spreads logos out using space-between, mirroring the
            booking logo layout. */}
        <section className="splash-clients">
          <h3 className={styles.testimonialsHeading}>
            Happy company<br />clients include
          </h3>
          <div className="splash-clients-row">
            {companyClients.map(c => (
              <div key={c.name} className="splash-client-item">
                <img
                  src={c.src}
                  alt={c.name}
                  className="splash-client-logo"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="splash-divider" />

        {/* ── ZONE 3b — HAPPY PRIVATE CLIENTS (TESTIMONIALS) ──── */}
        {/* The .splash-wider-testimonials wrapper overrides the
            grid's max-width to 1600px on desktop while leaving the
            carousel (mobile) untouched. */}
        <section className={`${styles.testimonialsSection} splash-wider-testimonials`}>
          <h3 className={styles.testimonialsHeading}>Happy private<br />clients include</h3>

          <div
            className={tAnimate ? styles.testimonialsTrack : styles.testimonialsTrackNoAnim}
            style={{ transform: `translateX(calc(-${tIndex * 100}%))` }}
            onTransitionEnd={onTTransitionEnd}
            onTouchStart={e => { tStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => { const dx = tStartX.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 40) goT(tIndex + (dx > 0 ? 1 : -1)); }}
          >
            {extended.map((t, i) => (
              <div key={i} className={styles.testimonialSlide}>
                <div className={styles.testimonialAvatar}>{t.avatar}</div>
                <h4 className={styles.testimonialName}>{t.name}</h4>
                <p className={styles.testimonialTitle}>{t.title}</p>
                <p className={styles.testimonialBody}>{t.body}</p>
                <div className={styles.testimonialStars}>{[...Array(5)].map((_, j) => <span key={j} className={styles.star}>★</span>)}</div>
                <p className={styles.testimonialDate}>{t.date}</p>
              </div>
            ))}
          </div>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => goT(i + 1)} className={`${styles.dot} ${i === tRealIndex ? styles.dotActive : ''}`} />
            ))}
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialsGridSlide}>
                <div className={styles.testimonialAvatar}>{t.avatar}</div>
                <h4 className={styles.testimonialName}>{t.name}</h4>
                <p className={styles.testimonialTitle}>{t.title}</p>
                <p className={styles.testimonialBody}>{t.body}</p>
                <div className={styles.testimonialStars}>{[...Array(5)].map((_, j) => <span key={j} className={styles.star}>★</span>)}</div>
                <p className={styles.testimonialDate}>{t.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FIND US ON ──────────────────────────────────────── */}
        <div style={{ paddingTop: 40, paddingBottom: 40 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff', textAlign: 'center', marginBottom: 24, opacity: 0.7 }}>
            Find us on:
          </h3>
          <div className={styles.logoSlider}>
            <div className={styles.logoRow}>
              {findUsLogos.map((logo) => (
                <img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <style>{`
        /* ── DECISION ZONE WRAPPER ──────────────────────────── */
        .splash-decision-zone {
          position: relative;
          background: #000000;
        }

        /* ── CONTINUOUS SPINE — extends UP further now ────────
           top: -55px → -85px so the line reaches up through the
           gap between My Body / My Team labels to the bottom of
           the full logo. */
        .splash-spine {
          display: none;
        }
        @media (min-width: 1024px) {
          .splash-spine {
            display: block;
            position: absolute;
            top: -85px;
            bottom: 0;
            left: 50%;
            width: 2px;
            background: #ffffff;
            opacity: 0.7;
            transform: translateX(-50%);
            z-index: 3;
            pointer-events: none;
          }
        }

        /* ── HERO PANELS ─────────────────────────────────────── */
        .splash-panels {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          width: 100%;
        }
        .splash-panels-gutter {
          display: none;
        }

        .splash-panel {
          position: relative;
          width: 100%;
          min-height: 60vh;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: #ffffff;
          font-family: inherit;
          display: block;
          overflow: hidden;
        }
        .splash-panel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .splash-panel-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 60vh;
          padding: 80px 32px 60px;
          justify-content: flex-end;
        }
        .splash-panel--left .splash-panel-content {
          text-align: right;
          align-items: flex-end;
        }
        .splash-panel--right .splash-panel-content {
          text-align: left;
          align-items: flex-start;
        }

        .splash-panel-heading {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 600;
          margin: 0 0 14px;
          line-height: 1.15;
        }
        .splash-panel-sub {
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          font-weight: 300;
          margin: 0 0 28px;
          line-height: 1.5;
          opacity: 0.92;
        }
        .splash-panel-rule {
          height: 1px;
          background: #ffffff;
          opacity: 0.6;
          margin-bottom: 18px;
          width: 90%;
        }
        .splash-panel-link {
          width: 90%;
          font-size: 0.78rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #ffffff;
        }
        .splash-panel-link--left {
          text-align: left;
        }
        .splash-panel-link--right {
          text-align: right;
        }

        .splash-panel:hover .splash-panel-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 100%);
        }

        @media (min-width: 1024px) {
          .splash-panels {
            grid-template-columns: 1fr 90px 1fr;
          }
          .splash-panels-gutter {
            display: block;
            background: #000000;
            min-height: 78vh;
          }
          .splash-panel {
            min-height: 78vh;
          }
          .splash-panel-content {
            min-height: 78vh;
            padding: 120px 60px 70px;
          }
        }

        /* ── ELABORATE / TWO-COLUMN BODY ─────────────────────── */
        .splash-elaborate {
          padding: 60px 24px 30px;
        }
        .splash-elaborate-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .splash-elaborate-gutter {
          display: none;
        }

        .splash-elaborate-col {
          position: relative;
          padding-top: 160px;
        }
        .splash-elaborate-col--left {
          text-align: right;
        }
        .splash-elaborate-col--right {
          text-align: left;
        }

        .splash-elaborate-arrow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0;
          opacity: 0.85;
          transition: opacity 0.2s ease;
          width: 100%;
        }
        .splash-elaborate-arrow:hover { opacity: 1; }

        .splash-elaborate-arrow-spacer {
          flex: 1;
        }

        .splash-elaborate-arrow-label {
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          text-transform: none;
          font-weight: 400;
        }

        .splash-elaborate-lead {
          font-size: 1.95rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.35;
          margin: 0 0 28px;
          letter-spacing: -0.01em;
        }
        .splash-elaborate-body {
          font-size: 1.15rem;
          font-weight: 300;
          color: #ffffff;
          line-height: 1.65;
          margin: 0 0 32px;
          opacity: 0.85;
          letter-spacing: 0;
        }

        .splash-elaborate-cta {
          display: inline-block;
          width: auto;
          font-size: 0.85rem;
          font-weight: 500;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          line-height: 1.6;
          padding: 16px 24px;
          border: 1px solid rgba(255,255,255,0.4);
          margin: 0;
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .splash-elaborate-cta:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.7);
        }

        @media (min-width: 1024px) {
          .splash-elaborate {
            padding: 80px 60px 60px;
          }
          .splash-elaborate-grid {
            grid-template-columns: 1fr 90px 1fr;
            gap: 0;
          }
          .splash-elaborate-gutter {
            display: block;
          }
          .splash-elaborate-col--left {
            padding-right: 50px;
          }
          .splash-elaborate-col--right {
            padding-left: 50px;
          }
          .splash-elaborate-lead {
            font-size: 2.6rem;
            line-height: 1.3;
          }
          .splash-elaborate-body {
            font-size: 1.5rem;
            line-height: 1.6;
          }
          .splash-elaborate-cta {
            font-size: 0.95rem;
            padding: 22px 32px;
          }
          .splash-elaborate-arrow-label {
            font-size: 1.5rem;
          }
        }

        /* ── COMPANY CLIENTS STRIP ───────────────────────────── */
        /* Logos now spread out across the available width using
           justify-content: space-between, similar to the find-us-on
           booking logos. No max-width constraint on desktop, just
           padding from the viewport edges. */
        .splash-clients {
          padding: 40px 24px 40px;
          text-align: center;
        }
        .splash-clients-row {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin: 32px auto 0;
          padding: 0 40px;
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .splash-clients-row::-webkit-scrollbar {
          display: none;
        }
        .splash-client-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          padding: 0 8px;
        }
        .splash-client-logo {
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
          .splash-clients {
            padding: 60px 60px 40px;
          }
          .splash-clients-row {
            padding: 0 80px;
            margin-top: 48px;
          }
          .splash-client-item { height: 80px; }
          .splash-client-logo {
            max-height: 60px;
            max-width: 240px;
          }
        }

        /* ── WIDER TESTIMONIALS WRAPPER ──────────────────────── */
        /* The default page-module testimonialsGrid has a moderate
           max-width. We override here to make it 1600px wide on
           desktop, matching the elaboration zone above.

           Using > * descendant selectors to reach the grid inside
           without changing page.module.css (which would also affect
           PrivateHomeClient). */
        @media (min-width: 1024px) {
          .splash-wider-testimonials [class*="testimonialsGrid"] {
            max-width: 1600px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }

        /* ── DIVIDER (between sections) ──────────────────────── */
        .splash-divider {
          height: 1px;
          background: rgba(255,255,255,0.2);
          margin: 20px 48px;
        }
        @media (min-width: 1024px) {
          .splash-divider { margin: 20px 80px; }
        }
      `}</style>
    </>
  );
}
