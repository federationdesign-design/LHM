'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import Nav from '../Nav';
import Footer from '../Footer';
import WellbeingForm from '../WellbeingForm';

const testimonials = [
  { name: 'Sarah Cater', title: 'Fantastic Swedish massage with Antonia', body: 'This was one of the best massages I have had over the 30 years of having them. I was very tight in many areas of my body and Antonia focused on what was the most needed and explained why I had the tension and how to avoid it going forward. I am definitely going back.', date: '30/03/2026', avatar: 'S' },
  { name: 'Suleyman Adanir', title: 'Swedish massage with Antonia', body: 'A very relaxing Swedish massage with Antonia. The room was clean and calming, and she was professional and attentive throughout. I left feeling refreshed and comfortable. I will definitely return.', date: '04/02/2026', avatar: 'S' },
  { name: 'Alice W', title: 'Orla is brilliant', body: 'I have recommended Lucy Hall massage to so many people as they are second to none. Their services are thorough and affordable. Orla is professional, friendly, kind and made me feel so comfortable. She really is brilliant at her job and very knowledgeable.', date: '10/12/2025', avatar: 'A' },
];

const logos = [
  { src: '/bookingpage.png', alt: 'BookingPage' },
  { src: '/tripadisvor.svg', alt: 'Tripadvisor' },
  { src: '/SBM-logo.png', alt: 'SimplyBook.me' },
  { src: '/linked_in.png', alt: 'LinkedIn' },
  { src: '/where-logo.png', alt: 'Wheree' },
];

