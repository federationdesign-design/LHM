// app/corporate/services/page.tsx
import type { Metadata } from 'next';
import CorporateServicesIndexClient from './CorporateServicesIndexClient';

export const metadata: Metadata = {
  title: 'Corporate Services | Lucy Hall Massage Therapy Cambridge',
  description:
    'Corporate wellbeing services in Cambridge: in-office chair massage, DSE assessments, and posture consultations. Designed to reduce stress, prevent injury, and improve workplace wellbeing.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/corporate/services' },
  openGraph: {
    title: 'Corporate Services | Lucy Hall Massage Therapy Cambridge',
    description:
      'Corporate wellbeing services: chair massage, DSE assessments, and posture consultations for Cambridge businesses.',
    url: 'https://www.lucyhallmassage.com/corporate/services',
    type: 'website',
  },
};

export default function CorporateServicesPage() {
  return <CorporateServicesIndexClient />;
}
