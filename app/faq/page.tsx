// app/faq/page.tsx
import type { Metadata } from 'next';
import FAQClient from '../FAQClient';

export const metadata: Metadata = {
  title: 'FAQ | Lucy Hall Massage Therapy Cambridge',
  description: 'Frequently asked questions about massage therapy at Lucy Hall in Cambridge. Deep tissue, sports, pregnancy massage, dry needling, Hopi ear candling and more.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/faq/' },
};

export default function FAQPage() {
  return <FAQClient />;
}
