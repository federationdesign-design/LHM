'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../../Nav';
import Footer from '../../Footer';
import styles from '../../page.module.css';

declare global {
  interface Window {
    SimplybookWidget?: new (config: Record<string, unknown>) => void;
  }
}

type Duration = {
  id: string;
  label: string;
  fullLabel: string;
  serviceId: string;
  image: string;
  copy: string;
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
      try { document.head.removeChild(script); } catch { /* noop */ }
    };
  }, [serviceId, containerId]);

  return <div id={containerId} ref={ref} />;
}

export default function SportsTherapyClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  // Drive the hero scroll-overlay fade based on scroll progress.
  // Mirrors the pattern from PrivateHomeClient/TreatmentsIndexClient
  // so we get the same "fade-as-you-scroll" feel.
  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current;
      const overlay = scrollOverlayRef.current;
      if (!hero || !overlay) return;
      const heroH = hero.offsetHeight;
      const scrolled = Math.max(0, Math.min(heroH, window.scrollY));
      const opacity = scrolled / heroH;
      overlay.style.opacity = String(opacity);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Nav uses scrollRef for transparent-on-hero, solid-on-scroll behaviour */}
      <Nav scrollRef={heroRef} />

      <main style={{ background: '#000000', color: '#ffffff' }}>
        {/* HERO — sticky so it pins when H1 reaches nav, then unpins after carousel */}
        <div
          ref={heroRef}
          className={styles.hero}
          style={{
            position: 'sticky',
            top: 'calc(-100vh + 280px)',
            height: '100vh',
            minHeight: '100vh',
            backgroundColor: '#1a1a1a',
            zIndex: 5,
          }}
        >
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />

          {/* Mobile hero */}
          <span className="st-hero-img-mobile" style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/sports-therapy-mobile.jpg"
              alt="Sports Therapy"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
            />
          </span>

          {/* Desktop hero */}
          <span className="st-hero-img-desktop" style={{ position: 'absolute', inset: 0, display: 'none' }}>
            <Image
              src="/sports-therapy-desktop.jpg"
              alt="Sports Therapy"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
            />
          </span>

          <div className={styles.heroContent} style={{ zIndex: 10 }}>
            <h1 className={styles.heroH1}>Sports Therapy</h1>
            <p className={styles.heroSub}>Choose your duration</p>
          </div>
        </div>

        {/* CAROUSEL */}
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
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                margin: '0 0 24px',
                color: '#ffffff',
              }}>
                {d.fullLabel}
              </h2>
              <p style={{
                fontSize: '1.05rem',
                fontWeight: 300,
                lineHeight: 1.75,
                marginBottom: 40,
                color: '#ffffff',
                opacity: 0.95,
              }}>
                {d.copy}
              </p>
              <div style={{
                marginTop: 32,
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4,
                overflow: 'hidden',
                background: '#1a1a1a',
                minHeight: 600,
              }}>
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
        .st-hero-img-desktop { display: none; }
        @media (min-width: 1025px) {
          .st-hero-img-mobile { display: none !important; }
          .st-hero-img-desktop { display: block !important; }
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
   DurationCarousel V5
   - Section run-up extended 120vh → 250vh (more scroll = more
     resistance, slower pan)
   - LERP factor 0.15 → 0.06 (heavier feel as you scroll)
   ───────────────────────────────────────────────────────────── */
function DurationCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const totalSlides = 1 + DURATIONS.length;

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
        totalSlides - 1,
        Math.max(0, Math.round(progress * (totalSlides - 1)))
      );
      setActiveIndex(idx);
    };

    const tick = () => {
      // Slowed LERP — gives a heavy/resistant feel as scroll happens
      current += (target - current) * 0.06;
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
  }, [totalSlides]);

  return (
    <section
      ref={sectionRef}
      className="dc-section"
      style={{
        position: 'relative',
        height: '250vh',
        zIndex: 1,
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: 'sticky',
          top: 280,
          height: 'calc(100vh - 280px)',
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: 20,
          overflow: 'hidden',
        }}
      >
        <div
          ref={trackRef}
          className="dc-track"
          style={{
            display: 'flex',
            gap: 24,
            paddingLeft: '6vw',
            paddingRight: '12vw',
            willChange: 'transform',
            transition: 'transform 0.05s linear',
          }}
        >
          {/* TITLE CARD */}
          <div
            className="dc-card dc-titlecard"
            style={{
              flex: '0 0 auto',
              width: 'min(75vw, 460px)',
              height: '70vh',
              position: 'relative',
              overflow: 'hidden',
              background: '#000000',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '64px 48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p style={{
              fontSize: '0.72rem',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#ffffff',
              marginBottom: 24,
              opacity: 0.5,
            }}>
              <a href="/treatments" style={{ color: '#ffffff', textDecoration: 'none' }}>Treatments</a> / Sports Therapy
            </p>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: '0 0 32px',
            }}>
              Sports Therapy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DURATIONS.map((d) => (
                <a
                  key={d.id}
                  href={`#${d.id}`}
                  className="dc-menu-item"
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 300,
                    color: '#ffffff',
                    lineHeight: 1.4,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    opacity: 0.85,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <span style={{ display: 'inline-flex', opacity: 0, transition: 'opacity 0.2s ease' }} className="dc-menu-arrow">
                    →
                  </span>
                  {d.fullLabel}
                </a>
              ))}
            </div>
            <div style={{
              marginTop: 36,
              height: 1,
              width: 48,
              background: 'rgba(255,255,255,0.2)',
            }} />
            <p style={{
              fontSize: '0.68rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              marginTop: 18,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>
              Scroll to explore →
            </p>
          </div>

          {/* DURATION CARDS */}
          {DURATIONS.map((d, i) => {
            const slideIndex = i + 1;
            const isHovered = hoverIndex === slideIndex;
            const isActive = activeIndex === slideIndex;
            const grayscale = 100;
            const brightness = 0.65;

            return (
              <Link
                key={d.id}
                href={`#${d.id}`}
                className="dc-card"
                style={{
                  flex: '0 0 auto',
                  width: 'min(75vw, 460px)',
                  height: 'calc(100vh - 320px)',
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: '#0a0908',
                  transition: 'transform 0.3s ease',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  transition: 'filter 0.4s ease',
                  filter: `brightness(${brightness}) grayscale(${grayscale}%)`,
                }}>
                  <Image
                    src={d.image}
                    alt={`Sports Therapy ${d.fullLabel}`}
                    fill
                    sizes="(max-width: 768px) 75vw, 460px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 65%, transparent 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px 28px',
                  color: '#ffffff',
                }}>
                  <h3 style={{
                    fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                    fontWeight: 600,
                    lineHeight: 1.05,
                    margin: '0 0 8px',
                  }}>
                    {d.label}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    margin: 0,
                    opacity: 0.85,
                  }}>
                    Book Now &raquo;
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .dc-menu-item:hover {
          opacity: 1 !important;
        }
        .dc-menu-item:hover .dc-menu-arrow {
          opacity: 1 !important;
        }
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
          .dc-titlecard {
            padding: 48px 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
