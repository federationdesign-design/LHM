'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import Testimonials from './components/Testimonials/Testimonials';
import type { Service } from './data/services';
import { serviceAvailability } from './data/serviceAvailability';
import { team } from './data/team';
import { articles } from './data/articleData';
import FindUsOn from '@/app/components/FindUsOn';

// ── SIMPLYBOOK WIDGET ─────────────────────────────────────────
function BookingWidget({ service }: { service: Service }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `sbw_${service.slug.replace(/-/g, '')}`;

  // Determine widget pre-filtering based on service availability:
  //   - If service is in the availability map and offered at ONE location → pre-fill service + location
  //   - If service is in the availability map and offered at MULTIPLE locations → pre-fill service only (user picks location)
  //   - If service is NOT in the availability map → fall back to the legacy widgetLocation on the Service type
  // Provider is added separately if widgetProvider is set on the Service.
  const availableLocations = serviceAvailability[service.slug];
  const basePredefined = availableLocations
    ? (availableLocations.length === 1
        ? { service: service.widgetService, location: availableLocations[0] }
        : { service: service.widgetService })
    : { service: service.widgetService, location: service.widgetLocation };
  // V2 (60/90/120 min pages) preselects service only — location and provider
  // are intentionally omitted so customers see all assigned therapists across
  // both locations in the SimplyBook widget itself.
  const predefined = service.widgetThemeV2
    ? { service: service.widgetService }
    : service.widgetProvider
      ? { ...basePredefined, provider: service.widgetProvider }
      : basePredefined;

  const themeV2 = service.widgetThemeV2;

  useEffect(() => {
    const existing = document.querySelector('script[src*="simplybook"]');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
          widget_type: 'iframe',
          url: 'https://lucyhallmassage.simplybook.it',
          theme: 'concise',
          theme_settings: {
            timeline_hide_unavailable: '1', hide_past_days: '0',
            timeline_show_end_time: '0', timeline_modern_display: 'as_slots',
            light_font_color: '#ffffff', sb_secondary_base: '#000000',
            sb_base_color: themeV2 ? '#545557' : '#ffffff',
            display_item_mode: themeV2 ? 'block' : 'list',
            booking_nav_bg_color: '#000000', sb_review_image: '115',
            sb_review_image_preview: '/uploads/lucyhallmassage/image_files/preview/4ecc8dab4516d05ab44aa11a3cfd7405.jpg',
            dark_font_color: '#000000', btn_color_1: '#2cd12c',
            sb_company_label_color: themeV2 ? '#000000' : '#ffffff',
            hide_img_mode: '0',
            show_sidebar: '1', sb_busy: '#db1f4b', sb_available: '#2cd12c',
          },
          timeline: themeV2 ? 'modern_week' : 'modern',
          datepicker: themeV2 ? 'top_calendar' : 'inline_datepicker',
          is_rtl: false,
          app_config: {
            clear_session: 0, allow_switch_to_ada: 0,
            predefined,
          },
          container_id: widgetId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId]);

  return <div id={widgetId} ref={containerRef} style={{ width: '100%' }} />;
}

