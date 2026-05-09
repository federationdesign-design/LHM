// app/your-pregnancy-massage/page.tsx
import type { Metadata } from 'next';
import YourPregnancyMassageClient from './YourPregnancyMassageClient';

export const metadata: Metadata = {
  title: 'Your Pregnancy Massage | Lucy Hall Massage Therapy Cambridge',
  description: 'Pregnancy massage at Lucy Hall Massage Therapy in Cambridge. Choose between 60 and 90 minute treatments.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/your-pregnancy-massage/' },
};

export default function YourPregnancyMassagePage() {
  return <YourPregnancyMassageClient />;
}
