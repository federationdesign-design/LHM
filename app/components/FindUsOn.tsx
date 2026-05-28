'use client';

import { useState, useRef } from 'react';
import styles from '../page.module.css';

/* ─────────────────────────────────────────────────────────────
   FindUsOn — shared "Find us on:" social logos block.
   Used on the splash, private homepage, and ~12 other pages.

   Visual:
   - Mobile: swipeable carousel, one logo visible at a time
   - Desktop: static row of all 5 logos
   (Mobile/desktop visibility is controlled by .logoSlider / .logoRow
   CSS rules in page.module.css — this component renders both and
   lets CSS hide whichever isn't appropriate.)

   All logos are clickable, open in a new tab.

   Single source of truth — update logos here and every page that
   uses this component gets the change.
   ───────────────────────────────────────────────────────────── */

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage', href: 'https://booking.page/en/company/page/lucyhallmassage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor', href: 'https://www.tripadvisor.co.uk/Attraction_Review-g186225-d19454707-Reviews-Lucy_Hall_Massage-Cambridge_Cambridgeshire_England.html' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me', href: 'https://lucyhallmassage.simplybook.it/v2/' },
  { src: '/linked_in.png', alt: 'LinkedIn', href: 'https://www.linkedin.com/in/lucy-hall-47369141/' },
];

export default function FindUsOn() {
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
    <div style={{ paddingTop: 40 }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff', textAlign: 'center', marginBottom: 24, opacity: 0.7 }}>
        Find us on:
      </h3>
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
              <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.alt}>
                <img src={logo.src} alt={logo.alt} className={styles.logoImg} draggable={false} />
              </a>
            </div>
          ))}
        </div>
        <div className={styles.logoRow}>
          {logos.map((logo) => (
            <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.alt}>
              <img src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
