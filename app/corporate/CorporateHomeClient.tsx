'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../Footer';
import CorporateNav from '../CorporateNav';

/* ─────────────────────────────────────────────────────────────
   CorporateHomeClient — /corporate

   Layout sections in order:
     1. CorporateNav (sticky)
     2. Hero — full-bleed image with overlay text and CTA links.
        Top-right of the hero has a chevron-CTA "Download our
        employer PDF" so the most-likely user goal (employer
        getting info to share internally) is visible immediately.
     3. Company-clients logo strip (Spotify, Cambridge, Amazon,
        Redgate). Same marquee-on-mobile pattern as the splash.
     4. Credibility intro — two centered paragraphs introducing
        the corporate massage offering.
     5. Two-column "duty of care" zone:
        - Left col: bordered box with the duty-of-care narrative
          + "Download our employer PDF" chevron CTA at bottom
        - Right col: plain text "what is corporate massage" copy
          + "Enquire About your team here" underlined CTA
     6. Services strip — three image cards linking to the
        individual service pages
     7. Two-column testimonial block (Cambridge testimonials,
        currently duplicated as placeholders)
     8. Find-us-on logos (BookingPage, Tripadvisor, SimplyBook,
        LinkedIn, Wheree)
     9. Footer

   Mobile collapses the two-column zones into single-column
   stacks. The hero text sits over a darker gradient overlay so
   it stays legible against the photographed image.
   ───────────────────────────────────────────────────────────── */

// ── COMPANY CLIENT LOGOS ──────────────────────────────────────
const companyClients = [
  { name: 'Spotify',                 src: '/spotify.png' },
  { name: 'University of Cambridge', src: '/university-cambridge.png' },
  { name: 'Amazon',                  src: '/amazon.png' },
  { name: 'Redgate',                 src: '/redgate-logo.png' },
];

// ── FIND-US-ON LOGOS ──────────────────────────────────────────
const findUsLogos = [
  { src: '/booking-page-logo.png', alt: 'Booking Page' },
  { src: '/tripadisvor.svg',       alt: 'Tripadvisor' },
  { src: '/SBM-logo.png',          alt: 'SimplyBook.me' },
  { src: '/linked_in.png',         alt: 'LinkedIn' },
  { src: '/where-logo.png',        alt: 'Wheree' },
];

// ── SERVICES ──────────────────────────────────────────────────
const services = [
  {
    n: '1',
    title: 'Display screen equipment Assessments',
    cta: 'DCS Assessments >>',
    href: '/corporate/dsc-assessments',
    img: '/corporate-dsc.jpg',
  },
  {
    n: '2',
    title: 'In-Office Chair Massage',
    cta: 'Chair Massage >>',
    href: '/corporate/in-chair-massage',
    img: '/corporate-chair-massage.jpg',
  },
  {
    n: '3',
    title: 'Assessments & Posture Consultations',
    cta: 'Assessments >>',
    href: '/corporate/posture-consultations',
    img: '/corporate-posture.jpg',
  },
];

// ── WHAT'S INCLUDED ───────────────────────────────────────────
const whatsIncluded = [
  {
    title: 'Posture Assessments:',
    body: 'We identify how individuals are sitting at their desks and provide tailored advice on improving their workstation setups to prevent discomfort and injury.',
  },
  {
    title: 'Pain Reduction Techniques:',
    body: 'We utilise specialised methods designed to alleviate stress, reduce pain, and relieve tight muscles caused by prolonged desk work.',
  },
  {
    title: 'Hybrid Solutions:',
    body: 'Offer ergonomic guidance and online consultations to support remote employees.',
  },
  {
    title: 'Custom Work Adaptations:',
    body: 'We assess how employees interact with their equipment and surroundings, advising on better practices to enhance efficiency and comfort.',
  },
  {
    title: 'Wellness Programmes:',
    body: 'We offer programs that focus on both physical and mental well-being, equipping staff with the tools they need to manage workplace stress and maintain a healthy work-life balance.',
  },
  {
    title: 'Access to remote documents:',
    body: 'including engaging presentations and informative videos — empowers your staff with valuable knowledge to effectively manage pain and foster good health and well-being in the workplace.',
  },
  {
    title: 'Flexibility:',
    body: 'Our fully customised plans adapt to your business needs, with flexible scheduling that integrates seamlessly into your operations, ensuring minimal disruption.',
  },
];

