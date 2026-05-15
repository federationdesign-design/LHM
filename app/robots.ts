import type { MetadataRoute } from 'next';

/**
 * Robots policy for lucyhallmassage.com.
 *
 * - Allows all crawlers to index everything by default.
 * - Disallows specific API/internal routes that shouldn't be indexed.
 * - Points to the sitemap so Google can discover all pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://www.lucyhallmassage.com/sitemap.xml',
    host: 'https://www.lucyhallmassage.com',
  };
}
