'use client';

import Image from 'next/image';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import type { BlogArticle } from './data/blog';

export default function BlogIndexClient({ articles }: { articles: BlogArticle[] }) {
  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>
        {/* Header section — left-aligned. Constrained width but anchored left, not centred. */}
        <section style={{ padding: '120px 48px 60px', maxWidth: 1300, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Blog
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 18 }}>
            Articles &amp; Insights
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', opacity: 0.7, lineHeight: 1.6, maxWidth: 640 }}>
            Advice, education and stories from our therapists. Treatment guides, wellbeing tips and a closer look at the work we do.
          </p>
        </section>

        {/* White divider */}
        <div style={{ height: 1, background: '#ffffff', margin: '0 48px' }} />

        {/* Article grid */}
        <section className={styles.blogGrid} style={{ padding: '60px 48px 100px' }}>
          {articles.map((a) => (
            <a
              key={a.slug}
              href={`/news/${a.slug}/`}
              className={styles.blogCard}
            >
              {/* Image wrapper — 16:9 aspect ratio */}
              <div
                className={styles.blogCardImage}
                style={{ transition: 'filter 0.3s ease' }}
              >
                <Image
                  src={a.heroImage}
                  alt={a.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Card body — publish date REMOVED per request (dates not accurate) */}
              <div style={{ padding: '24px 0 0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 }}>
                  {a.title}
                </h2>
                <p style={{ fontSize: '0.96rem', fontWeight: 300, color: '#ffffff', opacity: 0.75, lineHeight: 1.55, marginBottom: 18 }}>
                  {a.excerpt}
                </p>
                <span className={styles.blogReadMore}>
                  Read more
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14, marginLeft: 8 }}>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </section>

        <Footer />
      </main>
    </>
  );
}
