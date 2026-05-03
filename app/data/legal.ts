// app/data/legal.ts

export interface LegalPage {
  slug: string;
  title: string;
  lastUpdated: string;
  sections: { heading: string; content: string }[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export const legalPages: Record<string, LegalPage> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    lastUpdated: 'April 2026',
    metaTitle: 'Privacy Policy | Lucy Hall Massage Therapy',
    metaDescription: 'Privacy Policy for Lucy Hall Massage Therapy, Cambridge. How we collect, use and protect your personal data under UK GDPR.',
    canonicalUrl: 'https://www.lucyhallmassage.com/privacy-policy/',
    sections: [
      {
        heading: 'Who we are',
        content: `Lucy Hall Massage Therapy is the data controller for the personal information we collect and process. We are based at 2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU. You can contact us at info@lucyhallmassage.com with any questions about how we handle your data.\n\nThis policy explains what personal data we collect, why we collect it, how we use it, and your rights under UK GDPR and the Data Protection Act 2018.`,
      },
      {
        heading: 'What data we collect',
        content: `We may collect and process the following personal data:\n\n• Name, email address, phone number and appointment details when you book a treatment\n• Health and medical information you provide as part of your consultation, where relevant to your treatment\n• Payment information — processed securely via SimplyBook.me. We do not store your card details\n• IP address and browsing behaviour via Google Analytics and Meta Pixel\n• Any communications you send us by email or through our website`,
      },
      {
        heading: 'Why we collect your data',
        content: `We collect and use your data for the following purposes:\n\n• To manage your bookings and appointments (contractual necessity)\n• To provide safe and appropriate treatment — health information is collected where clinically relevant (legitimate interest and, where required, explicit consent)\n• To send appointment reminders and follow-up communications (legitimate interest)\n• To comply with legal obligations, including keeping records required by our professional bodies\n• To analyse how our website is used and improve our services (legitimate interest, via Google Analytics)\n• To show relevant advertising on social media platforms (consent, via Meta Pixel)`,
      },
      {
        heading: 'Legal basis for processing',
        content: `Under UK GDPR, we rely on the following legal bases:\n\n• Contract: to fulfil your booking and provide the services you have requested\n• Legitimate interests: to run and improve our business, communicate with clients, and keep our website functioning\n• Legal obligation: to comply with professional, financial and health and safety requirements\n• Consent: for marketing communications and the use of Meta Pixel tracking. You may withdraw consent at any time`,
      },
      {
        heading: 'Health data',
        content: `Health information is classed as special category data under UK GDPR. We collect this only where necessary for your safe treatment, and only with your explicit consent. This information is kept securely and is not shared with third parties except where required by law or in a medical emergency.`,
      },
      {
        heading: 'Third parties we share data with',
        content: `We share your data with the following third parties only where necessary:\n\n• SimplyBook.me — our booking platform, which processes appointment and payment data. Their privacy policy is available at simplybook.me\n• Google Analytics — anonymous website usage data to help us understand how visitors use our site\n• Meta (Facebook/Instagram) — via Meta Pixel, for advertising purposes. You can opt out via your Meta ad preferences\n\nWe do not sell your personal data to any third party.`,
      },
      {
        heading: 'How long we keep your data',
        content: `We retain personal data for as long as necessary to fulfil the purposes for which it was collected:\n\n• Booking and appointment records: 7 years (in line with HMRC requirements)\n• Health consultation records: 7 years from last treatment, or 7 years after a minor turns 18\n• Marketing data: until you withdraw consent or unsubscribe\n• Website analytics data: as per Google Analytics retention settings (default 26 months)`,
      },
      {
        heading: 'Your rights',
        content: `Under UK GDPR you have the following rights:\n\n• Right of access — you can request a copy of the personal data we hold about you\n• Right to rectification — you can ask us to correct inaccurate data\n• Right to erasure — you can ask us to delete your data in certain circumstances\n• Right to restrict processing — you can ask us to limit how we use your data\n• Right to data portability — you can request your data in a structured, machine-readable format\n• Right to object — you can object to processing based on legitimate interests or for direct marketing\n• Rights related to automated decision-making — we do not carry out automated decision-making or profiling\n\nTo exercise any of these rights, please contact us at info@lucyhallmassage.com. We will respond within one month. If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.`,
      },
      {
        heading: 'Cookies',
        content: `Our website uses cookies. Please see our Cookie Policy for full details of the cookies we use and how to manage them.`,
      },
      {
        heading: 'Changes to this policy',
        content: `We may update this Privacy Policy from time to time. The current version will always be available on this page with the date it was last updated. We encourage you to review it periodically.`,
      },
    ],
  },

