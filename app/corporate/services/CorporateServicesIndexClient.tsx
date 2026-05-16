'use client';

import Image from 'next/image';
import Link from 'next/link';
import CorporateNav from '../../CorporateNav';
import CorporateFooter from '../../CorporateFooter';
import Testimonials from '../../components/Testimonials/Testimonials';
import { corporateTestimonials } from '../../components/Testimonials/corporate-testimonials-data';

const services = [
  {
    n: '1',
    title: 'Display Screen Equipment Assessments',
    cta: 'DSC Assessments',
    href: '/corporate/services/dsc-assessments',
    img: '/corporate-dsc.jpg',
  },
  {
    n: '2',
    title: 'In-Office Chair Massage',
    cta: 'Chair Massage',
    href: '/corporate/services/in-chair-massage',
    img: '/corporate-chair-massage.jpg',
  },
  {
    n: '3',
    title: 'Assessments & Posture Consultations',
    cta: 'Posture Consultation',
    href: '/corporate/services/posture-consultations',
    img: '/corporate-posture.jpg',
  },
];

const quickActions = [
  { label: 'Enquire about your team', href: '/corporate/enquire' },
  { label: 'Download our employer PDF', href: '/employer-info.pdf', download: true },
  { label: 'Watch Videos', href: '#videos' },
];

const benefits = [
  'Reduced levels of stress and anxiety',
  'Increased mindfulness',
  'Increased concentration',
  'Significant boost to workplace morale and productivity',
  'Protection from potential future health risks',
  'Dramatically improves staff perception of management',
  'Cuts levels of sick leave, absenteeism & presenteeism',
];

