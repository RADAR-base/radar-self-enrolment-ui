/* 

This is a temporary solution for the PAPrKA study. A proper email service to deal with enrolment, study completion, consent forms and so on is required.

*/

import path from "path"
import { sendMail } from "./send"
import { promises as fs } from 'fs';
import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFPage,
  degrees,
  PDFFont,
} from 'pdf-lib';

const PDF_TEMPLATE = '/public/study/paprka/resources/consent_form.pdf';

const PDF_PAGE: Record<string, number> = {
  date: 1,
  first_name: 1,
  last_name: 1,
  signature: 2,
  'M-Confirmed read': 0,
  'M-Ack vol involvement': 0,
  'M-Ack understand involvement': 0,
  'M-Permission to collect PGHD': 0,
  'M-Permission to create joined dataset': 0,
  'M-Permission to access/work with NJR': 0,
  'M-Agree data in publications': 0,
  'M-Ack regulatory access': 1,
  'M-Agree take part': 1,
  'O-Agree UoM holding data': 1,
  'O-Prize draw': 1,
  'O-Contact future': 1,
  'O-Summary findings': 1,
  'O-Newsletter': 1,
};

type Point = [number, number];
type Rect = [number, number, number, number];

const PDF_COORDS: Record<string, Point | Rect> = {
  date: [400, 715],
  first_name: [75, 715],
  last_name: [230, 715],
  signature: [70, 180, 510, 280],
  'M-Confirmed read': [500, 226],
  'M-Ack vol involvement': [500, 310],
  'M-Ack understand involvement': [500, 386],
  'M-Permission to collect PGHD': [500, 450],
  'M-Permission to create joined dataset': [500, 556],
  'M-Permission to access/work with NJR': [500, 664],
  'M-Agree data in publications': [500, 718],
  'M-Ack regulatory access': [500, 100],
  'M-Agree take part': [500, 150],
  'O-Agree UoM holding data': [500, 260],
  'O-Prize draw': [500, 340],
  'O-Contact future': [500, 400],
  'O-Summary findings': [500, 440],
  'O-Newsletter': [500, 480],
};

const enrolHtmlContent = `<p>Hello,</p>
<p>Thank you for agreeing to take part in the PAPrKA study.</p>
<p><strong>Please see attached your consent form and a copy of the study's Participant information Sheet. </strong></p>
<p>If you have any questions or need assistance, you can contact us on <a href="mailto:paprka@manchester.ac.uk">paprka@manchester.ac.uk</a></p>
<p>Thank you again for your interest in the PAPrKA study.</p>
<p>Best regards,</p>
<p>PAPrKA Team</p>`

const finishHtmlContent = `<p>Hello,</p>
<p>Thank you for completing the PAPrKA study!</p>
<p>Key information recap</p>
<p>The study is being led by The <strong>University of Manchester </strong>in partnership with <strong>King&rsquo;s College London</strong>. We will join 3 pieces of information when carrying out our research: That will include:</p>
<ol>
<li>Information you have provided to us.</li>
<li><u>A one-time</u> collection of your <strong>physical activity information</strong></li>
<li>Your <strong>knee replacement information</strong></li>
</ol>
<p>The research team will work on the joined information within the secure research environment of the National Joint Registry. Read more about our research on the <a href="https://sep.radar-base.net/kratos-ui/paprka">PAPrKA website</a></p>
<p><strong>What happens next?</strong></p>
<p>No further action is required, and no additional data will be collected from you in the future.</p>
<p>If we are not able to include your information in our research, you will be notified by email.</p>
<p>We are grateful for your involvement in helping us gain a deeper understanding of recovery after knee replacement surgery. Your contribution is invaluable in supporting better-informed decisions for patients and doctors in the future.&nbsp;</p>
<p>If you have any questions or need assistance, you can contact us on <a href="mailto:paprka@manchester.ac.uk">paprka@manchester.ac.uk</a></p>
<p>Best regards,</p>
<p>PAPrKA Team</p>`


function adaptY(page: PDFPage, y: number): number {
  return page.getHeight() - y;
}

function adaptPoint(page: PDFPage, [x, y]: Point) {
  return { x, y: adaptY(page, y) };
}

function drawTick(page: PDFPage, anchor: Point) {
  const p1 = adaptPoint(page, anchor);
  const p2 = adaptPoint(page, [anchor[0] + 10, anchor[1] + 10]);
  const p3 = adaptPoint(page, [anchor[0] + 30, anchor[1] - 10]);

  const thickness = 2;
  page.drawLine({ start: p1, end: p2, thickness, color: rgb(0, 0, 0) });
  page.drawLine({ start: p2, end: p3, thickness, color: rgb(0, 0, 0) });
}

