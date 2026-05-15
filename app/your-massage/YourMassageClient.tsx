'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import Nav from '../Nav';
import Footer from '../Footer';
import Testimonials from '../components/Testimonials/Testimonials';
import FindUsOn from '@/app/components/FindUsOn';

const therapiesList = [
  { label: '60 minutes', href: '/treatments/60-min-massage', slideIndex: 1 },
  { label: '90 minutes', href: '/treatments/90-min-massage', slideIndex: 2 },
  { label: '120 minutes', href: '/treatments/120-min-massage', slideIndex: 3 },
];

const slides = [
  { type: 'intro' as const, slug: 'intro', title: null, tagline: null, image: null, color: '#000000', cta: null, ctaHref: null },
  {
    type: 'treatment' as const, slug: '60-min-massage', title: '60 minutes',
    tagline: 'Our most popular choice. Time enough to address two or three areas, balanced between treatment and relaxation. Suits anyone wanting solid pressure on problem spots without committing to a longer session.',
    image: '/swedish-mobile.jpg', color: '#cb8f77', cta: 'Book Now', ctaHref: '/treatments/60-min-massage',
  },
  {
    type: 'treatment' as const, slug: '90-min-massage', title: '90 minutes',
    tagline: "Deeper work with room to breathe. We can layer techniques, cover the full body, and still spend extra time on persistent issues. Good post-event, after a high-stress period, or when 60 minutes has not been quite enough.",
    image: '/sports-mobile.jpg', color: '#d09f7e', cta: 'Book Now', ctaHref: '/treatments/90-min-massage',
  },
  {
    type: 'treatment' as const, slug: '120-min-massage', title: '120 minutes',
    tagline: 'The full reset. Two hours gives space for complete head-to-toe coverage plus extended attention to long-standing tension. Best for chronic issues, recovery from heavy training blocks, or when you simply need the deepest work we offer.',
    image: '/relaxation-mobile.jpg', color: '#eab7a4', cta: 'Book Now', ctaHref: '/treatments/120-min-massage',
  },
];

const CARD_WIDTH_VW = 40;
const LERP_FACTOR = 0.05;

const BtnArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14, display: 'block' }}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const lineClamp = (lines: number): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

/* ─────────────────────────────────────────────────────────────
   Reusable nav-dot — same style as homepage carousels.
   15px diameter, 2px white border, transparent off-state.
   ───────────────────────────────────────────────────────────── */
function NavDot({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 15,
        height: 15,
        borderRadius: '50%',
        border: '2px solid #ffffff',
        background: active ? '#ffffff' : 'transparent',
        padding: 0,
        cursor: 'pointer',
        transition: 'background 0.25s ease',
      }}
    />
  );
}

/* Reusable chevron for the intro list — sized 8x14 with margin-top 2px
   to better align with text cap-height. Previously 7x14 / 8x16 depending
   on viewport — both sat slightly above the text optical centre. */
