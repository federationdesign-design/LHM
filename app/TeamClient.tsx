'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import type { TeamMember } from './data/team';


const testimonials = [
  { name: 'Sarah Cater', title: 'Fantastic Swedish massage with Antonia', body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date: '30/03/2026, 11:09:27', avatar: 'S' },
  { name: 'Suleyman Adanir', title: 'Swedish massage with Antonia', body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date: '04/02/2026, 22:21:40', avatar: 'S' },
  { name: 'Alice W', title: 'Orla is brilliant', body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date: '10/12/2025, 11:29:47', avatar: 'A' },
];

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me' },
  { src: '/linked_in.png', alt: 'LinkedIn' },
  { src: '/where-logo.png', alt: 'Wheree' },
];

// ── BOOKING WIDGET ────────────────────────────────────────────────────────────
function BookingWidget({ providerId }: { providerId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `sbw_provider_${providerId}`;

  useEffect(() => {
    const existing = document.querySelector(`script[data-provider="${providerId}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.async = true;
    script.setAttribute('data-provider', providerId);
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
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
            sb_base_color: '#ffffff',
            display_item_mode: 'list',
            booking_nav_bg_color: '#000000',
            // FIX: dark_font_color was '#ffffff' which produced white text on white
            // buttons in the booking widget. Changed to '#000000' so dark text
            // renders on light/white buttons — matching the styling of the newer
            // booking widgets used elsewhere on the site.
            dark_font_color: '#000000',
            btn_color_1: '#2cd12c',
            sb_company_label_color: '#ffffff',
            hide_img_mode: '0',
            show_sidebar: '1',
            sb_busy: '#db1f4b',
            sb_available: '#2cd12c',
          },
          timeline: 'modern', datepicker: 'inline_datepicker', is_rtl: false,
          app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: { provider: providerId } },
          container_id: widgetId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [providerId, widgetId]);

  return <div id={widgetId} ref={containerRef} style={{ width: '100%' }} />;
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function Testimonials() {
  const total = testimonials.length;
  const extended = [testimonials[total - 1], ...testimonials, testimonials[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0); const startY = useRef(0);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index === 0) { setAnimate(false); setIndex(total); }
    else if (index === total + 1) { setAnimate(false); setIndex(1); }
  };
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = startX.current - e.changedTouches[0].clientX, dy = Math.abs(startY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) go(index + (dx > 0 ? 1 : -1));
  };
  const realIndex = index === 0 ? total - 1 : index === total + 1 ? 0 : index - 1;

  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.testimonialsHeading}>Happy private<br />clients include</h2>
      <div
        className={animate ? styles.testimonialsTrack : styles.testimonialsTrackNoAnim}
        style={{ transform: `translateX(calc(-${index * 100}%))` }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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

// ── LOGO SLIDER ───────────────────────────────────────────────────────────────
function LogoSlider() {
  const total = logos.length;
  const extended = [logos[total - 1], ...logos, logos[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0); const startY = useRef(0);
  const mouseStartX = useRef(0); const isDragging = useRef(false);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index === 0) { setAnimate(false); setIndex(total); }
    else if (index === total + 1) { setAnimate(false); setIndex(1); }
  };
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = startX.current - e.changedTouches[0].clientX, dy = Math.abs(startY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 30 && Math.abs(dx) > dy) go(index + (dx > 0 ? 1 : -1));
  };
  const onMouseDown = (e: React.MouseEvent) => { mouseStartX.current = e.clientX; isDragging.current = true; };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return; isDragging.current = false;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 30) go(index + (diff > 0 ? 1 : -1));
  };
  const offset = 25 - index * 50;

  return (
    <div className={styles.logoSlider}>
      <div
        className={animate ? styles.logoTrack : styles.logoTrackNoAnim}
        style={{ transform: `translateX(${offset}%)` }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp}
        onMouseLeave={() => { isDragging.current = false; }}
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
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function TeamClient({ member }: { member: TeamMember }) {
  const [navSolid, setNavSolid] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current, overlay = scrollOverlayRef.current;
      if (!hero || !overlay) return;
      const h = hero.offsetHeight, s = window.scrollY, start = h * 0.1, range = h * 0.55;
      overlay.style.opacity = s <= start ? '0' : String(Math.min((s - start) / range, 1));
      setNavSolid(s > h - 56);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Nav scrollRef={heroRef} />
      <main className={styles.page}>

        {/* HERO */}
        <div ref={heroRef} className={styles.hero} style={{ backgroundColor: member.heroColor }}>
          <div className={styles.heroMobileImg} style={{ position: 'absolute', inset: 0 }}>
            <Image src={member.heroMobile} alt={member.name} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority onError={() => {}} />
          </div>
          <div className={styles.heroDesktopImg} style={{ position: 'absolute', inset: 0 }}>
            <Image src={member.heroDesktop} alt={member.name} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority onError={() => {}} />
          </div>
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          <div className={styles.heroContent}>
            <h1 className={styles.heroH1}>{member.name}</h1>
            <p className={styles.heroSub}>{member.title}</p>
            <a href="#booking-widget" className={styles.heroBookNow}>BOOK NOW ↓</a>
          </div>
        </div>

        {/* PROFILE + BIO */}
        <section style={{ padding: '48px 24px 48px', background: '#000000' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* Profile photo + name row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '1px solid #ffffff', flexShrink: 0, background: '#1a1a1a', position: 'relative' }}>
                <Image src={member.profilePhoto} alt={member.name} fill style={{ objectFit: 'cover' }} onError={() => {}} />
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 600, color: '#ffffff', marginBottom: 4, lineHeight: 1.1 }}>{member.name}</p>
                <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.06em' }}>{member.title}</p>
              </div>
            </div>

            {/* Bio */}
            {member.bio.map((para: string, i: number) => (
              <p key={i} style={{ fontSize: '1.125rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, marginBottom: 20 }}>{para}</p>
            ))}

            {/* Treatments */}
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: 16, textAlign: 'center' }}>Treatments offered</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {member.treatments.map((t: string) => (
                  <span key={t} style={{ fontSize: '0.82rem', fontWeight: 300, color: '#ffffff', border: '1px solid #ffffff', padding: '6px 14px', letterSpacing: '0.04em' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING WIDGET */}
        <div id="booking-widget" className={styles.widgetWrapper} style={{ borderTop: '1px solid #ffffff' }}>
          <BookingWidget providerId={member.widgetProviderId} />
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* LOGO SLIDER */}
        <LogoSlider />
        <Footer />
      </main>
    </>
  );
}
