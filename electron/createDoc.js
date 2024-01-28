import PDFKit from 'pdfkit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export async function createDoc(text) {
  // var lineNum = text.split(/\r\n|\r|\n/).length;
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim() !== '');
  text = nonEmptyLines.join('\n');

  const pageWidth = 4 * 72; // 4 * 72 = 288
  const pageHeight = 372;

  let fontSize = 16;
  const lineSpacing = 1;
  let top = 20;

  let loop = true;

  const tempDoc = new PDFKit({
    size: [pageWidth, pageHeight],
    margins: {
      top,
      left: 5,
      right: 5,
      bottom: 5,
    },
  });

  let stringHeight = tempDoc.heightOfString(text, { align: 'center' });
  while (loop) {
    tempDoc.fontSize(fontSize).text(text, { align: 'center' });

    stringHeight = tempDoc.heightOfString(text);

    if (stringHeight < pageHeight - top * 2) {
      top += (315 - stringHeight);

      loop = false;
    } else {
      fontSize--;
    }
  }

  const doc = new PDFKit({
    size: [pageWidth, pageHeight],
    margins: {
      top,
      left: 5,
      right: 5,
      bottom: 5,
    },
  });

  // write the order number at the bottoom of the page in small font

  // doc.font(path.join(__dirname, 'DavidLibre-Regular.ttf'));
  doc.fontSize(fontSize).text(text, { align: 'center' });
  // doc.fontSize(8).text("\n"+ ordernumber);

  const buffer = await new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.end();
  });

  // create a file and return the path
  const tempFolder = fileURLToPath(import.meta.url);
  const tempPdfDir = path.join(tempFolder, 'pdfTemp'); // Path to the pdfTemp directory
  // Check if the pdfTemp directory exists, create if not
  if (!fs.existsSync(tempPdfDir)) {
    fs.mkdirSync(tempPdfDir, { recursive: true });
  }
  const filePath = path.join(tempPdfDir, `${Date.now()}.pdf`);

  // save the file
  fs.writeFileSync(filePath, buffer);

  return filePath;
}
