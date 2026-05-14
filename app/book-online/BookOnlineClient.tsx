'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../page.module.css';
import Nav from '../Nav';
import Footer from '../Footer';
import Testimonials from '../components/Testimonials/Testimonials';
import FindUsOn from '@/app/components/FindUsOn';

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

        <Testimonials heading="Happy private clients include" />

        <FindUsOn />

        <Footer />
      </main>
    </>
  );
}
