import styles from './page.module.css';

/* ─────────────────────────────────────────────────────────────
   CorporateFooter — used on /corporate/* pages only.

   Differs from Footer (private) in 3 ways:
     - Address: 96 Cromwell Road, Cambridge, CB1 3EG
     - Tagline: 'Lucy Hall Massage Corporate'
     - Main Menu's Contact links to /corporate/contact (corp-specific)
     - Treatments column replaced with Services column
       (3 corp services)

   Useful Links + Opening Times kept identical to private footer.

   Reuses the existing footer CSS classes so look-and-feel matches
   the private side exactly. Just the data changes.
   ───────────────────────────────────────────────────────────── */

const mainMenu: [string, string][] = [
  ['Home', '/private'],
  ['All Treatments', '/treatments'],
  ['Locations', '/locations'],
  ['Our Team', '/team'],
  ['Gift Vouchers', '/gift-vouchers'],
  ['Blog', '/news'],
  ['FAQ', '/faq'],
  ['Contact', '/corporate/contact'],
  ['Corporate', '/corporate'],
];

const usefulLinks: [string, string][] = [
  ['Request Receipts', '/receipts'],
  ['Reviews', '/reviews'],
  ['Testimonials', '/testimonials'],
  ['Facebook', 'https://www.facebook.com/lucyhallmassage'],
  ['Instagram', 'https://www.instagram.com/lucyhallmassage/'],
  ['LinkedIn', 'https://www.linkedin.com/in/lucy-hall-massage-47369141/'],
  ['Privacy Policy', '/legal/privacy-policy'],
  ['Terms & Conditions', '/legal/terms-and-conditions'],
  ['Data Request', '/legal/data-request'],
];

const corpServices: [string, string][] = [
  ['In-Office Chair Massage', '/corporate/in-chair-massage'],
  ['DSE Assessments',         '/corporate/dsc-assessments'],
  ['Posture Consultations',   '/corporate/posture-consultations'],
];

export default function CorporateFooter() {
  return (
    <footer className={styles.footer}>
      {/* Mobile only: address + hours */}
      <div className={styles.footerAddress}>
        96 Cromwell Road,<br />Cambridge,<br />CB1 3EG<br />
        <a href="tel:07765555078" style={{ textDecoration: 'underline' }}>07765 555078</a>
      </div>
      <p className={styles.footerHoursTitle}>Opening Times</p>
      <div className={styles.footerHours}>
        Monday &nbsp;&nbsp;&nbsp;~ 12pm to 8pm<br />
        Tuesday &nbsp;&nbsp;~ 10am to 6pm<br />
        Wednesday ~ 10am to 8pm<br />
        Thursday &nbsp;~ 10am to 6pm<br />
        Friday &nbsp;&nbsp;&nbsp;&nbsp;~ 9am to 5pm<br />
        Saturday &nbsp;~ 9am to 5pm<br />
        Sunday &nbsp;&nbsp;&nbsp;~ 9am to 5pm
      </div>

      {/* Desktop: 5-column grid.
          Order: Address | Main Menu | Services | Useful Links | Opening Times */}
      <div className={styles.footerGrid}>

        <div className={styles.footerCol}>
          <h4>Lucy Hall Massage Corporate</h4>
          <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.6 }}>
            96 Cromwell Road,<br />Cambridge, CB1 3EG<br />
            <a href="tel:07765555078" style={{ textDecoration: 'underline', color: '#ffffff' }}>07765 555078</a>
          </p>
        </div>

        <div className={styles.footerCol}>
          <h4>Main Menu</h4>
          <ul>
            {mainMenu.map(([label, href]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>Services</h4>
          <ul>
            {corpServices.map(([label, href]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>Useful Links</h4>
          <ul>
            {usefulLinks.map(([label, href]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4>Opening Times</h4>
          <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.9 }}>
            Monday – 12pm to 8pm<br />
            Tuesday – 10am to 6pm<br />
            Wednesday – 10am to 8pm<br />
            Thursday – 10am to 6pm<br />
            Friday – 9am to 5pm<br />
            Saturday – 9am to 5pm<br />
            Sunday – 9am to 5pm
          </p>
        </div>

      </div>

      {/* Bottom bar — same as private */}
      <div className={styles.footerBottom}>
        <p className={styles.footerCopy}>© 2026 LucyHallMassage</p>
        <div className={styles.footerLinks}>
          <a href="/legal/cookie-policy">Cookies</a>
          <span className={styles.footerSep}>|</span>
          <a href="/legal/privacy-policy">Privacy Policy</a>
          <span className={styles.footerSep}>|</span>
          <a href="/legal/terms-and-conditions">Terms & Conditions</a>
          <span className={styles.footerSep}>|</span>
          <a href="/legal/data-request">Data Request</a>
        </div>
      </div>
    </footer>
  );
}