export default function CorporateServicesIndexClient() {
  return (
    <>
      <CorporateNav />

      <main className="cs-page">
        {/* ── HERO: 3 cards (2+1) + quick actions ────────── */}
        <section className="cs-hero">
          <div className="cs-services-grid">
            {services.map((s) => (
              <Link key={s.n} href={s.href} className="cs-service-card">
                <div className="cs-service-image">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div className="cs-service-overlay" />
                </div>
                <div className="cs-service-content">
                  <p className="cs-service-n">Service {s.n}:</p>
                  <h3 className="cs-service-title">{s.title}</h3>
                  <div className="cs-service-rule" />
                  <span className="cs-service-cta">{s.cta} &gt;&gt;</span>
                </div>
              </Link>
            ))}
          </div>

          <aside className="cs-quick-actions">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                {...(a.download ? { download: true } : {})}
                className="cs-quick-action"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M10 8L20 16L10 24" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{a.label}</span>
              </Link>
            ))}
          </aside>
        </section>

        {/* ── 2-column: aside + main copy ─────────────── */}
        <section className="cs-body">
          <aside className="cs-sessions">
            <h3 className="cs-sessions-title">The sessions are designed not to interfere with the team day.</h3>
            <p>An online booking form is shared prior to the scheduled day. And on a first come first served basis, the team can book a slot that suits.</p>
            <p>These individual team member sessions can be different amount of time depending on your teams available time (and budget).</p>
            <p className="cs-sessions-bold">We offer slot lengths:</p>
            <ul>
              <li>15 minute</li>
              <li>20 minute</li>
              <li>30 minute</li>
            </ul>
            <p>This service is ideal for SME companies with a staffed office. We offer flexibility + convenience to fit within your daily operations.</p>
          </aside>

          <div className="cs-main-copy">
            <p className="cs-lead">
              Stress, burnout and physical illness are rarely ever the fault of the staff or the organisation itself. Sometimes we stumble and fall, or, perhaps worse, stumble and fall and then come into work, when we should be recovering! Managing stress levels and physical wellbeing with regular massage treatments for your staff will have them feeling revived, content and motivated!
            </p>
            <p className="cs-sub">
              Our specialist corporate massages in Cambridge are a popular choice for businesses looking to enhance their employee wellness programs, relieve stress, and create a more positive and productive work environment.
            </p>

            <h3 className="cs-benefits-title">Benefits to business:</h3>
            <ul className="cs-benefits-list">
              {benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <Link href="/corporate/enquire" className="cs-enquire-link">
              Enquire About your team here
            </Link>
          </div>
        </section>

        {/* ── CREDIBILITY: testimonials ───────────────────── */}
        <section className="cs-credibility">
          <h2 className="cs-credibility-heading">Credibility</h2>
          <Testimonials items={corporateTestimonials} />
        </section>
      </main>

      <CorporateFooter />

      <style>{`
        .cs-page {
          background: #0a0908;
          color: #ffffff;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* ── HERO ──────────────────────────────────────── */
        .cs-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 32px 16px;
          max-width: 1600px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .cs-hero {
            grid-template-columns: 2fr 1fr;
            gap: 48px;
            padding: 48px 80px;
          }
        }

        .cs-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 768px) {
          .cs-services-grid {
            grid-template-columns: 1fr 1fr;
          }
          /* 3rd card spans only one column (left), creating 2+1 layout */
          .cs-services-grid > .cs-service-card:nth-child(3) {
            grid-column: 1 / 2;
          }
        }

        .cs-service-card {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          color: #ffffff;
          text-decoration: none;
          display: block;
        }
        .cs-service-image {
          position: absolute;
          inset: 0;
        }
        .cs-service-image img {
          filter: grayscale(100%);
          transition: filter 0.4s ease;
        }
        .cs-service-card:hover .cs-service-image img {
          filter: grayscale(0%);
        }
        .cs-service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
          transition: background 0.3s ease;
        }
        .cs-service-card:hover .cs-service-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);
        }
        .cs-service-content {
          position: relative;
          z-index: 2;
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .cs-service-n {
          font-size: 0.85rem;
          opacity: 0.8;
          margin: 0 0 4px;
        }
        .cs-service-title {
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .cs-service-rule {
          height: 1px;
          background: rgba(255,255,255,0.5);
          margin-bottom: 12px;
        }
        .cs-service-cta {
          font-size: 0.85rem;
          opacity: 0.85;
        }

        /* ── QUICK ACTIONS ───────────────────────────── */
        .cs-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 8px 0;
        }
        .cs-quick-action {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
          text-decoration: none;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 1.05rem;
          transition: opacity 0.2s ease;
        }
        .cs-quick-action:hover {
          opacity: 0.7;
        }

        /* ── BODY: aside + main copy ─────────────── */
        .cs-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 0 16px 48px;
          max-width: 1600px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .cs-body {
            grid-template-columns: 320px 1fr;
            gap: 64px;
            padding: 0 80px 64px;
          }
        }

        .cs-sessions {
          border: 1px solid rgba(255,255,255,0.15);
          padding: 24px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .cs-sessions-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 16px;
          line-height: 1.3;
        }
        .cs-sessions p {
          margin: 0 0 16px;
          opacity: 0.85;
        }
        .cs-sessions-bold {
          font-weight: 600;
          opacity: 1 !important;
          margin-bottom: 8px !important;
        }
        .cs-sessions ul {
          list-style: disc;
          padding-left: 24px;
          margin: 0 0 16px;
        }
        .cs-sessions li {
          margin-bottom: 4px;
          opacity: 0.85;
        }

        .cs-main-copy {
          font-size: 1.1rem;
          line-height: 1.55;
        }
        .cs-lead {
          font-size: 1.2rem;
          margin: 0 0 24px;
        }
        .cs-sub {
          margin: 0 0 32px;
          opacity: 0.85;
        }
        .cs-benefits-title {
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0 0 16px;
        }
        .cs-benefits-list {
          list-style: disc;
          padding-left: 24px;
          margin: 0 0 32px;
        }
        .cs-benefits-list li {
          margin-bottom: 8px;
          opacity: 0.9;
        }
        .cs-enquire-link {
          color: #ffffff;
          font-size: 1.2rem;
          text-decoration: underline;
          font-weight: 500;
        }
        .cs-enquire-link:hover {
          opacity: 0.8;
        }

        /* ── CREDIBILITY ────────────────────────── */
        .cs-credibility {
          padding: 64px 16px;
          max-width: 1600px;
          margin: 0 auto;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        @media (min-width: 1024px) {
          .cs-credibility {
            padding: 80px 80px;
          }
        }
        .cs-credibility-heading {
          font-size: 1.4rem;
          font-weight: 500;
          margin: 0 0 32px;
        }
      `}</style>
    </>
  );
}