// ── VIDEOS ────────────────────────────────────────────────────
// Each video has a Vimeo ID (the numeric ID from the Vimeo URL),
// a title, and a short intro. To add a real video, replace the
// placeholder vimeoId with the actual ID (e.g. "123456789").
// Leave as empty string to render a placeholder tile.
const videos = [
  {
    vimeoId: '478025499',
    title: 'Watch a recent Webinar',
    intro: 'Watch a recording of a recent webinar hosted by Lucy, learn about seating postures and at desk exercises.',
  },
  {
    vimeoId: '1189408231',
    title: 'Watch our promo for on site service',
    intro: 'We made an advert, view it here.',
  },
  {
    vimeoId: '1189408591',
    title: 'Watch Staff member testimonies',
    intro: 'See and hear real people talking about real solutions.',
  },
  {
    vimeoId: '1189408959',
    title: 'What our desk posture tutorial',
    intro: 'Watch one of our tutorials here. We have a whole archive of them for you and your team.',
  },
];

// ── GALLERY ───────────────────────────────────────────────────
// Each gallery item declares its column span (out of 6) so the
// layout can mix portrait + landscape, full-width + half-width,
// 3-up + 2-up rows. `span: 2` means 3-per-row, `span: 3` means
// 2-per-row, `span: 6` means full-width. `aspect` controls the
// ratio so portraits render tall.
//
// To swap to real images later: replace each `src` with the real
// path (e.g. /gallery/01.jpg) and adjust span/aspect to suit.
const gallery: { src: string; alt: string; bg: string }[] = [
  { src: '/21c4036c-feae-48b8-a539-64338850279d.jpg', alt: '', bg: '#2a2a2a' },
  { src: '/26042d42-dec0-439d-a36c-6756ba1aeb94.jpg', alt: '', bg: '#3a2e2e' },
  { src: '/b3ec0456-0550-469c-8121-99e3fef95064.jpg', alt: '', bg: '#2e3a3a' },
  { src: '/chair.jpg', alt: '', bg: '#3a352e' },
  { src: '/chair2.jpg', alt: '', bg: '#2e3a35' },
  { src: '/chair3.jpg', alt: '', bg: '#352e3a' },
  { src: '/chair4.jpg', alt: '', bg: '#3a2e35' },
  { src: '/exercises1.jpg', alt: '', bg: '#2e2e3a' },
  { src: '/lucy-hall-massage-23.jpg', alt: '', bg: '#2a2a2a' },
  { src: '/lucy-hall-massage-25.jpg', alt: '', bg: '#3a2e2e' },
  { src: '/lucy-hall-massage-36.jpg', alt: '', bg: '#2e3a3a' },
  { src: '/exercises2.jpg', alt: '', bg: '#3a352e' },
  { src: '/excercises3.jpg', alt: '', bg: '#2e3a35' },
  { src: '/lucy-hall-massage-42.jpg', alt: '', bg: '#352e3a' },
  { src: '/b7d62880-47c2-46b1-bd1f-d99662f9895c.jpg', alt: '', bg: '#3a2e35' },
  { src: '/d730a508-6c23-4661-9335-64c79b68d5fe.jpg', alt: '', bg: '#2e2e3a' },
  { src: '/lucy-hall-massage-44.jpg', alt: '', bg: '#2a2a2a' },
  { src: '/lucy-hall-massage-47.jpg', alt: '', bg: '#3a2e2e' },
  { src: '/lucy-hall-massage-57.jpg', alt: '', bg: '#2e3a3a' },
  { src: '/lucy-hall-massage-74.jpg', alt: '', bg: '#3a352e' },
  { src: '/lucy-hall-massage-95.jpg', alt: '', bg: '#2e3a35' },
  { src: '/lucy-hall-massage-96.jpg', alt: '', bg: '#352e3a' },
  { src: '/lucy-hall-massage-112.jpg', alt: '', bg: '#3a2e35' },
  { src: '/lucy-hall-massage-114.jpg', alt: '', bg: '#2e2e3a' },
  { src: '/lucy-hall-massage-116.jpg', alt: '', bg: '#2a2a2a' },
  { src: '/lucy-hall-massage-124.jpg', alt: '', bg: '#3a2e2e' },
  { src: '/lucy-hall-massage-160.jpg', alt: '', bg: '#2e3a3a' },
  { src: '/lucy-hall-massage-177.jpg', alt: '', bg: '#3a352e' },
  { src: '/lucy-hall-massage-202.jpg', alt: '', bg: '#2e3a35' },
  { src: '/lucy-hall-massage-218.jpg', alt: '', bg: '#352e3a' },
  { src: '/lucy-hall-massage-223.jpg', alt: '', bg: '#3a2e35' },
  { src: '/lucy-hall-massage-227.jpg', alt: '', bg: '#2e2e3a' },
  { src: '/lucy-hall-massage-228.jpg', alt: '', bg: '#2a2a2a' },
  { src: '/lucy-hall-massage-232.jpg', alt: '', bg: '#3a2e2e' },
  { src: '/lucy-hall-massage-233.jpg', alt: '', bg: '#2e3a3a' },
  { src: '/lucy-hall-massage-235.jpg', alt: '', bg: '#3a352e' },
  { src: '/lucy-hall-massage-236.jpg', alt: '', bg: '#2e3a35' },
];

