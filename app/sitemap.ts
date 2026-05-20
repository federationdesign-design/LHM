import type { MetadataRoute } from 'next';
import { services } from './data/services';
import { team } from './data/team';
import { articles } from './data/articleData';
import { locations } from './data/locations';
import { legalPages } from './data/legal';

/**
 * Sitemap for lucyhallmassage.com.
 *
 * Dynamically generates entries for:
 * - Static top-level pages (home, treatments, team, etc.)
 * - /treatments/[slug] (from services.ts)
 * - /team/[slug] (from team.ts)
 * - /news/[slug] (from articleData.ts)
 * - /locations/[slug] (from data/locations.ts)
 * - /legal/[slug] (from data/legal.ts)
 *
 * Note: Returns ISO date for lastModified using the build time.
 */

const BASE_URL = 'https://www.lucyhallmassage.com';
const now = new Date();

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                            priority: 1.0, changeFrequency: 'weekly' },
  { path: '/private',                    priority: 0.9, changeFrequency: 'weekly' },
  { path: '/treatments',                 priority: 0.9, changeFrequency: 'weekly' },
  { path: '/team',                       priority: 0.8, changeFrequency: 'monthly' },
  { path: '/locations',                  priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact',                    priority: 0.7, changeFrequency: 'monthly' },
  { path: '/news',                       priority: 0.8, changeFrequency: 'weekly' },
  { path: '/faq',                        priority: 0.6, changeFrequency: 'monthly' },
  { path: '/reviews',                    priority: 0.7, changeFrequency: 'weekly' },
  { path: '/testimonials',               priority: 0.7, changeFrequency: 'monthly' },
  { path: '/gift-vouchers',              priority: 0.7, changeFrequency: 'monthly' },
  { path: '/book-online',                priority: 0.8, changeFrequency: 'monthly' },
  { path: '/your-massage',               priority: 0.7, changeFrequency: 'monthly' },
  { path: '/your-pregnancy-massage',     priority: 0.7, changeFrequency: 'monthly' },
  { path: '/your-cupping-massage',       priority: 0.7, changeFrequency: 'monthly' },
  { path: '/start-your-journey',         priority: 0.6, changeFrequency: 'monthly' },
  { path: '/tips-download',              priority: 0.5, changeFrequency: 'monthly' },
  { path: '/receipts',                   priority: 0.4, changeFrequency: 'yearly' },
  { path: '/workplace-massage-feedback', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/corporate',                  priority: 0.7, changeFrequency: 'monthly' },
  { path: '/corporate/services/dse-assessments',  priority: 0.6, changeFrequency: 'monthly' },
  { path: '/corporate/services/in-chair-massage', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/corporate/services/posture-consultations', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/corporate/team',             priority: 0.5, changeFrequency: 'monthly' },
  { path: '/corporate/contact',          priority: 0.5, changeFrequency: 'monthly' },
  { path: '/corporate/enquire',          priority: 0.5, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const treatmentEntries: MetadataRoute.Sitemap = Object.values(services).map((s) => ({
    url: `${BASE_URL}/treatments/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const teamEntries: MetadataRoute.Sitemap = Object.values(team).map((t) => ({
    url: `${BASE_URL}/team/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = Object.values(articles).map((a) => ({
    url: `${BASE_URL}/news/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const locationEntries: MetadataRoute.Sitemap = Object.values(locations).map((l) => ({
    url: `${BASE_URL}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const legalEntries: MetadataRoute.Sitemap = Object.values(legalPages).map((l) => ({
    url: `${BASE_URL}/legal/${l.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [
    ...staticEntries,
    ...treatmentEntries,
    ...teamEntries,
    ...articleEntries,
    ...locationEntries,
    ...legalEntries,
  ];
}
