// app/corporate/team/[slug]/page.tsx
//
// Corporate variant of the team member detail page. Scoped to a
// fixed allowlist of slugs (CORP_SLUGS) - any other slug returns
// 404 to keep the corp namespace narrow.
//
// Reuses TeamClient with variant='corporate' which:
//   - Hides the Treatments offered section
//   - Hides the SimplyBook booking iframe (corp members are not
//     bookable - they handle enquiries via SecondaryEnquiryModal)
//   - Relabels hero CTA to 'Enquire about your team' which opens
//     the modal
//   - Swaps Nav/Footer to CorporateNav/CorporateFooter
//   - Uses corporateTestimonials with logos
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { team } from '../../../data/team';
import TeamClient from '../../../TeamClient';

const CORP_SLUGS = ['lucy-hall', 'claire'];

export const dynamicParams = false;

export async function generateStaticParams() {
  return CORP_SLUGS.filter((slug) => team[slug]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!CORP_SLUGS.includes(slug)) return {};
  const member = team[slug];
  if (!member) return {};
  const canonical = `https://www.lucyhallmassage.com/corporate/team/${slug}/`;
  return {
    title: member.metaTitle,
    description: member.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: member.metaTitle,
      description: member.metaDescription,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function CorporateTeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!CORP_SLUGS.includes(slug)) notFound();
  const member = team[slug];
  if (!member) notFound();
  return <TeamClient member={member} variant="corporate" />;
}
