'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from './Footer';
import SplashNav from './SplashNav';
import Testimonials, { headingClassName } from './components/Testimonials/Testimonials';
import styles from './page.module.css';

/* ─────────────────────────────────────────────────────────────
   SplashClient — the disambiguation page rendered at /.

   ── Desktop (≥1024px) ────────────────────────────────────────
   Unchanged. Two hero panels side-by-side with the spine, gutter,
   and two-column elaboration zone.

   ── Mobile + Tablet (<1024px) ────────────────────────────────
   Uses the same SCROLL-DRIVEN HORIZONTAL TRANSLATE pattern as
   ServicesCarousel on PrivateHomeClient.

   The hero zone is a 200vh-tall section. Inside it sits a sticky
   100vh viewport that contains:
     1. A 200vw filmstrip with two images side-by-side
        (private | corporate). A scroll listener translates this
        filmstrip from translateX(0) → translateX(-100vw) as the
        user scrolls through the 200vh section.
     2. A fixed text overlay (always visible, never translates):
        - Two side-by-side headlines (Feeling Injured? | Work in HR?)
        - White rule across the bottom
        - "<< Private" left, "Corporate >>" right under the rule
     3. A tap layer split 50/50:
        - Left half → choose('private')
        - Right half → choose('corporate')

   The text overlay sits ABOVE the filmstrip via z-index so the
   headline content remains legible regardless of which image is
   currently visible underneath.

   Below the hero zone, the elaboration text follows in a single-
   column stack (this is unchanged from the existing mobile layout).
   ───────────────────────────────────────────────────────────── */

// ── CONFIG ────────────────────────────────────────────────────
const COOKIE_NAME = 'lhm-side';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

const PRIVATE_FALLBACK = '#9d4149';
const CORPORATE_FALLBACK = '#9f879d';

type Side = 'private' | 'corporate';

// ── COMPANY CLIENT LOGOS ──────────────────────────────────────
const companyClients = [
  { name: 'Spotify',                 src: '/spotify.png' },
  { name: 'University of Cambridge', src: '/university-cambridge.png' },
  { name: 'Amazon',                  src: '/amazon.png' },
  { name: 'Redgate',                 src: '/redgate-logo.png' },
];

// ── FIND-US-ON LOGOS ──────────────────────────────────────────
const findUsLogos = [
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png',    alt: 'SimplyBook.me' },
  { src: '/linked_in.png',   alt: 'LinkedIn' },
  { src: '/where-logo.png',  alt: 'Wheree' },
];

// ── ARROWS ────────────────────────────────────────────────────
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

