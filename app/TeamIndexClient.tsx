'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';

const members = [
  {
    slug: 'safia',
    name: 'Safia',
    title: 'Massage Therapist',
    location: 'Cromwell Road',
    locationSlug: 'cromwell-road',
    photo: '/safia.png',
    treatments: ['Deep Tissue Massage', 'Sports Massage'],
    bio: 'Safia is a highly skilled massage therapist based at our Cromwell Road clinic in Cambridge. With a passion for helping clients recover, perform and feel their best, she specialises in deep tissue and sports massage — working with everyone from office workers carrying chronic tension to athletes looking to optimise their recovery and performance. Safia holds a Level 3 Certificate in Massage Therapy and a Level 4 Certificate in Sports Massage Therapy, accredited by the CNHC. She is also a member of the Federation of Holistic Therapists (FHT).',
    corporate: false,
  },
  {
    slug: 'antonia',
    name: 'Antonia',
    title: 'Massage Therapist',
    location: 'Thoday Street',
    locationSlug: 'thoday-street',
    photo: '/antonia.png',
    treatments: ['Deep Tissue Massage', 'Pregnancy Massage', 'Swedish Massage', 'Relaxation Massage', 'Hopi Ear', 'Indian Head Massage', 'Hot Stone Massage'],
    bio: 'Antonia is a versatile and warm massage therapist based at our Thoday Street clinic in Cambridge. She offers one of the widest treatment menus in the practice — from deeply relaxing Swedish and relaxation massage to specialist pregnancy massage, Hopi Ear therapy, Indian Head massage and Hot Stone treatments. Antonia holds a Level 3 Certificate in Massage Therapy and a Level 4 Certificate in Sports Massage Therapy, accredited by the CNHC. She is also a qualified pregnancy massage practitioner and a member of the FHT.',
    corporate: false,
  },
  {
    slug: 'orla',
    name: 'Orla',
    title: 'Massage Therapist',
    location: 'Thoday Street',
    locationSlug: 'thoday-street',
    photo: '/orla.png',
    treatments: ['Cupping', 'Deep Tissue Massage', 'Sports Massage'],
    bio: 'Orla is an experienced massage therapist based at our Thoday Street clinic in Cambridge. She specialises in cupping therapy, deep tissue and sports massage — bringing a focused, clinical approach to each treatment that gets real results for her clients. Orla works with a wide range of clients, from those recovering from sports injuries and muscular strain to people looking to address long-standing postural issues or chronic pain. She holds a Level 3 and Level 4 Certificate in Massage Therapy, accredited by the CNHC, and is a trained cupping therapy practitioner and member of the FHT.',
    corporate: false,
  },
  {
    slug: 'lucy-hall',
    name: 'Lucy Hall',
    title: 'Owner & CEO',
    location: 'Cambridge',
    locationSlug: '',
    photo: '/lucy-profile.jpg',
    treatments: ['Corporate Massage', 'Seated Acupressure', 'Deep Tissue Massage', 'Sports Massage'],
    bio: 'Lucy founded Lucy Hall Massage Therapy with a simple vision: to make high-quality, professional massage therapy accessible to everyone in Cambridge. With over a decade of experience in the industry, she leads both the clinical and corporate sides of the business — overseeing the clinic team at Thoday Street and Cromwell Road while managing the company\'s growing B2B corporate massage programme. Lucy is passionate about the transformative impact that regular massage has on both physical and mental wellbeing, and she has built a team that shares that commitment to excellence.',
    corporate: true,
  },
  {
    slug: 'claire',
    name: 'Claire',
    title: 'Massage Therapist',
    location: 'Corporate',
    locationSlug: '',
    photo: '/claire-profile.jpg',
    treatments: ['Corporate Massage', 'Seated Acupressure', 'Chair Massage'],
    bio: 'Claire is a skilled massage therapist specialising in corporate and on-site massage. Based across Cambridge and the surrounding region, she delivers seated acupressure and chair massage treatments directly to workplaces — helping employees reduce stress, improve focus and feel their best. Claire brings warmth, professionalism and a calm presence to every corporate event or wellness day she attends, and is a trusted member of the Lucy Hall corporate massage team.',
    corporate: true,
  },
  {
    slug: 'katerina',
    name: 'Katerina',
    title: 'Massage Therapist',
    location: 'Corporate',
    locationSlug: '',
    photo: '/katerina-profile.jpg',
    treatments: ['Corporate Massage', 'Seated Acupressure', 'Chair Massage'],
    bio: 'Katerina is an experienced massage therapist with a particular focus on corporate wellness. She specialises in seated acupressure and chair massage, delivering on-site treatments to businesses across Cambridge and beyond. Katerina is known for her intuitive approach and ability to quickly identify and address areas of tension — making her corporate massage sessions both deeply effective and genuinely relaxing. She is a valued member of the Lucy Hall corporate team.',
    corporate: true,
  },
];

