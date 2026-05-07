import type { Metadata } from 'next';
import ContactClient from '../../ContactClient';

export const metadata: Metadata = {
  title: 'Corporate Contact | Lucy Hall Massage Therapy Cambridge',
  description: 'Get in touch about corporate massage services. Email, phone, address and opening hours for Lucy Hall Massage Therapy in Cambridge.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/corporate/contact/' },
};

export default function CorporateContactPage() {
  return <ContactClient variant="corporate" />;
}
