import type { Metadata } from 'next';
import BookOnlineClient from './BookOnlineClient';

export const metadata: Metadata = {
  title: 'Book Your Massage | Lucy Hall Massage Therapy',
  description: 'Book your massage treatment online. Choose from a wide range of therapies, locations and therapists in Cambridge. Quick and easy online booking.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/book-online' },
  openGraph: {
    title: 'Book Your Massage | Lucy Hall Massage Therapy',
    description: 'Book your massage treatment online. Quick and easy online booking with our team in Cambridge.',
    url: 'https://www.lucyhallmassage.com/book-online',
    type: 'website',
  },
};

export default function BookOnlinePage() {
  return <BookOnlineClient />;
}
