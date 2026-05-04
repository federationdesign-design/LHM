// app/page.tsx
//
// Root URL / — the splash page.
//
// First-time visitors hit this and choose Private or Corporate.
// Returning visitors with the lhm-side cookie set are redirected by
// middleware (middleware.ts at the project root) before this page renders,
// so they never see the splash again until the cookie expires (90 days).
//
// The previous private homepage (HomeClient) has been renamed to
// PrivateHomeClient and now lives at /private (see app/private/page.tsx).

import type { Metadata } from 'next';
import SplashClient from './SplashClient';

export const metadata: Metadata = {
  title: 'Lucy Hall Massage Therapy | Cambridge',
  description:
    'Lucy Hall Massage Therapy — private treatment in Cambridge and corporate massage for workplace wellbeing. Choose your path.',
  alternates: { canonical: 'https://www.lucyhallmassage.com' },
};

export default function HomePage() {
  return <SplashClient />;
}
