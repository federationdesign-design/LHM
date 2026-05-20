import type { Metadata } from 'next';
import DseAssessmentsClient from './DseAssessmentsClient';

export const metadata: Metadata = {
  title: 'Display Screen Equipment Assessments | Lucy Hall Massage',
  description:
    'Workplace DSE assessments in Cambridge. Reduce risk of injury, meet HSE regulations, and create a safer, more comfortable working environment for your team.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/corporate/services/dse-assessments',
  },
};

export default function DscAssessmentsPage() {
  return <DseAssessmentsClient />;
}
