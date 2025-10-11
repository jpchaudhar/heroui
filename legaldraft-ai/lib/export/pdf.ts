import jsPDF from 'jspdf';

export function exportToPDF(content: string, fileName: string, addWatermark: boolean = false) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add watermark for free tier
  if (addWatermark) {
    doc.setFontSize(60);
    doc.setTextColor(200, 200, 200);
    doc.text('LEGALDRAFT AI', 105, 150, {
      align: 'center',
      angle: 45,
    });
  }

  // Reset text settings
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  // Add content with proper formatting
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  const lines = doc.splitTextToSize(content, maxWidth);
  let y = margin;

  lines.forEach((line: string) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
      
      // Add watermark to new page if needed
      if (addWatermark) {
        doc.setFontSize(60);
        doc.setTextColor(200, 200, 200);
        doc.text('LEGALDRAFT AI', 105, 150, {
          align: 'center',
          angle: 45,
        });
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
      }
    }
    doc.text(line, margin, y);
    y += 7;
  });

  // Save the PDF
  doc.save(fileName);
}