  'terms-and-conditions': {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    lastUpdated: 'April 2026',
    metaTitle: 'Terms & Conditions | Lucy Hall Massage Therapy',
    metaDescription: 'Terms and Conditions for Lucy Hall Massage Therapy, Cambridge.',
    canonicalUrl: 'https://www.lucyhallmassage.com/terms-and-conditions/',
    sections: [
      {
        heading: 'About these terms',
        content: `These Terms & Conditions apply to all treatments and services provided by Lucy Hall Massage Therapy, 2 Antwerp Cottages, Thoday Street, Cambridge, CB1 3AU (info@lucyhallmassage.com). By booking a treatment with us, you agree to these terms.`,
      },
      {
        heading: 'Bookings',
        content: `All bookings are made through our online booking system (SimplyBook.me) or by contacting us directly. A booking is confirmed once you receive a confirmation email. We reserve the right to decline or cancel a booking at our discretion, in which case a full refund will be issued.`,
      },
      {
        heading: 'Cancellations and rescheduling',
        content: `We require a minimum of 24 hours notice to cancel or reschedule an appointment. Cancellations made with less than 24 hours notice, or failure to attend without notice (no-show), may result in a cancellation fee of up to 100% of the treatment cost.\n\nWe understand that emergencies happen. Cancellation fees are applied at our discretion and we will always try to be fair and reasonable.`,
      },
      {
        heading: 'Late arrivals',
        content: `If you arrive late for your appointment, we will do our best to provide your full treatment within the remaining time. However, your session may be shortened to avoid inconveniencing other clients. The full treatment fee will apply.`,
      },
      {
        heading: 'Health and medical conditions',
        content: `You are responsible for informing us of any medical conditions, injuries, allergies or medications that may affect your treatment. We reserve the right to decline or modify a treatment if we believe it is not safe or appropriate for you. In some cases, we may ask you to provide written consent from your GP or specialist before proceeding.`,
      },
      {
        heading: 'Payments',
        content: `Payment is taken at the time of booking via our secure online platform, or in person following your treatment. We accept card payments processed securely via SimplyBook.me. All prices are in GBP and include VAT where applicable.`,
      },
      {
        heading: 'Gift vouchers',
        content: `Gift vouchers are non-refundable and cannot be exchanged for cash. They are valid for 12 months from the date of purchase unless otherwise stated. Lost or stolen vouchers cannot be replaced.`,
      },
      {
        heading: 'Conduct',
        content: `We are committed to providing a safe and professional environment for all clients and staff. We reserve the right to end a treatment and ask a client to leave if their behaviour is inappropriate, aggressive or threatening. In such cases, the full treatment fee will be charged and future bookings may be declined.`,
      },
      {
        heading: 'Liability',
        content: `Lucy Hall Massage Therapy carries full professional liability insurance. However, we cannot accept liability for any loss, damage or injury that arises as a result of information you have withheld or failed to disclose prior to treatment.\n\nWe are not liable for any loss or damage to personal belongings brought to your appointment.`,
      },
      {
        heading: 'Governing law',
        content: `These Terms & Conditions are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.`,
      },
    ],
  },

