// app/data/team.ts

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  bio: string[];
  treatments: string[];
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
  safia: {
    slug: 'safia',
    name: 'Safia',
    title: 'Massage Therapist',
    bio: [
      'Safia is a highly skilled massage therapist based at our Cromwell Road clinic in Cambridge. With a passion for helping clients recover, perform and feel their best, she specialises in deep tissue and sports massage — working with everyone from office workers carrying chronic tension to athletes looking to optimise their recovery and performance.',
      'Her approach is thorough and results-driven. Whether you\'re dealing with a specific injury, postural issues from desk work, or simply need to release built-up muscle tension, Safia tailors every session to your individual needs.',
      'Safia holds a Level 3 Certificate in Massage Therapy and a Level 4 Certificate in Sports Massage Therapy, both accredited by the Complementary and Natural Healthcare Council (CNHC) — the UK\'s voluntary regulator for complementary healthcare practitioners. She is also a member of the Federation of Holistic Therapists (FHT).',
    ],
    treatments: ['Deep Tissue Massage', 'Sports Massage'],
    heroColor: '#2a2a2a',
    heroMobile: '/safia-hero-mobile.jpg',
    heroDesktop: '/safia-hero-desktop.jpg',
    profilePhoto: '/safia.png',
    widgetProviderId: '21',
    metaTitle: 'Safia | Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a massage with Safia at Lucy Hall Massage Therapy in Cambridge. Specialist in deep tissue and sports massage. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/safia/',
  },
  antonia: {
    slug: 'antonia',
    name: 'Antonia',
    title: 'Massage Therapist',
    bio: [
      'Antonia is a versatile and warm massage therapist based at our Thoday Street clinic in Cambridge. She offers one of the widest treatment menus in the practice — from deeply relaxing Swedish and relaxation massage to specialist pregnancy massage, Hopi Ear therapy, Indian Head massage and Hot Stone treatments.',
      'Her approach is intuitive and client-centred. Antonia takes time to understand what each person needs, whether that\'s relief from tension and stress, support during pregnancy, or a deeply restorative treatment to recharge body and mind.',
      'Antonia holds a Level 3 Certificate in Massage Therapy and a Level 4 Certificate in Sports Massage Therapy, accredited by the Complementary and Natural Healthcare Council (CNHC). She is also a qualified pregnancy massage practitioner and a member of the Federation of Holistic Therapists (FHT).',
    ],
    treatments: ['Deep Tissue Massage', 'Pregnancy Massage', 'Swedish Massage', 'Relaxation Massage', 'Hopi Ear', 'Indian Head Massage', 'Hot Stone Massage'],
    heroColor: '#2a2a2a',
    heroMobile: '/antonia-hero-mobile.jpg',
    heroDesktop: '/antonia-hero-desktop.jpg',
    profilePhoto: '/antonia.png',
    widgetProviderId: '22',
    metaTitle: 'Antonia | Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a massage with Antonia at Lucy Hall Massage Therapy in Cambridge. Specialist in Swedish, deep tissue, pregnancy massage and more. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/antonia/',
  },
  orla: {
    slug: 'orla',
    name: 'Orla',
    title: 'Massage Therapist',
    bio: [
      'Orla is an experienced massage therapist based at our Thoday Street clinic in Cambridge. She specialises in cupping therapy, deep tissue and sports massage — bringing a focused, clinical approach to each treatment that gets real results for her clients.',
      'Orla works with a wide range of clients, from those recovering from sports injuries and muscular strain to people looking to address long-standing postural issues or chronic pain. Her cupping treatments are particularly popular for releasing deep fascial tension and improving circulation.',
      'Orla holds a Level 3 Certificate in Massage Therapy and a Level 4 Certificate in Sports Massage Therapy, accredited by the Complementary and Natural Healthcare Council (CNHC). She is also a trained cupping therapy practitioner and a member of the Federation of Holistic Therapists (FHT).',
    ],
    treatments: ['Cupping', 'Deep Tissue Massage', 'Sports Massage'],
    heroColor: '#2a2a2a',
    heroMobile: '/orla-hero-mobile.jpg',
    heroDesktop: '/orla-hero-desktop.jpg',
    profilePhoto: '/orla.png',
    widgetProviderId: '25',
    metaTitle: 'Orla | Massage Therapist | Lucy Hall Massage Therapy Cambridge',
    metaDescription: 'Book a massage with Orla at Lucy Hall Massage Therapy in Cambridge. Specialist in cupping, deep tissue and sports massage. Book online in 2 minutes.',
    canonicalUrl: 'https://www.lucyhallmassage.com/team/orla/',
  },
};
