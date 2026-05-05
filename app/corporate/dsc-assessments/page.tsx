import type { Metadata } from 'next';
import DscAssessmentsClient from './DscAssessmentsClient';

export const metadata: Metadata = {
  title: 'Display Screen Equipment Assessments | Lucy Hall Massage',
  description:
    'Workplace DSE/DSC assessments in Cambridge. Reduce risk of injury, meet HSE regulations, and create a safer, more comfortable working environment for your team.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/corporate/dsc-assessments',
  },
};

export default function DscAssessmentsPage() {
  return <DscAssessmentsClient />;
}
