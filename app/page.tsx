// app/page.tsx
// Homepage — the main private client landing page at /
// Server component renders the HomeClient (client component for interactivity)

import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Lucy Hall Massage Therapy | Cambridge',
  description: 'Expert massage therapy in Cambridge — deep tissue, swedish, sports, pregnancy, hot stone and more. Two clinics, online booking, available 7 days a week.',
  alternates: { canonical: 'https://www.lucyhallmassage.com' },
};

export default function HomePage() {
  return <HomeClient />;
}
