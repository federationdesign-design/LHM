import type { Metadata } from 'next';
import PostureConsultationsClient from './PostureConsultationsClient';

export const metadata: Metadata = {
  title: 'Assessments & Posture Consultations | Lucy Hall Massage',
  description:
    'One-to-one posture consultations and assessments for your team in Cambridge. Improve posture, reduce pain, and prevent injury with personalised expert guidance.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/corporate/posture-consultations',
  },
};

export default function PostureConsultationsPage() {
  return <PostureConsultationsClient />;
}
