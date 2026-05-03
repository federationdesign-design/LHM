import type { Metadata } from 'next';
import QuestionnaireClient from './QuestionnaireClient';

export const metadata: Metadata = {
  title: 'New Client Questionnaire | Lucy Hall Massage Therapy',
  description: 'Complete your new client questionnaire ahead of your first appointment with Lucy Hall Massage Therapy.',
  // Hidden from search engines — this is a private form sent to clients after booking
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuestionnairePage() {
  return <QuestionnaireClient />;
}