// ── MOBILE/TABLET SCROLL-HERO COMPONENT ───────────────────────
// Tightly coupled to the surrounding splash markup so kept inline
// rather than extracted. Mirrors the ServicesCarousel pattern from
// PrivateHomeClient but with two fixed images and a fixed text
// overlay rather than slide content embedded in each frame.
function MobileScrollHero({ onChoose }: { onChoose: (side: Side) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Desktop bypasses the scroll-driven translate entirely.
        // The mobile section is hidden via CSS at ≥1024px so this
        // is just a belt-and-braces guard.
        if (window.innerWidth >= 1024) {
          track.style.transform = '';
          return;
        }
        const sectionTop = section.offsetTop;
        const scrollY = window.scrollY;
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const p = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollable));
        // Two images, single 100vw pan. p=0 shows private (left
        // half of filmstrip), p=1 shows corporate (right half).
        track.style.transform = `translateX(-${p * 100}vw)`;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="splash-m-hero"
      aria-label="Choose Private or Corporate"
    >
      <div className="splash-m-hero-sticky">

        {/* Filmstrip — 200vw of images, translated via JS */}
        <div ref={trackRef} className="splash-m-hero-track">
          <div
            className="splash-m-hero-frame"
            style={{ background: PRIVATE_FALLBACK }}
          >
            <Image
              src="/Physiotherapy-desktop.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div
            className="splash-m-hero-frame"
            style={{ background: CORPORATE_FALLBACK }}
          >
            <Image
              src="/corporate-signature-img.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        </div>

        {/* Dark overlay for text legibility */}
        <div className="splash-m-hero-overlay" aria-hidden="true" />

        {/* Fixed text overlay — never translates */}
        <div className="splash-m-hero-text">
          <div className="splash-m-hero-text-grid">
            <div className="splash-m-hero-text-col splash-m-hero-text-col--left">
              <h2 className="splash-m-hero-headline">Feeling Injured?</h2>
              <p className="splash-m-hero-sub">
                Don&rsquo;t let poor posture, stress,<br />or injury hold you back
              </p>
            </div>
            <div className="splash-m-hero-spine" aria-hidden="true" />
            <div className="splash-m-hero-text-col splash-m-hero-text-col--right">
              <h2 className="splash-m-hero-headline">Work in HR?</h2>
              <p className="splash-m-hero-sub">
                We can reduce sickness &amp;<br />absenteeism at work?
              </p>
            </div>
          </div>

          <div className="splash-m-hero-rule" />

          <div className="splash-m-hero-links">
            <span className="splash-m-hero-link">&lt;&lt;&nbsp;Private</span>
            <span className="splash-m-hero-link">Corporate&nbsp;&gt;&gt;</span>
          </div>
        </div>

        {/* Tap layer — left half = private, right half = corporate */}
        <div className="splash-m-hero-taps" aria-hidden="false">
          <button
            type="button"
            className="splash-m-hero-tap"
            onClick={() => onChoose('private')}
            aria-label="Choose private"
          />
          <button
            type="button"
            className="splash-m-hero-tap"
            onClick={() => onChoose('corporate')}
            aria-label="Choose corporate"
          />
        </div>

      </div>
    </section>
  );
}

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

  return (
    <>
      <SplashNav onSelect={choose} />

      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* ── DESKTOP DECISION ZONE (≥1024px) ───────────────── */}
        <div className="splash-desktop-only">
          <div className="splash-decision-zone">

            <div className="splash-spine" aria-hidden="true" />

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
                    Our experienced team are specialised in physiotherapist and provide: Deep Tissue, Swedish massage and pregnancy.
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
        </div>

        {/* ── MOBILE/TABLET HERO (<1024px) ──────────────────── */}
        <div className="splash-mobile-only">
          <MobileScrollHero onChoose={choose} />

          {/* Mobile elaboration — split into two separate sections
              with the chevron-panels block sandwiched between.
              Order: private (top) → panels → corporate (bottom). */}

          {/* 1. Private elaboration */}
          <section className="splash-elaborate splash-mobile-elaborate splash-mobile-elaborate--private">
            <div className="splash-elaborate-grid">
              <div className="splash-elaborate-col splash-elaborate-col--left">
                <p className="splash-elaborate-lead">
                  Our experienced team are specialised in physiotherapist and provide: Deep Tissue, Swedish massage and pregnancy.
                </p>
                <p className="splash-elaborate-body">
                  Whether you&rsquo;re recovering from an injury, managing ongoing tension, or simply in need of time to reset, our tailored treatments are designed around your body and your lifestyle. From deep tissue massage to pregnancy massage and physiotherapy, we help you move better, feel better, and get back to doing the things you love.
                </p>
                <a href="/tips-download" className="splash-elaborate-cta">
                  Download our 5 tips to a healthy body
                </a>
              </div>
            </div>
          </section>

          {/* 2. Mobile-only chevron-panels block — sandwiched
              between the two elaborations. Two rows, each 20vh:
              corporate row (image left, label right), private row
              (label left, image right). Whole row is tappable. */}
          <section className="splash-m-panels" aria-label="Choose Private or Corporate">

            <button
              type="button"
              className="splash-m-row splash-m-row--corporate"
              onClick={() => choose('corporate')}
              aria-label="Choose corporate — My Team"
            >
              <div className="splash-m-row-image">
                <Image
                  src="/corporate-signature-img.jpg"
                  alt=""
                  fill
                  sizes="50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="splash-m-row-chevron">
                <span className="splash-m-row-title">My Team</span>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 48, height: 48 }} aria-hidden="true">
                  <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="splash-m-row-side">Corporate</span>
              </div>
            </button>

            <button
              type="button"
              className="splash-m-row splash-m-row--private"
              onClick={() => choose('private')}
              aria-label="Choose private — My Body"
            >
              <div className="splash-m-row-chevron splash-m-row-chevron--left">
                <span className="splash-m-row-title">My Body</span>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 48, height: 48 }} aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="splash-m-row-side">Private client</span>
              </div>
              <div className="splash-m-row-image">
                <Image
                  src="/Physiotherapy-desktop.jpg"
                  alt=""
                  fill
                  sizes="50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </button>

          </section>

          {/* 3. Corporate elaboration */}
          <section className="splash-elaborate splash-mobile-elaborate splash-mobile-elaborate--corporate">
            <div className="splash-elaborate-grid">
              <div className="splash-elaborate-col splash-elaborate-col--right">
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

        {/* ── HAPPY COMPANY CLIENTS ───────────────────────────── */}
        <section className="splash-clients">
          <h3 className={headingClassName}>
            Happy company clients include
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

        {/* ── TESTIMONIALS (shared component) ─────────────────── */}
        <Testimonials heading="Happy private clients include" />

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
        /* ── VISIBILITY TOGGLES ──────────────────────────────── */
        .splash-desktop-only { display: none; }
        .splash-mobile-only  { display: block; }
        @media (min-width: 1024px) {
          .splash-desktop-only { display: block; }
          .splash-mobile-only  { display: none; }
        }

        /* ── DESKTOP — original layout ───────────────────────── */
        .splash-decision-zone {
          position: relative;
          background: #000000;
        }
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
        .splash-panels {
          display: grid;
          grid-template-columns: 1fr 90px 1fr;
          gap: 0;
          width: 100%;
        }
        .splash-panels-gutter {
          display: block;
          background: #000000;
          min-height: 78vh;
        }
        .splash-panel {
          position: relative;
          width: 100%;
          min-height: 78vh;
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
          min-height: 78vh;
          padding: 120px 60px 70px;
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
          font-size: 1.2rem;
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
        .splash-panel-link--left  { text-align: left; }
        .splash-panel-link--right { text-align: right; }
        .splash-panel:hover .splash-panel-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 100%);
        }

        /* Two-column elaboration (desktop) */
        .splash-elaborate {
          padding: 80px 60px 60px;
        }
        .splash-elaborate-grid {
          display: grid;
          grid-template-columns: 1fr 90px 1fr;
          gap: 0;
          max-width: 1600px;
          margin: 0 auto;
        }
        .splash-elaborate-gutter {
          display: block;
        }
        .splash-elaborate-col {
          position: relative;
          padding-top: 160px;
        }
        .splash-elaborate-col--left {
          text-align: right;
          padding-right: 50px;
        }
        .splash-elaborate-col--right {
          text-align: left;
          padding-left: 50px;
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
        .splash-elaborate-arrow-spacer { flex: 1; }
        .splash-elaborate-arrow-label {
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          text-transform: none;
          font-weight: 400;
        }
        .splash-elaborate-lead {
          font-size: 2.34rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
          margin: 0 0 28px;
          letter-spacing: -0.01em;
        }
        .splash-elaborate-body {
          font-size: 1.35rem;
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0 0 32px;
          opacity: 0.85;
        }
        .splash-elaborate-cta {
          display: inline-block;
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          line-height: 1.6;
          padding: 22px 32px;
          border: 1px solid rgba(255,255,255,0.4);
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .splash-elaborate-cta:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.7);
        }

        /* ── MOBILE/TABLET — scroll-driven hero ─────────────── */
        /* Scroll-snap (proximity) on the two mobile sections that
           form the hero handoff. Each becomes a snap target so when
           the user scrolls near the boundary, the browser nudges
           them onto the next section. Outside the proximity zone
           they free-scroll normally. The snap container is the
           document root; targets are the hero section and the
           elaboration block.

           Important: scroll-snap-type lives on the SCROLL CONTAINER,
           which is the document root on mobile. We apply it to the
           html element only below 1024px so desktop stays free-scroll. */
        @media (max-width: 1023px) {
          html {
            scroll-snap-type: y proximity;
          }
          .splash-m-hero,
          .splash-mobile-elaborate--private,
          .splash-m-panels,
          .splash-mobile-elaborate--corporate {
            scroll-snap-align: start;
            scroll-snap-stop: normal;
          }
        }

        .splash-m-hero {
          position: relative;
          background: #000000;
          /* 200vh = 100vh per image. Scroll runway. */
          height: 200vh;
        }
        .splash-m-hero-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .splash-m-hero-track {
          position: absolute;
          inset: 0;
          width: 200vw;
          display: flex;
          will-change: transform;
        }
        .splash-m-hero-frame {
          position: relative;
          width: 100vw;
          height: 100%;
          flex-shrink: 0;
        }
        .splash-m-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.35) 50%,
            rgba(0,0,0,0.7) 100%);
          z-index: 2;
          pointer-events: none;
        }

        /* Fixed text overlay */
        .splash-m-hero-text {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 3;
          padding: 0 24px 80px;
          color: #ffffff;
          pointer-events: none;
        }
        .splash-m-hero-text-grid {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .splash-m-hero-text-col {
          display: flex;
          flex-direction: column;
        }
        .splash-m-hero-text-col--left {
          text-align: right;
          padding-right: 16px;
          align-items: flex-end;
        }
        .splash-m-hero-text-col--right {
          text-align: left;
          padding-left: 16px;
          align-items: flex-start;
        }
        .splash-m-hero-spine {
          width: 1px;
          background: #ffffff;
          align-self: stretch;
        }
        .splash-m-hero-headline {
          font-size: 1.7rem;
          font-weight: 600;
          margin: 0 0 8px;
          line-height: 1.15;
        }
        .splash-m-hero-sub {
          font-size: 0.95rem;
          font-weight: 300;
          margin: 0;
          line-height: 1.45;
          opacity: 0.92;
        }
        .splash-m-hero-rule {
          height: 1px;
          background: rgba(255,255,255,0.7);
          width: 100%;
          margin-bottom: 14px;
        }
        .splash-m-hero-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .splash-m-hero-link {
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #ffffff;
        }

        /* Tap layer — sits ABOVE the text overlay so taps register
           even on the fixed text area. Buttons are transparent. */
        .splash-m-hero-taps {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .splash-m-hero-tap {
          background: transparent;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: inherit;
          color: transparent;
        }
        .splash-m-hero-tap:active {
          background: rgba(255,255,255,0.05);
        }

        /* Tablet bumps text up a touch */
        @media (min-width: 768px) and (max-width: 1023px) {
          .splash-m-hero-text {
            padding: 0 60px 100px;
          }
          .splash-m-hero-text-grid {
            gap: 32px;
            margin-bottom: 32px;
          }
          .splash-m-hero-text-col--left { padding-right: 32px; }
          .splash-m-hero-text-col--right { padding-left: 32px; }
          .splash-m-hero-headline {
            font-size: 2.4rem;
            margin-bottom: 12px;
          }
          .splash-m-hero-sub {
            font-size: 1.15rem;
          }
          .splash-m-hero-rule {
            margin-bottom: 18px;
          }
          .splash-m-hero-link {
            font-size: 1rem;
          }
        }

        /* Mobile elaboration — single-column stack below the
           horizontal-scroll hero. Shares some classes with the
           desktop elaboration but overrides the grid template. */
        .splash-mobile-elaborate {
          padding: 60px 24px 30px;
        }
        .splash-mobile-elaborate .splash-elaborate-grid {
          grid-template-columns: 1fr;
          gap: 60px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .splash-mobile-elaborate .splash-elaborate-col {
          position: relative;
          padding-top: 0;
        }
        .splash-mobile-elaborate .splash-elaborate-col--left {
          text-align: left;
          padding-right: 0;
        }
        .splash-mobile-elaborate .splash-elaborate-col--right {
          text-align: left;
          padding-left: 0;
        }
        .splash-mobile-elaborate .splash-elaborate-lead {
          font-size: 1.95rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.35;
          margin: 0 0 28px;
          letter-spacing: -0.01em;
        }
        .splash-mobile-elaborate .splash-elaborate-body {
          font-size: 1.15rem;
          font-weight: 300;
          color: #ffffff;
          line-height: 1.65;
          margin: 0 0 32px;
          opacity: 0.85;
        }
        .splash-mobile-elaborate .splash-elaborate-cta {
          font-size: 0.85rem;
          padding: 16px 24px;
        }

        /* ── MOBILE PANELS-WITH-CHEVRONS BLOCK ──────────────── */
        /* Two stacked rows below the elaboration. Each row is 40vh
           and split 50/50 image | label. Whole row is a button. */
        .splash-m-panels {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .splash-m-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
          width: 100%;
          height: 20vh;
          background: #000000;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: inherit;
          color: #ffffff;
          overflow: hidden;
        }
        .splash-m-row-image {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .splash-m-row-chevron {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          padding: 0 24px;
          text-align: right;
          background: #000000;
        }
        .splash-m-row-chevron--left {
          align-items: flex-start;
          text-align: left;
        }
        .splash-m-row-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.1;
        }
        .splash-m-row-side {
          font-size: 0.78rem;
          font-weight: 400;
          color: #ffffff;
          opacity: 0.9;
          letter-spacing: 0.02em;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .splash-m-row-title { font-size: 2rem; }
          .splash-m-row-side  { font-size: 0.95rem; }
          .splash-m-row-chevron { padding: 0 48px; gap: 10px; }
        }

        /* ── COMPANY CLIENTS STRIP ───────────────────────────── */
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
        .splash-clients-row::-webkit-scrollbar { display: none; }
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

        /* ── DIVIDER ─────────────────────────────────────────── */
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
