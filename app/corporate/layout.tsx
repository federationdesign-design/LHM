// app/corporate/layout.tsx
//
// Nested layout for all /corporate routes. Emits a distinct structured-data
// entity for the corporate arm (Lucy Hall Massage Corporate, 96 Cromwell Road)
// so search engines treat it as separate from the Thoday Street therapy clinic.
//
// The root layout still emits the therapy "#business" entity site-wide; this
// adds the "#corporate" entity on corporate pages only, linked back to the
// therapy practice via parentOrganization so the two read as related but
// distinct.
//
// Deliberately omitted:
//   - geo coordinates (managed manually elsewhere; never set here)
//   - openingHoursSpecification (corporate on-site hours differ from the clinic)
//   - aggregateRating (the reviews belong to the Thoday clinic, not corporate)

import type { ReactNode } from 'react';

export default function CorporateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HealthAndBeautyBusiness',
            '@id': 'https://www.lucyhallmassage.com/#corporate',
            name: 'Lucy Hall Massage Corporate',
            url: 'https://www.lucyhallmassage.com/corporate',
            telephone: '+447765555078',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '96 Cromwell Road',
              addressLocality: 'Cambridge',
              addressRegion: 'Cambridgeshire',
              postalCode: 'CB1 3EG',
              addressCountry: 'GB',
            },
            areaServed: { '@type': 'City', name: 'Cambridge' },
            parentOrganization: { '@id': 'https://www.lucyhallmassage.com/#business' },
          }),
        }}
      />
      {children}
    </>
  );
}
