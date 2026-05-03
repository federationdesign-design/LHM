// app/news/page.tsx
// Blog index page — server component. Loads sorted articles and passes to client.

import type { Metadata } from 'next';
import { getSortedArticles } from '../data/blog';
import BlogIndexClient from '../BlogIndexClient';

export const metadata: Metadata = {
  title: 'Blog | Lucy Hall Massage Therapy',
  description: 'Articles, advice and insights from Lucy Hall Massage Therapy in Cambridge. Learn about treatments, wellbeing and what to expect from your sessions.',
  alternates: {
    canonical: 'https://www.lucyhallmassage.com/news/',
  },
};

export default function NewsIndexPage() {
  const sorted = getSortedArticles();
  return <BlogIndexClient articles={sorted} />;
}
