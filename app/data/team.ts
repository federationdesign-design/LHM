// app/data/team.ts

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  bio: string[];
  treatments: string[];
  location: string;
  heroColor: string;
  heroMobile: string;
  heroDesktop: string;
  profilePhoto: string;
  widgetProviderId: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export const team: Record<string, TeamMember> = {
  saphia: {
    slug: 'saphia',
    name: 'Saphia',
    title: 'Massage Therapist',
    bio: [
      'Saphia is a highly skilled massage therapist based at our Cromwell Road clinic in Cambridge. With a passion for helping clients recover, perform, and feel their best, she specialises in deep tissue massage, sports massage, and performance-focused treatments, working with everyone from office workers carrying chronic tension to athletes looking to optimise recovery and performance.',
      'Saphia holds a Level 3 qualification in Massage Therapy and a qualification in Performance Massage. She is currently furthering her training by studying towards her Level 4 qualification in Sports Massage Therapy.',
      'Saphia is fully insured by the Federation of Holistic Therapists (FHT) and takes a hands-on, tailored approach to treatment, helping clients reduce tension, improve mobility, and support long-term wellbeing.',
    ],
    treatments: ['Deep Tissue Massage', 'Sports Massage'],
    location: 'Cromwell Road, Cambridge',
    heroColor: '#2a2a2a',
    heroMobile: '/saphia-hero-img.jpg',
    heroDesktop: '/saphia-hero-img.jpg',
    profilePhoto: '/saphia-profile-img.jpg',
    widgetProviderId: '21',
    metaTitle: 'Saphia | Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a massage with Saphia at Lucy Hall Massage Therapy in Cambridge. Specialist in deep tissue and sports massage. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/saphia/',
  },
  antonia: {
    slug: 'antonia',
    name: 'Antonia',
    title: 'Massage Therapist',
    bio: [
      'Antonia is a versatile and warm massage therapist based at our Thoday Street clinic in Cambridge. She offers one of the widest treatment menus in the practice, from deeply relaxing Swedish and relaxation massage to specialist pregnancy massage, Hopi Ear Candling, Indian Head Massage, and Hot Stone treatments.',
      'Antonia holds a Level 3 qualification in Massage Therapy and is a qualified pregnancy massage practitioner. She is fully insured by the Federation of Holistic Therapists (FHT).',
      'Known for her calming approach and attention to detail, Antonia tailors each treatment to the individual, helping clients relax, reduce tension, and take time out from the stresses of everyday life.',
    ],
    treatments: ['Deep Tissue Massage', 'Pregnancy Massage', 'Swedish Massage', 'Relaxation Massage', 'Hopi Ear', 'Indian Head Massage', 'Hot Stone Massage'],
    location: 'Thoday Street, Cambridge',
    heroColor: '#2a2a2a',
    heroMobile: '/antonia-hero-img.jpg',
    heroDesktop: '/antonia-hero-img.jpg',
    profilePhoto: '/antonia-profile-img.jpg',
    widgetProviderId: '22',
    metaTitle: 'Antonia | Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a massage with Antonia at Lucy Hall Massage Therapy in Cambridge. Specialist in Swedish, deep tissue, pregnancy massage and more. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/antonia/',
  },
  orla: {
    slug: 'orla',
    name: 'Orla',
    title: 'Sports Therapist',
    bio: [
      'Orla is an experienced Sports Therapist and massage therapist based at our Thoday Street clinic in Cambridge. She holds a BSc (Hons) degree in Sports Therapy and specialises in sports therapy, sports massage, cupping therapy, dry needling, and deep tissue massage, bringing a focused, clinical, and results-driven approach to every treatment.',
      'She works with a wide range of clients, from those recovering from sports injuries and muscular strain to individuals managing chronic pain, postural issues, and everyday tension. Her treatments are tailored to each client\'s needs, helping to reduce pain, improve mobility, support recovery, and enhance overall wellbeing.',
      'Outside the clinic, Orla also works pitch side with local rugby club Cantabs RFC, supporting players with injury management, recovery, and performance as the team continues to progress and compete at the next level.',
      'Orla is insured by the Society of Sports Therapists, with her massage and hands-on therapy training completed as part of her Sports Therapy degree.',
    ],
    treatments: ['Sports Therapy', 'Sports Massage', 'Cupping', 'Dry Needling', 'Deep Tissue Massage'],
    location: 'Thoday Street, Cambridge',
    heroColor: '#2a2a2a',
    heroMobile: '/orla-hero-img.jpg',
    heroDesktop: '/orla-hero-img.jpg',
    profilePhoto: '/orla-profile-img.jpg',
    widgetProviderId: '25',
    metaTitle: 'Orla | Sports Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a session with Orla at Lucy Hall Massage Therapy in Cambridge. Sports Therapist specialising in sports therapy, sports massage, cupping and deep tissue massage. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/orla/',
  },
  ellie: {
    slug: 'ellie',
    name: 'Ellie',
    title: 'Sports Therapist',
    bio: [
      'Ellie is a dedicated Sports Therapist and massage therapist based at our Thoday Street clinic in Cambridge. She holds a BSc (Hons) in Sports Therapy and specialises in sports therapy, sports massage, cupping, and deep tissue techniques, offering treatments that prioritise recovery, comfort, and long-term wellbeing.',
      'Alongside her clinical work, Ellie supports Cantabs RFC pitch side, providing injury assessment, acute care, and rehabilitation. She is insured by the Society of Sports Therapists and is committed to delivering high-quality, personalised care.',
    ],
    treatments: ['Sports Therapy', 'Sports Massage', 'Deep Tissue Massage'],
    location: 'Thoday Street, Cambridge',
    heroColor: '#2a2a2a',
    heroMobile: '/ellie-hero-img.jpg',
    heroDesktop: '/ellie-hero-img.jpg',
    profilePhoto: '/ellie-profile-img.jpg',
    widgetProviderId: '27',
    metaTitle: 'Ellie | Sports Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a session with Ellie at Lucy Hall Massage Therapy in Cambridge. Sports Therapist specialising in sports therapy, sports massage and deep tissue massage. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/ellie/',
  },
 
  'lucy-hall': {
    slug: 'lucy-hall',
    name: 'Lucy Hall',
    title: 'Founder & Lead Massage Therapist',
    bio: [
      'Lucy founded Lucy Hall Massage Therapy with a simple vision: to make high-quality, professional massage therapy accessible to everyone in Cambridge.',
      'With over a decade of experience in the industry, she leads both the clinical and corporate sides of the business — overseeing the clinic team at Thoday Street and Cromwell Road while managing the company\'s growing B2B corporate massage programme.',
      'Lucy is passionate about the transformative impact that regular massage has on both physical and mental wellbeing, and she has built a team that shares that commitment to excellence.',
    ],
    treatments: ['Deep Tissue Massage', 'Sports Massage', 'Swedish Massage', 'Pregnancy Massage'],
    location: 'Cambridge',
    heroColor: '#2a2a2a',
    heroMobile: '/lucy-hero-img.jpg',
    heroDesktop: '/lucy-hero-img.jpg',
    profilePhoto: '/lucy-profile-img.jpg',
    widgetProviderId: '',
    metaTitle: 'Lucy Hall | Founder & Lead Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Meet Lucy Hall, founder and lead therapist at Lucy Hall Massage Therapy in Cambridge. Over a decade of experience leading both clinical and corporate massage services.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/lucy-hall/',
  },
  claire: {
    slug: 'claire',
    name: 'Claire',
    title: 'Massage Therapist',
    bio: [
      'Claire is a skilled massage therapist specialising in corporate and on-site massage. Based across Cambridge and the surrounding region, she delivers seated acupressure and chair massage treatments directly to workplaces — helping employees reduce stress, improve focus and feel their best.',
      'Claire brings warmth, professionalism and a calm presence to every corporate event or wellness day she attends, and is a trusted member of the Lucy Hall corporate massage team.',
    ],
    treatments: ['Corporate Massage', 'Seated Acupressure', 'Chair Massage'],
    location: 'Corporate, Cambridge',
    heroColor: '#2a2a2a',
    heroMobile: '/claire-hero-img.jpg',
    heroDesktop: '/claire-hero-img.jpg',
    profilePhoto: '/claire-img.jpg',
    widgetProviderId: '',
    metaTitle: 'Claire | Corporate Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Meet Claire, corporate massage therapist at Lucy Hall Massage Therapy in Cambridge. Specialises in seated acupressure and chair massage for workplaces.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/claire/',
  },
};
