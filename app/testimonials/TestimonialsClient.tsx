'use client';

import { useEffect, useRef, useState } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import type { GoogleReview, GoogleReviewsResponse } from '../api/google-reviews/route';

/* ─────────────────────────────────────────────────────────────
   Star rating display — fills `count` of 5 stars
   ───────────────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-label={`${rating} out of 5 stars`}>
      {stars.map((filled, i) => (
        <svg key={i} viewBox="0 0 20 20" style={{ width: 16, height: 16 }} aria-hidden="true">
          <path
            d="M10 1l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.3l-5.2 2.7 1-5.8L1.5 7.1l5.9-.8L10 1z"
            fill={filled ? '#fbbc05' : 'none'}
            stroke={filled ? '#fbbc05' : 'rgba(255,255,255,0.4)'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Google Reviews — fetches from /api/google-reviews and renders
   each review as a card. Up to 5 reviews per Places API limit.
   ───────────────────────────────────────────────────────────── */
function GoogleReviews() {
  const [data, setData] = useState<GoogleReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(r => r.json())
      .then((d: GoogleReviewsResponse) => setData(d))
      .catch(err => setData({ reviews: [], rating: null, totalReviews: null, error: err?.message ?? 'Failed to load' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p style={{ fontSize: '0.92rem', fontWeight: 300, color: '#ffffff', opacity: 0.5, textAlign: 'center', padding: '40px 24px' }}>
        Loading reviews&hellip;
      </p>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <p style={{ fontSize: '0.92rem', fontWeight: 300, color: '#ffffff', opacity: 0.5, textAlign: 'center', padding: '40px 24px', border: '1px dashed rgba(255,255,255,0.2)' }}>
        {data?.error ? `Reviews unavailable: ${data.error}` : 'No reviews to display.'}
      </p>
    );
  }

  return (
    <div>
      {data.rating && data.totalReviews && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StarRating rating={data.rating} />
          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
            {data.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 300, color: '#ffffff', opacity: 0.6 }}>
            ({data.totalReviews.toLocaleString()} reviews)
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {data.reviews.map((r: GoogleReview, i: number) => (
          <article
            key={i}
            style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {r.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.profilePhotoUrl}
                  alt=""
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%', flexShrink: 0 }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#333', flexShrink: 0 }} aria-hidden="true" />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.authorUrl ? (
                    <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
                      {r.authorName}
                    </a>
                  ) : (
                    r.authorName
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 300, color: '#ffffff', opacity: 0.55 }}>
                  {r.relativeTimeDescription}
                </div>
              </div>
            </div>
            <StarRating rating={r.rating} />
            <p style={{ fontSize: '0.92rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.92, margin: 0 }}>
              {r.text}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SimplyBook Reviews widget — updated config with concise theme
   and new colour palette to match site styling.
   ───────────────────────────────────────────────────────────── */
function SimplyBookReviews() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerId = 'sbw_1fwz8g';
    const existing = document.querySelector(`script[data-widget="${containerId}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.async = true;
    script.src = '//widget.simplybook.it/v2/widget/widget.js';
    script.setAttribute('data-widget', containerId);
    script.onload = () => {
      if (typeof (window as any).SimplybookWidget !== 'undefined') {
        new (window as any).SimplybookWidget({
          widget_type: 'reviews',
          url: 'https://lucyhallmassage.simplybook.it',
          theme: 'concise',
          theme_settings: {
            timeline_hide_unavailable: '0',
            hide_past_days: '0',
            timeline_show_end_time: '0',
            timeline_modern_display: 'as_slots',
            light_font_color: '#ffffff',
            sb_secondary_base: '#000000',
            sb_base_color: '#000000',
            display_item_mode: 'block',
            booking_nav_bg_color: '#000000',
            sb_review_image: '',
            dark_font_color: '#333333',
            btn_color_1: '#385e8e',
            sb_company_label_color: '#275a9b',
            hide_img_mode: '0',
            show_sidebar: '1',
            sb_busy: '#c7b3b3',
            sb_available: '#d6ebff',
          },
          timeline: null,
          datepicker: null,
          is_rtl: false,
          app_config: { predefined: [] },
          reviews_count: '0',
          hide_add_reviews: 1,
          container_id: containerId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  return <div id="sbw_1fwz8g" ref={containerRef} style={{ width: '100%' }} />;
}

export default function TestimonialsClient() {
  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        <section style={{ padding: '120px 48px 40px', maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Testimonials
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 18 }}>
            What Our Clients Say
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, maxWidth: 640 }}>
            Genuine reviews and testimonials from clients across Cambridge. We are very grateful for the kind words our clients have shared about their experiences with our team.
          </p>
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* SimplyBook Reviews widget — updated config */}
        <section style={{ padding: '60px 48px 60px', maxWidth: 1300, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: 32 }}>
            Reviews from SimplyBook
          </h2>
          <SimplyBookReviews />
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* Google Reviews placeholder slot. See comment notes on TestimonialsClient
            previous version — paste an Elfsight or similar embed inside the div */}
        <section style={{ padding: '60px 48px 100px', maxWidth: 1300, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: 32 }}>
            Google Reviews
          </h2>

          {/* Live from Google Places API. Place ID: ChIJey7ynZpw2EcRU8Rob2GtOFk
              Backed by /api/google-reviews route, which uses GOOGLE_PLACES_API_KEY
              env var (server-side only, never exposed to browser). */}
          <GoogleReviews />
        </section>

        <Footer />
      </main>
    </>
  );
}
