'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import Testimonials from './components/Testimonials/Testimonials';
import FindUsOn from '@/app/components/FindUsOn';

// ── SIMPLYBOOK WIDGET ─────────────────────────────────────────
function BookingWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const existing = document.querySelector('script[src*="simplybook"]');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
          widget_type: 'iframe', url: 'https://lucyhallmassage.simplybook.it',
          theme: 'concise',
          theme_settings: { timeline_hide_unavailable:'1', hide_past_days:'0', timeline_show_end_time:'0', timeline_modern_display:'as_slots', light_font_color:'#ffffff', sb_secondary_base:'#000000', sb_base_color:'#ffffff', display_item_mode:'list', booking_nav_bg_color:'#000000', sb_review_image:'115', dark_font_color:'#ffffff', btn_color_1:'#2cd12c', sb_company_label_color:'#ffffff', hide_img_mode:'0', show_sidebar:'1', sb_busy:'#db1f4b', sb_available:'#2cd12c' },
          timeline: 'modern', datepicker: 'inline_datepicker', is_rtl: false,
          app_config: { clear_session:0, allow_switch_to_ada:0, predefined:{ service:'13', location:'4' } },
          container_id: 'sbw_9r75yx',
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);
  return <div id="sbw_9r75yx" ref={containerRef} style={{ width:'100%' }} />;
}

// ── LOGO SLIDER ───────────────────────────────────────────────
// ── MAIN PAGE ─────────────────────────────────────────────────
export default function BookingPageClient() {
  const [navSolid, setNavSolid] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const hero=heroRef.current, overlay=scrollOverlayRef.current;
      if (!hero||!overlay) return;
      const h=hero.offsetHeight, s=window.scrollY, start=h*0.1, range=h*0.55;
      overlay.style.opacity = s<=start ? '0' : String(Math.min((s-start)/range,1));
      setNavSolid(s > h - 56);
    };
    window.addEventListener('scroll', handleScroll, { passive:true });
    return ()=>window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>

      {/* ── JSON-LD STRUCTURED DATA ── */}
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
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '168',
                bestRating: '5',
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: '2 Antwerp Cottages, Thoday Street',
                addressLocality: 'Cambridge',
                addressRegion: 'Cambridgeshire',
                postalCode: 'CB1 3AU',
                addressCountry: 'GB',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 52.1951,
                longitude: 0.1313,
              },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Thursday'], opens: '09:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday'], opens: '12:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '09:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '17:30' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '17:00' },
              ],
              priceRange: '££',
              image: 'https://www.lucyhallmassage.com/deep-tissue-img.jpg',
              sameAs: [
                'https://www.tripadvisor.com',
                'https://www.linkedin.com/in/lucy-hall-47369141/',
              ],
            },
            {
              '@type': 'Service',
              '@id': 'https://www.lucyhallmassage.com/#deep-tissue',
              name: 'Deep Tissue Massage',
              description: 'Deep tissue massage targets the deeper layers of muscle and connective tissue, using slow, firm strokes to release chronic tension and knots.',
              provider: { '@id': 'https://www.lucyhallmassage.com/#business' },
              areaServed: { '@type': 'City', name: 'Cambridge' },
              serviceType: 'Massage Therapy',
              url: 'https://www.lucyhallmassage.com',
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.lucyhallmassage.com' },
                { '@type': 'ListItem', position: 2, name: 'Treatments', item: 'https://www.lucyhallmassage.com/services' },
                { '@type': 'ListItem', position: 3, name: 'Deep Tissue Massage', item: 'https://www.lucyhallmassage.com' },
              ],
            },
          ],
        }) }}
      />

      {/* ── NAV ── */}
      <Nav solid />

      {/* ── PAGE ── */}
      <main className={styles.page}>

        {/* HERO */}
        <div ref={heroRef} className={styles.hero}>
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          {/* Mobile hero */}
          <Image src="/hero.jpg" alt="Deep tissue massage" fill priority sizes="100vw"
            className={styles.heroMobileImg}
            style={{ objectFit:'cover', objectPosition:'center 30%', filter:'brightness(0.62)' }}/>
          {/* Desktop hero */}
          <Image src="/deep-tissue-img.jpg" alt="Deep tissue massage" fill priority sizes="100vw"
            className={styles.heroDesktopImg}
            style={{ objectFit:'cover', objectPosition:'center 40%', filter:'brightness(0.62)', display:'none' }}/>
          <div className={styles.heroContent}>
            <h1 className={styles.heroH1}>Deep Tissue Massage</h1>
            <p className={styles.heroSub}>Book your appointment in just two minutes with our simple online booking system.</p>
            <hr className={styles.heroRule} />
            <a href="#booking-widget" className={styles.heroBookNow}>BOOK NOW ↓</a>
            <p className={styles.heroEnquire}>Enquire now &gt;&gt;</p>
          </div>
        </div>

        {/* WIDGET */}
        <div id="booking-widget" className={styles.widgetWrapper}>
          <BookingWidget />
        </div>


        {/* ── SERVICE CONTENT ── */}
        <section className={styles.serviceSection}>

          {/* Why you need this */}
          <h2 className={styles.testimonialsHeading} style={{ marginBottom:20 }}>
            Why you need this
          </h2>
          <p style={{ fontSize:'1.2rem', color:'#ffffff', fontWeight:600, lineHeight:1.5, textAlign:'center', maxWidth:860, margin:'0 auto 48px', display:'block' }}>
            Deep tissue massage targets the deeper layers of muscle and connective tissue, using slow, firm strokes to release chronic tension and knots. Unlike a relaxation massage, deep tissue work focuses on specific problem areas — helping to restore movement, reduce pain and improve posture over time.
          </p>

          <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>
          <div className={styles.serviceGrid}>

            <div>
              <h3 style={{ fontSize:'1.08rem', fontWeight:600, textTransform:'none', letterSpacing:'0.04em', color:'#ffffff', marginBottom:20, lineHeight:1.3 }}>
                Benefits of this treatment on your body:
              </h3>
              <ul style={{ listStyle:'disc', paddingLeft:28, marginLeft:8 }}>
                {[
                  'Releases chronic muscle tension',
                  'Works out deep-seated knots',
                  'Reduces pain in the neck, shoulders and lower back',
                  'Improves posture and range of movement',
                  'Breaks down scar tissue from old injuries',
                  'Lowers stress hormones and promotes recovery',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize:'0.98rem', color:'#ffffff', fontWeight:300, lineHeight:1.3, marginBottom:8 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize:'1.08rem', fontWeight:600, textTransform:'none', letterSpacing:'0.04em', color:'#ffffff', marginBottom:20, lineHeight:1.3 }}>
                We recommend this treatment for:
              </h3>
              <ul style={{ listStyle:'disc', paddingLeft:28, marginLeft:8 }}>
                {[
                  'People with chronic back, neck or shoulder pain',
                  'Those recovering from sports injuries',
                  'People with a repetitive strain injury',
                  'Anyone with poor posture from desk-based work',
                  'Clients who find lighter massage insufficient',
                  'Those managing stress-related physical tension',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize:'0.98rem', color:'#ffffff', fontWeight:300, lineHeight:1.3, marginBottom:8 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* TESTIMONIALS */}
        <Testimonials heading="Happy private clients include" />

        {/* LOGOS */}
        <FindUsOn />
        <Footer />
      </main>
    </>
  );
}
