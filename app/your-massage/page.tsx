// app/your-massage/page.tsx
import type { Metadata } from 'next';
import YourMassageClient from './YourMassageClient';

export const metadata: Metadata = {
  title: 'Your Massage | Lucy Hall Massage Therapy Cambridge',
  description: 'A tailored massage from Lucy Hall Massage Therapy in Cambridge. Perfect for first-time clients or anyone with multiple problem areas to address in one session.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/your-massage/' },
};

export default function YourMassagePage() {
  return <YourMassageClient />;
}
