import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

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
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
