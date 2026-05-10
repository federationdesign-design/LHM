// app/api/google-reviews/route.ts
//
// Server-side endpoint that fetches reviews from Google Places API for the
// Lucy Hall Massage place. The API key is read from process.env.GOOGLE_PLACES_API_KEY
// and never exposed to the browser.
//
// Returns a JSON array of reviews (up to 5 — that's the legacy endpoint's cap).
//
// Caches at the edge for 6 hours so we don't hammer the Places API on every
// page load. Adjust the revalidate value if reviews need to refresh more
// frequently.

import { NextResponse } from 'next/server';

// Lucy Hall Massage on Google Maps
const PLACE_ID = 'ChIJey7ynZpw2EcRU8Rob2GtOFk';

// Cache for 6 hours (in seconds)
export const revalidate = 21600;

export interface GoogleReview {
  authorName: string;
  authorUrl: string;
  profilePhotoUrl: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  time: number; // unix timestamp
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  rating: number | null;
  totalReviews: number | null;
  error?: string;
}

interface PlacesApiReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
}

interface PlacesApiResponse {
  result?: {
    reviews?: PlacesApiReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
  error_message?: string;
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json<GoogleReviewsResponse>({
      reviews: [],
      rating: null,
      totalReviews: null,
      error: 'GOOGLE_PLACES_API_KEY is not configured',
    }, { status: 200 });
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', PLACE_ID);
  url.searchParams.set('fields', 'reviews,rating,user_ratings_total');
  url.searchParams.set('key', apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate } });
    const data = (await res.json()) as PlacesApiResponse;

    if (data.status !== 'OK') {
      return NextResponse.json<GoogleReviewsResponse>({
        reviews: [],
        rating: null,
        totalReviews: null,
        error: `Places API status: ${data.status}${data.error_message ? ' - ' + data.error_message : ''}`,
      }, { status: 200 });
    }

    const result = data.result ?? {};
    const reviews: GoogleReview[] = (result.reviews ?? []).map(r => ({
      authorName: r.author_name,
      authorUrl: r.author_url ?? '',
      profilePhotoUrl: r.profile_photo_url ?? '',
      rating: r.rating,
      text: r.text,
      relativeTimeDescription: r.relative_time_description,
      time: r.time,
    }));

    return NextResponse.json<GoogleReviewsResponse>({
      reviews,
      rating: result.rating ?? null,
      totalReviews: result.user_ratings_total ?? null,
    });
  } catch (err) {
    return NextResponse.json<GoogleReviewsResponse>({
      reviews: [],
      rating: null,
      totalReviews: null,
      error: err instanceof Error ? err.message : 'Unknown error fetching reviews',
    }, { status: 200 });
  }
}
