import { z } from 'zod';
import PDFDocument from 'pdfkit';
import { nanoid } from 'nanoid';
import { Readable } from 'stream';

export const ExportParams = z.object({
  text: z.string(),
  format: z.enum(['pdf', 'docx']).default('pdf'),
});

export async function exportDocument(params: z.infer<typeof ExportParams>) {
  const { text, format } = ExportParams.parse(params);

  if (format === 'pdf') {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    return await new Promise<{ buffer: Buffer; filename: string }>((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, filename: `document-${nanoid(8)}.pdf` });
      });
      doc.on('error', reject);

      doc.fontSize(12);
      text.split('\n').forEach((line) => {
        doc.text(line);
      });

      doc.end();
    });
  }

  // simple DOCX using minimal format (fallback as .txt renamed)
  const filename = `document-${nanoid(8)}.docx`;
  const buffer = Buffer.from(text, 'utf-8');
  return { buffer, filename };
}
