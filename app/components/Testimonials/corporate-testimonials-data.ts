import type { Testimonial } from './testimonials-data';

/* ─────────────────────────────────────────────────────────────
   corporate-testimonials-data.ts

   Corporate-specific testimonials shown on /corporate service
   pages. Same Testimonial type as the private-side testimonials
   so they render through the shared <Testimonials /> component.

   Mapping notes:
     - title  → company name (since company is the salient identifier)
     - avatar → first letter of name
   ───────────────────────────────────────────────────────────── */

export const corporateTestimonials: Testimonial[] = [
  {
    id: 'louise-domeisen-redgate',
    name: 'Louise Domeisen',
    title: 'Redgate',
    body: 'We have always been big fans of Lucy and her team when they would visit the offices for in-person massages. We jumped at the chance to offer the next best thing — zoom consultations with a therapist. No matter the format of the interactions the feedback is always the same: expert therapists, actionable advice, personable and professional.',
    date: '',
    avatar: 'L',
  },
  {
    id: 'maria-slater-spotify',
    name: 'Maria Slater',
    title: 'Spotify',
    body: 'Lucy and her team have a great reputation in the industry and we wanted the best for our staff. Her team make you feel like you are important, they listen to what you say and advise accordingly. All of our staff come back into the office singing their praises. Lucy feels like a member of our team, part of the family.',
    date: '',
    avatar: 'M',
  },
  {
    id: 'emma-king-costello-medical',
    name: 'Emma King',
    title: 'Costello Medical',
    body: 'We regularly use Lucy Hall Massage as part of our ongoing wellbeing initiative and consistently receive excellent feedback from our employees. Lucy takes the time to provide employees with personalised advice and guidance on their posture, which has been highly valued by staff.',
    date: '',
    avatar: 'E',
  },
  {
    id: 'ginelle-richardson-spotify',
    name: 'Ginelle Richardson',
    title: 'Spotify',
    body: 'Lucy and her team are always professional, prompt and provides a friendly service. The entire Spotify office love her and the team! Many members of staff have also used Lucy Hall Massage privately since. Highly recommended!',
    date: '',
    avatar: 'G',
  },
  {
    id: 'nataliia-matsuk-amazon',
    name: 'Nataliia Matsuk',
    title: 'Amazon',
    body: 'The sessions are not only relaxing but also really helpful for posture correction, especially for those of us who spend long hours at our desks. We noticed reduced tension and overall better well-being. It is a great way to relieve stress and improve workplace comfort.',
    date: '',
    avatar: 'N',
  },
  {
    id: 'natasha-gobec-softwire',
    name: 'Natasha Gobec',
    title: 'Softwire',
    body: 'We have been regular clients of Lucy for the past two years. Both she and Katerina check our posture at our desks and offer valuable advice that has significantly helped us improve our pain management and overall health. Their visits are always positive, and it is a pleasure to have them in the office.',
    date: '',
    avatar: 'N',
  },
  {
    id: 'isobel-jordan-clinical-school',
    name: 'Isobel Jordan',
    title: 'Clinical School of Medicine',
    body: 'We use Lucy Hall as part of supporting Wellbeing for colleagues at the Clinical School, these sessions are always in high demand! Thank you Lucy and your team.',
    date: '',
    avatar: 'I',
  },
  {
    id: 'steve-mann-brand-recruitment',
    name: 'Steve Mann',
    title: 'Brand Recruitment',
    body: 'We have been lucky enough to benefit from Lucy\'s assessments and treatments over the years. It is a nice perk to look forward to, yet for others the consultative advice Lucy gives (about workstations, posture, remedial stretches and exercises etc.) has really made a genuine difference to their wellbeing and happiness. I cannot recommend her enough!',
    date: '',
    avatar: 'S',
  },
];
