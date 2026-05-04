import styles from './page.module.css';

const mainMenu: [string, string][] = [
  ['Home', '/private'],
  ['All Treatments', '/treatments'],
  ['Locations', '/locations'],
  ['Our Team', '/team'],
  ['Gift Vouchers', '/gift-vouchers'],
  ['Blog', '/news'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
];

// Useful Links — FAQ removed, "Request Receipts" and "Testimonials" added
const usefulLinks: [string, string][] = [
  ['Request Receipts', '/receipts'],
  ['Testimonials', '/testimonials'],
  ['Facebook', 'https://www.facebook.com/lucyhallmassage'],
  ['Instagram', 'https://www.instagram.com/lucyhallmassage/'],
  ['LinkedIn', 'https://www.linkedin.com/in/lucy-hall-massage-47369141/'],
  ['Privacy Policy', '/legal/privacy-policy'],
  ['Terms & Conditions', '/legal/terms-and-conditions'],
  ['Data Request', '/legal/data-request'],
];

const treatments: [string, string][] = [
  ['Cupping', '/cupping'],
  ['Deep Tissue', '/deep-tissue-massage'],
  ['Hopi Ear', '/hopi-ear'],
  ['Hot Stone', '/hot-stone-massage'],
  ['Indian Head', '/indian-head-massage'],
  ['Physiotherapy', '/physiotherapy-treatment'],
  ['Pregnancy', '/pregnancy-massage'],
  ['Relaxation', '/relaxation-massage'],
  ['Sports Massage', '/sports-massage'],
  ['Swedish', '/swedish-massage'],
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Mobile only: address + hours */}
      <div className={styles.footerAddress}>
        2 Antwerp Cottages,<br />Thoday Street,<br />Cambridge,<br />CB1 3AU<br />
        <a href="tel:07765555078" style={{ textDecoration: 'underline' }}>07765 555078</a>
      </div>
      <p className={styles.footerHoursTitle}>Opening Times</p>
      <div className={styles.footerHours}>
        Monday &nbsp;&nbsp;&nbsp;~ 9am to 8pm<br />
        Tuesday &nbsp;&nbsp;~ 9am to 8pm<br />
        Wednesday ~ 9am to 8pm<br />
        Thursday &nbsp;~ 9am to 8pm<br />
        Friday &nbsp;&nbsp;&nbsp;&nbsp;~ 9am to 6pm<br />
        Saturday &nbsp;~ 9am to 5.30pm<br />
        Sunday &nbsp;&nbsp;&nbsp;~ 10am to 5pm
      </div>

      {/* Desktop: 5-column grid.
          Order is now: Address | Main Menu | Treatments | Useful Links | Opening Times
          (Useful Links and Opening Times swapped per request — Opening Times now last) */}
      <div className={styles.footerGrid}>

        <div className={styles.footerCol}>
          <h4>Lucy Hall Massage Therapy</h4>
          <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.6 }}>
            2 Antwerp Cottages,<br />Thoday Street,<br />Cambridge, CB1 3AU<br />
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
          <h4>Treatments</h4>
          <ul>
            {treatments.map(([label, href]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        {/* Useful Links — moved to 4th position (was 5th).
            FAQ removed. Request Receipts and Testimonials added at the top */}
        <div className={styles.footerCol}>
          <h4>Useful Links</h4>
          <ul>
            {usefulLinks.map(([label, href]) => (
              <li key={label}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        {/* Opening Times — moved to 5th position (was 4th) */}
        <div className={styles.footerCol}>
          <h4>Opening Times</h4>
          <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.9 }}>
            Monday – 9am to 8pm<br />
            Tuesday – 9am to 8pm<br />
            Wednesday – 9am to 8pm<br />
            Thursday – 9am to 8pm<br />
            Friday – 9am to 6pm<br />
            Saturday – 9am to 5.30pm<br />
            Sunday – 10am to 5pm
          </p>
        </div>

      </div>

      {/* Bottom bar */}
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
