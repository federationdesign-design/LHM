import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deep Tissue Massage Cambridge | Lucy Hall Massage Therapy',
  description: 'Book a deep tissue massage in Cambridge with Lucy Hall Massage Therapy. Specialist treatment for chronic muscle tension, back pain and injury recovery. Book online in 2 minutes.',
  keywords: ['deep tissue massage cambridge', 'deep tissue massage', 'massage therapy cambridge', 'back pain massage cambridge', 'sports massage cambridge'],
  openGraph: {
    title: 'Deep Tissue Massage Cambridge | Lucy Hall Massage Therapy',
    description: 'Book a deep tissue massage in Cambridge. Specialist treatment for chronic tension, back pain and injury recovery.',
    url: 'https://www.lucyhallmassage.com/deep-tissue-massage/',
    siteName: 'Lucy Hall Massage Therapy',
    images: [{ url: 'https://www.lucyhallmassage.com/deep-tissue-img.jpg', width: 1200, height: 630, alt: 'Deep Tissue Massage Cambridge - Lucy Hall Massage Therapy' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Tissue Massage Cambridge | Lucy Hall Massage Therapy',
    description: 'Book a deep tissue massage in Cambridge. Specialist treatment for chronic tension, back pain and injury recovery.',
    images: ['https://www.lucyhallmassage.com/deep-tissue-img.jpg'],
  },
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/deep-tissue-massage/',
  },
  robots: {
    index: true,
    follow: true,
  },
};


import BookingPageClient from './BookingPageClient';

export default function Page() {
  return <BookingPageClient />;
}
