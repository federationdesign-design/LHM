import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | Lucy Hall Massage Therapy',
  description: 'The page you\'re looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: '0.85rem',
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        opacity: 0.5,
        marginBottom: 32,
      }}>
        Error 404
      </p>

      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: 600,
        lineHeight: 1.1,
        marginBottom: 24,
        maxWidth: 800,
      }}>
        Lost your way?
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
        fontWeight: 300,
        lineHeight: 1.6,
        opacity: 0.85,
        marginBottom: 48,
        maxWidth: 540,
      }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let us help you find what you need.
      </p>

      <nav aria-label="Quick links" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        marginBottom: 64,
      }}>
        {[
          { label: 'Home', href: '/' },
          { label: 'Treatments', href: '/treatments' },
          { label: 'Book Online', href: '/book-online' },
          { label: 'Locations', href: '/locations' },
          { label: 'Contact', href: '/contact' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.82rem',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#ffffff',
              textDecoration: 'none',
              border: '1px solid #ffffff',
              padding: '14px 28px',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p style={{
        fontSize: '0.85rem',
        fontWeight: 300,
        opacity: 0.6,
        maxWidth: 480,
      }}>
        Still can&apos;t find what you&apos;re looking for? Reach out to us directly
        at{' '}
        <a
          href="mailto:info@lucyhallmassage.com"
          style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: 4 }}
        >
          info@lucyhallmassage.com
        </a>
        .
      </p>
    </main>
  );
}
