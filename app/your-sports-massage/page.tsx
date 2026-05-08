// app/your-sports-massage/page.tsx
import type { Metadata } from 'next';
import YourSportsMassageClient from './YourSportsMassageClient';

export const metadata: Metadata = {
  title: 'Your Sports Massage | Lucy Hall Massage Therapy Cambridge',
  description: 'Sports massage at Lucy Hall Massage Therapy in Cambridge.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/your-sports-massage/' },
};

export default function YourSportsMassagePage() {
  return <YourSportsMassageClient />;
}
