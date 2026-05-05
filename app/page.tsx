import type { Metadata } from 'next';
import CorporateHomeClient from './CorporateHomeClient';

export const metadata: Metadata = {
  title: 'Corporate Massage Cambridge | Lucy Hall Massage',
  description:
    'Corporate massage services in Cambridge. In-office chair massage, DSC assessments, and posture consultations to support employee wellbeing and reduce sickness and absenteeism at work.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/corporate',
  },
  openGraph: {
    title: 'Corporate Massage Cambridge | Lucy Hall Massage',
    description:
      'Corporate massage services in Cambridge — making your workplace happier and healthier.',
    url: 'https://www.lucyhallmassage.com/corporate',
    siteName: 'Lucy Hall Massage Therapy',
    type: 'website',
  },
};

export default function CorporateHomePage() {
  return <CorporateHomeClient />;
}
