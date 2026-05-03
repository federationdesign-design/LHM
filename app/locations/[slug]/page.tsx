// app/locations/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locations } from '../../data/locations';
import LocationClient from '../../LocationClient';

export async function generateStaticParams() {
  return Object.keys(locations).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = locations[slug];
  if (!location) return {};
  return {
    title: location.metaTitle,
    description: location.metaDescription,
    alternates: { canonical: location.canonicalUrl },
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      url: location.canonicalUrl,
      type: 'website',
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = locations[slug];
  if (!location) notFound();
  return <LocationClient location={location} />;
}
