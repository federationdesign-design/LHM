'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

/* ─────────────────────────────────────────────────────────────
   Nav — the shared navigation for the PRIVATE side of the site.
   Used on /private and all root-level private pages (/treatments,
   /team/*, /location/*, etc).

   The "Home" link and logo point to /private (not /). The root URL
   / now serves the splash page (SplashClient), which has its own
   header (SplashNav).
   ───────────────────────────────────────────────────────────── */

const menuItems: [string, string][] = [
  ['Home', '/private'],
  ['Treatments', '/treatments'],
  ['Locations', '/locations'],
  ['Our Team', '/team'],
  ['Testimonials', '/testimonials'],
  ['Gift Vouchers', '/gift-vouchers'],
  ['Blog', '/news'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
  ['Corporate', '/corporate'],
];

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s ease' }} />
      <div style={{ position: 'fixed', inset: 0, background: '#0a0908', zIndex: 400, opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(24px)', pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s ease, transform 0.25s ease', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <nav style={{ flex: 1, paddingTop: 80 }}>
          {menuItems.map(([label, href]) => (
            <a key={label} href={href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 32px', color: '#ffffff', textDecoration: 'none', fontSize: '1.15rem', fontWeight: 400, letterSpacing: '0.06em' }}>
              {/* Chevron 10x18 with marginTop: 3 — pushes the chevron down to align
                  with text optical centre. Previous marginTop was 0 — chevron sat
                  a few pixels above text cap-line. */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.622 59.257" style={{ width: 10, height: 18, flexShrink: 0, opacity: 0.7, marginTop: 3 }} overflow="visible">
                <g transform="translate(24.47 43.189) rotate(180)">
                  <path d="M21.131,41.2.708,20.778,21.131.354" transform="translate(2.735 9.994)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                </g>
              </svg>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}


interface NavProps {
  solid?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Nav({ solid = false, scrollRef }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(solid);


  useEffect(() => {
    if (solid) return;
    const handleScroll = () => {
      if (!scrollRef?.current) return;
      setNavSolid(window.scrollY > scrollRef.current.offsetHeight - 56);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [solid, scrollRef]);

  const lineTransition = 'transform 0.3s ease, opacity 0.2s ease';

  return (
    <>
      <nav className={`${styles.nav} ${navSolid ? styles.navSolid : ''}`}>
        {/* Logo links to /private — was / before splash was introduced */}
        <a href="/private" aria-label="Lucy Hall Massage">
          <img src="/LHM-private-logo-exact.svg" alt="Lucy Hall Massage" className={styles.logo} draggable={false} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Booking CTA — was a span, now an anchor linking to /book-online */}
          <a href="/book-online" className={styles.navBooking} style={{ textDecoration: 'none', color: 'inherit' }}>
            Book your massage now
          </a>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={styles.hamburger}
            style={{ position: 'relative', zIndex: 500 }}
          >
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none" style={{ overflow: 'visible' }}>
              <g style={{
                transformOrigin: '12px 10px',
                transform: menuOpen ? 'translateY(8.5px) rotate(45deg)' : 'translateY(0) rotate(0)',
                transition: lineTransition,
              }}>
                <line x1="1" y1="1.5" x2="23" y2="1.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              <g style={{
                opacity: menuOpen ? 0 : 1,
                transition: lineTransition,
              }}>
                <line x1="1" y1="10" x2="23" y2="10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              <g style={{
                transformOrigin: '12px 10px',
                transform: menuOpen ? 'translateY(-8.5px) rotate(-45deg)' : 'translateY(0) rotate(0)',
                transition: lineTransition,
              }}>
                <line x1="1" y1="18.5" x2="23" y2="18.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </svg>
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
