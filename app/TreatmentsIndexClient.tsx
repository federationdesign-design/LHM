'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';

const therapiesList = [
  { label: 'Deep Tissue Massage', href: '/deep-tissue-massage', slideIndex: 1 },
  { label: 'Swedish Massage', href: '/swedish-massage', slideIndex: 2 },
  { label: 'Sports Massage', href: '/sports-massage', slideIndex: 3 },
  { label: 'Relaxation Massage', href: '/relaxation-massage', slideIndex: 4 },
  { label: 'Pregnancy Massage', href: '/pregnancy-massage', slideIndex: 5 },
  { label: 'Hopi Ear & Back Massage', href: '/hopi-ear', slideIndex: 6 },
  { label: 'Physiotherapy', href: '/physiotherapy-treatment', slideIndex: 7 },
  { label: 'Indian Head Massage', href: '/indian-head-massage', slideIndex: 8 },
  { label: 'Hot Stone Massage', href: '/hot-stone-massage', slideIndex: 9 },
  { label: 'Cupping', href: '/cupping', slideIndex: 10 },
  { label: 'Our Locations', href: '/locations', slideIndex: 11 },
  { label: 'Gift Vouchers', href: '/gift-vouchers', slideIndex: 12 },
  { label: 'Get in Touch', href: '/contact', slideIndex: 13 },
  { label: 'Claiming Receipts', href: '/contact', slideIndex: 14 },
];

