'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

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

// ── TESTIMONIALS ──────────────────────────────────────────────
const testimonials = [
  { name:'Sarah Cater', title:'Fantastic Swedish massage with Antonia', body:'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date:'30/03/2026, 11:09:27', avatar:'S' },
  { name:'Suleyman Adanir', title:'Swedish massage with Antonia', body:'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date:'04/02/2026, 22:21:40', avatar:'S' },
  { name:'Alice W', title:'Orla is brilliant', body:'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date:'10/12/2025, 11:29:47', avatar:'A' },
];

function Testimonials() {
  const total = testimonials.length;
  const extended = [testimonials[total-1], ...testimonials, testimonials[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0); const startY = useRef(0);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index===0) { setAnimate(false); setIndex(total); }
    else if (index===total+1) { setAnimate(false); setIndex(1); }
  };
  const onTouchStart = (e: React.TouchEvent) => { startX.current=e.touches[0].clientX; startY.current=e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx=startX.current-e.changedTouches[0].clientX, dy=Math.abs(startY.current-e.changedTouches[0].clientY);
    if (Math.abs(dx)>40 && Math.abs(dx)>dy) go(index+(dx>0?1:-1));
  };
  const realIndex = index===0?total-1:index===total+1?0:index-1;

  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.testimonialsHeading}>Happy private clients include</h2>

      {/* Mobile/tablet carousel */}
      <div
        className={animate ? styles.testimonialsTrack : styles.testimonialsTrackNoAnim}
        style={{ transform:`translateX(calc(-${index*100}%))` }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {extended.map((t,i) => (
          <div key={i} className={styles.testimonialSlide}>
            <div className={styles.testimonialAvatar}>{t.avatar}</div>
            <h4 className={styles.testimonialName}>{t.name}</h4>
            <p className={styles.testimonialTitle}>{t.title}</p>
            <p className={styles.testimonialBody}>{t.body}</p>
            <div className={styles.testimonialStars}>{[...Array(5)].map((_,j)=><span key={j} className={styles.star}>★</span>)}</div>
            <p className={styles.testimonialDate}>{t.date}</p>
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {testimonials.map((_,i)=>(
          <button key={i} onClick={()=>go(i+1)} className={`${styles.dot} ${i===realIndex?styles.dotActive:''}`} />
        ))}
      </div>

      {/* Desktop 3-col grid */}
      <div className={styles.testimonialsGrid}>
        {testimonials.map((t,i) => (
          <div key={i} className={styles.testimonialsGridSlide}>
            <div className={styles.testimonialAvatar}>{t.avatar}</div>
            <h4 className={styles.testimonialName}>{t.name}</h4>
            <p className={styles.testimonialTitle}>{t.title}</p>
            <p className={styles.testimonialBody}>{t.body}</p>
            <div className={styles.testimonialStars}>{[...Array(5)].map((_,j)=><span key={j} className={styles.star}>★</span>)}</div>
            <p className={styles.testimonialDate}>{t.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── LOGO SLIDER ───────────────────────────────────────────────
const logos = [
  { src:'/bookingpage.png', alt:'BookingPage' },
  { src:'/tripadisvor.svg', alt:'Tripadvisor' },
  { src:'/SBM-logo.png', alt:'SimplyBook.me' },
  { src:'/linked_in.png', alt:'LinkedIn' },
  { src:'/where-logo.png', alt:'Wheree' },
];

function LogoSlider() {
  const total = logos.length;
  const extended = [logos[total-1], ...logos, logos[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0); const startY = useRef(0);
  const mouseStartX = useRef(0); const isDragging = useRef(false);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index===0) { setAnimate(false); setIndex(total); }
    else if (index===total+1) { setAnimate(false); setIndex(1); }
  };
  const onTouchStart = (e: React.TouchEvent) => { startX.current=e.touches[0].clientX; startY.current=e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx=startX.current-e.changedTouches[0].clientX, dy=Math.abs(startY.current-e.changedTouches[0].clientY);
    if (Math.abs(dx)>30 && Math.abs(dx)>dy) go(index+(dx>0?1:-1));
  };
  const onMouseDown = (e: React.MouseEvent) => { mouseStartX.current=e.clientX; isDragging.current=true; };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return; isDragging.current=false;
    const diff=mouseStartX.current-e.clientX;
    if (Math.abs(diff)>30) go(index+(diff>0?1:-1));
  };
  const offset = 25 - index*50;

  return (
    <div className={styles.logoSlider}>
      {/* Mobile/tablet slider */}
      <div
        className={animate ? styles.logoTrack : styles.logoTrackNoAnim}
        style={{ transform:`translateX(${offset}%)` }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp}
        onMouseLeave={()=>{ isDragging.current=false; }}
      >
        {extended.map((logo,i)=>(
          <div key={i} className={styles.logoSlide}>
            <img src={logo.src} alt={logo.alt} className={styles.logoImg} draggable={false} />
          </div>
        ))}
      </div>

      {/* Desktop full row */}
      <div className={styles.logoRow}>
        {logos.map((logo)=>(
          <img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />
        ))}
      </div>
    </div>
  );
}

// ── MOBILE MENU ───────────────────────────────────────────────
const menuItems = ['Home','All Treatments','Locations','Gift Vouchers','Blog','FAQ','Claiming Receipts','Contact'];

function MobileMenu({ open, onClose }: { open:boolean; onClose:()=>void }) {
  useEffect(() => { document.body.style.overflow=open?'hidden':''; return ()=>{ document.body.style.overflow=''; }; }, [open]);
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300, opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity 0.25s ease' }} />

      {/* X — outside animated drawer, appears instantly with no transition */}
      {open && (
        <div className={styles.menuHeader} style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, pointerEvents:'auto' }}>
          <button onClick={onClose} style={{background:'none', border:'none', padding:0, display:'flex', alignItems:'center', justifyContent:'center', width:24, height:24}}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width:24, height:24 }}>
              <line x1="3" y1="3" x2="21" y2="21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="21" y1="3" x2="3" y2="21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      <div style={{ position:'fixed', inset:0, background:'#000000', zIndex:400, opacity:open?1:0, transform:open?'translateY(0)':'translateY(24px)', pointerEvents:open?'auto':'none', transition:'opacity 0.25s ease, transform 0.25s ease', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        {/* Spacer to push nav links below the X */}
        <div style={{ height:56, flexShrink:0 }} />
        <nav style={{ flex:1, paddingTop:16 }}>
          {menuItems.map((item)=>(
            <a key={item} href="#" onClick={onClose} className="menu-link" style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 32px', color:'#ffffff', fontSize:'1.15rem', fontWeight:400, letterSpacing:'0.06em', position:'relative' }}>
              <span className="menu-arrow" style={{ width:12, height:12, flexShrink:0, opacity:0, transition:'opacity 0.2s ease, transform 0.2s ease', transform:'translateX(-8px)', display:'flex', alignItems:'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.622 59.257" style={{ width:12, height:22 }} overflow="visible">
                  <g transform="translate(24.47 43.189) rotate(180)">
                    <path d="M21.131,41.2.708,20.778,21.131.354" transform="translate(2.735 9.994)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"/>
                  </g>
                </svg>
              </span>
              {item}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function BookingPageClient() {
  const [menuOpen, setMenuOpen] = useState(false);
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
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '09:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '09:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '17:30' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '17:00' },
              ],
              priceRange: '££',
              image: 'https://www.lucyhallmassage.com/deep-tissue-img.jpg',
              sameAs: [
                'https://www.tripadvisor.com',
                'https://www.linkedin.com/company/lucy-hall-massage',
              ],
            },
            {
              '@type': 'Service',
              '@id': 'https://lucyhallmassage.com/#deep-tissue',
              name: 'Deep Tissue Massage',
              description: 'Deep tissue massage targets the deeper layers of muscle and connective tissue, using slow, firm strokes to release chronic tension and knots.',
              provider: { '@id': 'https://lucyhallmassage.com/#business' },
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
      <nav className={`${styles.nav} ${navSolid ? styles.navSolid : ''}`}>
        <a href="/" aria-label="Lucy Hall Massage">
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 111.282 30.071" className={styles.logo}>
            <defs><clipPath id="clip-logo"><rect width="111.282" height="30.071" fill="#fff"/></clipPath></defs>
            <g transform="translate(-31 -27.26)">
              <g transform="translate(31 27.581)">
                <path d="M0,1.846V29.481H17.117V26.224H3.622V1.846Z" transform="translate(0 -1.846)" fill="#fff"/>
                <path d="M122.96,29.481V1.846h3.657V13.2h14.331V1.846h3.639V29.481h-3.639V16.456H126.617V29.481Z" transform="translate(-101.548 -1.846)" fill="#fff"/>
              </g>
              <path d="M122.464,28.985h.1V1.455h3.448V12.808h14.54V1.455h3.43V28.881h-3.43V15.856h-14.54V28.881h-3.552v.1h0v.1h3.761V16.065h14.122V29.09H144.2V1.246h-3.848V12.6H126.226V1.246H122.36V29.09h.1Z" transform="translate(-70.053 26.231)" fill="#fff"/>
              <g transform="translate(31 27.26)">
                <g clipPath="url(#clip-logo)">
                  <path d="M278.8,0c-.07.7,1.915,2.037,2.49,2.595,1.114,1.08,2.264,2.02,3.378,3.065,2.09,1.968,4.04,3.6,6.983,4.2a25.506,25.506,0,0,0,4.615.035l5.311.052c2.838.035,5.485.313,8.306.348,2.769.035,5.363.4,8.115.5,1.2.052,2.333.3,3.552.348a23.372,23.372,0,0,1,4.127.435,35.489,35.489,0,0,1,4.266,1.672c1.323.5,2.7,1.114,4.005,1.619,1.184.453,2.542,1.045,3.761,1.6.592.279,1.933.47,2.386.923a1.431,1.431,0,0,1-.157,2.02c-.749.435-2.281-.261-3.03-.435-.888-.192-1.776-.418-2.629-.627-1.6-.383-3.082-.975-4.7-1.428-2.455-.679-5.137-.453-7.749-.418a11.263,11.263,0,0,0-5.921,1.254,14.434,14.434,0,0,0-3.274,2.838c-.871.975-1.167,2-2.647,1.619-.07-.017-.644-.331-.731-.383-.331-.157-.644-.244-.975-.4-1.341-.644-2.891-1.027-4.179-1.654-.853-.418-1.794-.8-2.751-1.2a14.693,14.693,0,0,0-2.316-.853c.122,1.045,2.072,1.5,2.891,1.794,1.149.418,2.229.94,3.361,1.41,2.281.94,4.51,1.672,6.861,2.542,1.9.714,7.174,2.055,5.938,5.085-1.219,3.013-6.13.7-8.167.1-1.167-.331-2.142-.818-3.309-1.114-.209-.052-.244-.279-.5-.331-.488-.1-1.027,0-1.532-.1a5.521,5.521,0,0,0-2.612.035c-.522.087-1.1-.052-1.619.087-.261.07-.4.279-.662.331-.784.174-1.585.313-2.368.435-.958.139-1.968.3-2.908.348a12.266,12.266,0,0,1-2.891-.331c-4.3-.627-6.774-4.615-10.048-7.07-.488-.366-.906-.853-1.428-1.219-.47-.331-1.254-.7-1.323-1.323-.052-.488.331-.644.435-1.01a8.794,8.794,0,0,0,.122-1.794,16.743,16.743,0,0,0-.383-3.866c-.4-1.846-.749-3.692-1.1-5.555a20.045,20.045,0,0,1-.261-3.57A5.594,5.594,0,0,1,277.8.731C278.047.035,278,0,278.8,0" transform="translate(-229.198 0)" fill="#fff"/>
                  <path d="M492.506,111.471c.122.435.8.644,1.132.923.505.4.958.905,1.393,1.323.279.261.958.731,1.1,1.045.366.784-.366,1.306-1.132,1.219-1.149-.139-2.42-1.167-3.343-1.672a31.771,31.771,0,0,0-3.848-1.689c-.644-.244-1.323-.557-1.968-.731-.383-.1-.818-.017-1.2-.087-.366-.052-.644-.261-.958-.313-.836-.157-6.2.871-6.391.226-.157-.557,1.985-2.194,2.438-2.612a2.027,2.027,0,0,1,2.177-.5c.731.174,1.515.3,2.264.47,1.271.3,2.716.714,4.005,1.062.8.209,1.619.279,2.42.522.679.174,1.184.7,1.916.818" transform="translate(-394.167 -89.599)" fill="#fff"/>
                  <path d="M524.128,107.457a4.685,4.685,0,0,1,0,1.306c-.244.348-.47.261-1.01.261a2.558,2.558,0,0,1-1.724-.453,21.517,21.517,0,0,1-1.567-1.532,33.967,33.967,0,0,0-3.413-3.309,14.31,14.31,0,0,0-5.154-2.09c-1.1-.261-2.194-.488-3.291-.766-.522-.122-1.08-.157-1.585-.279-.853-.209-1.254-.035-1.358-.975a12.087,12.087,0,0,0,1.654-.4,12.653,12.653,0,0,1,2.438-.035,8.687,8.687,0,0,1,3.465.731c1.637.609,3.256,1.2,4.841,1.759a9.788,9.788,0,0,1,3.483,2.351,14.355,14.355,0,0,1,1.532,1.55c.488.609.975,1.532,1.689,1.881" transform="translate(-417.082 -81.877)" fill="#fff"/>
                  <path d="M551.425,97.328c1.062-.453,2.194.157,3.274.4a21.384,21.384,0,0,1,2.42.609,40.5,40.5,0,0,1,4.911,1.619,9.926,9.926,0,0,1,3.169,3.361,8.422,8.422,0,0,1,1.132,1.689c.1.261.522.836.279,1.149-.209.261-2.125.087-2.438.017-1.48-.348-2.177-1.863-3.152-2.873a22.067,22.067,0,0,0-2.194-2.055,14.154,14.154,0,0,0-3.639-2.09c-.575-.244-1.132-.522-1.706-.749a7.528,7.528,0,0,1-.975-.383,7.123,7.123,0,0,0-1.08-.7" transform="translate(-455.403 -80.245)" fill="#fff"/>
                </g>
              </g>
            </g>
          </svg>
        </a>

        <div style={{ display:'flex', alignItems:'center', gap:32 }}>
          <a href="#booking-widget" className={styles.navBooking} style={{ visibility: menuOpen ? 'hidden' : 'visible' }}>Book your massage now</a>
          <button onClick={()=>setMenuOpen(true)} aria-label="Open menu" className={styles.hamburger} style={{ visibility: menuOpen ? 'hidden' : 'visible' }}>
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <line x1="1" y1="1.5" x2="23" y2="1.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="1" y1="10" x2="23" y2="10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="1" y1="18.5" x2="23" y2="18.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={()=>setMenuOpen(false)} />

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
            <p className={styles.heroSub}>Book your appointment now, it only takes 2 minutes with our online booking tool</p>
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
        <Testimonials />

        {/* LOGOS */}
        <LogoSlider />

        {/* FOOTER */}
        <footer className={styles.footer}>
          <p className={styles.footerCompany}>Lucy Hall Massage Therapy</p>
          <div className={styles.footerAddress}>
            2 Antwerp Cottages,<br/>Thoday Street,<br/>Cambridge,<br/>CB1 3AU<br/>
            <a href="tel:07765555078" style={{ textDecoration:'underline' }}>07765 555078</a><br/>
            <a href="https://maps.google.com" target="_blank" rel="noopener" style={{ textDecoration:'underline' }}>Google map</a>
          </div>
          <p className={styles.footerHoursTitle}>Opening Times</p>
          <div className={styles.footerHours}>
            Monday &nbsp;&nbsp;&nbsp;~ 9am to 8pm<br/>
            Tuesday &nbsp;&nbsp;~ 9am to 8pm<br/>
            Wednesday ~ 9am to 8pm<br/>
            Thursday &nbsp;~ 9am to 8pm<br/>
            Friday &nbsp;&nbsp;&nbsp;&nbsp;~ 9am to 6pm<br/>
            Saturday &nbsp;~ 9am to 5.30pm<br/>
            Sunday &nbsp;&nbsp;&nbsp;~ 10am to 5pm
          </div>

          {/* Desktop 5-col footer grid */}
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <h4>Lucy Hall Massage Therapy</h4>
              <p style={{ fontSize:'0.82rem', color:'#ffffff', fontWeight:300, lineHeight:1.6 }}>
                2 Antwerp Cottages,<br/>Thoday Street,<br/>Cambridge, CB1 3AU<br/>
                <a href="tel:07765555078" style={{ textDecoration:'underline' }}>07765 555078</a><br/>
                <a href="https://maps.google.com" target="_blank" rel="noopener" style={{ textDecoration:'underline' }}>Google map</a>
              </p>
            </div>
            <div className={styles.footerCol}>
              <h4>Main Menu</h4>
              <ul>
                {['Homepage','Book online','Treatments','About','News','Contact','Testimonials','Gift Vouchers'].map(i=><li key={i}><a href="#">{i}</a></li>)}
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Useful Links</h4>
              <ul>
                {['FAQ','Facebook','Instagram','LinkedIn','SOP','Privacy Policy','Terms of Use','Receipts'].map(i=><li key={i}><a href="#">{i}</a></li>)}
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Treatments</h4>
              <ul>
                {['Deep Tissue','Massage','Hopi Ear','Physiotherapy','Pregnancy','Relaxation','Sports Massage','Swedish'].map(i=><li key={i}><a href="#">{i}</a></li>)}
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Opening Times</h4>
              <p style={{ fontSize:'0.82rem', color:'#ffffff', fontWeight:300, lineHeight:1.9 }}>
                Monday &nbsp;&nbsp;– 9am to 8pm<br/>
                Tuesday &nbsp;– 9am to 8pm<br/>
                Wednesday – 9am to 8pm<br/>
                Thursday – 9am to 8pm<br/>
                Friday &nbsp;&nbsp;&nbsp;– 9am to 6pm<br/>
                Saturday – 9am to 5.30pm<br/>
                Sunday &nbsp;&nbsp;– 10am to 5pm
              </p>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopy}>© 2026 LucyHallMassage</p>
            <div className={styles.footerLinks}>
              <a href="#">Cookies</a><span className={styles.footerSep}>|</span>
              <a href="#">Privacy Policy</a><span className={styles.footerSep}>|</span>
              <a href="#">Certification</a><span className={styles.footerSep}>|</span>
              <a href="#">Data Request</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
