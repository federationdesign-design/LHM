import type { Metadata } from 'next';
import TeamIndexClient from '../../TeamIndexClient';

export const metadata: Metadata = {
  title: 'Corporate Team | Lucy Hall Massage Therapy Cambridge',
  description: 'Meet the qualified workplace health professionals delivering corporate massage at Lucy Hall Massage Therapy in Cambridge.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/corporate/team/' },
};

export default function CorporateTeamPage() {
  return <TeamIndexClient variant="corporate" />;
}
