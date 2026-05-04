// app/private/page.tsx
//
// Private-side homepage at /private.
//
// Renders the renamed PrivateHomeClient (formerly HomeClient at /).
// The root URL / now serves the splash page; private clients land here
// once they've identified themselves on the splash, and returning visitors
// are redirected here automatically by middleware when their lhm-side
// cookie is "private".

import type { Metadata } from 'next';
import PrivateHomeClient from '../PrivateHomeClient';

export const metadata: Metadata = {
  title: 'Lucy Hall Massage Therapy | Cambridge',
  description:
    'Expert massage therapy in Cambridge — deep tissue, swedish, sports, pregnancy, hot stone and more. Two clinics, online booking, available 7 days a week.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/private' },
};

export default function PrivateHomePage() {
  return <PrivateHomeClient />;
}
