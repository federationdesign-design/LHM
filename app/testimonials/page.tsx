import type { Metadata } from 'next';
import TestimonialsClient from './TestimonialsClient';

export const metadata: Metadata = {
  title: 'Testimonials | Lucy Hall Massage Therapy',
  description: 'Read genuine reviews and testimonials from our clients in Cambridge. Hear what people are saying about their experiences with Lucy Hall Massage Therapy.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/testimonials' },
  openGraph: {
    title: 'Testimonials | Lucy Hall Massage Therapy',
    description: 'Read genuine reviews and testimonials from our clients in Cambridge.',
    url: 'https://www.lucyhallmassage.com/testimonials',
    type: 'website',
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}
