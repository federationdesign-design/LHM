/**
 * Generate Questionnaire PDF — produces a multi-page A4 PDF from
 * questionnaire form data using pdf-lib.
 *
 * Design philosophy for v1:
 * - Functional, clean layout. Lucy will redesign later.
 * - A4 portrait, single column.
 * - Standard Helvetica (built into pdf-lib, no font embedding overhead).
 * - Cover page: logo, title, client name, date, confidentiality note.
 * - Body pages: each form section as a labelled block.
 * - Signature embedded as PNG image in its own section.
 * - Multi-page: content flows naturally onto new pages.
 *
 * Returns a Buffer suitable for use as an email attachment.
 */

import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type QuestionnaireData = {
  // Personal
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  dob?: string;
  postcode?: string;

  // Pregnancy
  pregnancy?: string | null;
  trimester?: string | null;

  // Emergency contact
  emergencyName?: string;
  emergencyNumber?: string;

  // GP
  gpName?: string;
  gpPractice?: string;

  // Medications
  medications?: string;

  // Conditions
  musculoskeletal: string[];
  symptoms: string[];
  history: string[];

  // Cancer
  cancer?: string | null;
  cancerDetails?: string;

  // Hear about
  hearAbout?: string | null;
  hearAboutOther?: string;

  // Notes
  notes?: string;

  // Consent
  consent1: boolean;
  consent2: boolean;
  consent3: boolean;
  declarationConsent: boolean;

  // Signature — base64 data URL (e.g. "data:image/png;base64,iVBORw0KGgo...")
  signature: string;

  // Submission metadata
  submittedAt: Date;
};

// ── PAGE / LAYOUT CONSTANTS ───────────────────────────────────────────────────

// A4 dimensions in points (1pt = 1/72 inch)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// Margins
const MARGIN_X = 50;
const MARGIN_Y = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_X * 2);

// Typography sizes
const SIZE_TITLE = 24;
const SIZE_SUBTITLE = 14;
const SIZE_SECTION = 12;
const SIZE_LABEL = 9;
const SIZE_BODY = 10;
const SIZE_SMALL = 8;

// Spacing
const LINE_HEIGHT = 1.4;
const PARAGRAPH_GAP = 8;
const SECTION_GAP = 16;

// Colours
const BLACK = rgb(0, 0, 0);
const GREY_DARK = rgb(0.3, 0.3, 0.3);
const GREY_MID = rgb(0.5, 0.5, 0.5);

// ── HELPERS ───────────────────────────────────────────────────────────────────

/**
 * Wrap a string to fit within `maxWidth`, returning an array of lines.
 * Greedy wrapping by word — splits on spaces only.
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Format a date as "3 May 2026" for use in the PDF.
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date+time as "3 May 2026 at 14:32" for the submission timestamp.
 */
