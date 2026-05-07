'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../../Nav';
import Footer from '../../Footer';
import styles from '../../page.module.css';

/* ─────────────────────────────────────────────────────────────
   /treatments/sports-therapy

   Layout:
     - Hero: H1 "Sports Therapy" + sub "Choose your duration"
     - Horizontal scroll-driven carousel: 4 slides (30/60/90/120 min)
       Each slide is a card with the duration as title.
       Clicking a card scrolls to that duration's anchor section.
     - 4 anchor sections below the carousel, each with:
         * H2 "30 minutes" (etc.)
         * Unique intro paragraph
         * 3 generic Sports Therapy explainer paragraphs
         * SimplyBook iframe pre-selecting the right service ID

   Service ID mapping (per Lucy's SimplyBook config):
     30 min  → service ID 1
     60 min  → service ID 2
     90 min  → service ID 3
     120 min → service ID 4

   Image: shared sports-therapy-mobile.jpg / -desktop.jpg
   for all 4 cards.
   ───────────────────────────────────────────────────────────── */

type Duration = {
  id: string;        // anchor id
  label: string;     // card title — "30 min"
  fullLabel: string; // section H2 — "30 minutes"
  serviceId: number; // SimplyBook service ID
  intro: string;     // unique opening paragraph
};

const DURATIONS: Duration[] = [
  {
    id: '30',
    label: '30 min',
    fullLabel: '30 minutes',
    serviceId: 1,
    intro:
      "Not sure what type of massage you need? Or maybe you have one specific area of tension that needs attention. If so then the 30 minute massage is the right one for you. Best for: targeted relief on a single area — neck, shoulders, lower back, or calves. A quick reset between meetings or before a busy week.",
  },
  {
    id: '60',
    label: '60 min',
    fullLabel: '60 minutes',
    serviceId: 2,
    intro:
      "Not sure what type of massage you need? Or maybe you have a couple of troublesome areas you want addressing in one session. If so then the 60 minute massage is the right one for you. Best for: a balanced full-body or focused multi-area session — the most popular choice for those wanting both treatment and relaxation.",
  },
  {
    id: '90',
    label: '90 min',
    fullLabel: '90 minutes',
    serviceId: 3,
    intro:
      "Not sure what type of massage you need? Or maybe you've got persistent issues that need real depth and time to work through. If so then the 90 minute massage is the right one for you. Best for: deeper work, layered technique, and full-body coverage with attention to problem areas — ideal post-event, or after a high-stress period.",
  },
  {
    id: '120',
    label: '120 min',
    fullLabel: '120 minutes',
    serviceId: 4,
    intro:
      "Not sure what type of massage you need? Or maybe you've been carrying long-standing tension and want a complete reset. If so then the 120 minute massage is the right one for you. Best for: a full mind-body restoration — the deepest work we offer, with time for full-body coverage plus extended focus on chronic problem areas. Bring a notebook of where it hurts.",
  },
];

// Generic Sports Therapy explainer — shown at the bottom of every section
const GENERIC_PARAGRAPHS = [
  "Sports massage aims to reduce pain and improve joint mobility. It combines deep-tissue massage, neuromuscular techniques and stretching to relieve tension. This is available to anybody — whether you're a runner, rower, athlete, or non-athlete, sports massage can alleviate acute pain. Chronic muscular tension is massaged away to improve quality of life.",
  "A sports massage involves our therapists using intense massage techniques that often involve quite a fast pace, heavy kneading of the body's soft tissue areas — such as muscles, tendons and fascia — and some specific techniques such as active release and trigger point therapy. However, it should not be daunting. It is one of the most effective ways to maintain and protect the body from aches, pains and injuries.",
  "The therapist will adapt the massage to your exact needs.",
];

// Build the SimplyBook iframe URL for a given service ID
function iframeUrl(serviceId: number): string {
  return `https://lucyhallmassage.simplybook.it/v2/?widget=widget-config&service=${serviceId}`;
}

