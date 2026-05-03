'use client';

import { useEffect, useId, useState } from 'react';
import styles from './page.module.css';

const menuItems: [string, string][] = [
  ['Home', '/'],
  ['Treatments', '/treatments'],
  ['Locations', '/locations'],
  ['Our Team', '/team'],
  ['Testimonials', '/testimonials'],
  ['Gift Vouchers', '/gift-vouchers'],
  ['Blog', '/news'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
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

const Logo = ({ clipId }: { clipId: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 111.282 30.071" className={styles.logo}>
    <defs><clipPath id={clipId}><rect width="111.282" height="30.071" fill="#fff" /></clipPath></defs>
    <g transform="translate(-31 -27.26)">
      <g transform="translate(31 27.581)">
        <path d="M0,1.846V29.481H17.117V26.224H3.622V1.846Z" transform="translate(0 -1.846)" fill="#fff" />
        <path d="M122.96,29.481V1.846h3.657V13.2h14.331V1.846h3.639V29.481h-3.639V16.456H126.617V29.481Z" transform="translate(-101.548 -1.846)" fill="#fff" />
      </g>
      <path d="M122.464,28.985h.1V1.455h3.448V12.808h14.54V1.455h3.43V28.881h-3.43V15.856h-14.54V28.881h-3.552v.1h0v.1h3.761V16.065h14.122V29.09H144.2V1.246h-3.848V12.6H126.226V1.246H122.36V29.09h.1Z" transform="translate(-70.053 26.231)" fill="#fff" />
      <g transform="translate(31 27.26)">
        <g clipPath={`url(#${clipId})`}>
          <path d="M278.8,0c-.07.7,1.915,2.037,2.49,2.595,1.114,1.08,2.264,2.02,3.378,3.065,2.09,1.968,4.04,3.6,6.983,4.2a25.506,25.506,0,0,0,4.615.035l5.311.052c2.838.035,5.485.313,8.306.348,2.769.035,5.363.4,8.115.5,1.2.052,2.333.3,3.552.348a23.372,23.372,0,0,1,4.127.435,35.489,35.489,0,0,1,4.266,1.672c1.323.5,2.7,1.114,4.005,1.619,1.184.453,2.542,1.045,3.761,1.6.592.279,1.933.47,2.386.923a1.431,1.431,0,0,1-.157,2.02c-.749.435-2.281-.261-3.03-.435-.888-.192-1.776-.418-2.629-.627-1.6-.383-3.082-.975-4.7-1.428-2.455-.679-5.137-.453-7.749-.418a11.263,11.263,0,0,0-5.921,1.254,14.434,14.434,0,0,0-3.274,2.838c-.871.975-1.167,2-2.647,1.619-.07-.017-.644-.331-.731-.383-.331-.157-.644-.244-.975-.4-1.341-.644-2.891-1.027-4.179-1.654-.853-.418-1.794-.8-2.751-1.2a14.693,14.693,0,0,0-2.316-.853c.122,1.045,2.072,1.5,2.891,1.794,1.149.418,2.229.94,3.361,1.41,2.281.94,4.51,1.672,6.861,2.542,1.9.714,7.174,2.055,5.938,5.085-1.219,3.013-6.13.7-8.167.1-1.167-.331-2.142-.818-3.309-1.114-.209-.052-.244-.279-.5-.331-.488-.1-1.027,0-1.532-.1a5.521,5.521,0,0,0-2.612.035c-.522.087-1.1-.052-1.619.087-.261.07-.4.279-.662.331-.784.174-1.585.313-2.368.435-.958.139-1.968.3-2.908.348a12.266,12.266,0,0,1-2.891-.331c-4.3-.627-6.774-4.615-10.048-7.07-.488-.366-.906-.853-1.428-1.219-.47-.331-1.254-.7-1.323-1.323-.052-.488.331-.644.435-1.01a8.794,8.794,0,0,0,.122-1.794,16.743,16.743,0,0,0-.383-3.866c-.4-1.846-.749-3.692-1.1-5.555a20.045,20.045,0,0,1-.261-3.57A5.594,5.594,0,0,1,277.8.731C278.047.035,278,0,278.8,0" transform="translate(-229.198 0)" fill="#fff" />
          <path d="M492.506,111.471c.122.435.8.644,1.132.923.505.4.958.905,1.393,1.323.279.261.958.731,1.1,1.045.366.784-.366,1.306-1.132,1.219-1.149-.139-2.42-1.167-3.343-1.672a31.771,31.771,0,0,0-3.848-1.689c-.644-.244-1.323-.557-1.968-.731-.383-.1-.818-.017-1.2-.087-.366-.052-.644-.261-.958-.313-.836-.157-6.2.871-6.391.226-.157-.557,1.985-2.194,2.438-2.612a2.027,2.027,0,0,1,2.177-.5c.731.174,1.515.3,2.264.47,1.271.3,2.716.714,4.005,1.062.8.209,1.619.279,2.42.522.679.174,1.184.7,1.916.818" transform="translate(-394.167 -89.599)" fill="#fff" />
          <path d="M524.128,107.457a4.685,4.685,0,0,1,0,1.306c-.244.348-.47.261-1.01.261a2.558,2.558,0,0,1-1.724-.453,21.517,21.517,0,0,1-1.567-1.532,33.967,33.967,0,0,0-3.413-3.309,14.31,14.31,0,0,0-5.154-2.09c-1.1-.261-2.194-.488-3.291-.766-.522-.122-1.08-.157-1.585-.279-.853-.209-1.254-.035-1.358-.975a12.087,12.087,0,0,0,1.654-.4,12.653,12.653,0,0,1,2.438-.035,8.687,8.687,0,0,1,3.465.731c1.637.609,3.256,1.2,4.841,1.759a9.788,9.788,0,0,1,3.483,2.351,14.355,14.355,0,0,1,1.532,1.55c.488.609.975,1.532,1.689,1.881" transform="translate(-417.082 -81.877)" fill="#fff" />
          <path d="M551.425,97.328c1.062-.453,2.194.157,3.274.4a21.384,21.384,0,0,1,2.42.609,40.5,40.5,0,0,1,4.911,1.619,9.926,9.926,0,0,1,3.169,3.361,8.422,8.422,0,0,1,1.132,1.689c.1.261.522.836.279,1.149-.209.261-2.125.087-2.438.017-1.48-.348-2.177-1.863-3.152-2.873a22.067,22.067,0,0,0-2.194-2.055,14.154,14.154,0,0,0-3.639-2.09c-.575-.244-1.132-.522-1.706-.749a7.528,7.528,0,0,1-.975-.383,7.123,7.123,0,0,0-1.08-.7" transform="translate(-455.403 -80.245)" fill="#fff" />
        </g>
      </g>
    </g>
  </svg>
);

interface NavProps {
  solid?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Nav({ solid = false, scrollRef }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(solid);

  const reactId = useId();
  const clipId = `clip-nav-${reactId.replace(/:/g, '')}`;

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
        <a href="/" aria-label="Lucy Hall Massage">
          <Logo clipId={clipId} />
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
