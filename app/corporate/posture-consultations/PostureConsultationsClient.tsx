'use client';

import CorporateServicePage from '../components/CorporateServicePage';

export default function PostureConsultationsClient() {
  return (
    <CorporateServicePage
      currentSlug="posture-consultations"
      heroImage="/corporate-posture.jpg"
      headline="Assessments & Posture Consultations"
      heroCopy={
        'One-to-one expert sessions to identify, correct, and prevent posture problems.\nIdeal for desk-based teams, hybrid workers, and anyone struggling with chronic tension or pain.'
      }
      whatIsTitle="What is a Posture Consultation?"
      whatIsBody="A posture consultation is a one-to-one session with a qualified therapist to analyse how an individual stands, sits, and moves. We identify imbalances, compensations, and habits that contribute to discomfort or risk of injury. Each consultation includes practical, personalised exercises and stretches the employee can do at their desk or at home — addressing the root cause, not just the symptoms. Sessions can be delivered on-site or remotely via video call."
      benefitsTitle="The Benefits of Posture Consultations"
      benefits={[
        {
          title: 'Targeted, Personal Advice',
          body: 'Generic ergonomic advice only goes so far. A posture consultation gives each person tailored guidance based on their actual body, workstation, and lifestyle — far more effective than one-size-fits-all training.',
        },
        {
          title: 'Reduced Pain & Tension',
          body: 'Most desk-related discomfort comes from a small number of fixable patterns. Identifying and correcting them brings noticeable relief, often within a few weeks.',
        },
        {
          title: 'Tools That Stick',
          body: 'Each consultation finishes with simple exercises and habits the employee can integrate into their working day. Real, lasting change rather than a one-off intervention.',
        },
        {
          title: 'Prevention Over Cure',
          body: 'Identifying issues early — before they become chronic — saves time, sick days, and discomfort later. Posture consultations are one of the highest-ROI wellbeing investments a business can make.',
        },
      ]}
    />
  );
}