const slides = [
  { type: 'intro' as const, slug: 'intro', title: null, tagline: null, image: null, color: '#000000', cta: null, ctaHref: null },
  {
    type: 'treatment' as const, slug: 'deep-tissue-massage', title: 'Deep Tissue Massage',
    tagline: 'Deep tissue massage targets the deeper layers of muscle and connective tissue, using slow, firm strokes to release chronic tension and knots. Unlike a relaxation massage, deep tissue work focuses on specific problem areas — helping to restore movement, reduce pain and improve posture over time.',
    image: '/hero.jpg', color: '#4e3225', cta: 'Book Now', ctaHref: '/deep-tissue-massage',
  },
  {
    type: 'treatment' as const, slug: 'swedish-massage', title: 'Swedish Massage',
    tagline: 'Swedish massage is a classic full-body treatment using long, flowing strokes, kneading and circular movements to promote deep relaxation. It improves circulation, eases muscle tension and leaves you feeling calm and restored.',
    image: '/swedish-mobile.jpg', color: '#cb8f77', cta: 'Book Now', ctaHref: '/swedish-massage',
  },
  {
    type: 'treatment' as const, slug: 'sports-massage', title: 'Sports Massage',
    tagline: 'Sports massage is a targeted treatment designed for active individuals, combining deep tissue techniques with stretching to prevent injury, aid recovery and improve performance. Whether you are training regularly or recovering from an event, sports massage keeps your body functioning at its best.',
    image: '/sports-mobile.jpg', color: '#d09f7e', cta: 'Book Now', ctaHref: '/sports-massage',
  },
  {
    type: 'treatment' as const, slug: 'relaxation-massage', title: 'Relaxation Massage',
    tagline: 'A relaxation massage uses light to medium pressure with long, slow strokes to calm the nervous system and ease both physical and mental tension. It is a deeply restorative treatment — the perfect way to step away from the demands of daily life.',
    image: '/relaxation-mobile.jpg', color: '#eab7a4', cta: 'Book Now', ctaHref: '/relaxation-massage',
  },
  {
    type: 'treatment' as const, slug: 'pregnancy-massage', title: 'Pregnancy Massage',
    tagline: 'Pregnancy massage is a specially adapted treatment designed to support the physical and emotional changes of pregnancy. Our therapists help relieve common discomforts including back pain, swelling and fatigue — providing both physical relief and a much-needed moment of calm.',
    image: '/Pregnancy-mobile.jpg', color: '#548661', cta: 'Book Now', ctaHref: '/pregnancy-massage',
  },
  {
    type: 'treatment' as const, slug: 'hopi-ear', title: 'Hopi Ear & Back Massage',
    tagline: 'A combined treatment pairing the traditional Hopi Ear ritual with a focused back massage. The gentle warmth of the hollow Hopi candle eases pressure around the ears and sinuses, while the back massage releases tension across the shoulders, neck and upper back.',
    image: '/hopi-mobile.jpg', color: '#d57640', cta: 'Book Now', ctaHref: '/hopi-ear',
  },
  {
    type: 'treatment' as const, slug: 'physiotherapy-treatment', title: 'Physiotherapy',
    tagline: 'Our physiotherapy service provides expert assessment and hands-on treatment for a wide range of musculoskeletal conditions. From acute injuries to chronic pain and postural problems, our qualified physiotherapists use evidence-based techniques to restore function and reduce pain.',
    image: '/Physiotherapy-mobile.jpg', color: '#b46a51', cta: 'Book Now', ctaHref: '/physiotherapy-treatment',
  },
  {
    type: 'treatment' as const, slug: 'indian-head-massage', title: 'Indian Head Massage',
    tagline: 'A traditional therapy focused on the head, scalp, neck and shoulders — the areas where most of us hold daily stress. Using a blend of firm and gentle techniques, the treatment eases muscular tension, calms a busy mind and leaves you feeling deeply restored.',
    image: '/Indian-Head-mobile.jpg', color: '#eab7a4', cta: 'Book Now', ctaHref: '/indian-head-massage',
  },
  {
    type: 'treatment' as const, slug: 'hot-stone-massage', title: 'Hot Stone Massage',
    tagline: 'Smooth, heated basalt stones placed on key points of the body and used as an extension of the therapist\'s hands. The penetrating warmth allows muscles to relax far more deeply than they would under hands alone — releasing tension that lighter treatments cannot reach.',
    image: '/Hot-Stone-mobile.jpg', color: '#d09f7e', cta: 'Book Now', ctaHref: '/hot-stone-massage',
  },
  {
    type: 'treatment' as const, slug: 'cupping', title: 'Cupping Therapy',
    tagline: 'A traditional therapy that uses gentle suction to lift the skin and underlying tissue. This reverse-pressure approach reaches layers of fascia and muscle that conventional massage struggles to access — releasing deep-seated tension and supporting natural recovery.',
    image: '/Cupping-mobile.jpg', color: '#cb8f77', cta: 'Book Now', ctaHref: '/cupping',
  },
  { type: 'treatment' as const, slug: 'locations', title: 'Our Locations', tagline: 'Two clinics in Cambridge — Thoday Street and Cromwell Road. All treatments available at both locations.', image: '/deep-tissue-img.jpg', color: '#28303a', cta: 'View Locations', ctaHref: '/locations' },
  { type: 'treatment' as const, slug: 'gift-vouchers', title: 'Gift Vouchers', tagline: 'Give the gift of relaxation — the perfect treat for someone special. Redeemable against any treatment at either clinic. Valid for 12 months.', image: '/gift-voucher-hero.jpg', color: '#3a3028', cta: 'Buy a Voucher', ctaHref: '/gift-vouchers' },
  { type: 'treatment' as const, slug: 'contact', title: 'Get in Touch', tagline: "Have a question? We're always happy to help. Get in touch with our team and we'll get back to you as soon as possible.", image: '/get-in-touch-img.jpg', color: '#2a2a2a', cta: 'Contact Us', ctaHref: '/contact' },
  { type: 'treatment' as const, slug: 'receipts', title: 'Claiming Receipts', tagline: 'Need a receipt for your treatment? We can provide one on request — useful if you are claiming through private health insurance or a corporate wellness scheme.', image: '/claiming-receipts.jpg', color: '#28303a', cta: 'Learn More', ctaHref: '/contact' },
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
    <div ref={sectionRef} style={{ height: `${slides.length * 110}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

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
                  filter: `brightness(${brightness})`,
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
                    {slide.image && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
                    )}
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
      style={{ position: 'relative', height: 'calc(100vh - 56px)', overflow: 'hidden', background: '#000000' }}
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
                {slide.image && (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
                )}
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

export default function TreatmentsIndexClient() {
  const isMobile = useIsMobile();

  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000' }}>
        {isMobile === null ? (
          <div style={{ height: '100vh' }} />
        ) : isMobile ? (
          <MobileTreatments />
        ) : (
          <DesktopTreatments />
        )}
        <Footer />
      </main>
    </>
  );
}
