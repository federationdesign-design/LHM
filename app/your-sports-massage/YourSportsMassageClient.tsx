'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import Nav from '../Nav';
import Footer from '../Footer';
import Testimonials from '../components/Testimonials/Testimonials';

const therapiesList = [
  { label: '30 minutes', href: '#', slideIndex: 1 },
  { label: '60 minutes', href: '#', slideIndex: 2 },
  { label: '90 minutes', href: '#', slideIndex: 3 },
  { label: '120 minutes', href: '#', slideIndex: 4 },
];

const slides = [
  { type: 'intro' as const, slug: 'intro', title: null, tagline: null, image: null, color: '#000000', cta: null, ctaHref: null },
  {
    type: 'treatment' as const, slug: '30-min-massage', title: '30 minutes',
    tagline: "A focused session on one trouble area. Ideal if you have got a single tight spot — neck, shoulders, lower back — that needs attention before a busy week. Quick to fit in over a lunch break and you will leave noticeably looser.",
    image: '/hero.jpg', color: '#4e3225', cta: 'Book Now', ctaHref: '/treatments/30-min-massage',
  },
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
                          onClick={() => scrollToSlide(item.slideIndex)}
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
                    <div style={{ position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', fontSize: '0.65rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
                      {String(i).padStart(2, '0')} / {String(slides.length - 1).padStart(2, '0')}
                    </div>
                    <div style={{ position: 'absolute', bottom: 240, left: 0, right: 0, padding: '0 90px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <a href={slide.ctaHref!} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2 style={{ fontSize: 'clamp(1.4rem, 2vw, 2.1rem)', fontWeight: 600, color: '#ffffff', marginBottom: 14, lineHeight: 1.15 }}>{slide.title}</h2>
                      </a>
                      <div style={{ height: 160, display: 'flex', alignItems: 'flex-start', marginBottom: 28 }}>
                        <p style={{ fontSize: '0.94rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.4, opacity: 0.85, ...lineClamp(6) }}>{slide.tagline}</p>
                      </div>
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

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    setIndex(clamped);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
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
    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [index, goTo]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', height: 'calc(67vh - 56px)', overflow: 'hidden', background: '#000000' }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          height: '100%',
          width: `${slides.length * 100}vw`,
          transform: `translateX(-${index * 100}vw)`,
          transition: 'transform 0.4s ease',
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
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
                      onClick={() => goTo(item.slideIndex)}
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
                <div style={{ position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', fontSize: '0.65rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)' }}>
                  {String(i).padStart(2, '0')} / {String(slides.length - 1).padStart(2, '0')}
                </div>
                <div style={{ position: 'absolute', bottom: 110, left: 0, right: 0, padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <a href={slide.ctaHref!} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#ffffff', marginBottom: 14, lineHeight: 1.15 }}>{slide.title}</h2>
                  </a>
                  <p style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.45, opacity: 0.9, marginBottom: 22, maxWidth: 420, ...lineClamp(5) }}>{slide.tagline}</p>
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
        {slides.map((_, i) => (
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

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage', href: 'https://booking.page/en/company/page/lucyhallmassage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor', href: 'https://www.tripadvisor.co.uk/Attraction_Review-g186225-d19454707-Reviews-Lucy_Hall_Massage-Cambridge_Cambridgeshire_England.html' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me', href: 'https://lucyhallmassage.simplybook.it/v2/' },
  { src: '/linked_in.png', alt: 'LinkedIn', href: 'https://www.linkedin.com/in/lucy-hall-massage-47369141/' },
  { src: '/where-logo.png', alt: 'Wheree', href: 'https://lucy-hall-massage-therapy.wheree.com' },
];

function LogoSliderWithHeading() {
  const total = logos.length;
  const extended = [logos[total - 1], ...logos, logos[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index === 0) { setAnimate(false); setIndex(total); }
    else if (index === total + 1) { setAnimate(false); setIndex(1); }
  };

  return (
    <div style={{ paddingTop: 40 }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff', textAlign: 'center', marginBottom: 24, opacity: 0.7 }}>
        Find us on:
      </h3>
      <div className={styles.logoSlider}>
        <div
          className={animate ? styles.logoTrack : styles.logoTrackNoAnim}
          style={{ transform: `translateX(${25 - index * 50}%)` }}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={e => { startX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { const dx = startX.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 30) go(index + (dx > 0 ? 1 : -1)); }}
        >
          {extended.map((logo, i) => (
            <div key={i} className={styles.logoSlide}>
              <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.alt}>
                <img src={logo.src} alt={logo.alt} className={styles.logoImg} draggable={false} />
              </a>
            </div>
          ))}
        </div>
        <div className={styles.logoRow}>
          {logos.map((logo) => (
            <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.alt}>
              <img src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function YourSportsMassageClient() {
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

          <span className="ysm-hero-img-mobile" style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/sports-therapy-mobile.jpg"
              alt="Your Sports Massage"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
            />
          </span>

          <span className="ysm-hero-img-desktop" style={{ position: 'absolute', inset: 0, display: 'none' }}>
            <Image
              src="/sports-therapy-desktop.jpg"
              alt="Your Sports Massage"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
            />
          </span>

          <div className={styles.heroContent} style={{ zIndex: 10 }}>
            <h1 className={styles.heroH1}>Your Sports Massage</h1>
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
        {/* Why you need this — pulled from sports-massage service data */}
        <section className={styles.serviceSection}>
          <h2 className={styles.testimonialsHeading} style={{ marginBottom: 20 }}>Why you need this</h2>
          <p style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.5, textAlign: 'center', maxWidth: 860, margin: '0 auto 48px', display: 'block' }}>
            Sports massage is a targeted treatment designed for active individuals, combining deep tissue techniques with stretching to prevent injury, aid recovery and improve performance. Whether you are training regularly or recovering from an event, sports massage keeps your body functioning at its best.
          </p>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className={styles.serviceGrid}>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.04em', color: '#ffffff', marginBottom: 20, lineHeight: 1.3 }}>
                  Benefits of this treatment on your body:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8 }}>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Speeds up muscle recovery after exercise</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Reduces risk of sports injuries</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Improves flexibility and range of motion</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Breaks down lactic acid build-up</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Enhances athletic performance</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Treats specific areas of overuse</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.04em', color: '#ffffff', marginBottom: 20, lineHeight: 1.3 }}>
                  We recommend this treatment for:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8 }}>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Regular gym-goers and athletes</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Runners, cyclists and swimmers</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>People recovering from a sports injury</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Those with tight or overworked muscles</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>Anyone training for an event</li>
                  <li style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>People with recurring muscle problems</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Testimonials heading="Happy private clients include" />
        <LogoSliderWithHeading />
        <Footer />
      </main>

      <style>{`
        .ysm-hero-img-desktop { display: none; }
        @media (min-width: 1025px) {
          .ysm-hero-img-mobile { display: none !important; }
          .ysm-hero-img-desktop { display: block !important; }
        }
      `}</style>
    </>
  );
}
