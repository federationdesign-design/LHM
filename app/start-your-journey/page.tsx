import type { Metadata } from 'next';
import StartYourJourneyClient from './StartYourJourneyClient';

export const metadata: Metadata = {
  title: 'Start Your Journey | Lucy Hall Massage Therapy',
  description: 'Not sure if massage is right for you? Sign up to our free well-being programme. Tell us about your situation and we will guide you towards the right approach.',
  alternates: { canonical: 'https://www.lucyhallmassage.com/start-your-journey' },
  openGraph: {
    title: 'Start Your Journey | Lucy Hall Massage Therapy',
    description: 'Not sure if massage is right for you? Start with our free well-being programme.',
    url: 'https://www.lucyhallmassage.com/start-your-journey',
    type: 'website',
  },
};

export default function StartYourJourneyPage() {
  return <StartYourJourneyClient />;
}
