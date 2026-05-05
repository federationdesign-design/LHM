'use client';

import CorporateServicePage from '../components/CorporateServicePage';

export default function InChairMassageClient() {
  return (
    <CorporateServicePage
      currentSlug="in-chair-massage"
      heroImage="/corporate-chair-massage.jpg"
      headline="In-Office Chair Massage Services"
      heroCopy={
        'On-site chair massage delivered by fully qualified therapists.\nA quick, easy, and proven way to boost team wellbeing without disrupting the working day.'
      }
      whatIsTitle="What is a Chair Massage?"
      whatIsBody="A chair massage is a focused, fully-clothed treatment performed in a specialised ergonomic chair. Sessions typically last between 10 and 20 minutes and target the upper back, shoulders, neck, and arms — the areas most affected by long hours at a desk. No oils, no special setup, no downtime. Our therapists come to your office and your team simply takes turns through the day."
      benefitsTitle="The Benefits of In-Office Massage"
      benefits={[
        {
          title: 'Reduced Stress',
          body: 'Massage lowers cortisol levels and activates the parasympathetic nervous system, helping employees switch from "fight or flight" mode back into focused, calm work.',
        },
        {
          title: 'Increased Productivity',
          body: 'Even short massage sessions improve circulation, reduce mental fatigue, and leave your team noticeably more alert and engaged for the rest of the day.',
        },
        {
          title: 'Improved Morale',
          body: 'Investing in physical wellbeing sends a clear signal that you value your people. Teams routinely report higher satisfaction and stronger company loyalty after wellbeing initiatives like this.',
        },
        {
          title: 'Enhanced Posture',
          body: 'Each session includes posture observations and small adjustments. Over time, employees become more aware of their working posture and ergonomics — preventing the small daily habits that turn into chronic pain.',
        },
      ]}
    />
  );
}
