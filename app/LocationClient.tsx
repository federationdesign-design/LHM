import Image from 'next/image';
'use client';

import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import Testimonials from './components/Testimonials/Testimonials';
import type { Location } from './data/locations';
import FindUsOn from '@/app/components/FindUsOn';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// ── LOGOS DATA ────────────────────────────────────────────────────────────────
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
        zoom: 15.5,
        pitch: 50,
        bearing: -15,
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

// ── LOGO SLIDER ───────────────────────────────────────────────────────────────
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
        {/* ── GALLERY ────────────────────────────────────────── */}
        {location.gallery && location.gallery.length > 0 && (
          <section className="location-gallery">
            <div className="location-gallery-grid">
              {location.gallery.map((src, i) => (
                <div key={i} className="location-gallery-item">
                  <Image
                    src={src}
                    alt={`${location.name} clinic ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            <style>{`
              .location-gallery {
                padding: 48px 24px;
                background: #000000;
              }
              .location-gallery-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                max-width: 1600px;
                margin: 0 auto;
              }
              .location-gallery-item {
                position: relative;
                aspect-ratio: 1 / 1;
                overflow: hidden;
              }
              @media (min-width: 768px) {
                .location-gallery {
                  padding: 64px 32px;
                }
                .location-gallery-grid {
                  grid-template-columns: repeat(4, 1fr);
                  gap: 12px;
                }
              }
            `}</style>
          </section>
        )}
        <div id="booking-widget" className={styles.widgetWrapper}>
          <BookingWidget locationId={location.widgetLocationId} />
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* TESTIMONIALS */}
        <Testimonials heading="Happy private clients include" />

        {/* LOGO SLIDER */}
        <FindUsOn />
        <Footer />
      </main>
    </>
  );
}
