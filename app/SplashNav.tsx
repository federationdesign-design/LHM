'use client';

import { useEffect, useId, useState } from 'react';
import styles from './page.module.css';

/* ─────────────────────────────────────────────────────────────
   SplashNav — header used only on the splash page at /.

   Scroll-driven shrink behaviour:
     - Tracks scroll position via a one-shot listener
     - As soon as scrollY > 0 the `shrunk` state flips to true
       and stays true for the rest of the session (does not
       reset when scrolling back to top)
     - In the shrunk state, the nav becomes a slim header that
       echoes the standard Nav.tsx used on /private etc. but
       keeps the two side logos (Private/Corporate) so the user
       can still pick a side mid-page
     - The full Lucy Hall logo and My Body / My Team labels
       fade out and are removed from the layout (display: none
       under the shrunk class)
     - All transitions are CSS-driven (height, opacity) for a
       smooth handoff

   Header still 140px tall in the unshrunk state, side logos
   36px, labels 2.4rem.
   ───────────────────────────────────────────────────────────── */

// ── PRIVATE LOGO (LH with hand) ──────────────────────────────
const PrivateLogo = ({ clipId }: { clipId: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.282 30.071" className="splash-side-logo">
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

interface SplashNavProps {
  onSelect: (side: 'private' | 'corporate') => void;
}

export default function SplashNav({ onSelect }: SplashNavProps) {
  const reactId = useId();
  const clipId = `clip-splashnav-${reactId.replace(/:/g, '')}`;

  // One-way shrink trigger: flips true on first scroll past 0
  // and stays true for the rest of the session.
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    if (shrunk) return; // Already shrunk, no need to listen anymore
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShrunk(true);
      }
    };
    // Run once on mount in case the page loads pre-scrolled
    // (e.g. browser restored scroll position on refresh)
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shrunk]);

  return (
    <nav
      className={[
        styles.nav,
        styles.navSolid,
        'splash-nav-tall',
        'splash-nav-sticky',
        shrunk ? 'splash-nav-shrunk' : '',
      ].join(' ').trim()}
      style={{ position: 'sticky', top: 0 }}
    >

      {/* LEFT side logo */}
      <button
        type="button"
        onClick={() => onSelect('private')}
        aria-label="Lucy Hall Massage — Private"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flex: '0 0 auto' }}
      >
        <PrivateLogo clipId={clipId} />
      </button>

      {/* CENTRE BLOCK — full logo + labels — fades out when shrunk */}
      <div className="splash-nav-centre">
        <div className="splash-nav-centre-grid">
          <img
            src="/full-LHM-logo.svg"
            alt="Lucy Hall Massage"
            className="splash-full-logo"
            draggable={false}
          />
          <button
            type="button"
            onClick={() => onSelect('private')}
            className="splash-nav-label splash-nav-label--left"
          >
            My Body
          </button>
          <div className="splash-nav-gutter-spacer" aria-hidden="true" />
          <button
            type="button"
            onClick={() => onSelect('corporate')}
            className="splash-nav-label splash-nav-label--right"
          >
            My Team
          </button>
        </div>
      </div>

      {/* RIGHT side logo */}
      <button
        type="button"
        onClick={() => onSelect('corporate')}
        aria-label="Lucy Hall Massage — Corporate"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flex: '0 0 auto', marginLeft: 'auto' }}
      >
        <img
          src="/LHM-corp-logo.svg"
          alt="Lucy Hall Massage Corporate"
          className="splash-side-logo splash-corp-logo"
          draggable={false}
        />
      </button>

      <style>{`
        /* Sticky positioning. z-index 100 keeps the nav above the
           spine (z 3) and any panel content (z 2). The background
           comes from styles.navSolid (black). */
        .splash-nav-sticky {
          position: sticky !important;
          top: 0;
          z-index: 100;
          background: #000000;
        }

        .splash-nav-tall {
          min-height: 140px;
          padding-top: 18px;
          padding-bottom: 18px;
          align-items: center;
          /* Smoothly animate height/padding when shrinking */
          transition: min-height 0.35s ease, padding 0.35s ease;
        }

        /* ── SHRUNK STATE ────────────────────────────────────
           Once the user scrolls past the top, the nav compresses
           to a slim 64px header. The full LHM logo and My Body /
           My Team labels are removed entirely (display: none on
           the centre block) so only the side Private/Corporate
           logos remain. */
        .splash-nav-shrunk.splash-nav-tall {
          min-height: 64px;
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .splash-nav-shrunk .splash-nav-centre {
          display: none;
        }
        .splash-nav-shrunk .splash-side-logo {
          height: 24px;
          transition: height 0.35s ease;
        }
        @media (max-width: 600px) {
          .splash-nav-shrunk.splash-nav-tall {
            min-height: 56px;
          }
          .splash-nav-shrunk .splash-side-logo {
            height: 22px;
          }
        }

        /* ── UNSHRUNK CENTRE BLOCK ──────────────────────────── */
        .splash-nav-centre {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.25s ease;
        }
        .splash-nav-centre-grid {
          display: grid;
          grid-template-columns: 1fr 90px 1fr;
          align-items: center;
          width: 100%;
          row-gap: 10px;
          column-gap: 0;
        }
        .splash-nav-centre-grid > * {
          pointer-events: auto;
        }

        .splash-full-logo {
          grid-column: 1 / -1;
          height: 53px;
          width: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
        }

        .splash-nav-label {
          background: none;
          border: none;
          color: #ffffff;
          font-family: inherit;
          font-size: 2.4rem;
          font-weight: 500;
          padding: 4px 0;
          cursor: pointer;
          letter-spacing: 0.02em;
          line-height: 1;
          transition: opacity 0.2s ease;
        }
        .splash-nav-label:hover {
          opacity: 0.8;
        }
        .splash-nav-label--left {
          justify-self: end;
        }
        .splash-nav-label--right {
          justify-self: start;
        }

        .splash-nav-gutter-spacer {
        }

        .splash-side-logo {
          height: 36px;
          width: auto;
          object-fit: contain;
          display: block;
          transition: height 0.35s ease;
        }
        .splash-corp-logo {
          width: auto !important;
        }

        @media (max-width: 600px) {
          .splash-nav-tall {
            min-height: 110px;
          }
          .splash-nav-label {
            font-size: 1.6rem;
          }
          .splash-full-logo {
            height: 42px;
          }
          .splash-side-logo {
            height: 30px;
          }
          .splash-nav-centre-grid {
            grid-template-columns: 1fr 24px 1fr;
          }
        }
      `}</style>
    </nav>
  );
}