export default function SportsTherapyClient() {
  return (
    <>
      <Nav solid />

      <main style={{ background: '#000000', color: '#ffffff' }}>
        {/* ── HERO ────────────────────────────────────────── */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            height: '70vh',
            minHeight: 480,
            overflow: 'hidden',
            background: '#1a1a1a',
          }}
        >
          {/* Mobile hero image */}
          <Image
            src="/sports-therapy-mobile.jpg"
            alt="Sports Therapy — Lucy Hall Massage"
            fill
            sizes="(max-width: 1024px) 100vw, 0px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="st-hero-mobile"
          />
          {/* Desktop hero image */}
          <Image
            src="/sports-therapy-desktop.jpg"
            alt="Sports Therapy — Lucy Hall Massage"
            fill
            sizes="(min-width: 1025px) 100vw, 0px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="st-hero-desktop"
          />

          {/* Gradient overlay for legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)',
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '0 32px 64px',
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                margin: '0 0 16px',
                color: '#ffffff',
              }}
            >
              Sports Therapy
            </h1>
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                fontWeight: 300,
                lineHeight: 1.4,
                margin: 0,
                color: '#ffffff',
                opacity: 0.92,
              }}
            >
              Choose your duration
            </p>
          </div>
        </section>

        {/* ── 4-DURATION CAROUSEL ─────────────────────────── */}
        <DurationCarousel />

        {/* ── 4 ANCHOR SECTIONS ───────────────────────────── */}
        {DURATIONS.map((d) => (
          <section
            key={d.id}
            id={d.id}
            style={{
              padding: '80px 24px 96px',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              scrollMarginTop: 80,
            }}
            className="st-anchor-section"
          >
            <div style={{ maxWidth: 880, margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  margin: '0 0 32px',
                  color: '#ffffff',
                }}
              >
                {d.fullLabel}
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 300,
                  lineHeight: 1.75,
                  marginBottom: 24,
                  color: '#ffffff',
                  opacity: 0.95,
                }}
              >
                {d.intro}
              </p>

              {GENERIC_PARAGRAPHS.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 300,
                    lineHeight: 1.75,
                    marginBottom: 20,
                    color: '#ffffff',
                    opacity: 0.9,
                  }}
                >
                  {p}
                </p>
              ))}

              {/* IFRAME */}
              <div
                style={{
                  marginTop: 48,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#1a1a1a',
                }}
              >
                <iframe
                  src={iframeUrl(d.serviceId)}
                  width="100%"
                  height="780"
                  style={{ border: 0, display: 'block' }}
                  title={`Book a ${d.fullLabel} massage`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        ))}

        <Footer />
      </main>

      <style>{`
        /* Hero image responsive show/hide */
        .st-hero-desktop {
          display: none;
        }
        @media (min-width: 1025px) {
          .st-hero-mobile {
            display: none;
          }
          .st-hero-desktop {
            display: block;
          }
        }
        @media (min-width: 768px) {
          .st-anchor-section {
            padding: 100px 40px 120px !important;
          }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DurationCarousel — horizontal scroll-driven carousel that
   mirrors the TreatmentsIndexClient pattern but with only 4
   cards. As the user scrolls vertically, the cards pan
   horizontally inside a sticky container.

   On mobile (<768px) it falls back to a simple horizontal
   scroll with snap-points so users can swipe.
   ───────────────────────────────────────────────────────────── */
function DurationCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);

  // On desktop, transform the track based on scroll progress
  // through the section (same idea as DesktopTreatments).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) return; // mobile uses native scroll

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let raf = 0;
    let target = 0;
    let current = 0;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const passed = Math.max(0, Math.min(total, -rect.top));
      const progress = passed / total; // 0 → 1

      // 4 slides — the centre slide changes as we progress.
      // Total horizontal travel = (cards-1) * cardWidth + spacing
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxShift = Math.max(0, trackWidth - viewportWidth);
      target = progress * maxShift;

      // Determine active index based on progress
      const idx = Math.min(
        DURATIONS.length - 1,
        Math.max(0, Math.round(progress * (DURATIONS.length - 1)))
      );
      setActiveIndex(idx);
    };

    const tick = () => {
      // LERP for smoothness
      current += (target - current) * 0.15;
      if (track) {
        track.style.transform = `translateX(${-current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="dc-section"
      style={{
        position: 'relative',
        // Make the section TALL on desktop so user has room to
        // scroll-pan through the horizontal carousel.
        // 4 cards × 60vh per card ~= 240vh
        height: '180vh',
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={trackRef}
          className="dc-track"
          style={{
            display: 'flex',
            gap: 24,
            paddingLeft: '12vw',
            paddingRight: '12vw',
            willChange: 'transform',
            transition: 'transform 0.05s linear',
          }}
        >
          {DURATIONS.map((d, i) => {
            const isHovered = hoverIndex === i;
            const isActive = activeIndex === i;
            const grayscale = isHovered || isActive ? 0 : 100;
            const brightness = isHovered || isActive ? 1 : 0.65;

            return (
              <Link
                key={d.id}
                href={`#${d.id}`}
                className="dc-card"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(-1)}
                style={{
                  flex: '0 0 auto',
                  width: 'min(75vw, 460px)',
                  height: '70vh',
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: '#0a0908',
                  transition: 'transform 0.3s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transition: 'filter 0.4s ease',
                    filter: `brightness(${brightness}) grayscale(${grayscale}%)`,
                  }}
                >
                  <Image
                    src="/sports-therapy-desktop.jpg"
                    alt={`Sports Therapy ${d.fullLabel}`}
                    fill
                    sizes="(max-width: 768px) 75vw, 460px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Bottom gradient + label */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px 28px',
                    color: '#ffffff',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                      fontWeight: 600,
                      lineHeight: 1.05,
                      margin: '0 0 8px',
                    }}
                  >
                    {d.label}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      margin: 0,
                      opacity: 0.85,
                    }}
                  >
                    Book Now &raquo;
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .dc-section {
            height: auto !important;
          }
          .dc-section > div {
            position: relative !important;
            height: auto !important;
            overflow-x: auto !important;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 24px 0;
          }
          .dc-track {
            transform: none !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .dc-card {
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
}
