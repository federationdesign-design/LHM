'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const services = [
  { slug: 'deep-tissue-massage', title: 'Deep Tissue Massage', image: '/deep-tissue-img.jpg', href: '/deep-tissue-massage', cta: 'Book Treatment' },
  { slug: 'swedish-massage', title: 'Swedish Massage', image: '/swedish-mobile.jpg', href: '/swedish-massage', cta: 'Book Treatment' },
  { slug: 'sports-massage', title: 'Sports Massage', image: '/sports-mobile.jpg', href: '/sports-massage', cta: 'Book Treatment' },
  { slug: 'relaxation-massage', title: 'Relaxation Massage', image: '/relaxation-mobile.jpg', href: '/relaxation-massage', cta: 'Book Treatment' },
  { slug: 'pregnancy-massage', title: 'Pregnancy Massage', image: '/Pregnancy-mobile.jpg', href: '/pregnancy-massage', cta: 'Book Treatment' },
  { slug: 'hopi-ear', title: 'Hopi Ear & Back Massage', image: '/hopi-mobile.jpg', href: '/hopi-ear', cta: 'Book Treatment' },
  { slug: 'physiotherapy-treatment', title: 'Physiotherapy', image: '/Physiotherapy-mobile.jpg', href: '/physiotherapy-treatment', cta: 'Book Treatment' },
  { slug: 'indian-head-massage', title: 'Indian Head Massage', image: '/Indian-Head-mobile.jpg', href: '/indian-head-massage', cta: 'Book Treatment' },
  { slug: 'hot-stone-massage', title: 'Hot Stone Massage', image: '/Hot-Stone-mobile.jpg', href: '/hot-stone-massage', cta: 'Book Treatment' },
  { slug: 'cupping', title: 'Cupping Therapy', image: '/cupping-mobile.jpg', href: '/cupping', cta: 'Book Treatment' },
  { slug: 'locations', title: 'Our Locations', image: '/main-team-hero-img.jpg', href: '/locations', cta: 'View Locations' },
  { slug: 'gift-vouchers', title: 'Gift Vouchers', image: '/gift-voucher-hero.jpg', href: '/gift-vouchers', cta: 'Buy a Voucher' },
  { slug: 'contact', title: 'Get in Touch', image: '/get-in-touch-img.jpg', href: '/contact', cta: 'Contact Us' },
  // FIX: claiming-receipts.jpg as the proper image for the Receipts card
  { slug: 'receipts', title: 'Claiming Receipts', image: '/claiming-receipts.jpg', href: '/receipts', cta: 'Learn More' },
];

const locations = [
  { slug: 'thoday-street', name: 'Thoday Street', address: '2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU', lat: 52.19850, lng: 0.13580 },
  { slug: 'cromwell-road', name: 'Cromwell Road', address: '96 Cromwell Road, Cambridge, CB1 3EG', lat: 52.19480, lng: 0.13920 },
];

const promoCards = [
  {
    slug: 'sport-impact',
    image: '/Get-tips-img.jpg',
    title: 'Get tips and learn about the Impact of Sport on Your Body',
    cta: 'Start Your Journey',
    href: '/start-your-journey',
  },
  {
    slug: 'tips-download',
    image: '/blog/10-ways-to-practice-self-care.jpg',
    title: 'Download our 5 tips to a healthy body',
    cta: 'Download Our Guide',
    href: '/tips-download',
  },
  {
    slug: 'news-articles',
    image: '/blog/the-physical-impact-of-sport-on-your-body.jpg',
    title: 'Read our news articles about wellness and wellbeing',
    cta: 'Read Our Articles',
    href: '/news',
  },
];

