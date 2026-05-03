export interface Location {
  slug: string;
  name: string;
  h1: string;
  tagline: string;
  address: string[];
  googleMapsUrl: string;
  lat: number;
  lng: number;
  widgetLocationId: string;
  hours: { day: string; time: string }[];
  heroColor: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export const locations: Record<string, Location> = {
  'thoday-street': {
    slug: 'thoday-street',
    name: 'Thoday Street',
    h1: 'Thoday Street, Cambridge',
    tagline: 'Our main clinic — open 7 days a week',
    address: ['2 Antwerp Cottages', 'Thoday Street', 'Cambridge', 'CB1 3AU'],
    googleMapsUrl: 'https://maps.google.com/?q=2+Antwerp+Cottages+Thoday+Street+Cambridge+CB1+3AU',
    lat: 52.19850,
    lng: 0.13580,
    widgetLocationId: '2',
    hours: [
      { day: 'Monday', time: '9am – 8pm' },
      { day: 'Tuesday', time: '9am – 8pm' },
      { day: 'Wednesday', time: '9am – 8pm' },
      { day: 'Thursday', time: '9am – 8pm' },
      { day: 'Friday', time: '9am – 6pm' },
      { day: 'Saturday', time: '9am – 5.30pm' },
      { day: 'Sunday', time: '10am – 5pm' },
    ],
    heroColor: '#3a3028',
    metaTitle: 'Thoday Street Clinic | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Visit our Thoday Street clinic in Cambridge for deep tissue, Swedish, sports massage and more. Open 7 days a week. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/locations/thoday-street/',
  },
  'cromwell-road': {
    slug: 'cromwell-road',
    name: 'Cromwell Road',
    h1: 'Cromwell Road, Cambridge',
    tagline: 'Available Wednesdays and Fridays',
    address: ['96 Cromwell Road', 'Cambridge', 'Cambridgeshire', 'CB1 3EG'],
    googleMapsUrl: 'https://maps.google.com/?q=96+Cromwell+Road+Cambridge+CB1+3EG',
    lat: 52.19480,
    lng: 0.13920,
    widgetLocationId: '4',
    hours: [
      { day: 'Wednesday', time: '9am – 8pm' },
      { day: 'Friday', time: '9am – 6pm' },
    ],
    heroColor: '#28303a',
    metaTitle: 'Cromwell Road Clinic | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Visit our Cromwell Road clinic in Cambridge. Available Wednesdays and Fridays. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/locations/cromwell-road/',
  },
};
