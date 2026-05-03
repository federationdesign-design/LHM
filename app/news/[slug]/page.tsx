// app/news/[slug]/page.tsx
// Individual blog article page — dynamic server component.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticleBody } from '../../data/blog';
import BlogArticleClient from '../../BlogArticleClient';

type RouteParams = { slug: string };

// Statically generate all 20 article routes at build time
export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

// Per-article metadata for SEO (title tag, OG tags, etc.)
export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: article.canonicalUrl },
  };
}

export default async function NewsArticlePage(
  { params }: { params: Promise<RouteParams> }
) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();
  const body = getArticleBody(slug);
  return <BlogArticleClient article={article} body={body} />;
}
