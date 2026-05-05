import type { Metadata } from 'next';
import CorporateEnquireClient from './CorporateEnquireClient';

export const metadata: Metadata = {
  title: 'Enquire about Corporate Massage | Lucy Hall Massage',
  description:
    'Request our employer PDF and discuss corporate massage services for your team. We respond within one working day.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/corporate/enquire',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CorporateEnquirePage() {
  return <CorporateEnquireClient />;
}