const testimonials = [
  { name: 'Sarah Cater', title: 'Fantastic Swedish massage with Antonia', body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date: '30/03/2026', avatar: 'S' },
  { name: 'Suleyman Adanir', title: 'Swedish massage with Antonia', body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date: '04/02/2026', avatar: 'S' },
  { name: 'Alice W', title: 'Orla is brilliant', body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date: '10/12/2025', avatar: 'A' },
];

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me' },
  { src: '/linked_in.png', alt: 'LinkedIn' },
  { src: '/where-logo.png', alt: 'Wheree' },
];

function mapboxStaticUrl(lat: number, lng: number, width = 800, height = 600): string {
  const pin = `pin-s+ffffff(${lng},${lat})`;
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${pin}/${lng},${lat},15.5,0/${width}x${height}@2x?access_token=${MAPBOX_TOKEN}`;
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function NavDot({ active, onClick, label }: { active: boolean; onClick: (e: React.MouseEvent) => void; label: string }) {
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

function CardContent({ label, title, description, cta }: { label: string; title: string; description?: string; cta: string }) {
  return (
    <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.7, marginBottom: 6 }}>
        {label}
      </p>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginBottom: description ? 10 : 14, lineHeight: 1.15 }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: '0.85rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5, marginBottom: 14 }}>
          {description}
        </p>
      )}
      <div style={{ height: 1, background: '#ffffff', marginBottom: 14 }} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff' }}>
        {cta}
        <Arrow />
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PromoCards
   - Mobile: title 2rem (~2x larger than before), 56px bottom padding
   - Desktop: title clamp(1.5rem, 1.8vw, 1.8rem) (3pts larger), 56px bottom padding
   ───────────────────────────────────────────────────────────── */
function PromoCards() {
  const [index, setIndex] = useState(0);
  const startX = useRef(0);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(promoCards.length - 1, i)));
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(index + (dx > 0 ? 1 : -1));
  };

  const renderCard = (card: typeof promoCards[number]) => (
    <a
      href={card.href}
      className="hp-promo-card-link"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid #ffffff',
        background: '#000000',
        height: '100%',
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#1a1a1a' }}>
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 1023px) 100vw, 33vw"
          className="hp-promo-card-img"
          style={{ objectFit: 'cover', transition: 'filter 0.3s ease' }}
        />
      </div>

      {/* Title and CTA inside padded area.
          Mobile: 2rem title, 56px bottom padding for breathing space.
          Desktop: clamp scales 1.5rem → 1.8rem (was max 1.4rem - 3pt larger). */}
      <div style={{ padding: '32px 28px 56px', display: 'flex', flexDirection: 'column', minHeight: 200 }}>
        <h3 className="hp-promo-card-title" style={{
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3,
          marginBottom: 28,
          flexGrow: 1,
        }}>
          {card.title}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.85rem',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#ffffff',
            textDecoration: 'underline',
            textUnderlineOffset: '6px',
          }}>
            {card.cta}
            <Arrow />
          </span>
        </div>
      </div>
    </a>
  );

  return (
    <section style={{ padding: '20px 0 30px', background: '#000000' }}>

      <div className="hp-promo-mobile" style={{ width: '100%', padding: '0 24px', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            width: `${promoCards.length * 100}%`,
            transform: `translateX(-${index * (100 / promoCards.length)}%)`,
            transition: 'transform 0.4s ease',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {promoCards.map((card) => (
            <div key={card.slug} style={{ width: `${100 / promoCards.length}%`, flexShrink: 0, padding: '0', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative' }}>
                {renderCard(card)}
                <div style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10, pointerEvents: 'none' }}>
                  {promoCards.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
                      aria-label={`Go to promo ${i + 1}`}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        background: i === index ? '#ffffff' : 'transparent',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'background 0.25s ease',
                        pointerEvents: 'auto',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="hp-promo-desktop" style={{ display: 'none' }}>
        <div className="hp-grid-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {promoCards.map((card) => (
              <div key={card.slug}>
                {renderCard(card)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hp-promo-mobile { display: none !important; }
          .hp-promo-desktop { display: block !important; }
        }
        .hp-promo-card-link:hover .hp-promo-card-img { filter: brightness(0.7); }

        /* Promo card title sizing.
           Mobile (<1024px): 2rem — roughly 2x the previous ~1.1rem.
           Desktop (>=1024px): clamp from 1.5rem to 1.8rem on ultra-wide
           — 3pts larger than the previous max of 1.4rem. */
        .hp-promo-card-title {
          font-size: 2rem;
        }
        @media (min-width: 1024px) {
          .hp-promo-card-title {
            font-size: clamp(1.5rem, 1.8vw, 1.8rem);
          }
        }
      `}</style>
    </section>
  );
}

function ServicesCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (window.innerWidth >= 1024) return;
        const sectionTop = section.offsetTop;
        const scrollY = window.scrollY;
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const p = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollable));
        const totalShift = (services.length - 1) * 100;
        const shift = p * totalShift;
        track.style.transform = `translateX(-${shift}vw)`;
        const idx = Math.min(services.length - 1, Math.round(p * (services.length - 1)));
        setActiveIndex(idx);
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

  const scrollToSlide = useCallback((targetIndex: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.offsetTop;
    const scrollable = section.offsetHeight - window.innerHeight;
    const t = targetIndex / (services.length - 1);
    window.scrollTo({ top: sectionTop + t * scrollable, behavior: 'smooth' });
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="hp-services-mobile"
        style={{
          height: `${services.length * 100}vh`,
          background: '#000000',
          position: 'relative',
        }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Tightened top padding so the gap above the heading is reduced */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 16px', flexShrink: 0 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', textAlign: 'center', margin: 0 }}>Services</h2>
          </div>

          <div
            ref={trackRef}
            style={{
              display: 'flex',
              willChange: 'transform',
              height: 'calc(100vh - 90px)',
            }}
          >
            {services.map((s) => (
              <div key={s.slug} style={{ width: '100vw', flexShrink: 0, padding: '0 12px 40px', boxSizing: 'border-box', display: 'flex' }}>
                <a href={s.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1a1a1a' }}>
                    <Image src={s.image} alt={s.title} fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
                    <CardContent label="Treatment:" title={s.title} cta={s.cta} />
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10 }}>
            {services.map((_, i) => (
              <NavDot
                key={i}
                active={i === activeIndex}
                onClick={() => scrollToSlide(i)}
                label={`Go to service ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop — top padding tightened from 60px to 30px to close the gap */}
      <section className="hp-services-desktop" style={{ display: 'none', padding: '30px 0 80px', background: '#000000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', textAlign: 'center', margin: 0 }}>Services</h2>
        </div>

        <div className="hp-grid-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {services.map((s) => (
              <a
                key={s.slug}
                href={s.href}
                className="hp-service-card"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.3s ease' }}
              >
                <div className="hp-service-card-image" style={{ position: 'relative', width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', background: '#1a1a1a', transition: 'filter 0.3s ease' }}>
                  <Image src={s.image} alt={s.title} fill sizes="(max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
                  <CardContent label="Treatment:" title={s.title} cta={s.cta} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 1024px) {
          .hp-services-mobile { display: none !important; }
          .hp-services-desktop { display: block !important; }
          .hp-view-all-services { display: none !important; }
          .hp-locations-mobile { display: none !important; }
          .hp-locations-desktop { display: block !important; }
        }
        .hp-service-card:hover .hp-service-card-image { filter: brightness(0.7); }
        .hp-service-card:hover { transform: translateY(-4px); }
        .hp-hero-cta:hover { text-decoration: underline; }
        .hp-cta-btn:hover { text-decoration: underline; }

        .hp-grid-wrap {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 60px;
        }
        @media (min-width: 1450px) {
          .hp-grid-wrap {
            max-width: none;
            padding: 0 80px;
          }
        }
      `}</style>
    </>
  );
}

function LocationsCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (window.innerWidth >= 1024) return;
        const sectionTop = section.offsetTop;
        const scrollY = window.scrollY;
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const p = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollable));
        const totalShift = (locations.length - 1) * 100;
        const shift = p * totalShift;
        track.style.transform = `translateX(-${shift}vw)`;
        const idx = Math.min(locations.length - 1, Math.round(p * (locations.length - 1)));
        setActiveIndex(idx);
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

  const scrollToSlide = useCallback((targetIndex: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.offsetTop;
    const scrollable = section.offsetHeight - window.innerHeight;
    const t = targetIndex / (locations.length - 1);
    window.scrollTo({ top: sectionTop + t * scrollable, behavior: 'smooth' });
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="hp-locations-mobile"
        style={{
          height: `${locations.length * 100}vh`,
          background: '#000000',
          position: 'relative',
        }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 16px', flexShrink: 0 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', textAlign: 'center', margin: 0 }}>Locations</h2>
          </div>

          <div
            ref={trackRef}
            style={{
              display: 'flex',
              willChange: 'transform',
              height: 'calc(100vh - 110px)',
            }}
          >
            {locations.map((loc) => (
              <div key={loc.slug} style={{ width: '100vw', flexShrink: 0, padding: '0 12px 40px', boxSizing: 'border-box', display: 'flex' }}>
                <a href={`/locations/${loc.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1a1a1a' }}>
                    <img
                      src={mapboxStaticUrl(loc.lat, loc.lng, 600, 750)}
                      alt={`Map of ${loc.name}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      draggable={false}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
                    <CardContent label="Location:" title={loc.name} description={loc.address} cta="Book Location" />
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', top: 125, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10 }}>
            {locations.map((_, i) => (
              <NavDot
                key={i}
                active={i === activeIndex}
                onClick={() => scrollToSlide(i)}
                label={`Go to location ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="hp-locations-desktop" style={{ display: 'none', padding: '60px 0 80px', background: '#000000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', textAlign: 'center', margin: 0 }}>Locations</h2>
        </div>

        <div className="hp-grid-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            {locations.map((loc) => (
              <a
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="hp-location-card"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.3s ease' }}
              >
                <div className="hp-location-card-image" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', overflow: 'hidden', background: '#1a1a1a', transition: 'filter 0.3s ease' }}>
                  <img
                    src={mapboxStaticUrl(loc.lat, loc.lng, 800, 550)}
                    alt={`Map of ${loc.name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    draggable={false}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
                  <CardContent label="Location:" title={loc.name} description={loc.address} cta="Book Location" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hp-location-card:hover .hp-location-card-image { filter: brightness(0.7); }
        .hp-location-card:hover { transform: translateY(-4px); }
      `}</style>
    </>
  );
}

function Testimonials() {
  const total = testimonials.length;
  const extended = [testimonials[total - 1], ...testimonials, testimonials[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index === 0) { setAnimate(false); setIndex(total); }
    else if (index === total + 1) { setAnimate(false); setIndex(1); }
  };
  const realIndex = index === 0 ? total - 1 : index === total + 1 ? 0 : index - 1;

  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.testimonialsHeading}>Happy private<br />clients include</h2>
      <div
        className={animate ? styles.testimonialsTrack : styles.testimonialsTrackNoAnim}
        style={{ transform: `translateX(calc(-${index * 100}%))` }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const dx = startX.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 40) go(index + (dx > 0 ? 1 : -1)); }}
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
          <button key={i} onClick={() => go(i + 1)} className={`${styles.dot} ${i === realIndex ? styles.dotActive : ''}`} />
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
  );
}

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
              <img src={logo.src} alt={logo.alt} className={styles.logoImg} draggable={false} />
            </div>
          ))}
        </div>
        <div className={styles.logoRow}>
          {logos.map((logo) => (
            <img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const heroRef = useRef<HTMLDivElement>(null);
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'MassageTherapist',
              '@id': 'https://www.lucyhallmassage.com/#business',
              name: 'Lucy Hall Massage Therapy',
              url: 'https://www.lucyhallmassage.com',
              telephone: '+447765555078',
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '168', bestRating: '5' },
              address: {
                '@type': 'PostalAddress',
                streetAddress: '2 Antwerp Cottages, Thoday Street',
                addressLocality: 'Cambridge',
                addressRegion: 'Cambridgeshire',
                postalCode: 'CB1 3AU',
                addressCountry: 'GB',
              },
              geo: { '@type': 'GeoCoordinates', latitude: 52.1951, longitude: 0.1313 },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '09:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '09:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '17:30' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '17:00' },
              ],
              priceRange: '££',
              image: 'https://www.lucyhallmassage.com/deep-tissue-img.jpg',
              sameAs: ['https://www.tripadvisor.com', 'https://www.linkedin.com/company/lucy-hall-massage'],
            },
          ],
        }) }}
      />

      <Nav scrollRef={heroRef} />

      <main style={{ background: '#000000' }}>

        <div ref={heroRef} className={styles.hero} style={{ height: '100vh', minHeight: '100vh' }}>
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          <Image
            src="/deep-tissue-img.jpg"
            alt="Massage therapy"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }}
          />
          <div className={styles.heroContent}>
            <h1 className={styles.heroH1}>Need a massage now?</h1>
            <p className={styles.heroSub}>Book your appointment now, it only takes 2 minutes with our online booking tool</p>
            <hr className={styles.heroRule} />
            <a href="/treatments" className={`${styles.heroBookNow} hp-hero-cta`}>BOOK TREATMENT &gt;&gt;</a>
          </div>
        </div>

        <section style={{ padding: '80px 24px 30px', maxWidth: 1400, margin: '0 auto' }}>
          <p style={{
            fontSize: 'clamp(1.4rem, 1.7vw, 1.7rem)',
            color: '#ffffff',
            fontWeight: 600,
            lineHeight: 1.45,
            textAlign: 'center',
            maxWidth: 'min(1200px, 90vw)',
            margin: '0 auto 36px',
          }}>
            Our experienced team are specialised in physiotherapist and provide: Deep Tissue, Swedish massage and pregnancy massage.
          </p>

          <p style={{
            fontSize: 'clamp(1.15rem, 1.4vw, 1.4rem)',
            color: '#ffffff',
            fontWeight: 300,
            lineHeight: 1.55,
            textAlign: 'center',
            maxWidth: 'min(1200px, 90vw)',
            margin: '0 auto',
          }}>
            Whether you&rsquo;re recovering from an injury, managing ongoing tension, or simply in need of time to reset, our tailored treatments are designed around your body and your lifestyle. From deep tissue massage to pregnancy massage and physiotherapy, we help you move better, feel better, and get back to doing the things you love.
          </p>
        </section>

        <PromoCards />

        <ServicesCarousel />

        <div className="hp-view-all-services" style={{ padding: '40px 24px 80px', display: 'flex', justifyContent: 'center', background: '#000000' }}>
          <a
            href="/treatments"
            className="hp-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.78rem',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#ffffff',
              textDecoration: 'none',
              border: '1px solid #ffffff',
              padding: '13px 28px',
            }}
          >
            View All Services
            <Arrow />
          </a>
        </div>

        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        <LocationsCarousel />

        <div style={{ padding: '40px 24px 80px', display: 'flex', justifyContent: 'center', background: '#000000' }}>
          <a
            href="/locations"
            className="hp-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '0.78rem',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#ffffff',
              textDecoration: 'none',
              border: '1px solid #ffffff',
              padding: '13px 28px',
            }}
          >
            View All Locations
            <Arrow />
          </a>
        </div>

        <div className={styles.divider} />
        <Testimonials />
        <LogoSliderWithHeading />
        <Footer />
      </main>
    </>
  );
}
