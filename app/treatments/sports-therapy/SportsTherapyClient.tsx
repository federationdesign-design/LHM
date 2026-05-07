'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../../Nav';
import Footer from '../../Footer';

/* ─────────────────────────────────────────────────────────────
   /treatments/sports-therapy — V3

   Changes from V2:
     - Unique image per duration (/30-img.jpg, /60-img.jpg, etc.)
     - Replaces plain iframe with SimplyBook embed widget pattern
       (matches existing service pages — themed, dark, green CTAs)
     - Shorter unique paragraph per duration
     - No generic shared paragraphs
     - Tightened gap between hero and carousel
   ───────────────────────────────────────────────────────────── */

// SimplyBook widget global typing
declare global {
  interface Window {
    SimplybookWidget?: new (config: Record<string, unknown>) => void;
  }
}

type Duration = {
  id: string;        // anchor id
  label: string;     // card title — '30 min'
  fullLabel: string; // section H2 — '30 minutes'
  serviceId: string; // SimplyBook predefined service id
  image: string;     // unique card image
  copy: string;      // unique short paragraph
};

const DURATIONS: Duration[] = [
  {
    id: '30',
    label: '30 min',
    fullLabel: '30 minutes',
    serviceId: '1',
    image: '/30-img.jpg',
    copy:
      "A focused session on one trouble area. Ideal if you've got a single tight spot — neck, shoulders, lower back — that needs attention before a busy week. Quick to fit in over a lunch break and you'll leave noticeably looser.",
  },
  {
    id: '60',
    label: '60 min',
    fullLabel: '60 minutes',
    serviceId: '2',
    image: '/60-img.jpg',
    copy:
      "Our most popular choice. Time enough to address two or three areas, balanced between treatment and relaxation. Suits anyone wanting solid pressure on problem spots without committing to a longer session.",
  },
  {
    id: '90',
    label: '90 min',
    fullLabel: '90 minutes',
    serviceId: '3',
    image: '/90-img.jpg',
    copy:
      "Deeper work with room to breathe. We can layer techniques, cover the full body, and still spend extra time on persistent issues. Good post-event, after a high-stress period, or when 60 minutes hasn't been quite enough.",
  },
  {
    id: '120',
    label: '120 min',
    fullLabel: '120 minutes',
    serviceId: '4',
    image: '/120-img.jpg',
    copy:
      "The full reset. Two hours gives space for complete head-to-toe coverage plus extended attention to long-standing tension. Best for chronic issues, recovery from heavy training blocks, or when you simply need the deepest work we offer.",
  },
];

/* ─────────────────────────────────────────────────────────────
   SimplyBook widget component — clones the pattern from
   ServiceBookingClient. One instance per duration. Each gets a
   unique container_id so 4 widgets coexist on the page.
   ───────────────────────────────────────────────────────────── */
function SimplyBookWidget({ serviceId, containerId }: { serviceId: string; containerId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.onload = () => {
      if (typeof window === 'undefined' || !window.SimplybookWidget) return;
      new window.SimplybookWidget({
        widget_type: 'iframe',
        url: 'https://lucyhallmassage.simplybook.it',
        theme: 'concise',
        theme_settings: {
          timeline_hide_unavailable: '1',
          hide_past_days: '0',
          timeline_show_end_time: '0',
          timeline_modern_display: 'as_slots',
          light_font_color: '#ffffff',
          sb_secondary_base: '#000000',
          sb_base_color: '#545557',
          display_item_mode: 'block',
          booking_nav_bg_color: '#000000',
          sb_review_image: '115',
          sb_review_image_preview:
            '/uploads/lucyhallmassage/image_files/preview/4ecc8dab4516d05ab44aa11a3cfd7405.jpg',
          dark_font_color: '#000000',
          btn_color_1: '#2cd12c',
          sb_company_label_color: '#000000',
          hide_img_mode: '0',
          show_sidebar: '1',
          sb_busy: '#db1f4b',
          sb_available: '#2cd12c',
        },
        timeline: 'modern_week',
        datepicker: 'top_calendar',
        is_rtl: false,
        app_config: {
          clear_session: 0,
          allow_switch_to_ada: 0,
          predefined: { service: serviceId },
        },
        container_id: containerId,
      });
    };
    document.head.appendChild(script);
    return () => {
      // The remove can fail silently if React strict-mode unmounts it
      try {
        document.head.removeChild(script);
      } catch {
        /* noop */
      }
    };
  }, [serviceId, containerId]);

  return <div id={containerId} ref={ref} />;
}

/* ─────────────────────────────────────────────────────────────
   Main page component
   ───────────────────────────────────────────────────────────── */
export default function SportsTherapyClient() {
  return (
    <>
      <Nav solid />

      <main style={{ background: '#000000', color: '#ffffff' }}>
        {/* HERO — shorter than V2 (50vh) so carousel sits closer */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            height: '50vh',
            minHeight: 360,
            overflow: 'hidden',
            background: '#1a1a1a',
          }}
        >
          <Image
            src="/sports-therapy-mobile.jpg"
            alt="Sports Therapy — Lucy Hall Massage"
            fill
            sizes="(max-width: 1024px) 100vw, 0px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="st-hero-mobile"
          />
          <Image
            src="/sports-therapy-desktop.jpg"
            alt="Sports Therapy — Lucy Hall Massage"
            fill
            sizes="(min-width: 1025px) 100vw, 0px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="st-hero-desktop"
          />

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
              padding: '0 32px 48px',
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                margin: '0 0 12px',
                color: '#ffffff',
              }}
            >
              Sports Therapy
            </h1>
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)',
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

        {/* CAROUSEL — sits flush against hero */}
        <DurationCarousel />

        {/* 4 ANCHOR SECTIONS */}
        {DURATIONS.map((d) => (
          <section
            key={d.id}
            id={d.id}
            style={{
              padding: '64px 24px 80px',
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
                  margin: '0 0 24px',
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
                  marginBottom: 40,
                  color: '#ffffff',
                  opacity: 0.95,
                }}
              >
                {d.copy}
              </p>

              {/* SimplyBook widget container */}
              <div
                style={{
                  marginTop: 32,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#1a1a1a',
                  minHeight: 600,
                }}
              >
                <SimplyBookWidget
                  serviceId={d.serviceId}
                  containerId={`sbw_st_${d.id}`}
                />
              </div>
            </div>
          </section>
        ))}

        <Footer />
      </main>

      <style>{`
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
            padding: 80px 40px 100px !important;
          }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DurationCarousel — same scroll-driven horizontal pan as V2,
   but with unique images per slide. Section height tuned down
   from 180vh → 140vh so the carousel finishes faster.
   ───────────────────────────────────────────────────────────── */
function DurationCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) return;

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
      const progress = passed / total;

      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxShift = Math.max(0, trackWidth - viewportWidth);
      target = progress * maxShift;

      const idx = Math.min(
        DURATIONS.length - 1,
        Math.max(0, Math.round(progress * (DURATIONS.length - 1)))
      );
      setActiveIndex(idx);
    };

    const tick = () => {
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
        height: '140vh',
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: 'sticky',
          top: 10,
          height: '75vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          marginTop: 10,
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
                  height: '65vh',
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
                    src={d.image}
                    alt={`Sports Therapy ${d.fullLabel}`}
                    fill
                    sizes="(max-width: 768px) 75vw, 460px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

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
