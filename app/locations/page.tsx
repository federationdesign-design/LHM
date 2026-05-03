// app/locations/page.tsx
import type { Metadata } from 'next';
import LocationsIndexClient from '../LocationsIndexClient';

export const metadata: Metadata = {
  title: 'Our Locations | Lucy Hall Massage Therapy Cambridge',
  description: 'Lucy Hall Massage Therapy operates from two clinics in Cambridge — Thoday Street and Cromwell Road. Book online in 2 minutes.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/locations/' },
};

export default function LocationsPage() {
  return <LocationsIndexClient />;
}
