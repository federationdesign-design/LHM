'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Nav from './Nav';
import Footer from './Footer';
import CorporateNav from './CorporateNav';
import CorporateFooter from './CorporateFooter';


const faqs = [
  {
    category: 'Deep Tissue Massage',
    questions: [
      { q: 'What is a deep tissue massage?', a: 'Deep tissue massage is a therapeutic technique that targets the deeper layers of muscle and connective tissue (fascia). Using slow, firm strokes and sustained pressure, it releases chronic tension, adhesions and knots that can cause pain and restricted movement.' },
      { q: 'What does a deep tissue massage feel like?', a: 'You can expect firm, sustained pressure that works into the deeper muscle layers. Some areas may feel tender or intense, particularly where tension has built up, but this should always feel productive rather than painful. Your therapist will check in with you throughout and can adjust the pressure to suit you.' },
      { q: 'Does deep tissue massage work?', a: 'Yes. Deep tissue massage is well evidenced for reducing chronic muscle tension, improving range of motion, relieving pain and aiding recovery from injury. Many clients notice significant improvements after just one session, with longer-lasting results from regular treatment.' },
      { q: 'What are the benefits of deep tissue massage?', a: 'Benefits include releasing chronic muscle tension, breaking down scar tissue and adhesions, improving circulation, reducing inflammation, easing pain from conditions such as sciatica and back pain, improving posture, and supporting recovery from injury or overuse.' },
      { q: 'Does deep tissue massage help frozen shoulder?', a: 'Yes. Deep tissue massage can be very effective for frozen shoulder (adhesive capsulitis) by working on the surrounding muscles, fascia and connective tissue to restore range of motion and reduce pain. It is most effective as part of a broader treatment plan.' },
      { q: 'Does deep tissue massage break up fat?', a: 'Deep tissue massage is not a fat loss treatment, but it can improve circulation and lymphatic drainage in the treated areas, which may temporarily reduce the appearance of water retention. For fat loss, it works best alongside regular exercise and a balanced diet.' },
      { q: 'What should I wear for a deep tissue massage?', a: 'There is no specific clothing requirement. You will be appropriately draped throughout your session and only the area being worked on will be uncovered. Most clients undress to their underwear, but your comfort is the priority — your therapist will advise you.' },
      { q: 'Can deep tissue massage cause miscarriage?', a: 'We do not recommend deep tissue massage during pregnancy. If you are pregnant, please book a pregnancy massage instead, which is specifically designed to be safe and beneficial at each stage of pregnancy.' },
    ],
  },
  {
    category: 'Dry Needling',
    questions: [
      { q: 'What is dry needling?', a: 'Trigger-point dry needling is a technique where a fine acupuncture needle is inserted directly into a muscle trigger point — an area of contracted, painful muscle tissue. It is called "dry" because no substance is injected; the needle itself creates the therapeutic effect.' },
      { q: 'What does dry needling do?', a: 'Dry needling creates a local twitch reflex within the contracted muscle, which is both diagnostic and therapeutic. Research shows this reflex response reduces muscle contraction, relieves pain and restores normal muscle function.' },
      { q: 'Does dry needling release toxins?', a: 'Dry needling stimulates the local tissue response and increases blood flow to the area, which can help clear metabolic waste products that accumulate in tight, contracted muscles. This is one of the mechanisms by which it reduces pain and improves function.' },
      { q: 'Can dry needling cause headaches?', a: 'In around 5–10% of cases, clients may experience a temporary headache following dry needling, particularly when the session focuses on the neck and upper shoulder area. This is caused by the increase in local blood flow and typically resolves quickly.' },
      { q: 'How long is a dry needling session?', a: 'A focused dry needling session targeting a specific area typically takes around 30 minutes. It is often combined with massage or manual therapy as part of a broader treatment.' },
      { q: 'Does dry needling work for tendonitis?', a: 'Yes. Dry needling can be effective for tendonitis by increasing blood supply to the tendon, which activates the healing process and supports tissue regeneration. It is particularly useful for chronic tendonitis where the tissue has become degenerative.' },
      { q: 'Does dry needling cure plantar fasciitis?', a: 'Dry needling can significantly reduce the pain and severity of chronic plantar fasciitis. While it may not be a permanent cure for all cases, many clients experience substantial and lasting relief, especially when combined with stretching and load management.' },
    ],
  },
  {
    category: 'Pregnancy Massage',
    questions: [
      { q: 'What is a pregnancy massage?', a: 'Pregnancy massage is a treatment specifically designed to be safe and comfortable during pregnancy. Sessions are carried out with you lying on your side, supported by cushions, allowing your therapist to work on your back, hips, legs and shoulders in a way that is gentle and appropriate for pregnancy.' },
      { q: 'Is massage safe during early pregnancy?', a: 'We recommend waiting until after 16 weeks of pregnancy before receiving a massage. Before this point, the pregnancy is considered higher risk and we err on the side of caution. If you are unsure, please check with your midwife or GP before booking.' },
      { q: 'Can massage cause miscarriage in early pregnancy?', a: 'There is no evidence that professional pregnancy massage causes miscarriage. However, as a precaution we do not treat clients in their first trimester (before 16 weeks). After this point, pregnancy massage performed by a qualified therapist is considered safe.' },
      { q: 'Are back massages safe during pregnancy?', a: 'Back massage during pregnancy is safe when carried out by a qualified pregnancy massage therapist, physiotherapist or sports therapist who is trained in pregnancy care. We do not recommend booking a standard deep tissue or Swedish massage during pregnancy — please book our pregnancy massage specifically.' },
      { q: 'Is Swedish massage safe during pregnancy?', a: 'We do not recommend standard Swedish massage during pregnancy. Please book our pregnancy massage, which is specifically adapted to be safe and comfortable at each stage of pregnancy.' },
    ],
  },
  {
    category: 'Sports Massage',
    questions: [
      { q: 'What is a sports massage?', a: 'Sports massage is a targeted treatment designed to relieve aches, pains and tension, and to support recovery from injury and physical activity. Despite the name, you do not need to be an athlete to benefit — it is suitable for anyone experiencing muscle pain, tightness or restricted movement.' },
      { q: 'What is a sports massage like?', a: 'Sports massage is more focused and targeted than a relaxation massage. Your therapist will work on specific areas of tension using a range of techniques including deep tissue work, stretching and trigger point therapy. The pressure is firm but can be adjusted to suit your needs.' },
      { q: 'What should I wear to a sports massage?', a: 'Please bring a pair of shorts. Depending on the area being treated, you may be asked to remove your top. Your therapist will ensure you are appropriately covered at all times.' },
      { q: 'How does sports massage reduce pain?', a: 'Sports massage reduces pain by releasing tight muscles, breaking down adhesions and scar tissue, improving circulation and stimulating the nervous system to reduce pain signals. A range of techniques are used depending on your specific needs.' },
      { q: 'Is sports massage good for sciatica?', a: 'Yes. Sports massage can be very effective for sciatic pain by releasing tension in the piriformis and surrounding muscles that can compress or irritate the sciatic nerve. Many clients experience significant relief after treatment.' },
      { q: 'Are sports massages good for you?', a: 'Yes. Regular sports massage has a wide range of benefits including reducing muscle tension and pain, improving flexibility and range of motion, supporting injury recovery and prevention, reducing stress and improving overall wellbeing.' },
    ],
  },
  {
    category: 'Hopi Ear Candling',
    questions: [
      { q: 'What is Hopi ear candling?', a: 'Hopi ear candling (also known as thermal auricular therapy) is a gentle, non-invasive treatment for the ears. A hollow, cone-shaped candle made from natural ingredients is placed at the entrance to the ear canal and lit, creating a gentle warmth and mild suction effect.' },
      { q: 'How do Hopi ear candles work?', a: 'The candle creates a gentle warming and mild vacuum effect at the entrance to the ear canal. This can help soften and loosen excess wax, relieve pressure and promote a feeling of relaxation. It is a soothing treatment often used for congestion and ear discomfort.' },
      { q: 'Do Hopi ear candles work?', a: 'Many clients find Hopi ear candling beneficial for relieving feelings of congestion, pressure and excess wax. It is a gentle complementary therapy and is not intended to replace medical treatment for serious ear conditions. If you have concerns about your ear health, please consult your GP.' },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left' }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 500, color: '#ffffff', lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: '1.4rem', fontWeight: 300, color: '#ffffff', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: '0.95rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.75, paddingBottom: 20, opacity: 0.85 }}>{a}</p>
      )}
    </div>
  );
}


