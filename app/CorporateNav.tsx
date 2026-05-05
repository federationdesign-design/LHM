'use client';

import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────
   CorporateNav — slim header used across every /corporate page.

   Layout:
     - Left:  the corporate-side LH logo, links back to /corporate
     - Right: "Enquire about your team here" text link, points
              to /corporate/enquire (the standalone enquiry page)

   This nav is intentionally simpler than the splash nav. It's
   always in its compact state — no expand-on-load behaviour.
   Background is solid black to match the rest of the site.

   Sticky positioning so it stays pinned at the top while the
   user scrolls through the page.
   ───────────────────────────────────────────────────────────── */

export default function CorporateNav() {
  return (
    <nav className="corp-nav">

      <Link href="/corporate" className="corp-nav-logo-link" aria-label="Lucy Hall Massage Corporate — home">
        <img
          src="/LHM-corp-logo.svg"
          alt="Lucy Hall Massage Corporate"
          className="corp-nav-logo"
          draggable={false}
        />
      </Link>

      <Link href="/corporate/enquire" className="corp-nav-cta">
        Enquire about your team here
      </Link>

      <style>{`
        .corp-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          min-height: 64px;
        }

        .corp-nav-logo-link {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
        }

        .corp-nav-logo {
          height: 28px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .corp-nav-cta {
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 400;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: opacity 0.2s ease;
        }
        .corp-nav-cta:hover {
          opacity: 0.8;
        }

        /* Mobile: smaller logo, smaller CTA */
        @media (max-width: 767px) {
          .corp-nav {
            padding: 10px 16px;
            min-height: 56px;
          }
          .corp-nav-logo {
            height: 22px;
          }
          .corp-nav-cta {
            font-size: 0.85rem;
            text-align: right;
            max-width: 60%;
            line-height: 1.2;
          }
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .corp-nav-cta {
            font-size: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}