function formatDateTime(date: Date): string {
  const d = formatDate(date);
  const t = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${d} at ${t}`;
}

// ── DRAWING CONTEXT ───────────────────────────────────────────────────────────

/**
 * A small wrapper around pdf-lib state to track the current cursor position
 * and automatically paginate. Each draw* method returns nothing but advances
 * the internal cursor.
 */
class DrawCtx {
  private doc: PDFDocument;
  private page: PDFPage;
  private regular: PDFFont;
  private bold: PDFFont;
  private italic: PDFFont;
  private cursorY: number;

  constructor(
    doc: PDFDocument,
    page: PDFPage,
    regular: PDFFont,
    bold: PDFFont,
    italic: PDFFont
  ) {
    this.doc = doc;
    this.page = page;
    this.regular = regular;
    this.bold = bold;
    this.italic = italic;
    this.cursorY = PAGE_HEIGHT - MARGIN_Y;
  }

  /** Add a new page and reset cursor. */
  newPage() {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.cursorY = PAGE_HEIGHT - MARGIN_Y;
  }

  /** Ensure there's enough vertical space for `needed` points; add a page if not. */
  ensureSpace(needed: number) {
    if (this.cursorY - needed < MARGIN_Y) {
      this.newPage();
    }
  }

  /** Advance cursor down by `amount` points. */
  advance(amount: number) {
    this.cursorY -= amount;
  }

  /** Draw a section heading. */
  drawSectionHeading(text: string) {
    this.ensureSpace(SIZE_SECTION + PARAGRAPH_GAP + 4);
    this.page.drawText(text.toUpperCase(), {
      x: MARGIN_X,
      y: this.cursorY - SIZE_SECTION,
      size: SIZE_SECTION,
      font: this.bold,
      color: BLACK,
    });
    this.advance(SIZE_SECTION + 4);
    // Underline
    this.page.drawLine({
      start: { x: MARGIN_X, y: this.cursorY - 2 },
      end: { x: MARGIN_X + CONTENT_WIDTH, y: this.cursorY - 2 },
      thickness: 0.5,
      color: GREY_MID,
    });
    this.advance(PARAGRAPH_GAP);
  }

  /** Draw a key-value field. Label is small grey, value is body-sized black. */
  drawField(label: string, value: string) {
    if (!value || value.trim().length === 0) value = '—';
    const valueLines = wrapText(value, this.regular, SIZE_BODY, CONTENT_WIDTH);
    const lineHeight = SIZE_BODY * LINE_HEIGHT;
    const totalHeight = SIZE_LABEL + 2 + (valueLines.length * lineHeight) + 4;

    this.ensureSpace(totalHeight);

    // Label
    this.page.drawText(label.toUpperCase(), {
      x: MARGIN_X,
      y: this.cursorY - SIZE_LABEL,
      size: SIZE_LABEL,
      font: this.bold,
      color: GREY_MID,
    });
    this.advance(SIZE_LABEL + 4);

    // Value (multi-line)
    for (const line of valueLines) {
      this.page.drawText(line, {
        x: MARGIN_X,
        y: this.cursorY - SIZE_BODY,
        size: SIZE_BODY,
        font: this.regular,
        color: BLACK,
      });
      this.advance(lineHeight);
    }
    this.advance(4);
  }

  /** Draw a paragraph of body text with wrapping. */
  drawParagraph(text: string, options: { italic?: boolean; size?: number } = {}) {
    const size = options.size ?? SIZE_BODY;
    const font = options.italic ? this.italic : this.regular;
    const lines = wrapText(text, font, size, CONTENT_WIDTH);
    const lineHeight = size * LINE_HEIGHT;
    this.ensureSpace(lines.length * lineHeight + PARAGRAPH_GAP);
    for (const line of lines) {
      this.page.drawText(line, {
        x: MARGIN_X,
        y: this.cursorY - size,
        size,
        font,
        color: GREY_DARK,
      });
      this.advance(lineHeight);
    }
    this.advance(PARAGRAPH_GAP);
  }

  /** Draw a checkbox-style line: ☑ or ☐ followed by label. Used for consent items. */
  drawConsentLine(checked: boolean, label: string) {
    const lines = wrapText(label, this.regular, SIZE_BODY, CONTENT_WIDTH - 24);
    const lineHeight = SIZE_BODY * LINE_HEIGHT;
    this.ensureSpace(Math.max(14, lines.length * lineHeight) + PARAGRAPH_GAP);

    // Box
    const boxY = this.cursorY - 12;
    this.page.drawRectangle({
      x: MARGIN_X,
      y: boxY,
      width: 10,
      height: 10,
      borderColor: BLACK,
      borderWidth: 0.8,
    });
    if (checked) {
      // Tick mark — simple lines
      this.page.drawLine({
        start: { x: MARGIN_X + 1.5, y: boxY + 5 },
        end: { x: MARGIN_X + 4, y: boxY + 2 },
        thickness: 1,
        color: BLACK,
      });
      this.page.drawLine({
        start: { x: MARGIN_X + 4, y: boxY + 2 },
        end: { x: MARGIN_X + 9, y: boxY + 8 },
        thickness: 1,
        color: BLACK,
      });
    }

    // Label (wrapped if needed)
    let lineY = this.cursorY - SIZE_BODY;
    for (const line of lines) {
      this.page.drawText(line, {
        x: MARGIN_X + 18,
        y: lineY,
        size: SIZE_BODY,
        font: this.regular,
        color: BLACK,
      });
      lineY -= lineHeight;
    }
    this.advance(Math.max(14, lines.length * lineHeight) + 4);
  }

  /** Add vertical space between sections. */
  drawSectionGap() {
    this.advance(SECTION_GAP);
  }

  /** Embed a signature PNG image, scaled to fit a fixed box. */
  async drawSignature(dataUrl: string) {
    if (!dataUrl) {
      this.drawParagraph('(No signature provided)', { italic: true });
      return;
    }

    // Strip "data:image/png;base64," prefix to get raw base64
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const imageBytes = Buffer.from(base64, 'base64');

    let image;
    try {
      image = await this.doc.embedPng(imageBytes);
    } catch {
      this.drawParagraph('(Signature could not be embedded)', { italic: true });
      return;
    }

    // Target box: max 300 wide, 100 tall
    const maxWidth = 300;
    const maxHeight = 100;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    this.ensureSpace(drawHeight + 8);
    this.page.drawImage(image, {
      x: MARGIN_X,
      y: this.cursorY - drawHeight,
      width: drawWidth,
      height: drawHeight,
    });
    this.advance(drawHeight + 8);

    // Signature line beneath
    this.page.drawLine({
      start: { x: MARGIN_X, y: this.cursorY },
      end: { x: MARGIN_X + 300, y: this.cursorY },
      thickness: 0.5,
      color: GREY_MID,
    });
    this.advance(12);
    this.page.drawText('Client signature', {
      x: MARGIN_X,
      y: this.cursorY - SIZE_SMALL,
      size: SIZE_SMALL,
      font: this.italic,
      color: GREY_MID,
    });
    this.advance(SIZE_SMALL + 4);
  }

  /** Draw the cover page — title, client name, date, confidentiality note. */
  /**
   * Embeds the designed cover PDF as page 1 and overlays the client name.
   * The cover at /public/LHM-PDF-cover.pdf provides all visual branding
   * (logo, title, "Confidential" stamp, footer). The only dynamic element
   * we add on top is the client's name.
   *
   * Note: this method assumes `this.page` is the FRESH cover page that's
   * already had the cover PDF embedded (handled in the main generator).
   * It just overlays the name text.
   *
   * Colour is WHITE because the cover has a black background.
   * Position is below the central title block, well above the footer rule.
   */
  drawClientNameOverlay(data: QuestionnaireData) {
    const clientName = `${data.firstName}${data.lastName ? ' ' + data.lastName : ''}`.trim();
    if (!clientName) return;

    // Position: centred horizontally, ~78% down from top of A4.
    // Lands below the central "Lucy Hall Massage / Massage New Patient /
    // Medical Form" title block, well above the horizontal rule near the
    // bottom. Adjust Y if cover design changes.
    const fontSize = 22;
    const nameWidth = this.regular.widthOfTextAtSize(clientName, fontSize);
    this.page.drawText(clientName, {
      x: (PAGE_WIDTH - nameWidth) / 2,
      y: PAGE_HEIGHT - (PAGE_HEIGHT * 0.78),
      size: fontSize,
      font: this.regular,
      color: rgb(1, 1, 1), // WHITE — cover has black background
    });
  }
}

// ── MAIN GENERATOR ────────────────────────────────────────────────────────────

/**
 * Generate the questionnaire PDF.
 * Returns a Buffer suitable for use as an email attachment.
 */
export async function generateQuestionnairePdf(data: QuestionnaireData): Promise<Buffer> {
  const doc = await PDFDocument.create();

  // Standard fonts — built into pdf-lib, no embedding cost
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  // ── PAGE 1: COVER ────────────────────────────────────────────────────────
  // Embed the designed cover PDF from /public/LHM-PDF-cover.pdf and overlay
  // the client's name. The cover provides all visual branding.
  const coverPath = path.join(process.cwd(), 'public', 'LHM-PDF-cover.pdf');
  const coverBytes = await fs.readFile(coverPath);
  const [coverEmbeddedPage] = await doc.embedPdf(coverBytes);
  const coverPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  // Draw the embedded cover scaled to fill the page exactly.
  coverPage.drawPage(coverEmbeddedPage, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });
  // Now overlay the client's name on top of the cover.
  const coverCtx = new DrawCtx(doc, coverPage, regular, bold, italic);
  coverCtx.drawClientNameOverlay(data);

  // ── PAGE 2+: BODY ────────────────────────────────────────────────────────
  const bodyPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const ctx = new DrawCtx(doc, bodyPage, regular, bold, italic);

  // Page header on body pages
  ctx.drawParagraph(
    `${data.firstName}${data.lastName ? ' ' + data.lastName : ''} — Massage New Patient Medical Form`,
    { size: SIZE_LABEL, italic: true }
  );

  // PERSONAL DETAILS
  ctx.drawSectionHeading('Personal details');
  ctx.drawField('First name', data.firstName);
  ctx.drawField('Last name', data.lastName || '');
  ctx.drawField('Email', data.email);
  ctx.drawField('Mobile', data.mobile || '');
  ctx.drawField('Date of birth', data.dob || '');
  ctx.drawField('Postcode', data.postcode || '');
  ctx.drawSectionGap();

  // EMERGENCY CONTACT
  ctx.drawSectionHeading('Emergency contact');
  ctx.drawField('Name', data.emergencyName || '');
  ctx.drawField('Number', data.emergencyNumber || '');
  ctx.drawSectionGap();

  // GP DETAILS
  ctx.drawSectionHeading('GP details');
  ctx.drawField('GP name', data.gpName || '');
  ctx.drawField('GP practice', data.gpPractice || '');
  ctx.drawSectionGap();

  // MEDICATIONS
  ctx.drawSectionHeading('Current medications');
  ctx.drawField('Medications', data.medications || '');
  ctx.drawSectionGap();

  // CONDITIONS
  ctx.drawSectionHeading('Musculoskeletal & pain issues');
  ctx.drawField('Selections', data.musculoskeletal.length > 0 ? data.musculoskeletal.join(', ') : '');
  ctx.drawSectionGap();

  ctx.drawSectionHeading('Symptoms & current conditions');
  ctx.drawField('Selections', data.symptoms.length > 0 ? data.symptoms.join(', ') : '');
  ctx.drawSectionGap();

  ctx.drawSectionHeading('Medical history & illnesses');
  ctx.drawField('Selections', data.history.length > 0 ? data.history.join(', ') : '');
  ctx.drawSectionGap();

  // PREGNANCY
  ctx.drawSectionHeading('Pregnancy');
  ctx.drawField('Currently pregnant', data.pregnancy || '');
  if (data.pregnancy === 'Yes') {
    ctx.drawField('Trimester', data.trimester || '');
  }
  ctx.drawSectionGap();

  // CANCER
  ctx.drawSectionHeading('Cancer / malignancy');
  ctx.drawField('Diagnosis', data.cancer || '');
  if (data.cancer === 'Yes' && data.cancerDetails) {
    ctx.drawField('Details', data.cancerDetails);
  }
  ctx.drawSectionGap();

  // HEAR ABOUT
  ctx.drawSectionHeading('How they heard about us');
  ctx.drawField('Source', data.hearAbout || '');
  if (data.hearAbout === 'Other' && data.hearAboutOther) {
    ctx.drawField('Specified', data.hearAboutOther);
  }
  ctx.drawSectionGap();

  // NOTES
  ctx.drawSectionHeading('Additional notes');
  ctx.drawField('Notes', data.notes || '');
  ctx.drawSectionGap();

  // CONSENT
  ctx.drawSectionHeading('Consent');
  ctx.drawConsentLine(
    data.consent1,
    'Lucy Hall Massage may use my data to send appointment reminders.'
  );
  ctx.drawConsentLine(
    data.consent2,
    'Lucy Hall Massage may send exercises, advice, offers, news and updates.'
  );
  ctx.drawConsentLine(
    data.consent3,
    'I am aware the privacy policy may change and will be notified by email or text of any changes.'
  );
  ctx.drawConsentLine(
    data.declarationConsent,
    'I declare the information provided is accurate at the time of writing, and it is my responsibility to inform the therapist of any changes.'
  );
  ctx.drawSectionGap();

  // SIGNATURE
  ctx.drawSectionHeading('Signature');
  await ctx.drawSignature(data.signature);

  // Convert to Buffer (Node.js Buffer, not browser Uint8Array)
  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
