'use client';

import Nav from '../Nav';
import Footer from '../Footer';
import WellbeingForm from '../WellbeingForm';

/* ─────────────────────────────────────────────────────────────
   Path to the lead magnet PDF. Placeholder for now &mdash; upload
   the actual file to /public/5-tips-to-a-healthy-body.pdf when
   ready. The link will 404 until the file exists.
   ───────────────────────────────────────────────────────────── */
const PDF_PATH = '/5-tips-to-a-healthy-body.pdf';
const PDF_FILENAME = '5-tips-to-a-healthy-body.pdf';

export default function TipsDownloadClient() {
  return (
    <>
      <Nav solid />
      <main style={{ background: '#000000', minHeight: '100vh' }}>

        {/* Header section */}
        <section style={{ padding: '120px 24px 40px', maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', opacity: 0.5, marginBottom: 18 }}>
            <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / Free Guide
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 24 }}>
            5 Tips to a Healthy Body
          </h1>
          <p style={{ fontSize: '1.05rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 18 }}>
            Aches, tension, and stiffness are some of the most common reasons people come to see us. The good news is that simple daily habits can make a significant difference. This free guide brings together five of the most effective tips from our team of experienced therapists.
          </p>
          <p style={{ fontSize: '1.05rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, marginBottom: 18 }}>
            Whether you sit at a desk all day, train hard, or simply want to keep your body feeling its best, you&rsquo;ll find practical, evidence-backed advice you can apply straight away.
          </p>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.6, opacity: 0.75 }}>
            Fill out the form below and your guide will be ready to download in seconds.
          </p>
        </section>

        {/* Form section */}
        <section style={{ padding: '20px 24px 100px', maxWidth: 760, margin: '0 auto' }}>
          <WellbeingForm
            heading="Get your free guide"
            submitButtonText="Download the guide"
            confirmationMessage={<>Your guide is downloading now. If it doesn&rsquo;t start automatically, <a href={PDF_PATH} download={PDF_FILENAME} style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 500 }}>click here</a> to download.</>}
            confirmationFooter={<>We&rsquo;ll also be in touch over the coming weeks with tailored advice based on the information you shared.</>}
            pdfPath={PDF_PATH}
            pdfFilename={PDF_FILENAME}
          />
        </section>

        <Footer />

      </main>
    </>
  );
}
