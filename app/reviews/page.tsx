// app/reviews/page.tsx
//
// Corporate reviews page. Lives at /reviews (top-level), separate
// from /testimonials which is the private-client reviews page.
//
// Renders 8 curated corporate testimonials from
// app/components/Testimonials/corporate-testimonials-data.ts plus
// a LinkedIn CTA pointing to Lucy's profile recommendations.

import type { Metadata } from 'next';
import ReviewsClient from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Corporate Reviews | Lucy Hall Massage Therapy',
  description: 'Reviews and recommendations from corporate clients including Spotify, Redgate, Costello Medical and Amazon. Read what HR and wellbeing leads say about working with Lucy Hall Massage Therapy.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/reviews',
  },
  openGraph: {
    title: 'Corporate Reviews | Lucy Hall Massage Therapy',
    description: 'Reviews and recommendations from corporate clients including Spotify, Redgate, Costello Medical and Amazon.',
    url: 'https://www.lucyhallmassage.com/reviews',
    type: 'website',
  },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
