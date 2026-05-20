import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | Lucy Hall Massage Therapy',
  robots: { index: false, follow: false },
};

const links = [
  { label: 'Home', href: '/' },
  { label: 'Treatments', href: '/treatments' },
  { label: 'Book Online', href: '/book-online' },
  { label: 'Locations', href: '/locations' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <main className="lhm-404">
      <p className="lhm-404-eyebrow">Error 404</p>
      <h1 className="lhm-404-h1">Lost your way?</h1>
      <p className="lhm-404-lead">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let us help you find what you need.
      </p>
      <nav aria-label="Quick links" className="lhm-404-links">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="lhm-404-link">
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="lhm-404-footnote">
        Still can&apos;t find what you&apos;re looking for? Reach out to us at{' '}
        <a href="mailto:info@lucyhallmassage.com" className="lhm-404-mail">
          info@lucyhallmassage.com
        </a>
        .
      </p>
      <style>{`
        .lhm-404 {
          min-height: 100vh;
          background: #000000;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
        }
        .lhm-404-eyebrow {
          font-size: 0.85rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.5;
          margin: 0 0 32px;
        }
        .lhm-404-h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 600;
          line-height: 1.1;
          margin: 0 0 24px;
          max-width: 800px;
        }
        .lhm-404-lead {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          font-weight: 300;
          line-height: 1.6;
          opacity: 0.85;
          margin: 0 0 48px;
          max-width: 540px;
        }
        .lhm-404-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 64px;
        }
        .lhm-404-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #ffffff;
          text-decoration: none;
          border: 1px solid #ffffff;
          padding: 14px 28px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .lhm-404-link:hover {
          background: #ffffff;
          color: #000000;
        }
        .lhm-404-footnote {
          font-size: 0.85rem;
          font-weight: 300;
          opacity: 0.6;
          max-width: 480px;
          margin: 0;
        }
        .lhm-404-mail {
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
      `}</style>
    </main>
  );
}
