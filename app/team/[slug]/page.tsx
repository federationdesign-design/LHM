// app/team/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { team } from '../../data/team';
import TeamClient from '../../TeamClient';

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
  return <TeamClient member={member} />;
}
