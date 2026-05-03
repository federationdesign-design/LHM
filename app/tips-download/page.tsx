import type { Metadata } from 'next';
import TipsDownloadClient from './TipsDownloadClient';

export const metadata: Metadata = {
  title: '5 Tips to a Healthy Body &mdash; Free Guide | Lucy Hall Massage Therapy',
  description: 'Download our free 5-tip guide to keeping your body healthy. Practical advice from our experienced massage therapy team in Cambridge.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/tips-download' },
  openGraph: {
    title: '5 Tips to a Healthy Body &mdash; Free Guide',
    description: 'Download our free 5-tip guide to keeping your body healthy from Lucy Hall Massage Therapy.',
    url: 'https://www.lucyhallmassage.com/tips-download',
    type: 'website',
  },
};

export default function TipsDownloadPage() {
  return <TipsDownloadClient />;
}
