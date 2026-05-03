// app/contact/page.tsx
import type { Metadata } from 'next';
import ContactClient from '../ContactClient';

export const metadata: Metadata = {
  title: 'Contact | Lucy Hall Massage Therapy Cambridge',
  description: 'Get in touch with Lucy Hall Massage Therapy in Cambridge. Email, phone, address and opening hours. Send us a message and we\'ll get back to you promptly.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/contact/' },
};

export default function ContactPage() {
  return <ContactClient />;
}