  'cookie-policy': {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    lastUpdated: 'April 2026',
    metaTitle: 'Cookie Policy | Lucy Hall Massage Therapy',
    metaDescription: 'Cookie Policy for Lucy Hall Massage Therapy. How we use cookies on our website.',
    canonicalUrl: 'https://www.lucyhallmassage.com/cookie-policy/',
    sections: [
      {
        heading: 'What are cookies',
        content: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners. Under UK GDPR and the Privacy and Electronic Communications Regulations (PECR), we are required to obtain your consent before placing non-essential cookies on your device.`,
      },
      {
        heading: 'Cookies we use',
        content: `Our website uses the following types of cookies:\n\nEssential cookies — these are necessary for the website to function and cannot be switched off. They include cookies set by our booking platform (SimplyBook.me) to manage your session during the booking process.\n\nAnalytics cookies — we use Google Analytics to understand how visitors use our website. These cookies collect anonymous information about pages visited, time spent on the site and how you arrived. No personally identifiable information is collected. You can opt out of Google Analytics tracking at tools.google.com/dlpage/gaoptout.\n\nMarketing cookies — we use Meta Pixel to measure the effectiveness of our advertising on Facebook and Instagram. These cookies track whether you have visited our site after seeing one of our adverts. You can manage your ad preferences at facebook.com/adpreferences.`,
      },
      {
        heading: 'Managing cookies',
        content: `You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website, including the ability to make bookings. For more information on managing cookies, visit allaboutcookies.org.\n\nYou can withdraw your consent to non-essential cookies at any time by adjusting your browser settings or contacting us at info@lucyhallmassage.com.`,
      },
      {
        heading: 'Changes to this policy',
        content: `We may update this Cookie Policy from time to time. The current version will always be available on this page.`,
      },
    ],
  },

  'cancellation-policy': {
    slug: 'cancellation-policy',
    title: 'Cancellation Policy',
    lastUpdated: 'April 2026',
    metaTitle: 'Cancellation Policy | Lucy Hall Massage Therapy',
    metaDescription: 'Cancellation and rescheduling policy for Lucy Hall Massage Therapy, Cambridge.',
    canonicalUrl: 'https://www.lucyhallmassage.com/cancellation-policy/',
    sections: [
      {
        heading: 'Our cancellation policy',
        content: `We understand that life is unpredictable and sometimes appointments need to change. We ask that you give us as much notice as possible so that we can offer your slot to another client.`,
      },
      {
        heading: '24-hour notice required',
        content: `We require a minimum of 24 hours notice to cancel or reschedule an appointment without charge. You can cancel or reschedule online through your booking confirmation email, or by contacting us directly at info@lucyhallmassage.com.`,
      },
      {
        heading: 'Late cancellations',
        content: `Cancellations made with less than 24 hours notice may incur a charge of up to 50% of the treatment cost. This is at the discretion of the therapist and we will always try to be fair.`,
      },
      {
        heading: 'No-shows',
        content: `If you do not attend your appointment without any notice, a charge of up to 100% of the treatment cost may apply. Repeated no-shows may result in a requirement to pay in full at the time of booking for future appointments.`,
      },
      {
        heading: 'Cancellations by us',
        content: `In the rare event that we need to cancel your appointment, we will give you as much notice as possible and offer you an alternative appointment or a full refund. We will not charge a cancellation fee if we cancel your appointment.`,
      },
      {
        heading: 'Illness',
        content: `If you are unwell, please do not attend your appointment. We ask that you contact us as soon as possible so we can rearrange. We will waive the cancellation fee where illness is the reason, particularly where you have given us notice on the day. The health and safety of our clients and therapists is our priority.`,
      },
    ],
  },

  'data-request': {
    slug: 'data-request',
    title: 'Data Request',
    lastUpdated: 'April 2026',
    metaTitle: 'Data Request | Lucy Hall Massage Therapy',
    metaDescription: 'How to request, correct or delete your personal data held by Lucy Hall Massage Therapy.',
    canonicalUrl: 'https://www.lucyhallmassage.com/data-request/',
    sections: [
      {
        heading: 'Your rights under UK GDPR',
        content: `Under UK GDPR and the Data Protection Act 2018, you have the right to access, correct, or request deletion of the personal data we hold about you. This page explains how to submit a request and what to expect.`,
      },
      {
        heading: 'Right of access (Subject Access Request)',
        content: `You have the right to receive a copy of the personal data we hold about you. To submit a Subject Access Request (SAR), please email us at info@lucyhallmassage.com with the subject line "Subject Access Request" and include your full name and the email address associated with your bookings so we can identify your records.\n\nWe will respond within one calendar month. This service is free of charge.`,
      },
      {
        heading: 'Right to rectification',
        content: `If any of the information we hold about you is inaccurate or incomplete, you have the right to ask us to correct it. Please email info@lucyhallmassage.com with the details of what needs to be updated.`,
      },
      {
        heading: 'Right to erasure',
        content: `You have the right to ask us to delete your personal data in certain circumstances — for example, if the data is no longer necessary for the purpose it was collected, or if you withdraw consent and there is no other legal basis for processing.\n\nPlease note that we may be required to retain certain records (such as financial or health records) for legal or professional reasons. We will explain this clearly if it applies to your request.\n\nTo request erasure, please email info@lucyhallmassage.com with the subject line "Erasure Request".`,
      },
      {
        heading: 'Right to object',
        content: `You have the right to object to us processing your data for direct marketing purposes at any time. You can also object to processing based on our legitimate interests. To exercise this right, please contact us at info@lucyhallmassage.com.`,
      },
      {
        heading: 'Right to withdraw consent',
        content: `Where we process your data based on consent (for example, for marketing emails or Meta Pixel tracking), you can withdraw that consent at any time. Withdrawing consent does not affect the lawfulness of processing before the withdrawal.`,
      },
      {
        heading: 'How to complain',
        content: `If you are unhappy with how we have handled your data or responded to your request, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):\n\nWebsite: ico.org.uk\nPhone: 0303 123 1113\n\nWe would always appreciate the opportunity to resolve any concerns directly before you contact the ICO, so please do reach out to us first at info@lucyhallmassage.com.`,
      },
    ],
  },
};
