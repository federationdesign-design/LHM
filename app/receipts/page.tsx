import type { Metadata } from 'next';
import ReceiptsClient from './ReceiptsClient';

export const metadata: Metadata = {
  title: 'Request a Receipt | Lucy Hall Massage Therapy',
  description: 'Need a receipt for your massage treatment? Request one through our online form and we will send it to you within 1-2 working days.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/receipts' },
  openGraph: {
    title: 'Request a Receipt | Lucy Hall Massage Therapy',
    description: 'Request a receipt for your massage treatment from Lucy Hall Massage Therapy.',
    url: 'https://www.lucyhallmassage.com/receipts',
    type: 'website',
  },
};

export default function ReceiptsPage() {
  return <ReceiptsClient />;
}
