'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import type { LegalPage } from './data/legal';


export default function LegalClient({ page }: { page: LegalPage }) {

  return (
    <>
      {/* NAV — always solid black on legal pages */}
      <Nav solid />

      <main className={styles.page} style={{ paddingTop: 56 }}>

        {/* PAGE HEADER */}
        <div style={{ borderBottom: '1px solid #ffffff', padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 16 }}>
              <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / {page.title}
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 12 }}>{page.title}</h1>
            <p style={{ fontSize: '0.82rem', fontWeight: 300, color: '#ffffff', opacity: 0.6 }}>Last updated: {page.lastUpdated}</p>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {page.sections.map((section, i) => (
              <div key={i} style={{ marginBottom: 48, paddingBottom: 48, borderBottom: i < page.sections.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: 16, letterSpacing: '0.02em' }}>{section.heading}</h2>
                {section.content.split('\n\n').map((block, j) => {
                  if (block.startsWith('•')) {
                    const lines = block.split('\n').filter(l => l.trim());
                    return (
                      <ul key={j} style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                        {lines.map((line, k) => (
                          <li key={k} style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, paddingLeft: 20, position: 'relative', marginBottom: 6 }}>
                            <span style={{ position: 'absolute', left: 0 }}>•</span>
                            {line.replace(/^•\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={j} style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, marginBottom: 16 }}>{block}</p>
                  );
                })}
              </div>
            ))}

            {/* Contact */}
            <div style={{ marginTop: 48, padding: '32px', border: '1px solid #ffffff' }}>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, margin: 0 }}>
                Questions about this page? Contact us at{' '}
                <a href="mailto:info@lucyhallmassage.com" style={{ color: '#ffffff', fontWeight: 600 }}>info@lucyhallmassage.com</a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
