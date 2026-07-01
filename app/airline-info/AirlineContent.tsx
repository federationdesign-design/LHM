'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const QA = [
  {
    q: 'Does the wheelchair or mobility aid have a battery(ies)?',
    a: 'Yes. The Omeo is operated by 2 sets of factory fitted batteries - Lithium Ion and Sealed Lead Acid.\n\n2 x Lithium Ion batteries: 73v 11400mAh 832.2wh\n2 x Lead Acid: 2.3ah 12v',
  },
  {
    q: 'Who is the device manufacturer and what is the model number?',
    a: 'Omeo Technology. Model: Omeo Evolution v1.2 or v1.3 (check your version).',
  },
  {
    q: 'What is the total weight of the wheelchair or mobility aid, including installed batteries and accessories?',
    a: '76kg with standard tyres.',
  },
  {
    q: 'What is the length, width and height (including accessories) of the wheelchair or mobility aid as presented for air travel?',
    a: 'H610mm x W650mm x L770mm',
  },
  {
    q: 'Does the wheelchair or mobility aid have any removable or adjustable parts (such as a custom seat cushion, joystick or headrest)?',
    a: 'No.',
  },
  {
    q: 'Does the battery(ies) need to be removed from the wheelchair or mobility aid for transport?',
    a: 'No. The batteries are securely fitted to the Omeo and the battery terminals are protected from short circuits.',
  },
  {
    q: 'How is power disconnected from the device?',
    a: 'The info key (controller) is kept with the operator and the Omeo cannot be switched on if more than 2m away from the key. The battery can also be removed from the info key to prevent operation as an extra precaution.',
  },
  {
    q: 'Is the user aware of how to engage/disengage the freewheel mode for the mobility aid?',
    a: 'The Omeo can be freewheeled without power by leaving the legs raised.',
  },
  {
    q: 'Do the batteries meet SECTION 14 / TESTED ACCORDING TO THE REQUIREMENTS OF THE UN manual of tests and criteria PART III subsection 38.3?',
    a: 'Yes. The manufacturer confirms that the batteries are tested and meet these requirements (UN3840/3841/3171).',
  },
  {
    q: 'Do the batteries comply with IATA 2.3.2.4 Wheelchairs/Mobility Aids with Lithium Batteries?',
    a: 'Yes.',
  },
]

const DOCS = [
  {
    label: 'Omeo Tech User Manual Battery Guidelines',
    href: 'https://myadaptability.co.uk/wp-content/uploads/2025/04/Omeo-Tech-User-Manual-Battery-Guidelines.pdf',
  },
  {
    label: 'IATA Guidelines',
    href: 'https://myadaptability.co.uk/wp-content/uploads/2025/04/IATA-Guidelines.pdf',
  },
  {
    label: 'Air New Zealand Handling Guidelines',
    href: 'https://myadaptability.co.uk/wp-content/uploads/2025/04/Air-New-Zealand-Handling-Guidelines.pdf',
  },
]

const ADDITIONAL = [
  {
    label: 'Battery-Powered Wheelchair and Mobility Aid Guidance Document',
    href: 'https://www.iata.org/contentassets/6fea26dd84d24b26a7a1fd5788561d6e/mobility-aid-guidance-document.pdf',
  },
  {
    label: 'IATA - Air Travel Accessibility',
    href: 'https://www.iata.org/en/programs/passenger/accessibility/',
  },
]

