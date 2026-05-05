import type { Metadata } from 'next';
import InChairMassageClient from './InChairMassageClient';

export const metadata: Metadata = {
  title: 'In-Office Chair Massage Services | Lucy Hall Massage',
  description:
    'Bring chair massage into your Cambridge workplace. Reduce stress, boost productivity, and support your team\'s wellbeing with on-site massage from qualified therapists.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/corporate/in-chair-massage',
  },
};

export default function InChairMassagePage() {
  return <InChairMassageClient />;
}