function drawBezierTick(page: PDFPage, anchor: Point, scale = 1.0, thickness = 2) {
  const [x, yTop] = anchor;
  const y = adaptY(page, yTop) + 16;
  const pathData = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';
  page.drawSvgPath(pathData, {
    x,
    y,
    borderColor: rgb(0, 0, 0),
    borderWidth: thickness,
    scale: 1,
  });
}

async function drawSignature(
  pdfDoc: PDFDocument,
  page: PDFPage,
  rect: Rect,
  dataUrl: string,
) {
  const bytes = Buffer.from(dataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  // pdf-lib can work out PNG vs JPG automatically
  const img = dataUrl.includes('jpeg') || dataUrl.includes('jpg')
    ? await pdfDoc.embedJpg(bytes)
    : await pdfDoc.embedPng(bytes);

  const [rx0, ry0, rx1, ry1] = rect;
  const rectWidth = rx1 - rx0;
  const rectHeight = ry1 - ry0;

  // Keep aspect ratio & fit inside the rectangle
  const scale = Math.min(rectWidth / img.width, rectHeight / img.height);
  const width = img.width * scale;
  const height = img.height * scale;

  const x = rx0 + (rectWidth - width) / 2;
  const yTopBased = ry0 + (rectHeight - height) / 2;
  const y = adaptY(page, yTopBased + height); // convert to bottom-left

  page.drawImage(img, { x, y, width, height });
}

async function drawText(
  pdfDoc: PDFDocument,
  page: PDFPage,
  pt: Point,
  text: string,
  font?: PDFFont,
) {
  const f = font ?? (await pdfDoc.embedFont(StandardFonts.Helvetica));
  const { x, y } = adaptPoint(page, pt);
  page.drawText(text, { x, y, size: 11, font: f });
}

function getConsentItems(paprka: any) {
  const {first_name, last_name, date, signature, ...items} = paprka.consent
  return items
}

function getPaprkaProject(user: any) {
  return user['identity']['traits']['projects'][0]
}

export async function generateConsentPdf(user: any): Promise<Uint8Array> {
  const templateBytes = await fs.readFile(path.join(process.cwd(), PDF_TEMPLATE));
  const pdfDoc = await PDFDocument.load(templateBytes);
  const paprka = getPaprkaProject(user);
  const consentItems = getConsentItems(paprka);
  const consentMeta = paprka.consent;

  // Tick every selected checkbox
  for (const [key, isChecked] of Object.entries(consentItems)) {
    if (!isChecked) continue;

    const page = pdfDoc.getPage(PDF_PAGE[key]);
    drawBezierTick(page, PDF_COORDS[key] as Point);
  }

  // Text fields
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textFields = [
    'first_name',
    'last_name',
    'date',
  ];
  for (const name of textFields) {
    const page = pdfDoc.getPage(PDF_PAGE[name]);
    await drawText(
      pdfDoc,
      page,
      PDF_COORDS[name] as Point,
      consentMeta[name],
      font,
    );
  }

  // Signature image
  const sigPage = pdfDoc.getPage(PDF_PAGE.signature);
  await drawSignature(
    pdfDoc,
    sigPage,
    PDF_COORDS.signature as Rect,
    consentMeta.signature /* data-URL string */,
  );
  // Serialize
  const output = await pdfDoc.save(); // Uint8Array
  await pdfDoc.flush();
  return output;
}


export async function paprkaEmailOnEnrol(
  user: any,
) {
  const user_address = user['identity']['traits']['email']

  await sendMail({
    to: user_address,
    fromName: 'PAPrKA Study',
    subject: 'Your consent form for participating in the PAPrKA Study.',
    html: enrolHtmlContent,
    attachments: [
      {
        'filename': 'participant_information_sheet.pdf',
        'path': path.join(process.cwd(), '/public/study/paprka/resources/paprka_pis.pdf')
      },
      {
        'filename': 'paprka_consent_form.pdf',
        'content': Buffer.from(await generateConsentPdf(user)),
        'contentType': 'application/pdf'
      }
    ]
  })
}


export async function paprkaEmailOnFinish(
  user: any
) {
  const user_address = user['identity']['traits']['email']
  return await sendMail({
    to: user_address,
    fromName: 'PAPrKA Study',
    subject: 'Thank you for participating in the PAPrKA Study.',
    html: finishHtmlContent,
  })
}