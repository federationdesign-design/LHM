// app/corporate/team/[slug]/page.tsx
//
// Corporate variant of the team member detail page. Reuses
// TeamClient with variant='corporate' to hide treatments, swap
// nav/footer, and relabel the hero CTA to open SecondaryEnquiryModal.
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { team } from '../../../data/team';
import TeamClient from '../../../TeamClient';

export async function generateStaticParams() {
  return Object.keys(team).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
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
  const member = team[slug];
  if (!member) notFound();
  return <TeamClient member={member} variant="corporate" />;
}
