import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.mapbox.com' },
    ],
  },

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

      // ── TREATMENTS (old WP slug → new app route) ──
      { source: '/hopi-ear', destination: '/treatments/hopi-ear', permanent: true },
      { source: '/hopi-ear/', destination: '/treatments/hopi-ear', permanent: true },
      { source: '/relaxation-massage', destination: '/treatments/relaxation-massage', permanent: true },
      { source: '/relaxation-massage/', destination: '/treatments/relaxation-massage', permanent: true },
      { source: '/sports-massage', destination: '/treatments/sports-massage', permanent: true },
      { source: '/sports-massage/', destination: '/treatments/sports-massage', permanent: true },
      { source: '/swedish-massage', destination: '/treatments/swedish-massage', permanent: true },
      { source: '/swedish-massage/', destination: '/treatments/swedish-massage', permanent: true },
      { source: '/pregnancy-massage', destination: '/your-pregnancy-massage', permanent: true },
      { source: '/pregnancy-massage/', destination: '/your-pregnancy-massage', permanent: true },
      { source: '/deep-tissue-massage', destination: '/treatments/deep-tissue-massage', permanent: true },
      { source: '/deep-tissue-massage/', destination: '/treatments/deep-tissue-massage', permanent: true },
      { source: '/treatments/cupping', destination: '/your-cupping-massage', permanent: true },
      { source: '/treatments/cupping/', destination: '/your-cupping-massage', permanent: true },
      { source: '/treatments/sports-therapy-2', destination: '/treatments/sports-therapy', permanent: true },
      { source: '/treatments/sports-therapy-2/', destination: '/treatments/sports-therapy', permanent: true },
      { source: '/treatments/appointments-length-from-30-up-to-120-minutes', destination: '/your-massage', permanent: true },
      { source: '/treatments/appointments-length-from-30-up-to-120-minutes/', destination: '/your-massage', permanent: true },

      // ── DISCONTINUED TREATMENTS → /treatments (no longer offered) ──
      { source: '/dry-needling', destination: '/treatments', permanent: true },
      { source: '/dry-needling/', destination: '/treatments', permanent: true },
      { source: '/physiotherapy-treatment', destination: '/treatments', permanent: true },
      { source: '/physiotherapy-treatment/', destination: '/treatments', permanent: true },
      { source: '/gait-analysis', destination: '/treatments', permanent: true },
      { source: '/gait-analysis/', destination: '/treatments', permanent: true },

      // ── SITE STRUCTURE ──
      { source: '/about-2', destination: '/team', permanent: true },
      { source: '/about-2/', destination: '/team', permanent: true },
      { source: '/about-2/price', destination: '/book-online', permanent: true },
      { source: '/about-2/price/', destination: '/book-online', permanent: true },
      { source: '/terms-conditions', destination: '/legal/terms-and-conditions', permanent: true },
      { source: '/terms-conditions/', destination: '/legal/terms-and-conditions', permanent: true },
      { source: '/privacy-policy-2', destination: '/legal/privacy-policy', permanent: true },
      { source: '/privacy-policy-2/', destination: '/legal/privacy-policy', permanent: true },
      { source: '/privacy-policy', destination: '/legal/privacy-policy', permanent: true },
      { source: '/privacy-policy/', destination: '/legal/privacy-policy', permanent: true },
      { source: '/sop', destination: '/legal/sop', permanent: true },
      { source: '/sop/', destination: '/legal/sop', permanent: true },
      { source: '/claiming-for-health-insurance', destination: '/receipts', permanent: true },
      { source: '/claiming-for-health-insurance/', destination: '/receipts', permanent: true },
      { source: '/gift-certificates', destination: '/gift-vouchers', permanent: true },
      { source: '/gift-certificates/', destination: '/gift-vouchers', permanent: true },
      { source: '/treatment-room-virtual-tour', destination: '/locations/thoday-street', permanent: true },
      { source: '/treatment-room-virtual-tour/', destination: '/locations/thoday-street', permanent: true },

      // ── BOOKING / FORMS / THANKS ──
      { source: '/appointments', destination: '/book-online', permanent: true },
      { source: '/appointments/', destination: '/book-online', permanent: true },
      { source: '/make-an-appointment-2', destination: '/book-online', permanent: true },
      { source: '/make-an-appointment-2/', destination: '/book-online', permanent: true },
      { source: '/pre-booking', destination: '/book-online', permanent: true },
      { source: '/pre-booking/', destination: '/book-online', permanent: true },
      { source: '/new-patient', destination: '/book-online', permanent: true },
      { source: '/new-patient/', destination: '/book-online', permanent: true },
      { source: '/questionnaire', destination: '/contact', permanent: true },
      { source: '/questionnaire/', destination: '/contact', permanent: true },
      { source: '/form', destination: '/contact', permanent: true },
      { source: '/form/', destination: '/contact', permanent: true },
      { source: '/massage-new-patient-medical-form-redux', destination: '/contact', permanent: true },
      { source: '/massage-new-patient-medical-form-redux/', destination: '/contact', permanent: true },
      { source: '/thank-you', destination: '/', permanent: true },
      { source: '/thank-you/', destination: '/', permanent: true },
      { source: '/thanks', destination: '/', permanent: true },
      { source: '/thanks/', destination: '/', permanent: true },
      { source: '/ipad-contact-form', destination: '/contact', permanent: true },
      { source: '/ipad-contact-form/', destination: '/contact', permanent: true },
      { source: '/create-event', destination: '/contact', permanent: true },
      { source: '/create-event/', destination: '/contact', permanent: true },

      // ── REMOVED ECOMMERCE ──
      { source: '/shop', destination: '/gift-vouchers', permanent: true },
      { source: '/shop/', destination: '/gift-vouchers', permanent: true },
      { source: '/cart', destination: '/gift-vouchers', permanent: true },
      { source: '/cart/', destination: '/gift-vouchers', permanent: true },
      { source: '/checkout', destination: '/gift-vouchers', permanent: true },
      { source: '/checkout/', destination: '/gift-vouchers', permanent: true },
      { source: '/my-account', destination: '/', permanent: true },
      { source: '/my-account/', destination: '/', permanent: true },
      { source: '/sample-page', destination: '/', permanent: true },
      { source: '/sample-page/', destination: '/', permanent: true },
      { source: '/home-2', destination: '/', permanent: true },
      { source: '/home-2/', destination: '/', permanent: true },

      // ── BENEFITS / INFO PAGES → relevant treatment ──
      { source: '/pregnancy-massage-benefits-cambridge', destination: '/your-pregnancy-massage', permanent: true },
      { source: '/pregnancy-massage-benefits-cambridge/', destination: '/your-pregnancy-massage', permanent: true },
      { source: '/sports-massage-benefits-cambridge', destination: '/treatments/sports-massage', permanent: true },
      { source: '/sports-massage-benefits-cambridge/', destination: '/treatments/sports-massage', permanent: true },
      { source: '/physiotherapy-benefits-cambridge', destination: '/treatments', permanent: true },
      { source: '/physiotherapy-benefits-cambridge/', destination: '/treatments', permanent: true },

      // ── FAQ — all old FAQ URLs → /faq ──
      { source: '/faq/:slug*', destination: '/faq', permanent: true },

      // ── VIDEOS → relevant pages ──
      { source: '/videos/client-testimonials', destination: '/testimonials', permanent: true },
      { source: '/videos/client-testimonials/', destination: '/testimonials', permanent: true },
      { source: '/videos/:slug*', destination: '/corporate', permanent: true },

      // ── COVID-19 — catch-all for anything we missed ──
      { source: '/covid-19/:slug*', destination: '/news', permanent: true },

      // ── CORPORATE PAGES (private domain WP) ──
      { source: '/corporate-massage-services', destination: '/corporate/services', permanent: true },
      { source: '/corporate-massage-services/', destination: '/corporate/services', permanent: true },
      { source: '/corporate-massage-services-old', destination: '/corporate/services', permanent: true },
      { source: '/corporate-massage-services-old/', destination: '/corporate/services', permanent: true },
      { source: '/corporate-bookings', destination: '/corporate', permanent: true },
      { source: '/corporate-bookings/', destination: '/corporate', permanent: true },
      { source: '/corporate-massage-services/:slug*', destination: '/corporate', permanent: true },

      // ── CORPORATE-SPECIFIC SCHEDULE PAGES → /corporate/services ──
      { source: '/speechmatics-20-minute-schedule', destination: '/corporate/services', permanent: true },
      { source: '/speechmatics-20-minute-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/spearhead-20-minute-massges', destination: '/corporate/services', permanent: true },
      { source: '/spearhead-20-minute-massges/', destination: '/corporate/services', permanent: true },
      { source: '/spearhead-30-minute-consultation-schedule', destination: '/corporate/services', permanent: true },
      { source: '/spearhead-30-minute-consultation-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/redgate-30-minute-massages', destination: '/corporate/services', permanent: true },
      { source: '/redgate-30-minute-massages/', destination: '/corporate/services', permanent: true },
      { source: '/redgate-15-minute-massage-schedule', destination: '/corporate/services', permanent: true },
      { source: '/redgate-15-minute-massage-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/redgate-30-minute-consultation-schedule', destination: '/corporate/services', permanent: true },
      { source: '/redgate-30-minute-consultation-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/abzena-20-minute-massage-schedule', destination: '/corporate/services', permanent: true },
      { source: '/abzena-20-minute-massage-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/spotify-30-minute-massages-schedule', destination: '/corporate/services', permanent: true },
      { source: '/spotify-30-minute-massages-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/spotify-20-minute-massage-schedule', destination: '/corporate/services', permanent: true },
      { source: '/spotify-20-minute-massage-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/costello-medical-20-minute-massage-schedule', destination: '/corporate/services', permanent: true },
      { source: '/costello-medical-20-minute-massage-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/costello-medical-30-minute-consultation-schedule', destination: '/corporate/services', permanent: true },
      { source: '/costello-medical-30-minute-consultation-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/university-of-cambridge-20-minute-schedule', destination: '/corporate/services', permanent: true },
      { source: '/university-of-cambridge-20-minute-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/university-of-cambridge-school-of-clinical-medicine-30-minute-consultation-schedule', destination: '/corporate/services', permanent: true },
      { source: '/university-of-cambridge-school-of-clinical-medicine-30-minute-consultation-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/mills-and-reeve-30-minute-schedule', destination: '/corporate/services', permanent: true },
      { source: '/mills-and-reeve-30-minute-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/iwf-15-minute-massage-schedule-2-2', destination: '/corporate/services', permanent: true },
      { source: '/iwf-15-minute-massage-schedule-2-2/', destination: '/corporate/services', permanent: true },
      { source: '/cambridge-network-schedule', destination: '/corporate/services', permanent: true },
      { source: '/cambridge-network-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/50-60-promotion-30-minute-schedule', destination: '/corporate/services', permanent: true },
      { source: '/50-60-promotion-30-minute-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/fstar-30-minute-consultation-schedule', destination: '/corporate/services', permanent: true },
      { source: '/fstar-30-minute-consultation-schedule/', destination: '/corporate/services', permanent: true },
      { source: '/examples-of-schedules-for-massage', destination: '/corporate/services', permanent: true },
      { source: '/examples-of-schedules-for-massage/', destination: '/corporate/services', permanent: true },

      // ── CORPORATE SUBDOMAIN PAGES (will hit when corp domain redirects to apex) ──
      { source: '/in-office-chair-massage', destination: '/corporate/services/in-chair-massage', permanent: true },
      { source: '/in-office-chair-massage/', destination: '/corporate/services/in-chair-massage', permanent: true },
      { source: '/dse-assessments', destination: '/corporate/services/dsc-assessments', permanent: true },
      { source: '/dse-assessments/', destination: '/corporate/services/dse-assessments', permanent: true },
      // DSC → DSE slug rename
      { source: '/corporate/services/dsc-assessments', destination: '/corporate/services/dse-assessments', permanent: true },
      { source: '/corporate/services/dsc-assessments/', destination: '/corporate/services/dse-assessments', permanent: true },
      { source: '/online-sessions', destination: '/corporate/services', permanent: true },
      { source: '/online-sessions/', destination: '/corporate/services', permanent: true },
      { source: '/services', destination: '/corporate/services', permanent: true },
      { source: '/services/', destination: '/corporate/services', permanent: true },
      { source: '/contact-us', destination: '/corporate/contact', permanent: true },
      { source: '/contact-us/', destination: '/corporate/contact', permanent: true },
      { source: '/concept-2', destination: '/corporate', permanent: true },
      { source: '/concept-2/', destination: '/corporate', permanent: true },
    ];
  },
};

export default nextConfig;