export default function TeamIndexClient() {
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

        {/* HERO */}
        <div ref={heroRef} className={styles.hero} style={{ backgroundColor: '#1a1a1a' }}>
          <Image src="/main-team-hero-img.jpg" alt="Lucy Hall Massage Therapy Team" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
          <div ref={scrollOverlayRef} className={styles.heroScrollOverlay} />
          <div className={styles.heroGradient} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', zIndex: 5, pointerEvents: 'none' }} />
          <div className={styles.heroContent} style={{ zIndex: 10 }}>
            <h1 className={styles.heroH1}>Our Team</h1>
            <p className={styles.heroSub}>Experienced, qualified and passionate about what they do</p>
          </div>
        </div>

        {/* TEAM GRID — uses .team-grid class so we can apply media queries.
            Mobile (<768px): 1 column. Tablet+ (768px+): 2 columns. */}
        <div className="team-grid">
          {members.map((m) => (
            <div key={m.slug} className="team-card">

              {/* Profile photo + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '1px solid #ffffff', position: 'relative', flexShrink: 0 }}>
                  <Image src={m.photo} alt={m.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 6 }}>{m.name}</h2>
                  <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', opacity: 0.6, letterSpacing: '0.06em' }}>{m.title}</p>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, marginBottom: 28 }}>{m.bio}</p>

              {/* Treatments */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 12, opacity: 0.5 }}>Treatments</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {m.treatments.map((t) => (
                    <span key={t} style={{ fontSize: '0.82rem', fontWeight: 300, color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)', padding: '5px 12px' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ffffff', marginBottom: 8, opacity: 0.5 }}>Location</p>
                {m.locationSlug ? (
                  <a href={`/locations/${m.locationSlug}`} style={{ fontSize: '0.95rem', fontWeight: 300, color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 2 }}>
                    {m.location}, Cambridge
                  </a>
                ) : (
                  <p style={{ fontSize: '0.95rem', fontWeight: 300, color: '#ffffff' }}>{m.location}</p>
                )}
              </div>

              {/* CTA — only for clinic (non-corporate) members */}
              {!m.corporate && (
                <a
                  href={`/team/${m.slug}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', textDecoration: 'none', border: '1px solid #ffffff', padding: '13px 28px' }}
                  onMouseEnter={e => { const a = e.currentTarget.querySelector('.ba') as HTMLElement; if (a) a.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { const a = e.currentTarget.querySelector('.ba') as HTMLElement; if (a) a.style.transform = 'translateX(0)'; }}
                >
                  Book with {m.name}
                  <span className="ba" style={{ display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s ease' }}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        <Footer />

        {/* Responsive grid styles.
            Mobile (<768px): 1 column, narrower padding.
            Tablet+ (768px+): 2 columns, full padding. */}
        <style>{`
          .team-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 60px 24px 60px;
            background: #000000;
          }

          .team-card {
            background: #000000;
            padding: 32px 24px;
            border: 1px solid rgba(255, 255, 255, 0.12);
          }

          @media (min-width: 768px) {
            .team-grid {
              grid-template-columns: 1fr 1fr;
              gap: 48px;
              padding: 80px 48px 80px;
            }
            .team-card {
              padding: 48px 48px;
            }
          }
        `}</style>
      </main>
    </>
  );
}
