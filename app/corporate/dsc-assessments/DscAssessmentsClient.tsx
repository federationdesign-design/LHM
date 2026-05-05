'use client';

import CorporateServicePage from '../components/CorporateServicePage';

export default function DscAssessmentsClient() {
  return (
    <CorporateServicePage
      currentSlug="dsc-assessments"
      heroImage="/corporate-dsc.jpg"
      headline="Display Screen Equipment Assessments"
      heroCopy={
        'Comprehensive DSE assessments to keep your team safe, comfortable, and compliant.\nWe identify risks, recommend adjustments, and help your business meet its duty of care obligations.'
      }
      whatIsTitle="What is a DSE Assessment?"
      whatIsBody="A Display Screen Equipment (DSE) assessment is a structured review of how each employee uses their workstation — from monitor height and chair setup to keyboard position and lighting. UK law (Health and Safety at Work Act / HSE DSE Regulations) requires employers to provide DSE assessments for staff who regularly use computers. We carry these out on-site or remotely, document findings, and provide tailored recommendations to reduce strain and prevent musculoskeletal injuries."
      benefitsTitle="The Benefits of DSE Assessments"
      benefits={[
        {
          title: 'Compliance with Regulations',
          body: 'Our assessments meet HSE guidelines and provide documented evidence that you\'ve fulfilled your duty of care to staff who use display screen equipment.',
        },
        {
          title: 'Reduced Sickness & Absence',
          body: 'Most workplace musculoskeletal issues — neck pain, back pain, RSI, eye strain — are preventable with the right setup. Catching them early keeps your team well and at work.',
        },
        {
          title: 'Personalised for Each Employee',
          body: 'No two bodies (or workstations) are the same. We assess each person individually and provide bespoke recommendations rather than one-size-fits-all advice.',
        },
        {
          title: 'Hybrid & Remote Worker Support',
          body: 'Home setups are often where the problems start. We extend assessments to remote and hybrid workers via video consultation, with the same depth as on-site reviews.',
        },
      ]}
    />
  );
}