const corpFaqs = [
  {
    category: 'Booking & scheduling',
    questions: [
      { q: 'Is there a minimum number of staff you can see?', a: 'Yes, we typically need a minimum group size that makes the visit viable for both sides. For most onsite sessions that is around 8-10 people, depending on slot length and location. Get in touch with your numbers and we will let you know what works.' },
      { q: 'Is there a maximum number of staff you can see in one day?', a: 'In a full working day a single therapist can typically see 20-30 people on shorter slots (15-20 minutes each). For larger teams we send multiple therapists so everyone gets seen. The biggest team we have run in a single day is in the hundreds, across several therapists.' },
      { q: 'How quickly can you fit us in?', a: 'It depends on the time of year. We try to offer something within 2-4 weeks, but during busy periods (autumn into Christmas, January wellness pushes, summer event season) it can be longer. The sooner you enquire, the more likely we are to slot you in when you want us.' },
      { q: 'We start early in the morning, what is the earliest you can get there?', a: 'We can usually be set up and ready to start by 8am if needed. If you need earlier than that, let us know and we will see what we can do.' },
    ],
  },
  {
    category: 'Logistics & setup',
    questions: [
      { q: 'What if we have multiple locations?', a: 'No problem. We have therapists across Cambridge and the surrounding region, and we regularly run multi-site rotations for clients with several offices. Tell us where your sites are and how often you want to cover each one, and we will build a schedule.' },
      { q: 'Do we need to prepare our team in any way before your arrival?', a: 'Not really. Some clients share a short note explaining what to wear (comfortable layers work best for chair massage) and mentioning that no oils are used during chair sessions, so people can come straight from a meeting. We will send a booking link your team can use to book their own slot in advance.' },
      { q: 'Would you do the massages outside?', a: 'Yes, if the weather is reliable and we have a safe, level surface. Outdoor sessions can be lovely for summer wellbeing days, but we always have a contingency plan in case of rain. Tell us what space you have and we will work it out together.' },
      { q: 'We are attending an event and would love to have a service like this on our stand. Can you help?', a: 'Absolutely. Event massage is one of our most popular services and a brilliant way to draw people to your stand. We have run sessions at trade shows, conferences, sponsor activations and brand experiences. Tell us about the event and we will put a quote together.' },
      { q: 'What space do you need at our office?', a: 'For chair massage we need a quiet-ish corner with enough room for the chair plus the therapist to move around it, roughly 2m x 2m. A small meeting room or a corner of an empty office both work well. For DSE assessments we come to the desk itself.' },
    ],
  },
  {
    category: 'Money & contracts',
    questions: [
      { q: 'Is there a deposit and when is it due?', a: 'Yes. For most bookings we ask for a 50% deposit to confirm the date, with the balance invoiced after the session. For larger or repeat clients we sometimes work on standard 30-day invoice terms instead. We will agree what works for you upfront.' },
      { q: 'How much does it cost?', a: 'It depends on team size, slot length and how many therapists we send. As a rough guide, a half-day with one therapist starts in the low hundreds; full days and larger teams scale from there. Get in touch with your numbers and we will send a proper quote.' },
      { q: 'Do you offer ongoing monthly visits?', a: 'Yes, and most of our long-term clients work with us this way. Regular monthly or fortnightly visits build a rhythm, fill up faster, and have a much bigger impact on team wellbeing than one-off sessions. Happy to design something around your team.' },
    ],
  },
  {
    category: 'Safety, insurance & confidentiality',
    questions: [
      { q: 'Do you have insurance for any injuries caused by your massages?', a: 'Yes. Every therapist on our team is fully insured (we work with the FHT and Society of Sports Therapists, depending on qualification) and we hold public liability cover for all onsite work. Happy to share certificates if your facilities team needs them.' },
      { q: 'How do you report any injuries you find? Is the information confidential to the employee?', a: 'Anything an individual shares with the therapist during their session stays between them and the therapist. We do not share personal health information with employers. If a therapist spots a workplace pattern (for example, repeated posture issues across one team), we may flag the pattern generally, never the individual.' },
      { q: 'How do you keep the area hygienic?', a: 'The massage chair face cradle is wiped down and re-covered with a fresh disposable cover between every person. Therapists wash hands between clients and bring their own kit. If you have specific site requirements we are happy to accommodate.' },
      { q: 'Are your therapists qualified?', a: 'Yes. Every therapist is qualified to at least Level 3 in Massage Therapy, with most also holding Level 4 Sports Massage or equivalent, and many have specialist qualifications (pregnancy, dry needling, sports therapy). All are insured and DBS-checked where appropriate.' },
    ],
  },
];

