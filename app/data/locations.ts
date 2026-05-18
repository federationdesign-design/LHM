// app/data/locations.ts

export interface Location {
  slug: string;
  name: string;
  h1: string;
  tagline: string;
  address: string[];
  googleMapsUrl: string;
  lat: number;
  lng: number;
  // Optional override coords for the inset map on the /locations index page.
  // When set, the LocationsIndexClient renders the pin at indexLat/indexLng
  // instead of lat/lng. Leave undefined to use lat/lng on both maps.
  indexLat?: number;
  indexLng?: number;
  widgetLocationId: string;
  hours: { day: string; time: string }[];
  heroColor: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  gallery?: string[];
}

export const locations: Record<string, Location> = {
  'thoday-street': {
    slug: 'thoday-street',
    name: 'Thoday Street',
    h1: 'Thoday Street, Cambridge',
    tagline: 'Our main clinic — open 7 days a week',
    address: ['2 Antwerp Cottages', 'Thoday Street', 'Cambridge', 'CB1 3AU'],
    googleMapsUrl: 'https://maps.google.com/?q=2+Antwerp+Cottages+Thoday+Street+Cambridge+CB1+3AU',
    lat: 52.200856,
    lng: 0.148039,
    indexLat: 52.200856,
    indexLng: 0.148039,
    widgetLocationId: '2',
    hours: [
      { day: 'Monday', time: '9am – 8pm' },
      { day: 'Tuesday', time: '9am – 8pm' },
      { day: 'Wednesday', time: '12pm – 8pm' },
      { day: 'Thursday', time: '9am – 8pm' },
      { day: 'Friday', time: '9am – 6pm' },
      { day: 'Saturday', time: '9am – 5.30pm' },
      { day: 'Sunday', time: '10am – 5pm' },
    ],
    heroColor: '#3a3028',
    metaTitle: 'Thoday Street Clinic | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Visit our Thoday Street clinic in Cambridge for deep tissue, Swedish, sports massage and more. Open 7 days a week. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/locations/thoday-street/',
    gallery: [
      '/thoday-location-img1.jpg',
      '/thoday-location-img2.jpg',
      '/thoday-location-img3.jpg',
      '/thoday-location-img4.jpg',
      '/thoday-location-img5.jpg',
      '/thoday-location-img6.jpg',
      '/thoday-location-img7.jpg',
      '/thoday-location-img8.jpg',
    ],
  },
  'cromwell-road': {
    slug: 'cromwell-road',
    name: 'Cromwell Road',
    h1: 'Cromwell Road, Cambridge',
    tagline: 'Available Wednesdays and Fridays',
    address: ['96 Cromwell Road', 'Cambridge', 'Cambridgeshire', 'CB1 3EG'],
    googleMapsUrl: 'https://maps.google.com/?q=96+Cromwell+Road+Cambridge+CB1+3EG',
    lat: 52.203035737126555,
    lng: 0.14792165893905196,
    indexLat: 52.203404271919894,
    indexLng: 0.14736598160194792,
    widgetLocationId: '4',
    hours: [
      { day: 'Wednesday', time: '9am – 8pm' },
      { day: 'Friday', time: '9am – 6pm' },
    ],
    heroColor: '#28303a',
    metaTitle: 'Cromwell Road Clinic | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Visit our Cromwell Road clinic in Cambridge. Available Wednesdays and Fridays. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/locations/cromwell-road/',
    gallery: [
      '/cromwell-location-img1.jpg',
      '/cromwell-location-img2.jpg',
      '/cromwell-location-img3.jpg',
      '/cromwell-location-img4.jpg',
      '/cromwell-location-img5.jpg',
      '/cromwell-location-img6.jpg',
      '/cromwell-location-img7.jpg',
      '/cromwell-location-img8.jpg',
    ],
  },
};
