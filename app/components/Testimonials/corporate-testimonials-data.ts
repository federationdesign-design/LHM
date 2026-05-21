import type { Testimonial } from './testimonials-data';

/* ─────────────────────────────────────────────────────────────
   corporate-testimonials-data.ts — single source of truth for
   corporate-side testimonials. Used by homepage + services index
   + individual service pages.

   Order matches the corp homepage display order. The `logo` field
   drives the new corp grid rendering (with company logos instead
   of avatar initials).
   ───────────────────────────────────────────────────────────── */

export const corporateTestimonials: Testimonial[] = [
  {
    id: 'louise-ranger-cambridge',
    name: 'Louise Ranger',
    title: 'Cambridge University',
    body: 'We use Lucy Hall Massage for our staff wellbeing days at Churchill College, Cambridge University. Lucy is awesome to work with and we get nothing but positive feedback from our staff about the chair massage sessions (which are always fully booked). Five star service and highly recommend!',
    date: '',
    avatar: 'L',
    logo: '/university-cambridge.png',
  },
  {
    id: 'nataliia-matsuk-amazon',
    name: 'Nataliia Matsuk',
    title: 'Amazon',
    body: 'The sessions are not only relaxing but also really helpful for posture correction, especially for those of us who spend long hours at our desks. We noticed reduced tension and overall better well-being. It is a great way to relieve stress and improve workplace comfort. Thanks for providing this service — it is definitely making a positive impact!',
    date: '',
    avatar: 'N',
    logo: '/amazon.png',
  },
  {
    id: 'ginelle-richardson-spotify',
    name: 'Ginelle Richardson',
    title: 'Spotify',
    body: 'Lucy and her team are always professional, prompt and provides a friendly service. The entire Spotify office love her and the team! Many members of staff have also used Lucy Hall Massage privately since. Highly recommended!',
    date: '',
    avatar: 'G',
    logo: '/spotify.png',
  },
  {
    id: 'robert-perrement-suffolk',
    name: 'Robert Perrement',
    title: 'Suffolk County Council',
    body: 'We used Lucy Hall Massage and her colleagues for the Suffolk & North East Essex Integrated Care System Expo 22 event. Lucy was very happy to help and answer any questions prior to the event, making booking as easy as possible. The team were also very adaptable on the day due to rainfall, but this did not hinder the quality of service. Everyone seemed very pleased with their massages.',
    date: '',
    avatar: 'R',
    logo: '/suffolk-county-logo.jpg',
  },
  {
    id: 'megan-foster-speechmatics',
    name: 'Megan Foster',
    title: 'Speechmatics',
    body: 'I highly recommend Lucy Hall massages for anyone looking to bring relaxation and stress relief directly to the workplace. Their professional massage therapist Kat visits our office once a month, offering convenient on-site services that help improve employee well-being and productivity. A fantastic investment in both employee health and company culture.',
    date: '',
    avatar: 'M',
    logo: '/speechmatics.png',
  },
  {
    id: 'emma-king-costello',
    name: 'Emma King',
    title: 'Costello Medical',
    body: 'This review is on behalf of Costello Medical. We regularly use Lucy Hall Massage as part of our ongoing wellbeing initiative and consistently receive excellent feedback from our employees. Lucy takes the time to provide employees with personalised advice and guidance on their posture, which has been highly valued by staff. We look forward to continue working with Lucy in the future.',
    date: '',
    avatar: 'E',
    logo: '/costello-medical.png',
  },
  {
    id: 'louise-domeisen-redgate',
    name: 'Louise Domeisen',
    title: 'Redgate',
    body: 'We have always been big fans of Lucy and her team when they would visit the offices for in-person massages. We jumped at the chance to offer the next best thing — zoom consultations with a therapist. No matter the format of the interactions the feedback is always the same: expert therapists, actionable advice, personable and professional.',
    date: '',
    avatar: 'L',
    logo: '/redgate-logo.png',
  },
  {
    id: 'maria-slater-spotify',
    name: 'Maria Slater',
    title: 'Spotify',
    body: 'Lucy and her team have a great reputation in the industry and we wanted the best for our staff. Her team make you feel like you are important, they listen to what you say and advise accordingly. All of our staff come back into the office singing their praises. Lucy feels like a member of our team, part of the family.',
    date: '',
    avatar: 'M',
    logo: '/spotify.png',
  },
  {
    id: 'natasha-gobec-softwire',
    name: 'Natasha Gobec',
    title: 'Softwire',
    body: 'We have been regular clients of Lucy for the past two years. Both she and Katerina check our posture at our desks and offer valuable advice that has significantly helped us improve our pain management and overall health. Their visits are always positive, and it is a pleasure to have them in the office.',
    date: '',
    avatar: 'N',
    logo: '/softwire-logo.png',
  },
  {
    id: 'isobel-jordan-clinical',
    name: 'Isobel Jordan',
    title: 'Clinical School of Medicine',
    body: 'We use Lucy Hall as part of supporting Wellbeing for colleagues at the Clinical School, these sessions are always in high demand! Thank you Lucy and your team.',
    date: '',
    avatar: 'I',
    logo: '/university-cambridge.png',
  },
  {
    id: 'steve-mann-brand-recruitment',
    name: 'Steve Mann',
    title: 'Brand Recruitment',
    body: 'We have been lucky enough to benefit from Lucy assessments and treatments over the years. It is a nice perk to look forward to, yet for others the consultative advice Lucy gives (about work stations, posture, remedial stretches and exercises etc.) has really made a genuine difference to their wellbeing and happiness. I cannot recommend her enough!',
    date: '',
    avatar: 'S',
    logo: '/brand-recruitment.png',
  },
  {
    id: 'will-r-hse-fac',
    name: 'Will R.',
    title: 'Technology Center HSE & FAC Manager',
    body: 'Lucy is a fantastic Sports Therapist, highly skilled and highly knowledgeable. If you have the opportunity to work together I recommend you take that chance.',
    date: '',
    avatar: 'W',
    logo: '/company-placeholder.png',
  },
  {
    id: 'rebecca-woof-redgate',
    name: 'Rebecca Woof',
    title: 'Redgate Software',
    body: 'We have had Lucy and her staff visiting our company for years and no matter how frequently they came along, there was always demand and hype. During Covid, Lucy demonstrated her flexibility and adaptability by providing extremely valuable support virtually for us all when we had to work from home. She offers a variety of massage styles and adapts to best suit the needs of her client. Couldn\'t recommend Lucy and her team highly enough.',
    date: '',
    avatar: 'R',
    logo: '/redgate-logo.png',
  },
  {
    id: 'charlotte-brown-speechmatics',
    name: 'Charlotte Brown',
    title: 'Speechmatics',
    body: 'Lucy spends a day per month with us at Speechmatics. The timetable fills up in a matter of seconds — a testament to how much we love her visits. Aside from being excellent at her job, she always arrives and leaves with a smile on her face and full of enthusiasm.',
    date: '',
    avatar: 'C',
    logo: '/speechmatics.png',
  },
];
