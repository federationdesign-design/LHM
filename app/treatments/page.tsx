// app/treatments/page.tsx
import type { Metadata } from 'next';
import TreatmentsIndexClient from '../TreatmentsIndexClient';
import { services } from '../data/services';

export const metadata: Metadata = {
  title: 'All Treatments | Lucy Hall Massage Therapy Cambridge',
  description: 'Browse all massage and therapy treatments at Lucy Hall Massage Therapy in Cambridge. Deep tissue, Swedish, sports massage, pregnancy massage and more. Book online in 2 minutes.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/treatments/' },
};

export default function TreatmentsPage() {
  return (
    <>
      {/* SEO: crawlable list of all treatments, visually hidden. Keeps every
          treatment page discoverable in the initial server HTML, since the
          visible carousel below renders its list client-side. */}
      <nav
        aria-label="All treatments"
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}
      >
        <ul>
          {Object.values(services).map((s) => (
            <li key={s.slug}>
              <a href={`/treatments/${s.slug}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </nav>
      <TreatmentsIndexClient />
    </>
  );
}
