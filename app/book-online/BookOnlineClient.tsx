'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../page.module.css';
import Nav from '../Nav';
import Footer from '../Footer';

/* ─────────────────────────────────────────────────────────────
   Inline booking widget (iframe). Renders within the page flow
   between the intro paragraphs and the testimonials.
   ───────────────────────────────────────────────────────────── */
function BookingWidget() {
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerId = 'sbw_9r75yx';
    const existing = document.querySelector(`script[data-widget="${containerId}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.async = true;
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.setAttribute('data-widget', containerId);
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
            sb_base_color: '#545557',
            display_item_mode: 'block',
            booking_nav_bg_color: '#000000',
            sb_review_image: '115',
            sb_review_image_preview: '/uploads/lucyhallmassage/image_files/preview/4ecc8dab4516d05ab44aa11a3cfd7405.jpg',
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
          app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: [] },
          container_id: containerId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  // z-index 1 keeps the widget within page flow — no overlap with header
  return <div id="sbw_9r75yx" ref={widgetContainerRef} style={{ position: 'relative', zIndex: 1, width: '100%' }} />;
}

const testimonials = [
  { name: 'Sarah Cater', title: 'Fantastic Swedish massage with Antonia', body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date: '30/03/2026', avatar: 'S' },
  { name: 'Suleyman Adanir', title: 'Swedish massage with Antonia', body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date: '04/02/2026', avatar: 'S' },
  { name: 'Alice W', title: 'Orla is brilliant', body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date: '10/12/2025', avatar: 'A' },
];

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

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me' },
  { src: '/linked_in.png', alt: 'LinkedIn' },
  { src: '/where-logo.png', alt: 'Wheree' },
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

export default function BookOnlineClient() {
  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* Header section — breadcrumbs, h1, two intro paragraphs */}
        <section style={{ padding: '120px 48px 60px', maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Book Online
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 24 }}>
            Book Your Massage
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, maxWidth: 720, marginBottom: 18 }}>
            Choose a treatment, location, therapist and time below to begin booking your appointment.
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, maxWidth: 720 }}>
            Booking takes a couple of minutes. If you need help choosing a treatment, <a href="/contact" style={{ color: '#ffffff', textDecoration: 'underline' }}>get in touch</a> and we&rsquo;ll guide you.
          </p>
        </section>

        {/* Inline booking widget — sits between intro and testimonials */}
        <section style={{ padding: '20px 48px 80px', maxWidth: 1300, margin: '0 auto' }}>
          <BookingWidget />
        </section>

        <Testimonials />

        <LogoSliderWithHeading />

        <Footer />
      </main>
    </>
  );
}
