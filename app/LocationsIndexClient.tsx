'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import Testimonials from './components/Testimonials/Testimonials';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const locations = [
  {
    slug: 'thoday-street',
    name: 'Thoday Street',
    tagline: 'Our main clinic — open 7 days a week',
    address: '2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU',
    hours: [
      { day: 'Monday', time: '9am – 8pm' },
      { day: 'Tuesday', time: '9am – 8pm' },
      { day: 'Wednesday', time: '9am – 8pm' },
      { day: 'Thursday', time: '9am – 8pm' },
      { day: 'Friday', time: '9am – 6pm' },
      { day: 'Saturday', time: '9am – 5.30pm' },
      { day: 'Sunday', time: '10am – 5pm' },
    ],
    lat: 52.19850,
    lng: 0.13580,
    team: [
      { name: 'Antonia', photo: '/antonia.png', slug: 'antonia' },
      { name: 'Orla', photo: '/orla.png', slug: 'orla' },
    ],
  },
  {
    slug: 'cromwell-road',
    name: 'Cromwell Road',
    tagline: 'Available Wednesdays and Fridays',
    address: '96 Cromwell Road, Cambridge, CB1 3EG',
    hours: [
      { day: 'Wednesday', time: '9am – 8pm' },
      { day: 'Friday', time: '9am – 6pm' },
    ],
    lat: 52.19480,
    lng: 0.13920,
    team: [
      { name: 'Safia', photo: '/safia.png', slug: 'safia' },
    ],
  },
];

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me' },
  { src: '/linked_in.png', alt: 'LinkedIn' },
  { src: '/where-logo.png', alt: 'Wheree' },
];

/* ─────────────────────────────────────────────────────────────
   Opening hours helpers — per-location
   ───────────────────────────────────────────────────────────── */

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function parseTimeStr(s: string): [number, number] {
  const m = s.trim().match(/^(\d{1,2})(?:[.:](\d{2}))?\s*(am|pm)$/i);
  if (!m) return [0, 0];
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const meridiem = m[3].toLowerCase();
  if (meridiem === 'pm' && h !== 12) h += 12;
  if (meridiem === 'am' && h === 12) h = 0;
  return [h, min];
}

function parseHoursStrings(hours: { day: string; time: string }[]): Record<number, [number, number, number, number]> {
  const out: Record<number, [number, number, number, number]> = {};
  for (const { day, time } of hours) {
    const dayIdx = DAY_NAMES.indexOf(day);
    if (dayIdx === -1) continue;
    const parts = time.split(/\s*[–—-]\s*/);
    if (parts.length !== 2) continue;
    const [oh, om] = parseTimeStr(parts[0]);
    const [ch, cm] = parseTimeStr(parts[1]);
    out[dayIdx] = [oh, om, ch, cm];
  }
  return out;
}

type StatusResult = { label: string; color: string };

