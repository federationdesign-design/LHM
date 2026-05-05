/* ─────────────────────────────────────────────────────────────
   testimonials-data.ts

   Source of truth for testimonials shown across the site via the
   shared <Testimonials /> component.

   Add new entries to the top of the array for newest-first order
   on the carousel and grid.

   Future ideas (not done yet):
     - Tag entries with `audience: 'private' | 'corporate' | 'both'`
       so /corporate pages can show a filtered subset.
     - Pull live data from the SimplyBook reviews API (item 024).
   ───────────────────────────────────────────────────────────── */

export type Testimonial = {
  /** Stable id, useful as React key and for future filtering. */
  id: string;
  /** Reviewer name as it should display. */
  name: string;
  /** Short headline / review title. */
  title: string;
  /** Body of the review. */
  body: string;
  /** Display date e.g. '30/03/2026'. */
  date: string;
  /** Single character (or short string) shown inside the avatar circle. */
  avatar: string;
  /** Star rating out of 5. Defaults to 5 if omitted. */
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    id: 'sarah-cater-2026-03',
    name: 'Sarah Cater',
    title: 'Fantastic Swedish massage with Antonia',
    body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.',
    date: '30/03/2026',
    avatar: 'S',
  },
  {
    id: 'suleyman-adanir-2026-02',
    name: 'Suleyman Adanir',
    title: 'Swedish massage with Antonia',
    body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.',
    date: '04/02/2026',
    avatar: 'S',
  },
  {
    id: 'alice-w-2025-12',
    name: 'Alice W',
    title: 'Orla is brilliant',
    body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.',
    date: '10/12/2025',
    avatar: 'A',
  },
];