// ── TESTIMONIALS ──────────────────────────────────────────────
// Real corporate testimonials. Logos point to /public assets;
// /company-placeholder.png is used for companies we don't have a
// brand logo for.
const corpTestimonials = [
  {
    body:
      '“We have always been big fans of Lucy and her team when they would visit the offices for in-person massages. Unfortunately, due to the current situation we knew those would not be an option for the foreseeable future, but we jumped at the chance to offer the next best thing — zoom consultations with a therapist. Amazing experience! Attendees were able to have 1:1 time with one of Lucy\'s expert team to talk through any niggles, aches and pains they were experiencing, and get personally tailored advice, exercises and stretches to alleviate these. We have been using Lucy Hall massage for years at Redgate, initially for in-person massages and recently the zoom consultations. No matter the format of the interactions the feedback is always the same — expert therapists, actionable advice, personable and professional.”',
    name: 'Louise Domeisen',
    company: 'Redgate',
    logo: '/redgate-logo.png',
  },
  {
    body:
      '“Lucy and her team have a great reputation in the industry and we wanted the best for our staff. Her team make you feel like you are important, they listen to what you say and advise accordingly, they give their full attention to you during your time and nothing is too much trouble. Lucy\'s team listen to what you need as a business, advising and giving their expertise but happy to do what is good for you and your team. All of our staff come back into the office singing their praises. Lucy feels like a member of our team, part of the family. Everybody looks forward to the days when Lucy and her team come into the office, she is so relaxed and organised makes everyone feel at ease nobody feels uncomfortable and if they do after one visit they realise how important and special she makes you feel you are totally at ease.”',
    name: 'Maria Slater',
    company: 'Spotify',
    logo: '/spotify.png',
  },
  {
    body:
      '“This review is on behalf of Costello Medical. We regularly use Lucy Hall Massage as part of our ongoing wellbeing initiative and consistently receive excellent feedback from our employees. Lucy takes the time to provide employees with personalised advice and guidance on their posture, which has been highly valued by staff. We look forward to continue working with Lucy in the future.”',
    name: 'Emma King',
    company: 'Costello Medical',
    logo: '/company-placeholder.png',
  },
  {
    body:
      '“Lucy and her team are always professional, prompt and provides a friendly service. The entire Spotify office love her and the team! Many members of staff have also used Lucy Hall Massage privately since. Highly recommended!”',
    name: 'Ginelle Richardson',
    company: 'Spotify',
    logo: '/spotify.png',
  },
  {
    body:
      '“The sessions are not only relaxing but also really helpful for posture correction, especially for those of us who spend long hours at our desks. We noticed reduced tension and overall better well-being. It\'s a great way to relieve stress and improve workplace comfort. Thanks for providing this service — it\'s definitely making a positive impact!”',
    name: 'Nataliia Matsuk',
    company: 'Amazon',
    logo: '/amazon.png',
  },
  {
    body:
      '“We have been regular clients of Lucy for the past two years. Both she and Katerina check our posture at our desks and offer valuable advice that has significantly helped us improve our pain management and overall health. Their visits are always positive, and it is a pleasure to have them in the office.”',
    name: 'Natasha Gobec',
    company: 'Softwire',
    logo: '/company-placeholder.png',
  },
  {
    body:
      '“We use Lucy Hall as part of supporting Wellbeing for colleagues at the Clinical School, these sessions are always in high demand! Thank you Lucy and your team.”',
    name: 'Isobel Jordan',
    company: 'Clinical School of Medicine',
    logo: '/university-cambridge.png',
  },
  {
    body:
      '“We\'ve been lucky enough to benefit from Lucy\'s assessments and treatments over the years. It\'s a nice perk to look forward to, yet for others the consultative advice Lucy gives (about work stations, posture, remedial stretches and exercises etc.) has really made a genuine difference to their wellbeing and happiness. I cannot recommend her enough!”',
    name: 'Steve Mann',
    company: 'Brand Recruitment',
    logo: '/company-placeholder.png',
  },
];

