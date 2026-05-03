'use client';

import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import type { BlogArticle } from './data/blog';
import { services } from './data/services';

/* ─────────────────────────────────────────────────────────────
   Inline related-service card
   ───────────────────────────────────────────────────────────── */
function RelatedServiceCard({ slug }: { slug: string }) {
  const s = services[slug];
  if (!s) return null;

  return (
    <a
      href={`/${s.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        margin: '40px 0',
        position: 'relative',
        transition: 'transform 0.3s ease',
      }}
      className="related-service-card"
    >
      <div
        className="related-service-card-image"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          background: s.heroColor || '#1a1a1a',
          transition: 'filter 0.3s ease',
        }}
      >
        <Image
          src={s.heroMobile}
          alt={s.title}
          fill
          sizes="(max-width: 1023px) 100vw, 75vw"
          style={{ objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.7, marginBottom: 6 }}>
            Related Treatment:
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginBottom: 14, lineHeight: 1.15 }}>
            {s.title}
          </h3>
          <div style={{ height: 1, background: '#ffffff', marginBottom: 14 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff' }}>
            Book Treatment
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   Markdown body parser with auto-fallback.

   Mode 1 (explicit): If the markdown body contains {{related-service:slug}}
   tokens, those positions are used precisely.

   Mode 2 (auto-fallback): If the body has NO tokens AND the article has
   relatedTreatments configured, inject those cards at evenly-spaced
   paragraph boundaries (after roughly the 1/3 mark and 2/3 mark of the
   article). This means existing articles get cards immediately without
   needing to edit each markdown file.
   ───────────────────────────────────────────────────────────── */
function ArticleBody({ body, relatedTreatments }: { body: string; relatedTreatments: string[] }) {
  const tokenRegex = /\{\{related-service:([a-z0-9-]+)\}\}/gi;
  const hasExplicitTokens = tokenRegex.test(body);
  // Reset the regex state since .test() advances lastIndex
  tokenRegex.lastIndex = 0;

  let processedBody = body;

  // AUTO-FALLBACK: if no explicit tokens, inject related-treatment tokens
  // at evenly spaced paragraph boundaries
  if (!hasExplicitTokens && relatedTreatments.length > 0) {
    // Split body into paragraphs (double-newline separated)
    const paragraphs = body.split(/\n\n+/);

    if (paragraphs.length >= 4) {
      // For each related treatment, find a paragraph index to inject after
      // Spread them evenly: 1 treatment → after 50%; 2 treatments → after 33% and 66%; etc.
      const insertions: { index: number; slug: string }[] = [];
      const count = Math.min(relatedTreatments.length, 3); // cap at 3 to avoid clutter

      for (let i = 0; i < count; i++) {
        // Position: 1/(N+1), 2/(N+1), ... N/(N+1) through the article
        const targetPosition = (i + 1) / (count + 1);
        const insertAfterIndex = Math.floor(paragraphs.length * targetPosition);
        insertions.push({ index: insertAfterIndex, slug: relatedTreatments[i] });
      }

      // Inject tokens (work backwards so indexes don't shift)
      insertions.sort((a, b) => b.index - a.index);
      for (const { index, slug } of insertions) {
        paragraphs.splice(index + 1, 0, `{{related-service:${slug}}}`);
      }

      processedBody = paragraphs.join('\n\n');
    }
  }

  // Now split the processed body on tokens
  const parts: Array<{ type: 'markdown' | 'service'; content: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const splitRegex = /\{\{related-service:([a-z0-9-]+)\}\}/gi;

  while ((match = splitRegex.exec(processedBody)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', content: processedBody.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'service', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < processedBody.length) {
    parts.push({ type: 'markdown', content: processedBody.slice(lastIndex) });
  }
  if (parts.length === 0) {
    parts.push({ type: 'markdown', content: processedBody });
  }

  const mdComponents = {
    h2: ({ node, ...props }: any) => (
      <h2 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.25, marginTop: 48, marginBottom: 16 }} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, marginTop: 32, marginBottom: 12 }} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p style={{ fontSize: '1.02rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, marginBottom: 18 }} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul style={{ listStyle: 'disc', paddingLeft: 28, marginLeft: 8, marginBottom: 22 }} {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol style={{ listStyle: 'decimal', paddingLeft: 28, marginLeft: 8, marginBottom: 22 }} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }} {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote style={{ borderLeft: '3px solid #ffffff', paddingLeft: 22, margin: '32px 0', fontSize: '1.1rem', fontWeight: 300, fontStyle: 'italic', color: '#ffffff', lineHeight: 1.5 }} {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: 3 }} {...props} />
    ),
    strong: ({ node, ...props }: any) => (
      <strong style={{ fontWeight: 600 }} {...props} />
    ),
  };

  return (
    <>
      {parts.map((part, i) => (
        part.type === 'markdown' ? (
          <ReactMarkdown key={i} components={mdComponents}>{part.content}</ReactMarkdown>
        ) : (
          <RelatedServiceCard key={i} slug={part.content} />
        )
      ))}
    </>
  );
}

export default function BlogArticleClient({ article, body }: { article: BlogArticle; body: string }) {
  return (
    <>
      {/* JSON-LD Article schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.metaDescription,
          datePublished: article.publishDate,
          image: `https://www.lucyhallmassage.com${article.heroImage}`,
          author: { '@type': 'Organization', name: 'Lucy Hall Massage Therapy' },
          publisher: { '@type': 'Organization', name: 'Lucy Hall Massage Therapy', url: 'https://www.lucyhallmassage.com' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': article.canonicalUrl },
        }),
      }} />

      <Nav solid />

      <main style={{ background: '#000000', minHeight: '100vh' }}>
        <article className={styles.blogArticleWrapper} style={{ paddingTop: 100 }}>

          <p className={styles.blogBreadcrumbs}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a>
            {' / '}
            <a href="/news/" style={{ color: '#ffffff', textDecoration: 'none' }}>Blog</a>
          </p>

          <div className="blog-single-col">

            <div className={styles.blogArticleImage}>
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                sizes="(max-width: 1023px) calc(100vw - 96px), 75vw"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>

            <header className={styles.blogArticleHeader}>
              <h1 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.15, marginBottom: 20 }}>
                {article.h1}
              </h1>
              <p style={{ fontSize: '1.05rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.5 }}>
                {article.excerpt}
              </p>
            </header>

            {/* Article body — uses ArticleBody component which handles both
                explicit tokens AND auto-fallback from article.relatedTreatments */}
            <div className={styles.blogArticleBody}>
              <ArticleBody body={body || 'Article content coming soon.'} relatedTreatments={article.relatedTreatments || []} />
            </div>

          </div>
        </article>

        <Footer />

        <style>{`
          .blog-single-col {
            max-width: 760px;
            margin: 0 auto;
          }
          .related-service-card:hover .related-service-card-image {
            filter: brightness(0.7);
          }
          .related-service-card:hover {
            transform: translateY(-4px);
          }
        `}</style>
      </main>
    </>
  );
}
