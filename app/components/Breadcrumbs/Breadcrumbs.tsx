import Link from 'next/link';

/**
 * Breadcrumbs — shared site-wide navigation breadcrumb component.
 *
 * Renders an uppercase text trail like:
 *   HOME / TREATMENTS / SPORTS MASSAGE
 *
 * Last item is plain text (current page, no link). Earlier items are
 * clickable links. Also emits BreadcrumbList JSON-LD for SEO so Google
 * shows breadcrumbs in search results instead of the URL.
 *
 * Usage:
 *   <Breadcrumbs items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Treatments', href: '/treatments' },
 *     { label: 'Sports Massage' }   // last item, no href = current page
 *   ]} />
 *
 * The component is server-renderable (no 'use client'). No state, no effects.
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const BASE_URL = 'https://www.lucyhallmassage.com';

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  // Build JSON-LD BreadcrumbList for SEO.
  // Each item needs an absolute URL. For the last item (current page),
  // we use BASE_URL + the href of the parent + #current OR just the
  // implied page URL. Google requires every item to have an `item` URL.
  const ldItems = items.map((item, i) => {
    const url = item.href ? `${BASE_URL}${item.href}` : undefined;
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(url ? { item: url } : {}),
    };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: ldItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p
        style={{
          fontSize: '0.72rem',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: '#ffffff',
          opacity: 0.5,
          marginBottom: 18,
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={`${item.label}-${i}`}>
              {item.href && !isLast ? (
                <Link href={item.href} style={{ color: '#ffffff', textDecoration: 'none' }}>
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
              {!isLast && ' / '}
            </span>
          );
        })}
      </p>
    </>
  );
}
