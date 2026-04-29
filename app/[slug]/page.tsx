// app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { services } from '../data/services';
import ServiceBookingClient from '../ServiceBookingClient';

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: service.canonicalUrl,
      siteName: 'Lucy Hall Massage Therapy',
      images: [{ url: `https://www.lucyhallmassage.com${service.heroDesktop}`, width: 1200, height: 630, alt: service.title }],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
    alternates: {
      canonical: service.canonicalUrl,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();
  return <ServiceBookingClient service={service} />;
}
