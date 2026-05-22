// app/corporate/faq/page.tsx
import type { Metadata } from 'next';
import FAQClient from '../../FAQClient';
export const metadata: Metadata = {
  title: 'Corporate FAQ | Lucy Hall Massage Therapy Cambridge',
  description: 'Frequently asked questions about corporate massage services from Lucy Hall Massage Therapy in Cambridge.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/corporate/faq/' },
};
export default function CorporateFAQPage() {
  return <FAQClient variant="corporate" />;
}
