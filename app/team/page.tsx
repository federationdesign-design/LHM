// app/team/page.tsx
import type { Metadata } from 'next';
import TeamIndexClient from '../TeamIndexClient';

export const metadata: Metadata = {
  title: 'Our Team | Lucy Hall Massage Therapy Cambridge',
  description: 'Meet the massage therapists at Lucy Hall Massage Therapy in Cambridge. Experienced, qualified and passionate about what they do.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/team/' },
};

export default function TeamPage() {
  return <TeamIndexClient />;
}