function getOpenStatus(hoursMap: Record<number, [number, number, number, number]>): StatusResult {
  const now = new Date();
  const day = now.getDay();
  const total = now.getHours() * 60 + now.getMinutes();
  const todayHours = hoursMap[day];

  const formatNextOpen = (offset: number, openHour: number, openMin: number): string => {
    const targetDay = (day + offset) % 7;
    const dayLabel = offset === 1 ? 'tomorrow' : DAY_NAMES[targetDay];
    const minSuffix = openMin === 0 ? '' : `:${String(openMin).padStart(2, '0')}`;
    const meridiem = openHour < 12 ? 'am' : 'pm';
    const displayHour = openHour === 0 ? 12 : openHour > 12 ? openHour - 12 : openHour;
    return `Closed — opens ${dayLabel} at ${displayHour}${minSuffix}${meridiem}`;
  };

  if (!todayHours) {
    for (let i = 1; i <= 7; i++) {
      const nd = (day + i) % 7;
      if (hoursMap[nd]) {
        return { label: formatNextOpen(i, hoursMap[nd][0], hoursMap[nd][1]), color: '#ff4444' };
      }
    }
    return { label: 'Closed', color: '#ff4444' };
  }

  const [oh, om, ch, cm] = todayHours;
  const openMins = oh * 60 + om;
  const closeMins = ch * 60 + cm;

  if (total < openMins) {
    const minSuffix = om === 0 ? '' : `:${String(om).padStart(2, '0')}`;
    const meridiem = oh < 12 ? 'am' : 'pm';
    const displayHour = oh === 0 ? 12 : oh > 12 ? oh - 12 : oh;
    return { label: `Closed — opens today at ${displayHour}${minSuffix}${meridiem}`, color: '#ff4444' };
  }

  if (total >= closeMins) {
    for (let i = 1; i <= 7; i++) {
      const nd = (day + i) % 7;
      if (hoursMap[nd]) {
        return { label: formatNextOpen(i, hoursMap[nd][0], hoursMap[nd][1]), color: '#ff4444' };
      }
    }
    return { label: 'Closed', color: '#ff4444' };
  }

  if (closeMins - total <= 60) return { label: 'Closing Soon', color: '#f5a623' };
  return { label: 'Open Now', color: '#2cd12c' };
}

function OpenStatus({ hoursMap }: { hoursMap: Record<number, [number, number, number, number]> }) {
  const [status, setStatus] = useState<StatusResult>(() => getOpenStatus(hoursMap));

  useEffect(() => {
    setStatus(getOpenStatus(hoursMap));
    const t = setInterval(() => setStatus(getOpenStatus(hoursMap)), 60000);
    return () => clearInterval(t);
  }, [hoursMap]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.color, flexShrink: 0, display: 'inline-block' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff' }}>{status.label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MapboxMap
   ───────────────────────────────────────────────────────────── */
function MapboxMap({ lat, lng, name, id }: { lat: number; lng: number; name: string; id: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
    document.head.appendChild(link);

    const initMap = () => {
      const mapboxgl = (window as any).mapboxgl;
      if (!mapboxgl || !mapContainer.current) return;
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
          if (layer.type === 'symbol' && (layer.layout as any)['text-field']) { labelLayerId = layer.id; break; }
        }
        map.addLayer({
          id: `3d-${id}`, source: 'composite', 'source-layer': 'building',
          filter: ['==', 'extrude', 'true'], type: 'fill-extrusion', minzoom: 14,
          paint: {
            'fill-extrusion-color': '#2a2a2a',
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.5, ['get', 'height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.5, ['get', 'min_height']],
            'fill-extrusion-opacity': 0.85,
          },
        }, labelLayerId);

        const el = document.createElement('div');
        el.style.cssText = `width:22px;height:22px;background:#000;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.4);`;
        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`<div style="font-family:sans-serif;font-size:12px;font-weight:600;color:#000;padding:2px">${name}</div>`))
          .addTo(map);
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
      });
    };

    const scriptId = 'mapbox-gl-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (script) {
      if ((window as any).mapboxgl) initMap();
      else script.addEventListener('load', initMap);
    } else {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [lat, lng, name, id]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

/* ─────────────────────────────────────────────────────────────
   LogoSlider
   ───────────────────────────────────────────────────────────── */
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
  );
}

/* ─────────────────────────────────────────────────────────────
   LocationRow
   ───────────────────────────────────────────────────────────── */