// ── ARROWS ────────────────────────────────────────────────────
const ChevronRight = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── MAIN ──────────────────────────────────────────────────────

export default function CorporateHomeClient() {
  // Mobile carousel state for the testimonials block
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync carousel translation when active index changes
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${activeIdx * 100}%)`;
    }
  }, [activeIdx]);

  return (
    <>
      <CorporateNav />

      <main className="corp-main">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="corp-hero">
          <div className="corp-hero-image">
            <Image
              src="/corporate-hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="corp-hero-overlay" aria-hidden="true" />
          </div>

          {/* Top-right "Download our employer PDF" chevron CTA */}
          <Link href="/corporate/enquire" className="corp-hero-pdf">
            <ChevronRight size={28} />
            <span>Download our employer PDF</span>
          </Link>

          {/* Bottom-left text + enquire link */}
          <div className="corp-hero-text">
            <h1 className="corp-hero-headline">
              Making Your Workplace Happier &amp; Healthier
            </h1>
            <p className="corp-hero-sub">
              Transforming the way people feel and are treated at work, through the power of massage and mindfulness.
            </p>
            <div className="corp-hero-rule" />
            <Link href="/corporate/enquire" className="corp-hero-enquire">
              Enquire now &gt;&gt;
            </Link>
          </div>
        </section>

        {/* ── COMPANY CLIENTS STRIP ────────────────────────── */}
        <section className="corp-clients">
          <div className="corp-clients-marquee">
            <div className="corp-clients-marquee-track">
              {[...companyClients, ...companyClients].map((c, i) => (
                <div key={`${c.name}-${i}`} className="corp-client-item">
                  <img
                    src={c.src}
                    alt={c.name}
                    className="corp-client-logo"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CREDIBILITY INTRO ────────────────────────────── */}
        <section className="corp-intro">
          <p className="corp-intro-para">
            Our clients agree that the benefits of in workplace corporate massage services are incredible, and this rejuvenating and relaxing form of occupational health therapy is guaranteed to get your employees excited to come into work every day.
          </p>
          <p className="corp-intro-para">
            Our expertly trained therapists will revitalise and invigorate your staff with our in-house massage treatments &mdash; They fit in effortlessly with your daily schedule and are easy to set up in your premises.
          </p>
        </section>

        <div className="corp-divider" />

        {/* ── DUTY OF CARE / WHAT IS CORPORATE MASSAGE ─────── */}
        <section className="corp-twocol">
          <div className="corp-twocol-grid">

            {/* Left: bordered duty-of-care box */}
            <div className="corp-twocol-card corp-twocol-card--bordered">
              <h2 className="corp-twocol-heading">
                As an employer you have a duty of care to your staff, but, of course, massage isn&rsquo;t legally required. So, why invest in the physical wellbeing of your staff?
              </h2>
              <p className="corp-twocol-body">
                The health risks associated with prolonged desk use has been confirmed by the NHS and is a major cause for concern for employees in the office workplace. The NHS has its own guidelines on the health impacts of sitting, and some of the potential problems.
              </p>
              <Link href="/corporate/enquire" className="corp-twocol-chevron-cta">
                <ChevronRight size={28} />
                <span>Download our employer PDF</span>
              </Link>
            </div>

            {/* Right: what is corporate massage */}
            <div className="corp-twocol-card">
              <p className="corp-twocol-body corp-twocol-body--lead">
                Corporate massage is an cost-effective way to alleviate physical and mental tension and is very popular with employees.
              </p>
              <p className="corp-twocol-body">
                By adding corporate massage services to your employee benefits, you will see a major boost to staff wellbeing and create a happier work environment, leading to increased motivation and productivity long term.
              </p>
              <Link href="/corporate/enquire" className="corp-twocol-link-cta">
                Enquire About your team here
              </Link>
            </div>

          </div>
        </section>

        <div className="corp-divider" />

        {/* ── WHAT'S INCLUDED ──────────────────────────────── */}
        <section className="corp-included">
          <h2 className="corp-included-heading">What&rsquo;s Included</h2>
          <div className="corp-included-grid">
            {whatsIncluded.map((item) => (
              <div key={item.title} className="corp-included-item">
                <h3 className="corp-included-title">{item.title}</h3>
                <p className="corp-included-body">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="corp-divider" />

        {/* ── SERVICES STRIP ───────────────────────────────── */}
        <section className="corp-services">
          <h2 className="corp-services-heading">Services</h2>
          <div className="corp-services-grid">
            {services.map((s) => (
              <Link key={s.n} href={s.href} className="corp-service-card">
                <div className="corp-service-image">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div className="corp-service-overlay" />
                </div>
                <div className="corp-service-content">
                  <p className="corp-service-n">Service {s.n}:</p>
                  <h3 className="corp-service-title">{s.title}</h3>
                  <div className="corp-service-rule" />
                  <span className="corp-service-cta">{s.cta}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="corp-divider" />

        {/* ── VIDEOS ───────────────────────────────────────── */}
        <section className="corp-videos">
          <h2 className="corp-videos-heading">Videos</h2>
          <div className="corp-videos-grid">
            {videos.map((v, i) => (
              <div key={i} className="corp-video-item">
                <h3 className="corp-video-title">{v.title}</h3>
                <div className="corp-video-frame">
                  {v.vimeoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${v.vimeoId}?byline=0&portrait=0&title=0`}
                      title={v.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="corp-video-iframe"
                    />
                  ) : (
                    <div className="corp-video-placeholder">
                      <span>Video coming soon</span>
                    </div>
                  )}
                </div>
                <p className="corp-video-intro">{v.intro}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="corp-divider" />

        {/* ── CREDIBILITY TESTIMONIALS ─────────────────────── */}
        <section className="corp-credibility">
          <h2 className="corp-credibility-heading">Credibility:</h2>

          {/* Mobile carousel — single testimonial visible at a time
              with dots pager. Hidden on desktop via CSS. */}
          <div className="corp-credibility-mobile">
            <div className="corp-credibility-track-wrap">
              <div ref={trackRef} className="corp-credibility-track">
                {corpTestimonials.map((t, i) => (
                  <div key={i} className="corp-credibility-slide">
                    <div className="corp-credibility-item">
                      <p className="corp-credibility-body">{t.body}</p>
                      <div className="corp-credibility-attribution">
                        <img
                          src={t.logo}
                          alt={t.company}
                          className="corp-credibility-logo"
                          draggable={false}
                        />
                        <div>
                          <p className="corp-credibility-name">{t.name}</p>
                          <p className="corp-credibility-company">{t.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="corp-credibility-dots">
              {corpTestimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`corp-credibility-dot ${i === activeIdx ? 'corp-credibility-dot--active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop 2-column grid — all 8 visible. Hidden on mobile. */}
          <div className="corp-credibility-grid">
            {corpTestimonials.map((t, i) => (
              <div key={i} className="corp-credibility-item">
                <p className="corp-credibility-body">{t.body}</p>
                <div className="corp-credibility-attribution">
                  <img
                    src={t.logo}
                    alt={t.company}
                    className="corp-credibility-logo"
                    draggable={false}
                  />
                  <div>
                    <p className="corp-credibility-name">{t.name}</p>
                    <p className="corp-credibility-company">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GALLERY ──────────────────────────────────────── */}
        <section className="corp-gallery">
          <h2 className="corp-gallery-heading">Gallery</h2>
          <div className="corp-gallery-grid">
            {gallery.map((g, i) => (
              <div
                key={i}
                className="corp-gallery-item"
                style={{ background: g.bg }}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  className="corp-gallery-img"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── FIND US ON ───────────────────────────────────── */}
        <div className="corp-findus">
          <div className="corp-findus-marquee">
            <div className="corp-findus-marquee-track">
              {[...findUsLogos, ...findUsLogos].map((logo, i) => (
                <img
                  key={`${logo.alt}-${i}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="corp-findus-logo"
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <style>{`
        .corp-main {
          background: #000000;
          color: #ffffff;
          min-height: 100vh;
        }

        /* ── HERO ────────────────────────────────────────────── */
        .corp-hero {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 480px;
          overflow: hidden;
          background: #000000;
        }
        .corp-hero-image {
          position: absolute;
          inset: 0;
        }
        .corp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.45) 35%,
            rgba(0,0,0,0.15) 100%
          );
        }
        .corp-hero-pdf {
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          transition: opacity 0.2s ease;
        }
        .corp-hero-pdf:hover { opacity: 0.85; }

        .corp-hero-text {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 2;
          padding: 0 60px 60px;
          max-width: 720px;
          width: 100%;
          color: #ffffff;
        }
        .corp-hero-headline {
          font-size: clamp(1.6rem, 3.2vw, 2.4rem);
          font-weight: 600;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.01em;
        }
        .corp-hero-sub {
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          font-weight: 300;
          line-height: 1.5;
          margin: 0 0 28px;
          opacity: 0.92;
          max-width: 520px;
        }
        .corp-hero-rule {
          height: 1px;
          background: rgba(255,255,255,0.6);
          margin-bottom: 18px;
          width: 90%;
          max-width: 520px;
        }
        .corp-hero-enquire {
          display: inline-block;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-decoration: none;
          padding-left: calc(50% - 80px);
          transition: opacity 0.2s ease;
        }
        .corp-hero-enquire:hover { opacity: 0.85; }

        /* Mobile + tablet hero */
        @media (max-width: 1023px) {
          .corp-hero {
            height: auto;
            min-height: 0;
          }
          .corp-hero-image {
            position: relative;
            inset: auto;
            width: 100%;
            height: 60vh;
            min-height: 380px;
          }
          .corp-hero-pdf {
            position: relative;
            top: auto;
            right: auto;
            display: none;
          }
          .corp-hero-text {
            position: relative;
            left: auto;
            bottom: auto;
            padding: 32px 24px 32px;
            max-width: 100%;
          }
          .corp-hero-headline {
            font-size: 1.7rem;
          }
          .corp-hero-sub {
            font-size: 1rem;
          }
          .corp-hero-rule {
            width: 100%;
          }
          .corp-hero-enquire {
            padding-left: 0;
            display: block;
            text-align: center;
          }
        }

        /* ── COMPANY CLIENTS ─────────────────────────────────── */
        .corp-clients {
          padding: 40px 24px;
          overflow: hidden;
        }
        .corp-clients-marquee {
          width: 100%;
          overflow: hidden;
        }
        .corp-clients-marquee-track {
          display: flex;
          align-items: center;
          gap: 40px;
          width: max-content;
          animation: corp-marquee 25s linear infinite;
        }
        @keyframes corp-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .corp-client-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
          padding: 0 8px;
        }
        .corp-client-logo {
          max-height: 40px;
          max-width: 130px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        @media (min-width: 1024px) {
          .corp-clients {
            padding: 60px 80px;
          }
          .corp-clients-marquee-track {
            justify-content: space-between;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            animation: none;
            transform: none !important;
          }
          .corp-clients-marquee-track > .corp-client-item:nth-child(n+5) {
            display: none;
          }
          .corp-client-item { height: 80px; }
          .corp-client-logo {
            max-height: 60px;
            max-width: 240px;
          }
        }

        /* ── CREDIBILITY INTRO ───────────────────────────────── */
        .corp-intro {
          padding: 40px 24px 60px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }
        .corp-intro-para {
          font-size: clamp(1.1rem, 1.4vw, 1.35rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0 0 28px;
          opacity: 0.92;
        }
        .corp-intro-para:last-child {
          margin-bottom: 0;
        }
        @media (min-width: 1024px) {
          .corp-intro {
            padding: 80px 80px 80px;
          }
        }

        /* ── DIVIDER ─────────────────────────────────────────── */
        .corp-divider {
          height: 1px;
          background: rgba(255,255,255,0.2);
          margin: 0 48px;
        }
        @media (min-width: 1024px) {
          .corp-divider { margin: 0 80px; }
        }

        /* ── TWO-COLUMN BLOCK ────────────────────────────────── */
        .corp-twocol {
          padding: 60px 24px;
        }
        .corp-twocol-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .corp-twocol-card {
          padding: 32px;
        }
        .corp-twocol-card--bordered {
          border: 1px solid rgba(255,255,255,0.4);
        }
        .corp-twocol-heading {
          font-size: clamp(1.05rem, 1.2vw, 1.2rem);
          font-weight: 400;
          color: #ffffff;
          line-height: 1.5;
          margin: 0 0 24px;
          letter-spacing: 0.005em;
        }
        .corp-twocol-body {
          font-size: clamp(1rem, 1.1vw, 1.1rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0 0 24px;
          opacity: 0.9;
        }
        .corp-twocol-body--lead {
          font-size: clamp(1.2rem, 1.4vw, 1.35rem);
          opacity: 1;
          font-weight: 400;
        }
        .corp-twocol-chevron-cta {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 400;
          margin-top: 24px;
          transition: opacity 0.2s ease;
        }
        .corp-twocol-chevron-cta:hover { opacity: 0.85; }
        .corp-twocol-link-cta {
          display: inline-block;
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-size: 1.5rem;
          font-weight: 400;
          margin-top: 16px;
          transition: opacity 0.2s ease;
        }
        .corp-twocol-link-cta:hover { opacity: 0.85; }

        @media (min-width: 1024px) {
          .corp-twocol {
            padding: 80px 80px;
          }
          .corp-twocol-grid {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
          .corp-twocol-card {
            padding: 40px;
          }
        }

        /* ── SERVICES STRIP ──────────────────────────────────── */
        .corp-services {
          padding: 60px 24px;
        }
        .corp-services-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 32px;
          letter-spacing: 0.02em;
        }
        .corp-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-service-card {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          text-decoration: none;
          color: #ffffff;
          transition: transform 0.3s ease;
        }
        .corp-service-card:hover {
          transform: scale(1.01);
        }
        .corp-service-image {
          position: absolute;
          inset: 0;
        }
        .corp-service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
        }
        .corp-service-card:hover .corp-service-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);
          transition: background 0.3s ease;
        }
        .corp-service-overlay {
          transition: background 0.3s ease;
        }
        .corp-service-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
        }
        .corp-service-n {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 4px;
          color: #ffffff;
        }
        .corp-service-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 16px;
          color: #ffffff;
          line-height: 1.2;
        }
        .corp-service-rule {
          height: 1px;
          background: rgba(255,255,255,0.6);
          margin-bottom: 12px;
          width: 100%;
        }
        .corp-service-cta {
          font-size: 0.85rem;
          font-weight: 400;
          color: #ffffff;
          text-align: right;
          display: block;
        }

        @media (min-width: 1024px) {
          .corp-services {
            padding: 80px 80px;
          }
          .corp-services-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
          }
          .corp-service-card {
            aspect-ratio: 1 / 1;
          }
        }

        /* ── CREDIBILITY TESTIMONIALS ────────────────────────── */
        /* Mobile: carousel showing one testimonial at a time, with
           dots pager. Desktop: 2-column grid showing all 8 at once. */
        .corp-credibility {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-credibility-heading {
          font-size: 1.5rem;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 32px;
        }

        /* Mobile carousel */
        .corp-credibility-mobile {
          display: block;
        }
        .corp-credibility-track-wrap {
          overflow: hidden;
          width: 100%;
        }
        .corp-credibility-track {
          display: flex;
          width: 100%;
          transition: transform 0.4s ease;
          will-change: transform;
        }
        .corp-credibility-slide {
          flex: 0 0 100%;
          width: 100%;
          padding: 0 4px;
        }

        /* Desktop grid (hidden on mobile) */
        .corp-credibility-grid {
          display: none;
        }

        /* Shared item internals (used by both carousel + grid) */
        .corp-credibility-item {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .corp-credibility-body {
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0;
          opacity: 0.92;
        }
        .corp-credibility-attribution {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .corp-credibility-logo {
          max-height: 36px;
          max-width: 120px;
          width: auto;
          height: auto;
          object-fit: contain;
          flex-shrink: 0;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .corp-credibility-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 2px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .corp-credibility-company {
          font-size: 0.85rem;
          font-weight: 300;
          color: #ffffff;
          margin: 0;
          opacity: 0.7;
        }

        /* Dots pager */
        .corp-credibility-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
        }
        .corp-credibility-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.6);
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .corp-credibility-dot--active {
          background: #ffffff;
          border-color: #ffffff;
        }

        /* Desktop overrides */
        @media (min-width: 1024px) {
          .corp-credibility {
            padding: 80px 80px;
          }
          /* Hide mobile carousel, show desktop grid */
          .corp-credibility-mobile {
            display: none;
          }
          .corp-credibility-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px 60px;
          }
        }

        /* ── WHAT'S INCLUDED ─────────────────────────────────── */
        .corp-included {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-included-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 40px;
          letter-spacing: 0.02em;
        }
        .corp-included-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px 60px;
        }
        .corp-included-item {
          /* Title + body stack */
        }
        .corp-included-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
          letter-spacing: 0.01em;
        }
        .corp-included-body {
          font-size: clamp(0.95rem, 1.05vw, 1.05rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0;
          opacity: 0.9;
        }
        @media (min-width: 768px) {
          .corp-included-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .corp-included {
            padding: 80px 80px;
          }
          .corp-included-grid {
            gap: 36px 80px;
          }
        }

        /* ── VIDEOS ──────────────────────────────────────────── */
        .corp-videos {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-videos-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 40px;
          letter-spacing: 0.02em;
        }
        .corp-videos-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .corp-video-item {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .corp-video-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.01em;
        }
        .corp-video-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #1a1a1a;
          overflow: hidden;
          border-radius: 4px;
        }
        .corp-video-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .corp-video-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 0.9rem;
          opacity: 0.5;
          font-style: italic;
        }
        .corp-video-intro {
          font-size: clamp(0.9rem, 1vw, 1rem);
          font-weight: 300;
          color: #ffffff;
          line-height: 1.6;
          margin: 0;
          opacity: 0.85;
        }
        @media (min-width: 768px) {
          .corp-videos-grid {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
          }
        }
        @media (min-width: 1024px) {
          .corp-videos {
            padding: 80px 80px;
          }
          .corp-videos-grid {
            gap: 60px;
          }
        }

        /* ── GALLERY ─────────────────────────────────────────── */
        /* Masonry layout via CSS columns. Images keep their
           native aspect ratio; columns flow top-down. Each
           image has its own background colour set inline so
           the tile shows a coloured placeholder while loading. */
        .corp-gallery {
          padding: 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-gallery-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 40px;
          letter-spacing: 0.02em;
        }
        .corp-gallery-grid {
          column-count: 2;
          column-gap: 8px;
        }
        .corp-gallery-item {
          break-inside: avoid;
          margin-bottom: 8px;
          overflow: hidden;
          /* background set inline per-item via the bg field */
        }
        .corp-gallery-img {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.3s ease, transform 0.5s ease;
        }
        .corp-gallery-item:hover .corp-gallery-img {
          transform: scale(1.03);
        }
        @media (min-width: 768px) {
          .corp-gallery-grid {
            column-count: 3;
            column-gap: 12px;
          }
          .corp-gallery-item {
            margin-bottom: 12px;
          }
        }
        @media (min-width: 1024px) {
          .corp-gallery {
            padding: 80px 80px;
          }
          .corp-gallery-grid {
            column-gap: 16px;
          }
          .corp-gallery-item {
            margin-bottom: 16px;
          }
        }

        /* ── FIND US ON ──────────────────────────────────────── */
        .corp-findus {
          padding: 40px 24px 60px;
          overflow: hidden;
        }
        .corp-findus-marquee {
          width: 100%;
          overflow: hidden;
        }
        .corp-findus-marquee-track {
          display: flex;
          align-items: center;
          gap: 40px;
          width: max-content;
          animation: corp-marquee 25s linear infinite;
        }
        .corp-findus-logo {
          flex: 0 0 auto;
          height: 36px;
          width: auto;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
          opacity: 0.85;
        }
        @media (min-width: 1024px) {
          .corp-findus {
            padding: 60px 80px;
          }
          .corp-findus-marquee-track {
            justify-content: center;
            gap: 60px;
            width: 100%;
            animation: none;
            transform: none !important;
          }
          .corp-findus-marquee-track > .corp-findus-logo:nth-child(n+6) {
            display: none;
          }
          .corp-findus-logo {
            height: 50px;
          }
        }
      `}</style>
    </>
  );
}
