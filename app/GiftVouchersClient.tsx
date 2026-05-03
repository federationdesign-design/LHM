'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';

const WIDGET_ID = 'sbw_gift_vouchers';

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

function GiftVoucherWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.querySelector('script[data-gift-voucher]');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.async = true;
    script.setAttribute('data-gift-voucher', 'true');
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
          widget_type: 'iframe',
          url: 'https://lucyhallmassage.simplybook.it',
          theme: 'concise',
          theme_settings: {
            timeline_hide_unavailable: '1', hide_past_days: '0', timeline_show_end_time: '0',
            timeline_modern_display: 'as_slots', light_font_color: '#ffffff', sb_secondary_base: '#000000',
            sb_base_color: '#ffffff', display_item_mode: 'block', booking_nav_bg_color: '#000000',
            sb_review_image: '', dark_font_color: '#000000', btn_color_1: '#34b823',
            sb_company_label_color: '#275a9b', hide_img_mode: '0', show_sidebar: '1',
            sb_busy: '#c7b3b3', sb_available: '#d6ebff',
          },
          timeline: null, datepicker: null, is_rtl: false,
          app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: [] },
          navigate: 'gift-card',
          container_id: WIDGET_ID,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  return <div id={WIDGET_ID} ref={containerRef} style={{ width: '100%' }} />;
}

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
  const realIndex = index === 0 ? total - 1 : index === total + 1 ? 0 : index - 1;
  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.testimonialsHeading}>Happy private<br />clients include</h2>
      <div className={animate ? styles.testimonialsTrack : styles.testimonialsTrackNoAnim} style={{ transform: `translateX(calc(-${index * 100}%))` }} onTransitionEnd={handleTransitionEnd} onTouchStart={e => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; }} onTouchEnd={e => { const dx = startX.current - e.changedTouches[0].clientX, dy = Math.abs(startY.current - e.changedTouches[0].clientY); if (Math.abs(dx) > 40 && Math.abs(dx) > dy) go(index + (dx > 0 ? 1 : -1)); }}>
        {extended.map((t, i) => (<div key={i} className={styles.testimonialSlide}><div className={styles.testimonialAvatar}>{t.avatar}</div><h4 className={styles.testimonialName}>{t.name}</h4><p className={styles.testimonialTitle}>{t.title}</p><p className={styles.testimonialBody}>{t.body}</p><div className={styles.testimonialStars}>{[...Array(5)].map((_, j) => <span key={j} className={styles.star}>★</span>)}</div><p className={styles.testimonialDate}>{t.date}</p></div>))}
      </div>
      <div className={styles.dots}>{testimonials.map((_, i) => (<button key={i} onClick={() => go(i + 1)} className={`${styles.dot} ${i === realIndex ? styles.dotActive : ''}`} />))}</div>
      <div className={styles.testimonialsGrid}>{testimonials.map((t, i) => (<div key={i} className={styles.testimonialsGridSlide}><div className={styles.testimonialAvatar}>{t.avatar}</div><h4 className={styles.testimonialName}>{t.name}</h4><p className={styles.testimonialTitle}>{t.title}</p><p className={styles.testimonialBody}>{t.body}</p><div className={styles.testimonialStars}>{[...Array(5)].map((_, j) => <span key={j} className={styles.star}>★</span>)}</div><p className={styles.testimonialDate}>{t.date}</p></div>))}</div>
    </section>
  );
}

function LogoSlider() {
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
    <div className={styles.logoSlider}>
      <div className={animate ? styles.logoTrack : styles.logoTrackNoAnim} style={{ transform: `translateX(${25 - index * 50}%)` }} onTransitionEnd={handleTransitionEnd} onTouchStart={e => { startX.current = e.touches[0].clientX; }} onTouchEnd={e => { const dx = startX.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 30) go(index + (dx > 0 ? 1 : -1)); }}>
        {extended.map((logo, i) => (<div key={i} className={styles.logoSlide}><img src={logo.src} alt={logo.alt} className={styles.logoImg} draggable={false} /></div>))}
      </div>
      <div className={styles.logoRow}>{logos.map((logo) => (<img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />))}</div>
    </div>
  );
}

export default function GiftVouchersClient() {
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
      <Nav scrollRef={heroRef} />

      <main className={styles.page}>

        {/* HERO */}
        <div ref={heroRef} className={styles.hero} style={{ backgroundColor: '#3a3028' }}>
          <Image src="/gift-voucher-hero.jpg" alt="Gift Vouchers — Lucy Hall Massage Therapy" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', zIndex: 5, pointerEvents: 'none' }} />
          <div className={styles.heroContent} style={{ zIndex: 10 }}>
            <h1 className={styles.heroH1}>Gift Vouchers</h1>
            <p className={styles.heroSub}>Give the gift of relaxation, the perfect treat for someone special</p>
            <a href="#gift-widget" className={styles.heroBookNow}>BUY A VOUCHER ↓</a>
          </div>
        </div>

        {/* INTRO */}
        <section style={{ padding: '56px 48px', borderBottom: '1px solid #ffffff', background: '#000000' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 600, color: '#ffffff', marginBottom: 24, lineHeight: 1.2 }}>The perfect gift</h2>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.6, marginBottom: 16 }}>
              Whether it's a birthday, anniversary, new baby or just a well-deserved treat, a Lucy Hall Massage Therapy gift voucher is always a welcome surprise.
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, marginBottom: 40 }}>
              Vouchers can be redeemed against any of our treatments at either of our Cambridge clinics. Valid for 12 months from the date of purchase.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center' }}>
              {[
                { label: 'Any treatment', desc: 'Redeemable against all services' },
                { label: '12 months', desc: 'Valid for a full year' },
                { label: 'Both clinics', desc: 'Thoday Street & Cromwell Road' },
                { label: 'Instant delivery', desc: 'Sent by email immediately' },
              ].map(({ label, desc }) => (
                <div key={label} style={{ textAlign: 'center', minWidth: 140 }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 300, color: '#ffffff', opacity: 0.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WIDGET — marginTop crops SimplyBook header bar; marginBottom crops the bottom GDPR area to avoid duplicate divider lines */}
        <div id="gift-widget" className={styles.widgetWrapper} style={{ marginTop: -50, marginBottom: -100, paddingTop: 0 }}>
          <GiftVoucherWidget />
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
