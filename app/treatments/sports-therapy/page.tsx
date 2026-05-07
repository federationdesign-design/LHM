// app/treatments/sports-therapy/page.tsx
import type { Metadata } from 'next';
import SportsTherapyClient from './SportsTherapyClient';

export const metadata: Metadata = {
  title: 'Sports Therapy Cambridge | Lucy Hall Massage Therapy',
  description:
    'Book Sports Therapy in Cambridge — choose 30, 60, 90, or 120 minutes. Expert assessment and treatment for injury, pain and movement problems. Book online in 2 minutes.',
  keywords: [
    'sports therapy cambridge',
    'sports therapist cambridge',
    'injury treatment cambridge',
    'back pain sports therapy cambridge',
  ],
  alternates: { canonical: 'https://www.lucyhallmassage.com/treatments/sports-therapy/' },
  openGraph: {
    title: 'Sports Therapy Cambridge | Lucy Hall Massage Therapy',
    description:
      'Book Sports Therapy in Cambridge — choose 30, 60, 90, or 120 minutes.',
    url: 'https://www.lucyhallmassage.com/treatments/sports-therapy/',
    siteName: 'Lucy Hall Massage Therapy',
    images: [
      {
        url: 'https://www.lucyhallmassage.com/sports-therapy-desktop.jpg',
        width: 1200,
        height: 630,
        alt: 'Sports Therapy at Lucy Hall Massage Therapy',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Therapy Cambridge | Lucy Hall Massage Therapy',
    description:
      'Book Sports Therapy in Cambridge — choose 30, 60, 90, or 120 minutes.',
    images: ['https://www.lucyhallmassage.com/sports-therapy-desktop.jpg'],
  },
};

export default function SportsTherapyPage() {
  return <SportsTherapyClient />;
}
