// utils/simplePdfGenerator.ts
import jsPDF from 'jspdf';
import { TestOrderRaw, Result, ResultDetails } from '../fetch';

interface PDFGeneratorOptions {
  order: TestOrderRaw;
  selectedResult?: Result;
  includeAllResults?: boolean;
}

export class SimpleTestOrderPDFGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.currentY = this.margin;
  }

  private formatDate(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  }

  private extractEmail(runBy: string | null): string {
    if (!runBy) return 'N/A';
    const match = runBy.match(/Email:\s*([^|]+)/);
    return match ? match[1] : runBy;
  }

  private checkPageBreak(requiredHeight: number): void {
    if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }
  private sanitizeText(text: string): string {
    // Replace Unicode characters that jsPDF doesn't handle well
    return text
      .replace(/¼/g, 'µ')  // Replace Greek mu with micro sign
  }
  private addHeader(order: TestOrderRaw): void {
    // Top section with logo/name
    this.doc.setFillColor(230, 240, 250); // Light blue background
    this.doc.rect(0, 0, this.pageWidth, 30, 'F'); // Header background

    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0); // Black text for main title
    this.doc.text('HEALTHCARE', this.margin + 5, 15);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(50, 50, 50); // Darker grey for contact info
    this.doc.text('0123456789 | 0912345678', this.pageWidth - this.margin - 35, 15);
    this.doc.text('healthcare123@health.com', this.pageWidth - this.margin - 35, 19);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 100, 0); // Green for tagline
    this.doc.text('Accurate | Caring | Instant', this.margin + 5, 20);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(50, 50, 50);
    this.doc.text('Ly Thuong Kiet, Dien Hong, Ho Chi Minh city, Viet Nam', this.margin + 5, 25);
    this.doc.text('www.healthcare.com', this.pageWidth - this.margin - 25, 25);

    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, 30, this.pageWidth - this.margin, 30); // Line under header

    this.currentY = 45;
  }


  private addPatientInfo(order: TestOrderRaw): void {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PATIENT INFORMATION', this.margin, this.currentY);
    this.currentY += 10;

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    const patientInfo = [
      [`Full Name:`, order.fullName || 'N/A'],
      [`Age:`, `${new Date().getFullYear() - new Date(order.dateOfBirth).getFullYear() || 'N/A'} years`],
      [`Gender:`, order.gender || 'N/A'],
      [`Phone:`, order.phone || 'N/A'],
      [`Status:`, order.status || 'N/A'],
    //   [`Created By:`, this.extractEmail(order.createdBy)],
      [`Run By:`, this.extractEmail(order.runBy)],
      [`Run Date:`, order.runAt ? this.formatDate(order.runAt) : 'N/A']
    ];

    let startY = this.currentY;
    patientInfo.forEach(([label, value], index) => {
      const yPos = startY + (index * 7);
      this.doc.text(label, this.margin, yPos);
      this.doc.text(value, this.margin + 60, yPos);
    });

    this.currentY = startY + (patientInfo.length * 7) + 15;
  }

  private drawTable(headers: string[], data: string[][], startY: number): number {
    const colWidths = [30, 30, 40, 40, 35]; // Adjust column widths as needed
    const rowHeight = 8;
    const headerHeight = 10;
    
    let currentX = this.margin;
    let currentTableY = startY;

    // Draw header background
    this.doc.setFillColor(41, 128, 185);
    this.doc.rect(this.margin, currentTableY, colWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');

    // Draw header text
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    
    headers.forEach((header, index) => {
      this.doc.text(this.sanitizeText(header), currentX + 2, currentTableY + 7);
      currentX += colWidths[index];
    });

    currentTableY += headerHeight;
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');

    // Draw data rows
    data.forEach((row, rowIndex) => {
      currentX = this.margin;
      
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(248, 248, 248);
        this.doc.rect(this.margin, currentTableY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      }

      // Check if value is abnormal and highlight
      const isAbnormal = row[4] === 'Abnormal';
      if (isAbnormal) {
        this.doc.setFillColor(255, 200, 200);
        this.doc.rect(this.margin, currentTableY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      }

      row.forEach((cell, colIndex) => {
        this.doc.text(this.sanitizeText(cell), currentX + 2, currentTableY + 6);
        currentX += colWidths[colIndex];
      });

      currentTableY += rowHeight;
    });

    // Draw table borders
    this.doc.setLineWidth(0.3);
    
    // Horizontal lines
    for (let i = 0; i <= data.length + 1; i++) {
      const y = startY + (i === 0 ? headerHeight : headerHeight + (i - 1) * rowHeight);
      this.doc.line(this.margin, y, this.margin + colWidths.reduce((a, b) => a + b, 0), y);
    }

    // Vertical lines
    currentX = this.margin;
    for (let i = 0; i <= colWidths.length; i++) {
      this.doc.line(currentX, startY, currentX, currentTableY);
      if (i < colWidths.length) currentX += colWidths[i];
    }

    return currentTableY + 10;
  }

  private addResultTable(result: Result, resultIndex?: number): void {
    this.checkPageBreak(80);

    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const title = resultIndex !== undefined 
      ? `TEST RESULT #${resultIndex + 1} (ID: ${result.id})`
      : `TEST RESULT (ID: ${result.id})`;
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;

    // Prepare table data
    const headers = ['Parameter', 'Value', 'Unit', 'Reference Range', 'Status'];
    const tableData = result.detailResults.map((detail: ResultDetails) => [
      detail.paramName,
      detail.value.toString(),
      detail.unit || '',
      `${detail.rangeMin} - ${detail.rangeMax}`,
      this.isValueInRange(detail.value, detail.rangeMin, detail.rangeMax) ? 'Normal' : 'Abnormal'
    ]);

    this.currentY = this.drawTable(headers, tableData, this.currentY);
  }

  private isValueInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  private addComments(result: Result): void {
    if (!result.comment_result || result.comment_result.length === 0) {
      return;
    }

    this.checkPageBreak(40);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('COMMENTS:', this.margin, this.currentY);
    this.currentY += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    const comment = result.comment_result[result.comment_result.length-1];
      this.checkPageBreak(20);
      
      const commentText = `${comment.content}`;
      const commentBy = ` By: ${this.extractEmail(comment.createdBy)} on ${this.formatDate(comment.createdAt)}`;
      
      // Handle text wrapping
      const splitComment = this.doc.splitTextToSize(commentText, this.pageWidth - 2 * this.margin);
      this.doc.text(splitComment, this.margin, this.currentY);
      this.currentY += splitComment.length * 5;
      
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(commentBy, this.margin, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.currentY += 8;

    this.currentY += 5;
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 30; // Position above page number
    const signatureLineY = footerY + 15;

    this.doc.setLineWidth(0.2);
    this.doc.setDrawColor(0, 0, 0);

    const signatureBlockWidth = 50;
    const spacing = (this.pageWidth - 2 * this.margin - 3 * signatureBlockWidth) / 2;

    
    // Footer bottom strip
    this.doc.setFillColor(0, 100, 150); // Darker blue strip
    this.doc.rect(0, this.pageHeight - 15, this.pageWidth, 15, 'F');

    this.doc.setFontSize(8);
    this.doc.setTextColor(255, 255, 255); // White text for footer

    this.doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, this.margin + 5, this.pageHeight - 10);
    this.doc.text('Sample Collection', this.pageWidth / 2 - 15, this.pageHeight - 10);
    this.doc.text('0123456789', this.pageWidth - this.margin - 15, this.pageHeight - 10);
  }


  public generatePDF(options: PDFGeneratorOptions): void {
    const { order, selectedResult, includeAllResults = false } = options;

    this.addHeader(order);
    this.addPatientInfo(order);

    if (includeAllResults && order.results && order.results.length > 0) {
      order.results.forEach((result, index) => {
        if (index > 0) {
          this.doc.addPage();
          this.currentY = this.margin;
        }
        this.addResultTable(result, index);
        this.addComments(result);
      });
    } else if (selectedResult) {
      this.addResultTable(selectedResult);
      this.addComments(selectedResult);
    }

    this.addFooter();
  }

  public save(filename: string): void {
    this.doc.save(filename);
  }

  public preview(): void {
    window.open(this.doc.output('bloburl'), '_blank');
  }
}

// Helper function to generate and download PDF
export const generateSimpleTestOrderPDF = (
  order: TestOrderRaw,
  selectedResult?: Result,
  includeAllResults: boolean = false,
  preview: boolean = false
): void => {
  const generator = new SimpleTestOrderPDFGenerator();
  generator.generatePDF({ order, selectedResult, includeAllResults });
  
  if (preview) {
    generator.preview();
  } else {
    const filename = `TestOrder_${order.testId}_${order.fullName?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    generator.save(filename);
  }
};