function LogoSliderWithHeading() {
  const total = logos.length;
  const extended = [logos[total - 1], ...logos, logos[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index === 0) { setAnimate(false); setIndex(total); }
    else if (index === total + 1) { setAnimate(false); setIndex(1); }
  };

  return (
    <div style={{ paddingTop: 40 }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#ffffff', textAlign: 'center', marginBottom: 24, opacity: 0.7 }}>
        Find us on:
      </h3>
      <div className={styles.logoSlider}>
        <div
          className={animate ? styles.logoTrack : styles.logoTrackNoAnim}
          style={{ transform: `translateX(${25 - index * 50}%)` }}
          onTransitionEnd={handleTransitionEnd}
          onTouchStart={e => { startX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { const dx = startX.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 30) go(index + (dx > 0 ? 1 : -1)); }}
        >
          {extended.map((logo, i) => (
            <div key={i} className={styles.logoSlide}>
              <img src={logo.src} alt={logo.alt} className={styles.logoImg} draggable={false} />
            </div>
          ))}
        </div>
        <div className={styles.logoRow}>
          {logos.map((logo) => (
            <img key={logo.alt} src={logo.src} alt={logo.alt} className={styles.logoRowImg} draggable={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const total = testimonials.length;
  const extended = [testimonials[total - 1], ...testimonials, testimonials[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0);
  const go = (n: number) => { setAnimate(true); setIndex(n); };
  const handleTransitionEnd = () => {
    if (index === 0) { setAnimate(false); setIndex(total); }
    else if (index === total + 1) { setAnimate(false); setIndex(1); }
  };
  const realIndex = index === 0 ? total - 1 : index === total + 1 ? 0 : index - 1;

  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.testimonialsHeading}>Happy private<br />clients include</h2>
      <div
        className={animate ? styles.testimonialsTrack : styles.testimonialsTrackNoAnim}
        style={{ transform: `translateX(calc(-${index * 100}%))` }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const dx = startX.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 40) go(index + (dx > 0 ? 1 : -1)); }}
      >
        {extended.map((t, i) => (
          <div key={i} className={styles.testimonialSlide}>
            <div className={styles.testimonialAvatar}>{t.avatar}</div>
            <h4 className={styles.testimonialName}>{t.name}</h4>
            <p className={styles.testimonialTitle}>{t.title}</p>
            <p className={styles.testimonialBody}>{t.body}</p>
            <div className={styles.testimonialStars}>{[...Array(5)].map((_, j) => <span key={j} className={styles.star}>★</span>)}</div>
            <p className={styles.testimonialDate}>{t.date}</p>
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => go(i + 1)} className={`${styles.dot} ${i === realIndex ? styles.dotActive : ''}`} />
        ))}
      </div>
      <div className={styles.testimonialsGrid}>
        {testimonials.map((t, i) => (
          <div key={i} className={styles.testimonialsGridSlide}>
            <div className={styles.testimonialAvatar}>{t.avatar}</div>
            <h4 className={styles.testimonialName}>{t.name}</h4>
            <p className={styles.testimonialTitle}>{t.title}</p>
            <p className={styles.testimonialBody}>{t.body}</p>
            <div className={styles.testimonialStars}>{[...Array(5)].map((_, j) => <span key={j} className={styles.star}>★</span>)}</div>
            <p className={styles.testimonialDate}>{t.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


function DownloadTipsLink() {
  return (
    <a href="/tips-download" className="syj-tips-link">
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22, flexShrink: 0 }}>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Download our 5 tips to a healthy body</span>
    </a>
  );
}

export default function StartYourJourneyClient() {

  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000' }}>

        {/* Page wrapper that holds hero, credentials, body, AND the
            sticky form overlay. Position relative so the absolute form
            container is positioned against this wrapper.

            The form column is an absolute layer overlaying the right
            third of the wrapper. Its INNER content uses position sticky
            so it tracks the viewport as user scrolls within this wrapper.
            When wrapper ends (above logo slider), form scrolls away. */}
        <div className="syj-page-wrap">

          {/* HERO — full width within the wrapper */}
          <section className="syj-hero">
            <div className="syj-hero-img">
              <Image
                src="/running-athlete.jpg"
                alt="Athlete recovering from a run"
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
            </div>

            <div className="syj-hero-text">
              <h1 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.15, marginBottom: 18 }}>
                Get tips and learn about the Impact of Sport on Your Body
              </h1>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.55, marginBottom: 24, maxWidth: 540 }}>
                Whether you&rsquo;re recovering from an injury, managing ongoing tension, or simply in need of time to reset, our tailored treatments are designed around your body and your lifestyle.
              </p>
              <div style={{ height: 1, width: 60, background: '#ffffff', marginBottom: 18 }} />
              <a href="#start-form" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', textDecoration: 'none' }}>
                Start now &raquo;
              </a>
            </div>
          </section>

          {/* CREDENTIALS bar — full width below hero. Logos always on one
              line and scale smaller instead of wrapping. */}
          <section className="syj-credentials-section" style={{ background: '#0a0908', padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="syj-credentials-row">
              {[
                { src: '/FHT.png', alt: 'Federation of Holistic Therapists' },
                { src: '/hppc.png', alt: 'Health & Care Professions Council' },
                { src: '/AACP.png', alt: 'Acupuncture Association of Chartered Physiotherapists' },
                { src: '/STA.png', alt: 'Sports Therapy Association' },
              ].map(c => (
                <div key={c.src} className="syj-credential-item">
                  <img
                    src={c.src}
                    alt={c.alt}
                    className="syj-credential-img"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* BODY content — full width below credentials.
              Has right-side padding on desktop to clear the form overlay. */}
          <section className="syj-body-section">
            <div className="syj-body-grid">
              <div>
                <p style={{ fontSize: '1.2rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, marginBottom: 22 }}>
                  Booking your first ever massage can feel like a big step. You might wonder whether your problem is &ldquo;serious enough&rdquo; for treatment, whether massage will actually help, or simply whether it&rsquo;s the right thing for you right now. Those questions are completely normal &mdash; and you don&rsquo;t need to answer any of them to start learning.
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, marginBottom: 22 }}>
                  The science behind massage is well-evidenced. Regular treatment has been shown to lower blood pressure, ease muscular tension and increase serotonin levels by an average of 54% while reducing cortisol by 43%. It&rsquo;s one of the most accessible forms of self-care for both physical recovery and mental wellbeing.
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, marginBottom: 22 }}>
                  Our well-being programme is designed for people who aren&rsquo;t ready to book. There&rsquo;s no commitment, no sales pressure, and no expectation that you&rsquo;ll become a regular client. Tell us a bit about your situation in the form and we&rsquo;ll send you tailored advice &mdash; articles, guides, and gentle suggestions for what might help. When and if you decide to book, we&rsquo;ll be here.
                </p>
              </div>
            </div>
          </section>

          {/* DESKTOP-ONLY form overlay column.
              Absolutely positioned over the right side of the wrapper.
              Inner content is sticky so it tracks viewport as user scrolls.
              Pointer-events on outer container disabled so clicks pass
              through where form isn't; re-enabled on the inner content. */}
          <div className="syj-form-overlay">
            <div className="syj-form-sticky">
              <DownloadTipsLink />
              <div id="start-form" style={{ marginTop: 16 }}>
                <WellbeingForm
                  heading="Sign up to our free well-being programme"
                  intro="Tell us a little about you and your situation. We'll send the guide straight to you and follow up with tailored advice."
                  submitButtonText="Submit"
                  confirmationTitle="Thank you"
                  confirmationMessage={
                    <>
                      <p style={{ marginBottom: 14 }}>Your guide is downloading now. If it doesn&rsquo;t start automatically, <a href="/5-tips-to-a-healthy-body.pdf" download style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 500 }}>click here</a> to download.</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>We&rsquo;ll also be in touch over the coming weeks with tailored advice based on the information you shared.</p>
                    </>
                  }
                  pdfPath="/5-tips-to-a-healthy-body.pdf"
                  pdfFilename="5-tips-to-a-healthy-body.pdf"
                />
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE-ONLY form section. On desktop this is hidden because the
            sticky form overlay handles desktop. On mobile the overlay is
            hidden and this stacked section is shown instead. */}
        <section className="syj-mobile-form-section">
          <DownloadTipsLink />
          <div id="start-form-mobile" style={{ marginTop: 16 }}>
            <WellbeingForm
              heading="Sign up to our free well-being programme"
              intro="Tell us a little about you and your situation. We'll send the guide straight to you and follow up with tailored advice."
              submitButtonText="Submit"
              confirmationTitle="Thank you"
              confirmationMessage={
                <>
                  <p style={{ marginBottom: 14 }}>Your guide is downloading now. If it doesn&rsquo;t start automatically, <a href="/5-tips-to-a-healthy-body.pdf" download style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 500 }}>click here</a> to download.</p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>We&rsquo;ll also be in touch over the coming weeks with tailored advice based on the information you shared.</p>
                </>
              }
              pdfPath="/5-tips-to-a-healthy-body.pdf"
              pdfFilename="5-tips-to-a-healthy-body.pdf"
            />
          </div>
        </section>

        {/* Standard testimonials section — mobile carousel + desktop 3-col grid.
            Mirrored from HomeClient/BookOnline. Sits below page-wrap so the
            form's overlay does not interfere. */}
        <Testimonials />

        <LogoSliderWithHeading />

        <Footer />

        <style>{`
          /* === MOBILE DEFAULTS (<1024px) === */

          .syj-page-wrap {
            position: relative;
          }

          /* Hero — full width, image background, text below image overlaid by gradient */
          .syj-hero {
            position: relative;
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          .syj-hero-img {
            position: absolute;
            inset: 0;
            z-index: 0;
          }
          .syj-hero-text {
            position: relative;
            z-index: 1;
            padding: 80px 24px 40px;
          }

          /* Credentials — always one row, logos scale to fit.
             Mobile: row spans full container width, logos shrink. */
          .syj-credentials-row {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .syj-credential-item {
            flex: 1 1 0;
            min-width: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 56px;
            padding: 4px 8px;
          }
          .syj-credential-img {
            width: 100%;
            max-width: 180px;
            max-height: 48px;
            height: auto;
            object-fit: contain;
            display: block;
          }

          /* Body section — full width, padded */
          .syj-body-section {
            padding: 60px 24px 80px;
          }
          .syj-body-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
          }

          /* Hide desktop form overlay on mobile */
          .syj-form-overlay {
            display: none;
          }

          /* Show mobile form section */
          .syj-mobile-form-section {
            padding: 40px 24px 80px;
            background: #000000;
          }

          /* === DESKTOP (>=1024px) === */
          @media (min-width: 1024px) {

            /* Hero is taller on desktop, accommodating the form overlay on right */
            .syj-hero {
              min-height: 720px;
            }
            .syj-hero-text {
              padding: 0 0 80px 60px;
              padding-right: 560px;
              max-width: none;
            }
            /* Tighten H1 size on desktop so it fits in the narrower
               content area left by the form column. Uses smaller min/max
               than the inline mobile clamp. */
            .syj-hero-text h1 {
              font-size: clamp(1.4rem, 2vw, 2.2rem) !important;
            }

            /* Credentials on desktop — still single row, larger gap/height,
               width-constrained so logos don't sit under the form column */
            .syj-credentials-row {
              gap: 32px;
              padding-left: 60px;
              padding-right: 30px;
              max-width: calc(100% - 560px);
              justify-content: flex-start;
            }
            .syj-credential-item {
              min-height: 70px;
              padding: 8px 16px;
            }
            .syj-credential-img {
              max-height: 60px;
              max-width: 200px;
            }

            /* Body section — left side gets content, right side
               leaves space for the absolute-positioned form overlay */
            .syj-body-section {
              padding: 60px 0 100px 60px;
              padding-right: 560px;
            }
            .syj-body-grid {
              grid-template-columns: 1fr;
              gap: 40px;
              align-items: start;
            }

            /* Form overlay — absolutely positioned over the right side of the
               page wrap. Spans full vertical height of the wrap.
               Width 540px including padding. */
            .syj-form-overlay {
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              width: 540px;
              padding: 100px 48px 60px;
              pointer-events: none;
              box-sizing: border-box;
            }

            /* Sticky inner — tracks viewport as user scrolls.
               Top: 80px keeps it just below the nav bar.
               Pointer events re-enabled here so form is clickable. */
            .syj-form-sticky {
              position: sticky;
              top: 80px;
              pointer-events: auto;
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            /* Hide mobile form section on desktop */
            .syj-mobile-form-section {
              display: none;
            }

            /* === Z-INDEX FIX FOR FORM OVERLAY CLICK INTERCEPTION ===
               The hero, credentials and body sections are full-width siblings
               of the form overlay inside .syj-page-wrap. On desktop, the
               credentials section in particular has an opaque background
               that visually sits behind the form's right-hand area. Without
               explicit stacking, those sections can intercept clicks on the
               form fields (especially the 2nd/3rd inputs which sit lower
               in the form, where the credentials bar's vertical extent
               overlaps).

               Fix: lift the form overlay above all sibling content sections
               by giving the overlay a higher z-index, and giving the content
               sections an explicit lower z-index with position: relative
               (z-index has no effect without a positioned ancestor). */
            .syj-form-overlay {
              z-index: 10;
            }
            .syj-hero,
            .syj-credentials-section,
            .syj-body-section {
              position: relative;
              z-index: 1;
            }
          }

          /* Download tips link styling */
          .syj-tips-link {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: #ffffff;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 400;
            line-height: 1.4;
            opacity: 0.95;
            transition: opacity 0.25s ease;
            align-self: flex-end;
          }
          .syj-tips-link:hover {
            opacity: 1;
            text-decoration: underline;
          }

        `}</style>
      </main>
    </>
  );
}
