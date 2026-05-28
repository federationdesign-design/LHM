import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CookieConsentProvider } from './components/cookies/CookieConsentProvider';
import { CookieBanner } from './components/cookies/CookieBanner';
import { Analytics } from './components/cookies/Analytics';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Lucy Hall Massage Therapy | Cambridge',
    template: '%s | Lucy Hall Massage Therapy',
  },
  description: 'Professional massage therapy in Cambridge. Deep tissue, Swedish, sports, pregnancy massage and more. Book online in 2 minutes.',
  metadataBase: new URL('https://www.lucyhallmassage.com'),
  openGraph: {
    siteName: 'Lucy Hall Massage Therapy',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/LHM2026logo-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Lucy Hall Massage Therapy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/LHM2026logo-square.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={jakarta.variable}>
      <body className={jakarta.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthAndBeautyBusiness',
              '@id': 'https://www.lucyhallmassage.com/#business',
              name: 'Lucy Hall Massage Therapy',
              url: 'https://www.lucyhallmassage.com',
              image: 'https://www.lucyhallmassage.com/LHM2026logo-square.jpg',
              telephone: '+447765555078',
              priceRange: '££',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '2 Antwerp Cottages, Thoday Street',
                addressLocality: 'Cambridge',
                postalCode: 'CB1 3AU',
                addressCountry: 'GB',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 52.197,
                longitude: 0.143,
              },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '12:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '10:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '10:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '10:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '10:00', closes: '18:00' },
              ],
              areaServed: { '@type': 'City', name: 'Cambridge' },
            }),
          }}
        />
        <CookieConsentProvider>
          {children}
          <Analytics />
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}