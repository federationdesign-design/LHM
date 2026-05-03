'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import type { Location } from './data/locations';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';


// ── TESTIMONIALS DATA ─────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Sarah Cater', title: 'Fantastic Swedish massage with Antonia', body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date: '30/03/2026, 11:09:27', avatar: 'S' },
  { name: 'Suleyman Adanir', title: 'Swedish massage with Antonia', body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date: '04/02/2026, 22:21:40', avatar: 'S' },
  { name: 'Alice W', title: 'Orla is brilliant', body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date: '10/12/2025, 11:29:47', avatar: 'A' },
];

// ── LOGOS DATA ────────────────────────────────────────────────────────────────
const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me' },
  { src: '/linked_in.png', alt: 'LinkedIn' },
  { src: '/where-logo.png', alt: 'Wheree' },
];

// ── MOBILE MENU ───────────────────────────────────────────────────────────────
// ── MAPBOX MAP ────────────────────────────────────────────────────────────────
function MapboxMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {
      const mapboxgl = (window as any).mapboxgl;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [lng, lat],
        zoom: 16,
        pitch: 55,
        bearing: -20,
        antialias: true,
      });

      mapRef.current = map;

      map.on('load', () => {
        const layers = map.getStyle().layers;
        let labelLayerId: string | undefined;
        for (const layer of layers) {
          if (layer.type === 'symbol' && (layer.layout as any)['text-field']) {
            labelLayerId = layer.id;
            break;
          }
        }

        map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#2a2a2a',
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.5, ['get', 'height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.5, ['get', 'min_height']],
            'fill-extrusion-opacity': 0.85,
          },
        }, labelLayerId);

        const el = document.createElement('div');
        el.style.cssText = `width:28px;height:28px;background:#000;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;`;

        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`<div style="font-family:sans-serif;font-size:13px;font-weight:600;padding:4px 2px;color:#000">${name}</div>`))
          .addTo(map);

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
      });
    };
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [lat, lng, name]);

  return <div ref={mapContainer} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

// ── BOOKING WIDGET ────────────────────────────────────────────────────────────
function BookingWidget({ locationId }: { locationId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `sbw_loc_${locationId}`;

  useEffect(() => {
    const existing = document.querySelector(`script[data-loc="${locationId}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.async = true;
    script.setAttribute('data-loc', locationId);
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
          widget_type: 'iframe',
          url: 'https://lucyhallmassage.simplybook.it',
          theme: 'concise',
          theme_settings: {
            timeline_hide_unavailable: '1', hide_past_days: '0', timeline_show_end_time: '0',
            timeline_modern_display: 'as_slots', light_font_color: '#ffffff', sb_secondary_base: '#000000',
            sb_base_color: '#ffffff', display_item_mode: 'list', booking_nav_bg_color: '#000000',
            sb_review_image: '115',
            sb_review_image_preview: '/uploads/lucyhallmassage/image_files/preview/4ecc8dab4516d05ab44aa11a3cfd7405.jpg',
            dark_font_color: '#000000', btn_color_1: '#2cd12c', sb_company_label_color: '#ffffff',
            hide_img_mode: '0', show_sidebar: '1', sb_busy: '#db1f4b', sb_available: '#2cd12c',
          },
          timeline: 'modern', datepicker: 'inline_datepicker', is_rtl: false,
          app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: { location: locationId } },
          container_id: widgetId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [locationId, widgetId]);

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
export default function LocationClient({ location }: { location: Location }) {
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

        {/* HERO — Mapbox 3D map fills the background */}
        <div ref={heroRef} className={styles.hero} style={{ backgroundColor: location.heroColor }}>
          <MapboxMap lat={location.lat} lng={location.lng} name={location.name} />
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} style={{ zIndex: 6 }} />
          <div className={styles.heroGradient} style={{ zIndex: 5 }} />
          {/* Bottom gradient: 270px total height. Fades from transparent at the top to fully opaque black 50px before the bottom, leaving 50px of solid black breathing room at the very bottom of the hero. */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 270, background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50px, transparent 100%)', zIndex: 5, pointerEvents: 'none' }} />
          <div className={styles.heroContent} style={{ zIndex: 10 }}>
            <h1 className={styles.heroH1}>{location.h1}</h1>
            <p className={styles.heroSub}>{location.tagline}</p>
            <a href="#booking-widget" className={styles.heroBookNow}>BOOK NOW ↓</a>
          </div>
        </div>

        {/* BOOKING WIDGET */}
        <div id="booking-widget" className={styles.widgetWrapper}>
          <BookingWidget locationId={location.widgetLocationId} />
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
