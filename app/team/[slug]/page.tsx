// app/team/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { team } from '../../data/team';
import TeamClient from '../../TeamClient';

// Slugs that should render the corporate variant of the team detail
// page (no booking widget, no treatments section, CorporateNav/Footer,
// hero CTA opens SecondaryEnquiryModal). Kept in sync with the corp
// team index filter in TeamIndexClient.
const CORP_SLUGS = ['lucy-hall', 'claire'];

export async function generateStaticParams() {
  return Object.keys(team).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = team[slug];
  if (!member) return {};
  return {
    title: member.metaTitle,
    description: member.metaDescription,
    alternates: { canonical: member.canonicalUrl },
    openGraph: {
      title: member.metaTitle,
      description: member.metaDescription,
      url: member.canonicalUrl,
      type: 'website',
    },
  };
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = team[slug];
  if (!member) notFound();
  const variant = CORP_SLUGS.includes(slug) ? 'corporate' : 'private';
  return <TeamClient member={member} variant={variant} />;
}