export default function FAQClient({ variant = 'private' }: { variant?: 'private' | 'corporate' } = {}) {
  const isCorp = variant === 'corporate';

  return (
    <>
      {isCorp ? <CorporateNav /> : <Nav solid />}

      <main className={styles.page} style={{ paddingTop: 56 }}>

        {/* HEADER */}
        <div style={{ borderBottom: '1px solid #ffffff', padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ffffff', marginBottom: 16 }}>
              <a href="/" style={{ color: '#ffffff', textDecoration: 'none' }}>Home</a> / FAQ
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1, marginBottom: 16 }}>Frequently Asked Questions</h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7 }}>
              Answers to the most common questions about our Cambridge massage therapy services. Can't find what you're looking for?{' '}
              <a href="/contact" style={{ color: '#ffffff', fontWeight: 500 }}>Contact us</a> and we'll be happy to help.
            </p>
          </div>
        </div>

        {/* FAQ CONTENT */}
        <div style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {(isCorp ? corpFaqs : faqs).map((section, i) => (
              <div key={i} style={{ marginBottom: 56 }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: 8, paddingBottom: 16, borderBottom: '1px solid #ffffff' }}>{section.category}</h2>
                {section.questions.map((item, j) => (
                  <AccordionItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            ))}

            {/* Still have a question */}
            <div style={{ marginTop: 48, padding: '32px', border: '1px solid #ffffff', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: 12 }}>Still have a question?</h3>
              <p style={{ fontSize: '1rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.7, marginBottom: 20 }}>
                We're always happy to help. Get in touch and we'll get back to you as soon as possible.
              </p>
              <a href="/contact" style={{ display: 'inline-block', fontSize: '0.88rem', fontWeight: 400, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.18em', textDecoration: 'none', border: '1px solid #ffffff', padding: '14px 32px' }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
        {isCorp ? <CorporateFooter /> : <Footer />}
      </main>
    </>
  );
}
