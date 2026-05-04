import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // NOTE: experimental.viewTransition removed — we're using the raw browser
  // View Transitions API directly rather than React's experimental
  // <ViewTransition> wrapper. The browser API is a stable web standard;
  // React's wrapper is in the experimental channel only and not safe for
  // production. See SplashClient.tsx and PrivateHomeClient.tsx for how the
  // transition is invoked via document.startViewTransition().

  async redirects() {
    return [
      // ── COVID-era pages — drop and send users to the blog index ──
      { source: '/covid-19/c19-policy', destination: '/news/', permanent: true },
      { source: '/covid-19/c19-policy/', destination: '/news/', permanent: true },
      { source: '/covid-19/your-safety-at-our-lucy-hall-massage', destination: '/news/', permanent: true },
      { source: '/covid-19/your-safety-at-our-lucy-hall-massage/', destination: '/news/', permanent: true },
      { source: '/news/corona-virus-opening', destination: '/news/', permanent: true },
      { source: '/news/corona-virus-opening/', destination: '/news/', permanent: true },

      // ── Old Christmas vouchers post → gift vouchers product page ──
      { source: '/news/gift-vouchers-christmas', destination: '/gift-vouchers', permanent: true },
      { source: '/news/gift-vouchers-christmas/', destination: '/gift-vouchers', permanent: true },

      // ── Date-stamped awareness day articles — drop, send to blog index ──
      { source: '/news/bone-and-joint-health-national-action-week-12th-to-20th-october', destination: '/news/', permanent: true },
      { source: '/news/bone-and-joint-health-national-action-week-12th-to-20th-october/', destination: '/news/', permanent: true },
      { source: '/news/national-stress-awareness-day-is-on-6th-november', destination: '/news/', permanent: true },
      { source: '/news/national-stress-awareness-day-is-on-6th-november/', destination: '/news/', permanent: true },
      { source: '/news/mental-health-awareness-day-10th-october', destination: '/news/', permanent: true },
      { source: '/news/mental-health-awareness-day-10th-october/', destination: '/news/', permanent: true },

      // ── Merged duplicate articles — old slug → kept slug ──
      { source: '/news/what-you-should-expect-from-your-first-massage', destination: '/news/what-to-expect-from-your-first-massage', permanent: true },
      { source: '/news/what-you-should-expect-from-your-first-massage/', destination: '/news/what-to-expect-from-your-first-massage', permanent: true },
      { source: '/news/have-you-ever-heard-of-dry-needling', destination: '/news/the-benefits-of-dry-needling', permanent: true },
      { source: '/news/have-you-ever-heard-of-dry-needling/', destination: '/news/the-benefits-of-dry-needling', permanent: true },
    ];
  },
};

export default nextConfig;