function Divider() {
  return <div style={{ height: 1, background: '#fff', margin: '0 24px' }} />
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.25s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M4 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AirlineContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <main style={{ background: '#000', color: '#fff', paddingTop: 'var(--nav-height)' }}>

      {/* ---- Header ---- */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '40px' }}>
            Information for Flying with your Omeo
          </h1>

          {/* IATA quote */}
          <blockquote
            style={{
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '24px',
              margin: '0 0 24px',
              fontStyle: 'italic',
              lineHeight: 1.7,
              opacity: 0.85,
            }}
          >
            The batteries that power wheelchairs and mobility aids are considered dangerous goods when carried by air.
            These and some other dangerous goods that are permitted for carriage by passengers can be transported safely
            by air provided certain safety requirements are met.
          </blockquote>
          <p style={{ fontSize: '0.85rem', opacity: 0.55, marginBottom: '36px', lineHeight: 1.5 }}>
            IATA - Battery-Powered Wheelchairs and Mobility Aids Guidance Document. Transport of Battery-Powered Wheelchair
            and Mobility Aid Carried by Passengers. Revised for the 2025 Regulations.
          </p>

          {/* IATA logo */}
          <div style={{ marginBottom: '36px' }}>
            <Image
              src="/IATA-WO.png"
              alt="IATA"
              width={200}
              height={80}
              style={{ objectFit: 'contain', objectPosition: 'left' }}
            />
          </div>

          {/* Warning note */}
          <div
            style={{
              background: 'rgba(240,129,38,0.1)',
              border: '1px solid var(--accent)',
              borderRadius: '12px',
              padding: '20px 24px',
              lineHeight: 1.65,
            }}
          >
            <strong>PLEASE NOTE:</strong> The information on this page is for information only. You must speak to your
            airline/flight operator to seek approval from them to fly with your Omeo.
          </div>
        </div>
      </section>

      <Divider />

      {/* ---- Vimeo Video ---- */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-media)' }}>
            <iframe
              src="https://player.vimeo.com/video/1171783263"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Flying with your Omeo"
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ---- Accordion ---- */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 700, marginBottom: '12px' }}>
            Airline Questions
          </h2>
          <p style={{ opacity: 0.75, lineHeight: 1.65, marginBottom: '36px' }}>
            Airlines generally ask a set of questions that help them determine if a mobility device meets the criteria
            of their guidelines. Here are the answers in relation to the Omeo...
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {QA.map((item, i) => (
              <div key={i} style={{ borderTop: i === 0 ? '1px solid rgba(255,255,255,0.15)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '20px 0',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: '0.97rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                  aria-expanded={openIndex === i}
                >
                  <span>{item.q}</span>
                  <ChevronIcon open={openIndex === i} />
                </button>
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: openIndex === i ? '400px' : '0',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <div style={{ paddingBottom: '20px', paddingRight: '32px' }}>
                    {item.a.split('\n\n').map((para, j) => (
                      <p key={j} style={{ opacity: 0.8, lineHeight: 1.7, fontSize: '0.95rem', margin: j > 0 ? '10px 0 0' : '0' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Post-accordion note */}
          <div style={{ marginTop: '40px', lineHeight: 1.65, fontSize: '0.95rem', opacity: 0.8 }}>
            <p style={{ marginBottom: '16px' }}>
              Omeo Technology provide additional information in their User Manual...
            </p>
            <a
              href="https://myadaptability.co.uk/wp-content/uploads/2025/04/Omeo-Tech-User-Manual-Battery-Guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Omeo Tech User Manual Battery Guidelines
            </a>
            <p style={{ marginTop: '24px', marginBottom: '16px' }}>
              The Omeo is cited in the IATA Mobility Aid Guidance Document as a wheelchair/mobility aid that provides
              adequate protection for the batteries by design...
            </p>
          </div>

          {/* IATA featuring Omeo image */}
          <div style={{ marginTop: '24px', borderRadius: 'var(--radius-media)', overflow: 'hidden', maxWidth: 700 }}>
            <Image
              src="/IATA-Featuring-Omeo-e1743540572310.png"
              alt="IATA Guidance Document featuring the Omeo"
              width={1200}
              height={600}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ---- Documents ---- */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 700, marginBottom: '32px' }}>
            Documents
          </h2>

          <div style={{ marginBottom: '40px', borderRadius: 'var(--radius-media)', overflow: 'hidden', maxWidth: 700 }}>
            <Image
              src="/Airline-travel-1.jpg"
              alt="Airline travel with Omeo"
              width={1200}
              height={800}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DOCS.map(doc => (
              <a
                key={doc.href}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  opacity: 0.85,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--accent)' }}>
                  <path d="M4 2h6l4 4v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M10 2v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {doc.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ---- Additional Info ---- */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 700, marginBottom: '24px' }}>
            Additional Info
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ADDITIONAL.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/omeo" className="btn-outline">Back to Omeo</Link>
        </div>
      </section>

    </main>
  )
}
