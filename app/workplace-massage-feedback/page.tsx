import type { Metadata } from 'next';
import WorkplaceMassageFeedbackClient from './WorkplaceMassageFeedbackClient';

export const metadata: Metadata = {
  title: 'Workplace Massage Feedback | Lucy Hall Massage Therapy',
  description: 'Tell us about your experience with our workplace massage service.',
  // Internal feedback form — keep out of search indexes
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.lucyhallmassage.com/workplace-massage-feedback/' },
};

export default function Page() {
  return <WorkplaceMassageFeedbackClient />;
}
