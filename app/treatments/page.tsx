// app/treatments/page.tsx
import type { Metadata } from 'next';
import TreatmentsIndexClient from '../TreatmentsIndexClient';

export const metadata: Metadata = {
  title: 'All Treatments | Lucy Hall Massage Therapy Cambridge',
  description: 'Browse all massage and therapy treatments at Lucy Hall Massage Therapy in Cambridge. Deep tissue, Swedish, sports massage, pregnancy massage and more. Book online in 2 minutes.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/treatments/' },
};

export default function TreatmentsPage() {
  return <TreatmentsIndexClient />;
}
