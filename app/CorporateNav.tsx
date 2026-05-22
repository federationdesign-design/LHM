'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SecondaryEnquiryModal from './corporate/components/SecondaryEnquiryModal';

const menuItems: [string, string][] = [
  ['Home',                       '/corporate'],
  ['Services',                   '/corporate/services'],
  ['In-Office Chair Massage',    '/corporate/services/in-chair-massage'],
  ['DSE Assessments',            '/corporate/services/dse-assessments'],
  ['Posture Consultations',      '/corporate/services/posture-consultations'],
  ['Our Team',                   '/corporate/team'],
  ['Reviews',                    '/reviews'],
  ['Book myself a massage',      '/private'],
  ['Main site',                  '/'],
  ['Contact Us',                 '/corporate/contact'],
];

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 300,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0908',
          zIndex: 400,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(24px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <nav style={{ flex: 1, paddingTop: 80 }}>
          {menuItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 32px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '1.15rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28.622 59.257"
                style={{ width: 10, height: 18, flexShrink: 0, opacity: 0.7, marginTop: 3 }}
                overflow="visible"
              >
                <g transform="translate(24.47 43.189) rotate(180)">
                  <path
                    d="M21.131,41.2.708,20.778,21.131.354"
                    transform="translate(2.735 9.994)"
                    fill="none"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  />
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

export default function CorporateNav({ transparent = false }: { transparent?: boolean } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const lineTransition = 'transform 0.3s ease, opacity 0.2s ease';

  return (
    <>
      <nav className={`corp-nav ${transparent ? "corp-nav--transparent" : ""}`}>
        <Link
          href="/corporate"
          className="corp-nav-logo-link"
          aria-label="Lucy Hall Massage Corporate - home"
        >
          <img
            src="/LHM-corp-logo.svg"
            alt="Lucy Hall Massage Corporate"
            className="corp-nav-logo"
            draggable={false}
          />
        </Link>

        <div className="corp-nav-right">
          <button type="button" onClick={() => setModalOpen(true)} className="corp-nav-cta">
            Enquire about your team
          </button>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="corp-nav-hamburger"
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

        <style>{`
          .corp-nav {
            position: sticky;
            top: 0;
            z-index: 500;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            min-height: 56px;
          }
          .corp-nav--transparent {
            position: fixed;
            left: 0;
            right: 0;
            background: transparent;
          }
          .corp-nav-logo-link {
            display: inline-flex;
            align-items: center;
            flex: 0 0 auto;
          }
          .corp-nav-logo {
            height: 22px;
            width: auto;
            object-fit: contain;
            display: block;
          }
          .corp-nav-right {
            display: flex;
            align-items: center;
            gap: 24px;
          }
          .corp-nav-cta {
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 400;
            text-decoration: none;
            letter-spacing: 0.02em;
            transition: opacity 0.2s ease;
            background: transparent;
            border: 0;
            padding: 0;
            cursor: pointer;
            font-family: inherit;
          }
          .corp-nav-cta:hover {
            opacity: 0.8;
          }
          .corp-nav-hamburger {
            background: transparent;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
          }
          @media (max-width: 767px) {
            .corp-nav-right {
              gap: 12px;
            }
            .corp-nav-cta {
              display: none;
            }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .corp-nav-cta {
              font-size: 1rem;
            }
          }
        `}</style>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SecondaryEnquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialName=""
        initialEmail=""
        initialMobile=""
        standalone
      />
    </>
  );
}
