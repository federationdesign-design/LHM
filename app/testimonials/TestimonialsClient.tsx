'use client';

import { useEffect, useRef } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';

/* ─────────────────────────────────────────────────────────────
   SimplyBook Reviews widget — updated config with concise theme
   and new colour palette to match site styling.
   ───────────────────────────────────────────────────────────── */
function SimplyBookReviews() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerId = 'sbw_1fwz8g';
    const existing = document.querySelector(`script[data-widget="${containerId}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.async = true;
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.setAttribute('data-widget', containerId);
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
          widget_type: 'reviews',
          url: 'https://lucyhallmassage.simplybook.it',
          theme: 'concise',
          theme_settings: {
            timeline_hide_unavailable: '1',
            hide_past_days: '0',
            timeline_show_end_time: '0',
            timeline_modern_display: 'as_slots',
            light_font_color: '#ffffff',
            sb_secondary_base: '#000000',
            sb_base_color: '#000000',
            display_item_mode: 'block',
            booking_nav_bg_color: '#000000',
            sb_review_image: '',
            dark_font_color: '#333333',
            btn_color_1: '#385e8e',
            sb_company_label_color: '#275a9b',
            hide_img_mode: '0',
            show_sidebar: '1',
            sb_busy: '#c7b3b3',
            sb_available: '#d6ebff',
          },
          timeline: null,
          datepicker: null,
          is_rtl: false,
          app_config: { predefined: [] },
          reviews_count: '0',
          hide_add_reviews: 0,
          container_id: containerId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  return <div id="sbw_1fwz8g" ref={containerRef} style={{ width: '100%' }} />;
}

export default function TestimonialsClient() {
  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        <section style={{ padding: '120px 48px 40px', maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Testimonials
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 18 }}>
            What Our Clients Say
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, maxWidth: 640 }}>
            Genuine reviews and testimonials from clients across Cambridge. We are very grateful for the kind words our clients have shared about their experiences with our team.
          </p>
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* SimplyBook Reviews widget — updated config */}
        <section style={{ padding: '60px 48px 60px', maxWidth: 1300, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: 32 }}>
            Reviews from SimplyBook
          </h2>
          <SimplyBookReviews />
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* Google Reviews placeholder slot. See comment notes on TestimonialsClient
            previous version — paste an Elfsight or similar embed inside the div */}
        <section style={{ padding: '60px 48px 100px', maxWidth: 1300, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: 32 }}>
            Google Reviews
          </h2>

          {/* WIDGET 2 — paste Google Reviews embed code (Elfsight or similar)
              inside this div. Google Place ID: ChIJey7ynZpw2EcRU8Rob2GtOFk */}
          <div id="google-reviews-widget" style={{ background: '#000000', padding: '20px 0', minHeight: 200 }}>
            <p style={{ fontSize: '0.92rem', fontWeight: 300, color: '#ffffff', opacity: 0.5, textAlign: 'center', padding: '40px 24px', border: '1px dashed rgba(255,255,255,0.2)' }}>
              Google Reviews widget — embed code will go here.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