// ── LOGO SLIDER ───────────────────────────────────────────────
// ── PROVIDER + ARTICLE SECTION ────────────────────────────────
function ProviderArticleSection({ service }: { service: Service }) {
  const providers = (service.providerSlugs ?? [])
    .map(slug => team[slug])
    .filter(Boolean);
  const article = service.featuredArticleSlug
    ? articles[service.featuredArticleSlug]
    : undefined;

  if (providers.length === 0 && !article) return null;

  return (
    <section className={styles.providerArticleSection}>
      <div className={styles.providerArticleGrid}>
        {/* Provider column */}
        <div className={styles.paCard}>
          <h3 className={styles.paCardHeading}>
            {providers.length > 1 ? 'Your therapists' : 'Your therapist'}
          </h3>
          {providers.map(p => (
            <a key={p.slug} href={`/team/${p.slug}`} className={styles.paProviderRow}>
              <Image
                src={p.profilePhoto}
                alt={p.name}
                width={80}
                height={80}
                className={styles.paProviderPhoto}
              />
              <div className={styles.paProviderText}>
                <div className={styles.paProviderName}>{p.name}</div>
                <div className={styles.paProviderTitle}>{p.title}</div>
                <p className={styles.paProviderBio}>{p.bio[0]}</p>
                <div className={styles.paProviderMeta}>
                  <div className={styles.paProviderMetaLabel}>Treatments</div>
                  <div className={styles.paTreatmentTags}>
                    {p.treatments.map(t => (
                      <span key={t} className={styles.paTreatmentTag}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.paProviderMeta}>
                  <div className={styles.paProviderMetaLabel}>Location</div>
                  <div className={styles.paProviderMetaValue}>{p.location}</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Article column */}
        {article && (
          <a href={`/news/${article.slug}`} className={styles.paArticleCard}>
            <h3 className={styles.paCardHeading}>Related article</h3>
            <div className={styles.paArticleImage}>
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 50vw, 540px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.paArticleBody}>
              <h3 className={styles.paArticleTitle}>{article.title}</h3>
              <p className={styles.paArticleExcerpt}>{article.excerpt}</p>
              <span className={styles.paArticleCta}>Read article →</span>
            </div>
          </a>
        )}

        {/* Start Your Journey card — shown only on selected treatment pages,
            sits below the related article in the same column.
            Slugs: 60/90/120-min massage and deep-tissue-massage. */}
        {['60-min-massage', '90-min-massage', '120-min-massage', 'deep-tissue-massage'].includes(service.slug) && (
          <a href="/start-your-journey" className={styles.paArticleCard}>
            <h3 className={styles.paCardHeading}>Start your journey</h3>
            <div className={styles.paArticleImage}>
              <Image
                src="/Get-tips-img.jpg"
                alt="Get tips and learn about the Impact of Sport on Your Body"
                fill
                sizes="(max-width: 1024px) 50vw, 540px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.paArticleBody}>
              <h3 className={styles.paArticleTitle}>Get tips and learn about the Impact of Sport on Your Body</h3>
              <p className={styles.paArticleExcerpt}>A free guide to help you understand how sport affects your body — and what regular bodywork can do to keep you performing at your best.</p>
              <span className={styles.paArticleCta}>Start Your Journey →</span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}

// ── MAIN SERVICE PAGE ─────────────────────────────────────────
export default function ServiceBookingClient({ service }: { service: Service }) {
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
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'MassageTherapist', '@id': 'https://www.lucyhallmassage.com/#business', name: 'Lucy Hall Massage Therapy', url: 'https://www.lucyhallmassage.com', telephone: '+447765555078', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '168', bestRating: '5' }, address: { '@type': 'PostalAddress', streetAddress: '2 Antwerp Cottages, Thoday Street', addressLocality: 'Cambridge', addressRegion: 'Cambridgeshire', postalCode: 'CB1 3AU', addressCountry: 'GB' }, geo: { '@type': 'GeoCoordinates', latitude: 52.1951, longitude: 0.1313 } },
            { '@type': 'Service', name: service.title, description: service.intro, provider: { '@id': 'https://www.lucyhallmassage.com/#business' }, areaServed: { '@type': 'City', name: 'Cambridge' }, url: service.canonicalUrl },
            { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.lucyhallmassage.com' }, { '@type': 'ListItem', position: 2, name: 'Treatments', item: 'https://www.lucyhallmassage.com/services' }, { '@type': 'ListItem', position: 3, name: service.title, item: service.canonicalUrl }] },
          ]
        })
      }} />
      <Nav scrollRef={heroRef} />
      <main className={styles.page}>
        {/* HERO */}
        <div ref={heroRef} className={styles.hero} style={{ backgroundColor: service.heroColor }}>
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          <Image src={service.heroMobile} alt={service.title} fill priority sizes="100vw" className={styles.heroMobileImg} style={{ objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.62)' }} />
          <Image src={service.heroDesktop} alt={service.title} fill priority sizes="100vw" className={styles.heroDesktopImg} style={{ objectFit: 'cover', objectPosition: 'center 40%', filter: 'brightness(0.62)', display: 'none' }} />
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroH1} ${styles.heroH1Treatment}`}>{service.h1}</h1>
            <p className={styles.heroSub}>{service.tagline}</p>
            <hr className={styles.heroRule} />
            <a href="#booking-widget" className={styles.heroBookNow}>BOOK NOW ↓</a>
          </div>
        </div>

        {/* SERVICE CONTENT */}
        <section className={styles.serviceSection}>
          <h2 className={styles.testimonialsHeading} style={{ marginBottom: 20 }}>Why you need this</h2>
          <p style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.5, textAlign: 'center', maxWidth: 860, margin: '0 auto 48px', display: 'block' }}>
            {service.intro}
          </p>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div className={styles.serviceGrid}>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.04em', color: '#ffffff', marginBottom: 20, lineHeight: 1.3 }}>
                  Benefits of this treatment on your body:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8 }}>
                  {service.benefits.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.04em', color: '#ffffff', marginBottom: 20, lineHeight: 1.3 }}>
                  We recommend this treatment for:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8 }}>
                  {service.recommendedFor.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROVIDER + ARTICLE */}
        <ProviderArticleSection service={service} />

        {/* WIDGET */}
        <div id="booking-widget" className={styles.widgetWrapper}>
          <BookingWidget service={service} />
        </div>

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