const ListChevron = ({ opacity = 0.5 }: { opacity?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28.622 59.257"
    style={{ width: 8, height: 14, opacity, flexShrink: 0, marginTop: 2 }}
    overflow="visible"
  >
    <g transform="translate(24.47 43.189) rotate(180)">
      <path d="M21.131,41.2.708,20.778,21.131.354" transform="translate(2.735 9.994)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </g>
  </svg>
);

function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

/* ═════════════════════════════════════════════════════════════
   DESKTOP — original scroll-driven horizontal pan
   ═════════════════════════════════════════════════════════════ */
function DesktopTreatments() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndexRef = useRef(0);

  const scrollToSlide = useCallback((index: number) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const cardPx = (CARD_WIDTH_VW / 100) * window.innerWidth;
    const totalWidth = track.scrollWidth - window.innerWidth;
    const targetT = Math.min((index * cardPx) / totalWidth, 1);
    const scrollable = section.offsetHeight - window.innerHeight;
    const targetScroll = section.offsetTop + targetT * scrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      currentXRef.current = lerp(currentXRef.current, targetXRef.current, LERP_FACTOR);
      if (track) track.style.transform = `translateX(-${currentXRef.current}px)`;
      const cardPx = (CARD_WIDTH_VW / 100) * window.innerWidth;
      const current = Math.min(Math.round(currentXRef.current / cardPx), slides.length - 1);
      if (current !== activeIndexRef.current) {
        activeIndexRef.current = current;
        setActiveIndex(current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    const handleScroll = () => {
      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollable));
      const totalWidth = track.scrollWidth - window.innerWidth;
      targetXRef.current = p * totalWidth;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `${slides.length * 75}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 280, height: '67vh', overflow: 'hidden' }}>

        {/* Bottom progress dots — homepage-style 15px circles, 2px border,
            transparent off-state. Replaces the previous 18px white pills. */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
          {slides.map((_, i) => (
            <NavDot
              key={i}
              active={i === activeIndex}
              onClick={() => scrollToSlide(i)}
              label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Horizontal card track */}
        <div ref={trackRef} style={{ display: 'flex', height: '100%', willChange: 'transform' }}>
          {slides.map((slide, i) => {
            const dist = Math.abs(i - activeIndex);
            const isHovered = hoverIndex === i;
            const brightness = isHovered ? 1 : dist === 0 ? 1 : dist === 1 ? 0.75 : 0.5;
            const grayscale = isHovered || dist === 0 ? 0 : 100;
            const imgScale = dist === 0 ? 1.03 : 1;

            return (
              <div
                key={slide.slug}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  flexShrink: 0,
                  width: `${CARD_WIDTH_VW}vw`,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRight: '5px solid #000000',
                  transition: 'filter 0.5s ease',
                  filter: `brightness(${brightness}) grayscale(${grayscale}%)`,
                }}
              >
                {slide.type === 'intro' ? (
                  <div style={{ position: 'absolute', inset: 0, background: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '72px 54px' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 24, opacity: 0.5 }}>
                      <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / All Treatments
                    </p>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 32 }}>All Treatments</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {therapiesList.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { window.location.href = item.href; }}
                          style={{ fontSize: '0.96rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.4, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 10, opacity: 0.85 }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; (e.currentTarget.querySelector('.li-arrow') as HTMLElement).style.opacity = '1'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; (e.currentTarget.querySelector('.li-arrow') as HTMLElement).style.opacity = '0'; }}
                        >
                          {/* Arrow uses ListChevron component for consistent sizing */}
                          <span className="li-arrow" style={{ opacity: 0, transition: 'opacity 0.2s ease', display: 'inline-flex' }}>
                            <ListChevron opacity={1} />
                          </span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 36, height: 1, width: 48, background: 'rgba(255,255,255,0.2)' }} />
                    <p style={{ fontSize: '0.68rem', fontWeight: 300, color: 'rgba(255,255,255,0.35)', marginTop: 18, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Scroll to explore →</p>
                  </div>
                ) : (
                  <>
                    {slide.image && (
                      <div style={{ position: 'absolute', inset: 0, transform: `scale(${imgScale})`, transition: 'transform 0.6s ease', transformOrigin: 'center center' }}>
                        <Image src={slide.image} alt={slide.title!} fill sizes="40vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority={i < 4} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: slide.image ? `${slide.color}44` : slide.color }} />
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 90px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
                      <a href={slide.ctaHref!} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2 style={{ fontSize: 'clamp(1.4rem, 2vw, 2.1rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.15, margin: 0 }}>{slide.title}</h2>
                      </a>
                      <p style={{ fontSize: '0.94rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.4, opacity: 0.85, margin: 0, ...lineClamp(6) }}>{slide.tagline}</p>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <a
                          href={slide.ctaHref!}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', textDecoration: 'none', border: '1px solid #ffffff', padding: '11px 22px' }}
                          onMouseEnter={e => { const a = e.currentTarget.querySelector('.ba') as HTMLElement; if (a) a.style.transform = 'translateX(4px)'; }}
                          onMouseLeave={e => { const a = e.currentTarget.querySelector('.ba') as HTMLElement; if (a) a.style.transform = 'translateX(0)'; }}
                        >
                          {slide.cta}
                          <span className="ba" style={{ display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s ease' }}>
                            <BtnArrow />
                          </span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   MOBILE — touch-swipe carousel + wheel/trackpad fallback
   ═════════════════════════════════════════════════════════════ */
function MobileTreatments() {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(false);
  // On mobile, only render the intro slide — duration menu links direct to /treatments/X-min-massage
  const mobileSlides = slides.filter(s => s.type === 'intro');

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(mobileSlides.length - 1, i));
    setIndex(clamped);
  }, []);

  const startY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(startX.current - e.touches[0].clientX);
    const dy = Math.abs(startY.current - e.touches[0].clientY);
    // If horizontal swipe is dominant, prevent vertical scroll
    if (dx > dy && dx > 10) {
      e.preventDefault();
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(index + (dx > 0 ? 1 : -1));
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 5) return;
      e.preventDefault();
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      setTimeout(() => { wheelLockRef.current = false; }, 500);
      goTo(index + (delta > 0 ? 1 : -1));
    };
    // Only attach wheel handler on non-touch devices
    if (!('ontouchstart' in window)) {
      wrapper.addEventListener('wheel', handleWheel, { passive: false });
      return () => wrapper.removeEventListener('wheel', handleWheel);
    }
  }, [index, goTo]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', height: '500px', overflow: 'hidden', background: '#000000', touchAction: 'pan-x' }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          height: '100%',
          width: `${mobileSlides.length * 100}vw`,
          transform: `translateX(-${index * 100}vw)`,
          transition: 'transform 0.4s ease',
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {mobileSlides.map((slide, i) => (
          <div
            key={slide.slug}
            style={{
              flexShrink: 0,
              width: '100vw',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {slide.type === 'intro' ? (
              <div style={{ position: 'absolute', inset: 0, background: '#000000', display: 'flex', flexDirection: 'column', padding: '40px 28px 60px', overflowY: 'auto' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 16, opacity: 0.5 }}>
                  <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / All Treatments
                </p>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 28 }}>All Treatments</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {therapiesList.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { window.location.href = item.href; }}
                      style={{
                        fontSize: '1rem',
                        fontWeight: 300,
                        color: '#ffffff',
                        lineHeight: 1.4,
                        background: 'none',
                        border: 'none',
                        padding: '4px 0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        opacity: 0.9,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      {/* Chevron uses ListChevron — consistent sizing across mobile and desktop */}
                      <ListChevron />
                      {item.label}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 28, height: 1, width: 48, background: 'rgba(255,255,255,0.2)' }} />
                <p style={{ fontSize: '0.68rem', fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginTop: 14, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Swipe to explore →</p>
              </div>
            ) : (
              <>
                {slide.image && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <Image src={slide.image} alt={slide.title!} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority={i < 3} />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: slide.image ? `${slide.color}44` : slide.color }} />
                <div style={{ position: 'absolute', inset: 0, padding: '60px 32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
                  <a href={slide.ctaHref!} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.15, margin: 0 }}>{slide.title}</h2>
                  </a>
                  <p style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.45, opacity: 0.9, maxWidth: 420, margin: 0, ...lineClamp(5) }}>{slide.tagline}</p>
                  <a
                    href={slide.ctaHref!}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', textDecoration: 'none', border: '1px solid #ffffff', padding: '11px 22px' }}
                  >
                    {slide.cta}
                    <BtnArrow />
                  </a>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom pagination dots — homepage-style 15px circles, 2px border,
          transparent off-state. Replaces the previous 16px white pills. */}
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        {mobileSlides.map((_, i) => (
          <NavDot
            key={i}
            active={i === index}
            onClick={() => goTo(i)}
            label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function YourMassageClient() {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

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
      <Nav scrollRef={heroRef} />
      <main style={{ background: '#000000' }}>
        <div
          ref={heroRef}
          className={`${styles.hero} ysm-hero-block`}
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

          <span className="ysm-hero-img-mobile" style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/sports-therapy-mobile.jpg"
              alt="Your Massage"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
            />
          </span>

          <span className="ysm-hero-img-desktop" style={{ position: 'absolute', inset: 0, display: 'none' }}>
            <Image
              src="/sports-therapy-desktop.jpg"
              alt="Your Massage"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
            />
          </span>

          <div className={styles.heroContent} style={{ zIndex: 10, paddingRight: 0, maxWidth: 'none' }}>
            <h1 className={styles.heroH1}>Your Massage</h1>
            <p className={styles.heroSub}>Choose your duration</p>
          </div>
        </div>

        {isMobile === null ? (
          <div style={{ height: '100vh' }} />
        ) : isMobile ? (
          <MobileTreatments />
        ) : (
          <DesktopTreatments />
        )}
        {/* Why you need this — Your Massage positioning */}
        <section className={styles.serviceSection}>
          <h2 className={styles.testimonialsHeading} style={{ marginBottom: 20 }}>Why you need this</h2>
          <p style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.5, textAlign: 'center', maxWidth: 860, margin: '0 auto 24px', display: 'block' }}>
            A general massage tailored to you. Perfect if you don&rsquo;t know what to book - a great starting point that lets your therapist focus on the areas that need most attention, whether that&rsquo;s shoulders, back, neck, feet, or anywhere else.
          </p>
          <p style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.55, textAlign: 'center', maxWidth: 860, margin: '0 auto 48px', display: 'block', opacity: 0.85 }}>
            This is a composite treatment drawing on techniques from our main massage styles. Especially suited to first-time clients, anyone uncertain whether sports massage is right for them, or those with multiple problem areas they&rsquo;d like addressed in one session.
          </p>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className={styles.serviceGrid}>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.04em', color: '#ffffff', marginBottom: 20, lineHeight: 1.3 }}>
                  Benefits of this treatment on your body:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8 }}>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Releases muscle tension across your problem areas</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Improves circulation and helps flush toxins</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Reduces day-to-day aches and stiffness</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Eases stress and helps you switch off</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Improves flexibility and range of movement</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Supports better posture and movement</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.04em', color: '#ffffff', marginBottom: 20, lineHeight: 1.3 }}>
                  We recommend this treatment for:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8 }}>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>First-time massage clients</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Anyone unsure which treatment to book</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>People with multiple problem areas to address</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Those with tension in shoulders, back, neck or feet</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Anyone wanting a tailored, all-purpose session</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>People looking for a regular maintenance massage</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Testimonials heading="Happy private clients include" />
        <FindUsOn />
        <Footer />
      </main>

      <style>{`
        .ysm-hero-img-desktop { display: none; }
        @media (min-width: 1025px) {
          .ysm-hero-img-mobile { display: none !important; }
          .ysm-hero-img-desktop { display: block !important; }
        }
        @media (max-width: 767px) {
          .ysm-hero-block {
            position: relative !important;
            top: 0 !important;
            height: 380px !important;
            min-height: 380px !important;
          }
        }
      `}</style>
    </>
  );
}
