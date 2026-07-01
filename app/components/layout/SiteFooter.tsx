import Link from 'next/link'
import Image from 'next/image'
import { BUSINESS } from '../../../lib/business'

export default function SiteFooter() {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '64px 24px 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>

          {/* Brand */}
          <div>
            <Image src="/Adapt-Ability-Dark-Background-600x217.png" alt="Adapt Ability" width={130} height={47} style={{ marginBottom: '20px' }} />
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.6, maxWidth: '260px' }}>
              Specialists in innovative self-balancing mobility vehicles, enhancing independence for wheelchair and ambulatory users across the UK.
            </p>
          </div>

          {/* Products */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
              Products
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Omeo', href: '/omeo' },
                { label: 'Hoss', href: '/hoss' },
                { label: 'Store', href: '/products' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.7 }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
              Useful Links
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Omeo and Hoss Purchase Agreement', href: '/purchase-agreement' },
                { label: 'Trial Terms and Conditions', href: '/trial-terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Complaints Procedure', href: '/complaints' },
                { label: 'Shop Orders and Returns', href: '/ordering' },
                { label: 'Flying with your Omeo', href: '/airline-info' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.7 }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Warranties */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
              Warranties
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Omeo Limited Warranty', href: '/omeo/warranty' },
                { label: 'Hoss Limited Warranty', href: '/hoss/warranty' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.7 }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
              Contact
            </p>
            <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href={`mailto:${BUSINESS.email}`} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.7 }}>{BUSINESS.email}</a>
              <p style={{ fontSize: '0.875rem', opacity: 0.5, margin: 0, lineHeight: 1.6 }}>
                {BUSINESS.address.street}<br />{BUSINESS.address.locality}<br />{BUSINESS.address.postcode}
              </p>
              <p style={{ fontSize: '0.8rem', opacity: 0.4, margin: 0 }}>{BUSINESS.hoursDisplay}</p>
            </address>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <Image src="/BHTA-TSI-Logo_Colour-L.png" alt="BHTA member" width={80} height={40} style={{ objectFit: 'contain', opacity: 0.7 }} />
            <Image src="/Trust-Pilot-Reviews-Logo-1.png" alt="Trustpilot" width={100} height={24} style={{ objectFit: 'contain', opacity: 0.7 }} />
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy policy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' },
              { label: 'Complaints', href: '/complaints' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.75rem', opacity: 0.4 }}>{l.label}</Link>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', opacity: 0.3, marginTop: '24px' }}>
          &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
