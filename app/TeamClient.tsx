'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import Testimonials from './components/Testimonials/Testimonials';
import type { TeamMember } from './data/team';
import FindUsOn from '@/app/components/FindUsOn';
import CorporateNav from './CorporateNav';
import CorporateFooter from './CorporateFooter';
import SecondaryEnquiryModal from './corporate/components/SecondaryEnquiryModal';
import { corporateTestimonials } from './components/Testimonials/corporate-testimonials-data';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';

// ── BOOKING WIDGET ────────────────────────────────────────────────────────────
function BookingWidget({ providerId }: { providerId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `sbw_provider_${providerId}`;

  useEffect(() => {
    const existing = document.querySelector(`script[data-provider="${providerId}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.async = true;
    script.setAttribute('data-provider', providerId);
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
            sb_base_color: '#ffffff',
            display_item_mode: 'list',
            booking_nav_bg_color: '#000000',
            // FIX: dark_font_color was '#ffffff' which produced white text on white
            // buttons in the booking widget. Changed to '#000000' so dark text
            // renders on light/white buttons — matching the styling of the newer
            // booking widgets used elsewhere on the site.
            dark_font_color: '#000000',
            btn_color_1: '#2cd12c',
            sb_company_label_color: '#ffffff',
            hide_img_mode: '0',
            show_sidebar: '1',
            sb_busy: '#db1f4b',
            sb_available: '#2cd12c',
          },
          timeline: 'modern', datepicker: 'inline_datepicker', is_rtl: false,
          app_config: { clear_session: 0, allow_switch_to_ada: 0, predefined: { provider: providerId } },
          container_id: widgetId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [providerId, widgetId]);

  return <div id={widgetId} ref={containerRef} style={{ width: '100%' }} />;
}

// ── LOGO SLIDER ───────────────────────────────────────────────────────────────
// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function TeamClient({ member, variant = 'private' }: { member: TeamMember; variant?: 'private' | 'corporate' }) {
  const isCorp = variant === 'corporate';
  const [modalOpen, setModalOpen] = useState(false);
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
      {isCorp ? <CorporateNav transparent scrollRef={heroRef} /> : <Nav scrollRef={heroRef} />}
      <main className={styles.page}>

        {/* HERO */}
        <div ref={heroRef} className={styles.hero} style={{ backgroundColor: member.heroColor }}>
          <div className={styles.heroMobileImg} style={{ position: 'absolute', inset: 0 }}>
            <Image src={member.heroMobile} alt={member.name} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority onError={() => {}} />
          </div>
          <div className={styles.heroDesktopImg} style={{ position: 'absolute', inset: 0 }}>
            <Image src={member.heroDesktop} alt={member.name} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority onError={() => {}} />
          </div>
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          <div className={styles.heroContent}>
            <Breadcrumbs items={isCorp ? [
              { label: 'Home', href: '/corporate' },
              { label: 'Corporate', href: '/corporate' },
              { label: 'Team', href: '/corporate/team' },
              { label: member.name },
            ] : [
              { label: 'Home', href: '/private' },
              { label: 'Team', href: '/team' },
              { label: member.name },
            ]} />
            <h1 className={styles.heroH1}>{member.name}</h1>
            <p className={styles.heroSub}>{member.title}</p>
            {isCorp ? (
              <a href="#" onClick={(e) => { e.preventDefault(); setModalOpen(true); }} className={styles.heroBookNow}>Enquire about your team</a>
            ) : (
              <a href="#booking-widget" className={styles.heroBookNow}>BOOK NOW ↓</a>
            )}
          </div>
        </div>

        {/* PROFILE + BIO */}
        <section style={{ padding: '48px 24px 48px', background: '#000000' }}>
          <div className="team-bio-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

            {/* Profile photo + name row */}
            <div className="team-bio-avatar" style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '1px solid #ffffff', flexShrink: 0, background: '#1a1a1a', position: 'relative' }}>
                <Image src={member.profilePhoto} alt={member.name} fill style={{ objectFit: 'cover' }} onError={() => {}} />
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 600, color: '#ffffff', marginBottom: 4, lineHeight: 1.1 }}>{member.name}</p>
                <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', letterSpacing: '0.06em' }}>{member.title}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="team-bio-text">
              {member.bio.map((para: string, i: number) => (
                <p key={i} style={{ fontSize: '1.125rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.3, marginBottom: 20 }}>{para}</p>
              ))}
            </div>

            {/* Treatments (hidden on corporate variant) */}
            {!isCorp && (
            <div className="team-bio-treatments" style={{ marginTop: 32 }}>
              <h2 className="team-bio-treatments-h2" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', marginBottom: 16, textAlign: 'center' }}>Treatments offered</h2>
              <div className="team-bio-treatments-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {member.treatments.map((t: string) => (
                  <span key={t} style={{ fontSize: '0.82rem', fontWeight: 300, color: '#ffffff', border: '1px solid #ffffff', padding: '6px 14px', letterSpacing: '0.04em' }}>{t}</span>
                ))}
              </div>
            </div>
            )}
            <style>{`
              @media (max-width: 1023px) {
                .team-bio-avatar { order: 2; margin-top: 32px; margin-bottom: 0 !important; }
                .team-bio-text { order: 1; }
                .team-bio-treatments { order: 3; }
                .team-bio-treatments-h2 { text-align: left !important; }
                .team-bio-treatments-tags { justify-content: flex-start !important; }
              }
            `}</style>
          </div>
        </section>

        {/* BOOKING WIDGET - hidden for team members without a widget ID, and on corporate variant */}
        {!isCorp && member.widgetProviderId && (
          <div id="booking-widget" className={styles.widgetWrapper}>
            <BookingWidget providerId={member.widgetProviderId} />
          </div>
        )}

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* TESTIMONIALS */}
        {isCorp ? (
          <Testimonials
            items={corporateTestimonials}
            useLogos
            heading="Trusted by leading Cambridge companies and businesses including Cambridge University"
          />
        ) : (
          <Testimonials heading="Happy private clients include" />
        )}

        {/* LOGO SLIDER */}
        <FindUsOn />
        {isCorp ? <CorporateFooter /> : <Footer />}
      </main>
      {isCorp && (
        <SecondaryEnquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialName=""
          initialEmail=""
          initialMobile=""
          standalone
        />
      )}
    </>
  );
}