function LocationRow({ loc }: { loc: typeof locations[number] }) {
  const hoursMap = useMemo(() => parseHoursStrings(loc.hours), [loc.hours]);

  return (
    <div className="loc-row">

      {/* Info — first on mobile, left on desktop */}
      <div className="loc-info">
        <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 12, opacity: 0.5 }}>Cambridge</p>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#ffffff', marginBottom: 8, lineHeight: 1.1 }}>{loc.name}</h2>
        <p style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff', opacity: 0.55, marginBottom: 16, lineHeight: 1.5 }}>{loc.tagline}</p>
        <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, marginBottom: 20 }}>{loc.address}</p>

        <div style={{ marginBottom: 24 }}>
          <OpenStatus hoursMap={hoursMap} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 12, opacity: 0.5 }}>Opening Hours</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {loc.hours.map(({ day, time }) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 280 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff' }}>{day}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#ffffff' }}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {loc.team.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 14, opacity: 0.5 }}>Therapists</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {loc.team.map((member) => (
                <a key={member.slug} href={`/team/${member.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '1px solid #ffffff', position: 'relative', flexShrink: 0 }}>
                    <Image src={member.photo} alt={member.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 300, color: '#ffffff', opacity: 0.7 }}>{member.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div>
          <a
            href={`/locations/${loc.slug}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', textDecoration: 'none', border: '1px solid #ffffff', padding: '13px 28px' }}
          >
            Book in at this location
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Map */}
      <div className="loc-map">
        <MapboxMap lat={loc.lat} lng={loc.lng} name={loc.name} id={loc.slug} />
      </div>

    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   ROOT
   ═════════════════════════════════════════════════════════════ */
export default function LocationsIndexClient() {
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

        {/* HERO — Google My Maps showing both locations */}
        <div ref={heroRef} style={{ position: 'relative', width: '100%', height: '70vh', marginTop: 56, overflow: 'hidden' }}>
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1r91sAk3sJecNJGcgLjBgBoQgz-Md-gk&hl=en&ehbc=2E312F"
            style={{ position: 'absolute', top: -85, left: 0, width: '100%', height: 'calc(100% + 85px)', border: 0, display: 'block', filter: 'grayscale(90%) contrast(90%) invert(100%)' }}
            allowFullScreen
            loading="lazy"
          />
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} style={{ zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 270, background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50px, transparent 100%)', zIndex: 3, pointerEvents: 'none' }} />

          {/* H1 overlay — uses styles.heroContent class so positioning matches
              Hopi Ear and other service pages exactly. zIndex: 4 ensures it
              sits above the bottom gradient. */}
          <div className={styles.heroContent} style={{ zIndex: 4 }}>
            <h1 className={styles.heroH1}>Our Locations</h1>
            <p className={styles.heroSub}>Two locations in Cambridge — by appointment only</p>
          </div>
        </div>

        {/* Padding between hero and first location */}
        <div style={{ height: 80 }} />

        {/* LOCATION ROWS */}
        <div className="locations-wrap">
          {locations.map((loc, i) => (
            <div key={loc.slug}>
              {i > 0 && <div className="loc-divider" />}
              <LocationRow loc={loc} />
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* TESTIMONIALS */}
        <Testimonials heading="Happy private clients include" />

        {/* LOGO SLIDER */}
        <LogoSlider />

        <Footer />

        {/* Responsive layout for the location rows */}
        <style>{`
          .locations-wrap {
            padding: 0 24px;
          }
          @media (min-width: 540px) {
            .locations-wrap { padding: 0 48px; }
          }

          .loc-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 80px;
          }

          .loc-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0;
          }

          .loc-map {
            position: relative;
            width: 100%;
            height: 450px;
            overflow: hidden;
          }

          .loc-divider {
            height: 100px;
            border-top: 1px solid #ffffff;
            margin-bottom: 40px;
          }

          @media (min-width: 900px) {
            .loc-row {
              grid-template-columns: 1fr 1fr;
              gap: 0;
              min-height: 520px;
              margin-bottom: 100px;
            }
            .loc-info {
              padding: 48px 56px 48px 0;
            }
            .loc-map {
              height: auto;
              min-height: 480px;
              padding-left: 48px;
              box-sizing: border-box;
            }
            .loc-divider {
              margin-bottom: 80px;
            }
          }
        `}</style>

      </main>
    </>
  );
}
