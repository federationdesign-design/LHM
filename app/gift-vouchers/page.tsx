// app/gift-vouchers/page.tsx
import type { Metadata } from 'next';
import GiftVouchersClient from '../GiftVouchersClient';

export const metadata: Metadata = {
  title: 'Gift Vouchers | Lucy Hall Massage Therapy Cambridge',
  description: 'Buy a massage gift voucher for someone special. Redeemable against any treatment at Lucy Hall Massage Therapy in Cambridge. Valid for 12 months.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/gift-vouchers/' },
  openGraph: {
    title: 'Gift Vouchers | Lucy Hall Massage Therapy Cambridge',
    description: 'Give the gift of relaxation. Redeemable against any treatment at our Cambridge clinics.',
    url: 'https://www.lucyhallmassage.com/gift-vouchers/',
    type: 'website',
  },
};

export default function GiftVouchersPage() {
  return <GiftVouchersClient />;
}
