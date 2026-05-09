// app/your-cupping-massage/page.tsx
import type { Metadata } from 'next';
import YourCuppingMassageClient from './YourCuppingMassageClient';

export const metadata: Metadata = {
  title: 'Your Cupping Massage | Lucy Hall Massage Therapy Cambridge',
  description: 'Cupping therapy at Lucy Hall Massage Therapy in Cambridge. Choose between 60 and 120 minute treatments.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/your-cupping-massage/' },
};

export default function YourCuppingMassagePage() {
  return <YourCuppingMassageClient />;
}
