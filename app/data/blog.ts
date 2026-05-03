// app/data/blog.ts
// Blog article metadata. Article bodies live in separate markdown files
// under app/data/articles/ — see getArticleBody() helper below.

import fs from 'fs';
import path from 'path';

export interface BlogArticle {
  slug: string;
  title: string;
  h1: string;
  excerpt: string;
  publishDate: string;          // ISO format YYYY-MM-DD — used for sorting (newest first)
  heroImage: string;            // path under /public, 16:9 aspect ratio recommended
  relatedTreatments: string[];  // slugs that exist in services.ts (e.g. 'hot-stone-massage')
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
}

export const articles: Record<string, BlogArticle> = {

  'proven-benefits-of-hot-stone-massage': {
    slug: 'proven-benefits-of-hot-stone-massage',
    title: 'Proven Benefits of Hot Stone Massage',
    h1: 'Proven Benefits of Hot Stone Massage',
    excerpt: 'Hot stone massage uses heated basalt stones to penetrate deep into muscle tissue, releasing tension and inducing profound relaxation. Here\'s what the science says about its benefits.',
    publishDate: '2026-04-20',
    heroImage: '/blog/proven-benefits-of-hot-stone-massage.jpg',
    relatedTreatments: ['hot-stone-massage', 'relaxation-massage'],
    metaTitle: 'Proven Benefits of Hot Stone Massage | Lucy Hall Massage Therapy',
    metaDescription: 'Discover the proven benefits of hot stone massage. Penetrating heat releases deep muscle tension, improves circulation and induces profound relaxation. Read more on the Lucy Hall Massage blog.',
    keywords: ['hot stone massage benefits', 'hot stone massage cambridge', 'thermal massage benefits', 'deep relaxation'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/proven-benefits-of-hot-stone-massage/',
  },

  'proven-benefits-of-indian-head-massage': {
    slug: 'proven-benefits-of-indian-head-massage',
    title: 'Proven Benefits of Indian Head Massage',
    h1: 'Proven Benefits of Indian Head Massage',
    excerpt: 'A traditional therapy with origins stretching back over a thousand years. Indian head massage focuses on the head, scalp, neck and shoulders — where most of us hold daily stress.',
    publishDate: '2026-04-15',
    heroImage: '/blog/proven-benefits-of-indian-head-massage.jpg',
    relatedTreatments: ['indian-head-massage', 'relaxation-massage'],
    metaTitle: 'Proven Benefits of Indian Head Massage | Lucy Hall Massage Therapy',
    metaDescription: 'Indian head massage is a traditional therapy that focuses on the head, scalp, neck and shoulders. Learn about its proven benefits for tension, headaches and mental wellbeing.',
    keywords: ['indian head massage benefits', 'head massage cambridge', 'scalp massage', 'tension headache relief'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/proven-benefits-of-indian-head-massage/',
  },

  'proven-benefits-of-dry-cupping': {
    slug: 'proven-benefits-of-dry-cupping',
    title: 'Proven Benefits of Dry Cupping',
    h1: 'Proven Benefits of Dry Cupping',
    excerpt: 'Cupping uses gentle suction to lift skin and underlying tissue, reaching layers of fascia that conventional massage struggles to access. Here\'s what makes it different.',
    publishDate: '2026-04-08',
    heroImage: '/blog/proven-benefits-of-dry-cupping.jpg',
    relatedTreatments: ['cupping', 'sports-massage', 'deep-tissue-massage'],
    metaTitle: 'Proven Benefits of Dry Cupping | Lucy Hall Massage Therapy',
    metaDescription: 'Dry cupping is a traditional therapy that uses suction to release deep fascial tension and improve circulation. Discover its proven benefits for athletes and chronic pain sufferers.',
    keywords: ['dry cupping benefits', 'cupping therapy cambridge', 'fascial release', 'cupping massage'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/proven-benefits-of-dry-cupping/',
  },

  '4-great-reasons-to-get-a-pregnancy-massage': {
    slug: '4-great-reasons-to-get-a-pregnancy-massage',
    title: '4 Great Reasons to Get a Pregnancy Massage',
    h1: '4 Great Reasons to Get a Pregnancy Massage',
    excerpt: 'Pregnancy puts unique demands on the body. A specialist pregnancy massage offers safe, gentle relief from the most common discomforts — here are four compelling reasons to book.',
    publishDate: '2026-03-28',
    heroImage: '/blog/4-great-reasons-to-get-a-pregnancy-massage.jpg',
    relatedTreatments: ['pregnancy-massage'],
    metaTitle: '4 Great Reasons to Get a Pregnancy Massage | Lucy Hall Massage Therapy',
    metaDescription: 'Pregnancy massage is a specialist treatment that supports both body and mind during pregnancy. Discover four compelling reasons to book a session.',
    keywords: ['pregnancy massage benefits', 'prenatal massage cambridge', 'massage during pregnancy', 'maternity wellness'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/4-great-reasons-to-get-a-pregnancy-massage/',
  },

  'how-do-hopi-ear-candles-work': {
    slug: 'how-do-hopi-ear-candles-work',
    title: 'How Do Hopi Ear Candles Work?',
    h1: 'How Do Hopi Ear Candles Work?',
    excerpt: 'Hopi ear candles have been used for centuries, but how do they actually work? We explain the science behind the warmth, the gentle vacuum effect and the deep relaxation they bring.',
    publishDate: '2026-03-15',
    heroImage: '/blog/how-do-hopi-ear-candles-work.jpg',
    relatedTreatments: ['hopi-ear'],
    metaTitle: 'How Do Hopi Ear Candles Work? | Lucy Hall Massage Therapy',
    metaDescription: 'Hopi ear candles are a traditional therapy with surprising scientific basis. Learn how they work, what they do, and why they remain popular today.',
    keywords: ['hopi ear candles', 'how hopi candles work', 'ear candling', 'sinus relief'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/how-do-hopi-ear-candles-work/',
  },

  'is-a-pregnancy-massage-safe': {
    slug: 'is-a-pregnancy-massage-safe',
    title: 'Is a Pregnancy Massage Safe?',
    h1: 'Is a Pregnancy Massage Safe?',
    excerpt: 'It\'s a question every expectant mother asks. Pregnancy massage is one of the most thoroughly researched complementary therapies — here\'s what you need to know about safety.',
    publishDate: '2026-03-02',
    heroImage: '/blog/is-a-pregnancy-massage-safe.jpg',
    relatedTreatments: ['pregnancy-massage'],
    metaTitle: 'Is a Pregnancy Massage Safe? | Lucy Hall Massage Therapy',
    metaDescription: 'Pregnancy massage is one of the most thoroughly researched complementary therapies. Learn about safety, contraindications, and when to book.',
    keywords: ['pregnancy massage safe', 'is prenatal massage safe', 'massage during pregnancy safety', 'pregnancy wellbeing'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/is-a-pregnancy-massage-safe/',
  },

  'how-often-should-you-get-a-massage': {
    slug: 'how-often-should-you-get-a-massage',
    title: 'How Often Should You Get a Massage?',
    h1: 'How Often Should You Get a Massage?',
    excerpt: 'Once a month? Every fortnight? Once a year for a treat? The right frequency depends on what you\'re trying to achieve. Here\'s our guide to massage frequency.',
    publishDate: '2026-02-18',
    heroImage: '/blog/how-often-should-you-get-a-massage.jpg',
    relatedTreatments: ['deep-tissue-massage', 'swedish-massage', 'sports-massage', 'relaxation-massage'],
    metaTitle: 'How Often Should You Get a Massage? | Lucy Hall Massage Therapy',
    metaDescription: 'How often you should get a massage depends on your goals — wellness, pain management, or athletic recovery. Our guide helps you decide.',
    keywords: ['massage frequency', 'how often massage', 'massage schedule', 'regular massage benefits'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/how-often-should-you-get-a-massage/',
  },

  'the-physical-impact-of-sport-on-your-body': {
    slug: 'the-physical-impact-of-sport-on-your-body',
    title: 'The Physical Impact of Sport on Your Body',
    h1: 'The Physical Impact of Sport on Your Body',
    excerpt: 'Regular sport does wonders for your fitness, but it also takes a toll on your body. Understanding what happens to your muscles, joints and tissues helps you train smarter — and recover better.',
    publishDate: '2026-02-04',
    heroImage: '/blog/the-physical-impact-of-sport-on-your-body.jpg',
    relatedTreatments: ['sports-massage', 'deep-tissue-massage'],
    metaTitle: 'The Physical Impact of Sport on Your Body | Lucy Hall Massage Therapy',
    metaDescription: 'Regular exercise is great for fitness but takes a toll on muscles and joints. Learn what happens to your body during sport — and how to recover smarter.',
    keywords: ['sports recovery', 'exercise effects on body', 'muscle recovery', 'athlete wellness'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/the-physical-impact-of-sport-on-your-body/',
  },

  'what-to-expect-from-your-first-massage': {
    slug: 'what-to-expect-from-your-first-massage',
    title: 'What to Expect From Your First Massage',
    h1: 'What to Expect From Your First Massage',
    excerpt: 'Booking your first ever massage can feel daunting. We walk you through everything — from arrival and consultation through to the treatment itself and aftercare — so you know exactly what to expect.',
    publishDate: '2026-01-22',
    heroImage: '/blog/what-to-expect-from-your-first-massage.jpg',
    relatedTreatments: ['swedish-massage', 'relaxation-massage', 'deep-tissue-massage'],
    metaTitle: 'What to Expect From Your First Massage | Lucy Hall Massage Therapy',
    metaDescription: 'Booking your first massage? Our complete guide explains what to expect from arrival to aftercare, so you can relax knowing exactly what\'s ahead.',
    keywords: ['first massage', 'what to expect massage', 'massage for beginners', 'new to massage'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/what-to-expect-from-your-first-massage/',
  },

  'relaxation-techniques-to-do-at-your-desk': {
    slug: 'relaxation-techniques-to-do-at-your-desk',
    title: 'Relaxation Techniques to Do at Your Desk',
    h1: 'Relaxation Techniques to Do at Your Desk',
    excerpt: 'Eight hours at a desk takes its toll on neck, shoulders and posture. These simple, discreet relaxation techniques can be done without leaving your seat — and make a real difference.',
    publishDate: '2026-01-08',
    heroImage: '/blog/relaxation-techniques-to-do-at-your-desk.jpg',
    relatedTreatments: ['relaxation-massage', 'indian-head-massage'],
    metaTitle: 'Relaxation Techniques to Do at Your Desk | Lucy Hall Massage Therapy',
    metaDescription: 'Simple relaxation techniques you can do without leaving your desk. Reduce stress, ease tension and reset your focus during the working day.',
    keywords: ['desk relaxation', 'workplace stress relief', 'office stretches', 'desk wellness'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/relaxation-techniques-to-do-at-your-desk/',
  },

  'the-benefits-of-dry-needling': {
    slug: 'the-benefits-of-dry-needling',
    title: 'The Benefits of Dry Needling',
    h1: 'The Benefits of Dry Needling',
    excerpt: 'Dry needling is a powerful technique for releasing trigger points and chronic muscle tension. Here\'s how it works, what to expect, and the proven benefits backed by research.',
    publishDate: '2025-12-18',
    heroImage: '/blog/the-benefits-of-dry-needling.jpg',
    relatedTreatments: ['physiotherapy-treatment', 'sports-massage', 'deep-tissue-massage'],
    metaTitle: 'The Benefits of Dry Needling | Lucy Hall Massage Therapy',
    metaDescription: 'Dry needling targets trigger points to release deep muscle tension. Learn how it works, what to expect during a session, and its proven therapeutic benefits.',
    keywords: ['dry needling benefits', 'trigger point therapy', 'dry needling cambridge', 'muscle pain treatment'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/the-benefits-of-dry-needling/',
  },

  '10-ways-to-practice-self-care': {
    slug: '10-ways-to-practice-self-care',
    title: '10 Ways to Practice Self-Care',
    h1: '10 Ways to Practice Self-Care',
    excerpt: 'Self-care isn\'t a luxury — it\'s an essential part of staying physically and mentally well. Our ten practical, achievable ways to weave self-care into a busy life.',
    publishDate: '2025-12-04',
    heroImage: '/blog/10-ways-to-practice-self-care.jpg',
    relatedTreatments: ['relaxation-massage', 'swedish-massage'],
    metaTitle: '10 Ways to Practice Self-Care | Lucy Hall Massage Therapy',
    metaDescription: 'Ten practical self-care ideas you can fit into a busy life. Simple, achievable ways to look after your physical and mental wellbeing.',
    keywords: ['self-care ideas', 'self-care practice', 'wellbeing tips', 'mental health self-care'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/10-ways-to-practice-self-care/',
  },

  'what-is-seated-acupressure': {
    slug: 'what-is-seated-acupressure',
    title: 'What is Seated Acupressure?',
    h1: 'What is Seated Acupressure?',
    excerpt: 'Seated acupressure is the foundation of corporate chair massage — a fully clothed, drug-free treatment that releases tension in 15-20 minutes. Here\'s how it works.',
    publishDate: '2025-11-20',
    heroImage: '/blog/what-is-seated-acupressure.jpg',
    relatedTreatments: [],
    metaTitle: 'What is Seated Acupressure? | Lucy Hall Massage Therapy',
    metaDescription: 'Seated acupressure is a fully clothed, drug-free treatment performed in a special chair. Discover how it works and where it\'s used in corporate wellness.',
    keywords: ['seated acupressure', 'chair massage', 'corporate massage', 'office wellness'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/what-is-seated-acupressure/',
  },

  'what-is-physiotherapy': {
    slug: 'what-is-physiotherapy',
    title: 'What is Physiotherapy?',
    h1: 'What is Physiotherapy?',
    excerpt: 'Physiotherapy is more than just "exercises after an injury." It\'s a clinical discipline rooted in evidence-based assessment and treatment. Here\'s what it covers and who it\'s for.',
    publishDate: '2025-11-06',
    heroImage: '/blog/what-is-physiotherapy.jpg',
    relatedTreatments: ['physiotherapy-treatment'],
    metaTitle: 'What is Physiotherapy? | Lucy Hall Massage Therapy',
    metaDescription: 'Physiotherapy is a clinical discipline focused on assessment, treatment and rehabilitation. Discover what it covers and how it helps.',
    keywords: ['what is physiotherapy', 'physiotherapy explained', 'physio cambridge', 'rehabilitation'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/what-is-physiotherapy/',
  },

  'gait-analysis-101': {
    slug: 'gait-analysis-101',
    title: 'Gait Analysis 101',
    h1: 'Gait Analysis 101',
    excerpt: 'How you walk, run and stand reveals a lot about your body\'s mechanics — and where injuries are likely to occur. An introduction to gait analysis and why it matters.',
    publishDate: '2025-10-22',
    heroImage: '/blog/gait-analysis-101.jpg',
    relatedTreatments: ['physiotherapy-treatment', 'sports-massage'],
    metaTitle: 'Gait Analysis 101 | Lucy Hall Massage Therapy',
    metaDescription: 'Gait analysis examines how you walk and run to reveal biomechanical issues before they cause injury. An introduction for athletes and active people.',
    keywords: ['gait analysis', 'running gait', 'walking assessment', 'biomechanics'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/gait-analysis-101/',
  },

  'why-corporate-treatments-at-work-work': {
    slug: 'why-corporate-treatments-at-work-work',
    title: 'Why Corporate Treatments at Work Work',
    h1: 'Why Corporate Treatments at Work Work',
    excerpt: 'On-site corporate massage isn\'t just a perk — it has measurable impact on staff wellbeing, productivity and retention. The business case for bringing massage to the office.',
    publishDate: '2025-10-08',
    heroImage: '/blog/why-corporate-treatments-at-work-work.jpg',
    relatedTreatments: [],
    metaTitle: 'Why Corporate Treatments at Work Work | Lucy Hall Massage Therapy',
    metaDescription: 'On-site corporate massage delivers measurable returns: less stress, better retention, fewer sick days. The business case for office wellness.',
    keywords: ['corporate massage benefits', 'office massage', 'workplace wellness', 'employee wellbeing'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/why-corporate-treatments-at-work-work/',
  },

  '5-common-workplace-distractions': {
    slug: '5-common-workplace-distractions',
    title: '5 Common Workplace Distractions',
    h1: '5 Common Workplace Distractions',
    excerpt: 'The five distractions that wreck your focus at work — and the practical strategies to handle each one. From open offices to notifications, regain control of your attention.',
    publishDate: '2025-09-24',
    heroImage: '/blog/5-common-workplace-distractions.jpg',
    relatedTreatments: [],
    metaTitle: '5 Common Workplace Distractions | Lucy Hall Massage Therapy',
    metaDescription: 'The five most common workplace distractions and practical strategies to handle each one. Reclaim your focus and productivity at work.',
    keywords: ['workplace distractions', 'office focus', 'productivity tips', 'workplace wellbeing'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/5-common-workplace-distractions/',
  },

  'pregnancy-massage-the-benefits-for-you-and-your-bump': {
    slug: 'pregnancy-massage-the-benefits-for-you-and-your-bump',
    title: 'Pregnancy Massage: The Benefits for You and Your Bump',
    h1: 'Pregnancy Massage: The Benefits for You and Your Bump',
    excerpt: 'Pregnancy massage benefits both mother and baby. From easing physical discomfort to supporting emotional wellbeing, here\'s what specialist pregnancy massage offers.',
    publishDate: '2025-09-10',
    heroImage: '/blog/pregnancy-massage-the-benefits-for-you-and-your-bump.jpg',
    relatedTreatments: ['pregnancy-massage'],
    metaTitle: 'Pregnancy Massage: Benefits for You and Your Bump | Lucy Hall Massage Therapy',
    metaDescription: 'Pregnancy massage offers benefits for both mother and baby — physical relief, emotional wellbeing and a moment of calm during pregnancy.',
    keywords: ['pregnancy massage benefits', 'prenatal wellness', 'pregnancy back pain', 'maternity massage'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/pregnancy-massage-the-benefits-for-you-and-your-bump/',
  },

  'the-origins-of-hopi-ear-candling': {
    slug: 'the-origins-of-hopi-ear-candling',
    title: 'The Origins of Hopi Ear Candling',
    h1: 'The Origins of Hopi Ear Candling',
    excerpt: 'Where does the practice of Hopi ear candling actually come from? We trace its roots through Native American tradition, modern adaptation, and the therapy you can experience today.',
    publishDate: '2025-08-27',
    heroImage: '/blog/the-origins-of-hopi-ear-candling.jpg',
    relatedTreatments: ['hopi-ear'],
    metaTitle: 'The Origins of Hopi Ear Candling | Lucy Hall Massage Therapy',
    metaDescription: 'The Hopi ear candling tradition has roots in Native American practice. We trace its history from origin to the modern therapy you can experience today.',
    keywords: ['hopi ear candling history', 'hopi tradition', 'ear candling origins', 'native american therapy'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/the-origins-of-hopi-ear-candling/',
  },

  'beating-back-pain-in-the-workplace': {
    slug: 'beating-back-pain-in-the-workplace',
    title: 'Beating Back Pain in the Workplace',
    h1: 'Beating Back Pain in the Workplace',
    excerpt: 'Back pain is the leading cause of workplace absence in the UK. Practical strategies — from posture to prevention to recovery — to keep you moving and working pain-free.',
    publishDate: '2025-08-13',
    heroImage: '/blog/beating-back-pain-in-the-workplace.jpg',
    relatedTreatments: ['deep-tissue-massage', 'physiotherapy-treatment', 'sports-massage'],
    metaTitle: 'Beating Back Pain in the Workplace | Lucy Hall Massage Therapy',
    metaDescription: 'Back pain is the UK\'s leading cause of workplace absence. Practical strategies for posture, prevention and recovery.',
    keywords: ['back pain workplace', 'office back pain', 'desk worker back pain', 'work back injury'],
    canonicalUrl: 'https://www.lucyhallmassage.com/news/beating-back-pain-in-the-workplace/',
  },

};

/**
 * Returns articles sorted by publishDate, newest first.
 * Used by the blog index page.
 */
export function getSortedArticles(): BlogArticle[] {
  return Object.values(articles).sort((a, b) =>
    b.publishDate.localeCompare(a.publishDate)
  );
}

/**
 * Reads the markdown body for a given article slug.
 * Body files live at app/data/articles/[slug].md
 * Returns empty string if the file doesn't exist (graceful degradation).
 */
export function getArticleBody(slug: string): string {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'articles', `${slug}.md`);
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}
