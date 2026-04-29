// app/data/services.ts
// All service page data — content, SEO, widget config

export interface Service {
  slug: string;
  title: string;
  h1: string;
  tagline: string;
  heroMobile: string;
  heroDesktop: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  widgetService: string;
  widgetLocation: string;
  intro: string;
  benefits: string[];
  recommendedFor: string[];
}

export const services: Record<string, Service> = {

  'deep-tissue-massage': {
    slug: 'deep-tissue-massage',
    title: 'Deep Tissue Massage',
    h1: 'Deep Tissue Massage',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/hero.jpg',
    heroDesktop: '/deep-tissue-img.jpg',
    metaTitle: 'Deep Tissue Massage Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book a deep tissue massage in Cambridge with Lucy Hall Massage Therapy. Specialist treatment for chronic muscle tension, back pain and injury recovery. Book online in 2 minutes.',
    keywords: ['deep tissue massage cambridge', 'deep tissue massage', 'massage therapy cambridge', 'back pain massage cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/deep-tissue-massage/',
    widgetService: '5',
    widgetLocation: '4',
    intro: 'Deep tissue massage targets the deeper layers of muscle and connective tissue, using slow, firm strokes to release chronic tension and knots. Unlike a relaxation massage, deep tissue work focuses on specific problem areas — helping to restore movement, reduce pain and improve posture over time.',
    benefits: [
      'Releases chronic muscle tension',
      'Works out deep-seated knots',
      'Reduces pain in the neck, shoulders and lower back',
      'Improves posture and range of movement',
      'Breaks down scar tissue from old injuries',
      'Lowers stress hormones and promotes recovery',
    ],
    recommendedFor: [
      'People with chronic back, neck or shoulder pain',
      'Those recovering from sports injuries',
      'People with a repetitive strain injury',
      'Anyone with poor posture from desk-based work',
      'Clients who find lighter massage insufficient',
      'Those managing stress-related physical tension',
    ],
  },

  'swedish-massage': {
    slug: 'swedish-massage',
    title: 'Swedish Massage',
    h1: 'Swedish Massage',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/swedish-mobile.jpg',
    heroDesktop: '/swedish-desktop.jpg',
    metaTitle: 'Swedish Massage Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book a Swedish massage in Cambridge with Lucy Hall Massage Therapy. Full body relaxation massage to relieve stress, ease tension and restore wellbeing. Book online in 2 minutes.',
    keywords: ['swedish massage cambridge', 'relaxing massage cambridge', 'full body massage cambridge', 'stress relief massage cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/swedish-massage/',
    widgetService: '14',
    widgetLocation: '4',
    intro: 'Swedish massage is a classic full-body treatment using long, flowing strokes, kneading and circular movements to promote deep relaxation. It improves circulation, eases muscle tension and leaves you feeling calm and restored. It is the ideal treatment for those new to massage or simply in need of some time to unwind.',
    benefits: [
      'Promotes full body relaxation',
      'Improves blood and lymphatic circulation',
      'Relieves everyday muscle tension',
      'Reduces cortisol and stress hormones',
      'Improves sleep quality',
      'Boosts mood and overall wellbeing',
    ],
    recommendedFor: [
      'Anyone new to massage therapy',
      'Those experiencing stress or anxiety',
      'People with general muscle tension',
      'Anyone who struggles to switch off',
      'Those wanting a regular wellness treatment',
      'People recovering from mild fatigue',
    ],
  },

  'sports-massage': {
    slug: 'sports-massage',
    title: 'Sports Massage',
    h1: 'Sports Massage',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/sports-mobile.jpg',
    heroDesktop: '/sports-desktop.jpg',
    metaTitle: 'Sports Massage Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book a sports massage in Cambridge with Lucy Hall Massage Therapy. Specialist treatment for athletes and active people — injury prevention, recovery and performance. Book online in 2 minutes.',
    keywords: ['sports massage cambridge', 'sports injury massage cambridge', 'athlete massage cambridge', 'muscle recovery massage cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/sports-massage/',
    widgetService: '13',
    widgetLocation: '4',
    intro: 'Sports massage is a targeted treatment designed for active individuals, combining deep tissue techniques with stretching to prevent injury, aid recovery and improve performance. Whether you are training regularly or recovering from an event, sports massage keeps your body functioning at its best.',
    benefits: [
      'Speeds up muscle recovery after exercise',
      'Reduces risk of sports injuries',
      'Improves flexibility and range of motion',
      'Breaks down lactic acid build-up',
      'Enhances athletic performance',
      'Treats specific areas of overuse',
    ],
    recommendedFor: [
      'Regular gym-goers and athletes',
      'Runners, cyclists and swimmers',
      'People recovering from a sports injury',
      'Those with tight or overworked muscles',
      'Anyone training for an event',
      'People with recurring muscle problems',
    ],
  },

  'relaxation-massage': {
    slug: 'relaxation-massage',
    title: 'Relaxation Massage',
    h1: 'Relaxation Massage',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/relaxation-mobile.jpg',
    heroDesktop: '/relaxation-desktop.jpg',
    metaTitle: 'Relaxation Massage Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book a relaxation massage in Cambridge with Lucy Hall Massage Therapy. Gentle, soothing treatment to melt away stress and restore calm. Book online in 2 minutes.',
    keywords: ['relaxation massage cambridge', 'gentle massage cambridge', 'stress massage cambridge', 'soothing massage cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/relaxation-massage/',
    widgetService: '12',
    widgetLocation: '4',
    intro: 'A relaxation massage uses light to medium pressure with long, slow strokes to calm the nervous system and ease both physical and mental tension. It is a deeply restorative treatment — the perfect way to step away from the demands of daily life and give your body and mind the rest they deserve.',
    benefits: [
      'Calms the nervous system',
      'Reduces mental and physical stress',
      'Eases tight muscles with gentle pressure',
      'Promotes deep, restorative sleep',
      'Lowers blood pressure naturally',
      'Restores a sense of calm and balance',
    ],
    recommendedFor: [
      'People experiencing high levels of stress',
      'Those who find deeper massage uncomfortable',
      'Anyone feeling overwhelmed or burnt out',
      'People who struggle to relax',
      'Those wanting a gentle, restorative treatment',
      'Anyone looking for regular self-care',
    ],
  },

  'pregnancy-massage': {
    slug: 'pregnancy-massage',
    title: 'Pregnancy Massage',
    h1: 'Pregnancy Massage',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/Pregnancy-mobile.jpg',
    heroDesktop: '/Pregnancy-desktop.jpg',
    metaTitle: 'Pregnancy Massage Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book a pregnancy massage in Cambridge with Lucy Hall Massage Therapy. Safe, specialist treatment to relieve back pain, swelling and stress during pregnancy. Book online in 2 minutes.',
    keywords: ['pregnancy massage cambridge', 'prenatal massage cambridge', 'massage during pregnancy cambridge', 'maternity massage cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/pregnancy-massage/',
    widgetService: '19',
    widgetLocation: '4',
    intro: 'Pregnancy massage is a specially adapted treatment designed to support the physical and emotional changes of pregnancy. Using gentle, safe techniques our therapists help relieve common discomforts including back pain, swelling and fatigue — providing both physical relief and a much-needed moment of calm during this special time.',
    benefits: [
      'Relieves lower back and hip pain',
      'Reduces swelling in hands and feet',
      'Eases sciatic nerve discomfort',
      'Reduces pregnancy-related anxiety',
      'Improves sleep quality',
      'Supports emotional wellbeing throughout pregnancy',
    ],
    recommendedFor: [
      'Women in their second or third trimester',
      'Those experiencing back or hip pain in pregnancy',
      'Pregnant women with swelling or oedema',
      'Anyone feeling anxious or stressed during pregnancy',
      'Those who want regular wellness support',
      'Women seeking safe, specialist prenatal care',
    ],
  },

  'hopi-ear': {
    slug: 'hopi-ear',
    title: 'Hopi Ear Candles',
    h1: 'Hopi Ear Candles',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/hopi-mobile.jpg',
    heroDesktop: '/hopi-desktop.jpg',
    metaTitle: 'Hopi Ear Candles Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book a Hopi ear candle treatment in Cambridge with Lucy Hall Massage Therapy. A traditional, relaxing therapy for ear and sinus comfort. Book online in 2 minutes.',
    keywords: ['hopi ear candles cambridge', 'ear candling cambridge', 'ear treatment cambridge', 'sinus relief cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/hopi-ear/',
    widgetService: '7',
    widgetLocation: '4',
    intro: 'Hopi ear candles are a traditional therapy originating from the Hopi Native American people. The gentle warmth from the hollow candle creates a mild vacuum effect, promoting a sense of calm and relief around the ear and sinus area. The treatment is deeply relaxing and often combined with a soothing facial massage.',
    benefits: [
      'Creates a soothing warmth around the ear',
      'Promotes relaxation of the facial muscles',
      'Eases feelings of pressure in the ears',
      'Supports sinus comfort and clarity',
      'Deeply calming for the nervous system',
      'Often combined with facial massage for enhanced benefit',
    ],
    recommendedFor: [
      'People with a feeling of congestion or pressure',
      'Those experiencing sinus discomfort',
      'Anyone who finds ear cleaning uncomfortable',
      'People looking for a deeply relaxing treatment',
      'Those interested in traditional therapies',
      'Anyone seeking relief from tension headaches',
    ],
  },

  'physiotherapy-treatment': {
    slug: 'physiotherapy-treatment',
    title: 'Physiotherapy',
    h1: 'Physiotherapy',
    tagline: 'Book your appointment now, it only takes 2 minutes with our online booking tool',
    heroMobile: '/Physiotherapy-mobile.jpg',
    heroDesktop: '/Physiotherapy-desktop.jpg',
    metaTitle: 'Physiotherapy Cambridge | Lucy Hall Massage Therapy',
    metaDescription: 'Book physiotherapy in Cambridge with Lucy Hall Massage Therapy. Expert assessment and treatment for injury, pain and movement problems. Book online in 2 minutes.',
    keywords: ['physiotherapy cambridge', 'physio cambridge', 'injury treatment cambridge', 'back pain physiotherapy cambridge'],
    canonicalUrl: 'https://www.lucyhallmassage.com/physiotherapy-treatment/',
    widgetService: '11',
    widgetLocation: '4',
    intro: 'Our physiotherapy service provides expert assessment and hands-on treatment for a wide range of musculoskeletal conditions. From acute injuries to chronic pain and postural problems, our qualified physiotherapists use evidence-based techniques to restore function, reduce pain and help you move well again.',
    benefits: [
      'Expert assessment of injury and movement',
      'Evidence-based hands-on treatment',
      'Reduces acute and chronic pain',
      'Restores full range of movement',
      'Addresses the root cause, not just symptoms',
      'Includes tailored exercise and aftercare advice',
    ],
    recommendedFor: [
      'People recovering from injury or surgery',
      'Those with chronic back, neck or joint pain',
      'Anyone with a movement restriction',
      'People with postural problems from desk work',
      'Those who have been referred by their GP',
      'Athletes seeking injury rehabilitation',
    ],
  },

};
