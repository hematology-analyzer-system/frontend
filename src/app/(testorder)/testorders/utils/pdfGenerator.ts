// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TestOrderRaw, Result, ResultDetails } from '../fetch';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PDFGeneratorOptions {
  order: TestOrderRaw;
  selectedResult?: Result;
  includeAllResults?: boolean;
}

export class TestOrderPDFGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private currentY: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
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

  private addHeader(order: TestOrderRaw): void {
    // Logo placeholder (you can add your clinic logo here)
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('MEDICAL TEST REPORT', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Draw a line
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.doc.internal.pageSize.width - this.margin, this.currentY);
    this.currentY += 10;
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
    //   [`Created By:`, this.extractEmail(order.createBy)],
      [`Run By:`, this.extractEmail(order.runBy)],
      [`Run Date:`, order.runAt ? this.formatDate(order.runAt) : 'N/A']
    ];

    let startY = this.currentY;
    patientInfo.forEach(([label, value], index) => {
      const yPos = startY + (index * 7);
      this.doc.text(label, this.margin, yPos);
      this.doc.text(value, this.margin + 60, yPos);
    });

    this.currentY = startY + (patientInfo.length * 7) + 10;
  }

  private addResultTable(result: Result, resultIndex?: number): void {
    this.checkPageBreak(60);

    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    const title = resultIndex !== undefined 
      ? `TEST RESULT #${resultIndex + 1} (ID: ${result.id})`
      : `TEST RESULT (ID: ${result.id})`;
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;

    // Prepare table data
    const tableData = result.detailResults.map((detail: ResultDetails) => [
      detail.paramName,
      detail.value.toString(),
      detail.unit || '',
      `${detail.rangeMin} - ${detail.rangeMax}`,
      this.isValueInRange(detail.value, detail.rangeMin, detail.rangeMax) ? 'Normal' : 'Abnormal'
    ]);

    // Create table
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Parameter', 'Value', 'Unit', 'Reference Range', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      bodyStyles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' }
      },
      didDrawCell: (data: any) => {
        // Highlight abnormal values in red
        if (data.column.index === 4 && data.cell.text[0] === 'Abnormal') {
          this.doc.setFillColor(255, 200, 200);
        }
      }
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
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

    result.comment_result.forEach((comment, index) => {
      this.checkPageBreak(20);
      
      const commentText = `${index + 1}. ${comment.content}`;
      const commentBy = `   - By: ${this.extractEmail(comment.createdBy)} on ${this.formatDate(comment.createdAt)}`;
      
      const splitComment = this.doc.splitTextToSize(commentText, this.doc.internal.pageSize.width - 2 * this.margin);
      this.doc.text(splitComment, this.margin, this.currentY);
      this.currentY += splitComment.length * 5;
      
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(commentBy, this.margin, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.currentY += 8;
    });

    this.currentY += 5;
  }

  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Add page number
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.doc.internal.pageSize.width - this.margin - 20,
        this.doc.internal.pageSize.height - 10
      );
      
      // Add generation date
      this.doc.text(
        `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        this.margin,
        this.doc.internal.pageSize.height - 10
      );
    }
  }

  public generatePDF(options: PDFGeneratorOptions): void {
    const { order, selectedResult, includeAllResults = false } = options;

    // Add header and patient info
    this.addHeader(order);
    this.addPatientInfo(order);

    if (includeAllResults && order.results && order.results.length > 0) {
      // Generate PDF with all results
      order.results.forEach((result, index) => {
        if (index > 0) {
          this.doc.addPage();
          this.currentY = this.margin;
        }
        this.addResultTable(result, index);
        this.addComments(result);
      });
    } else if (selectedResult) {
      // Generate PDF with only selected result
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
export const generateTestOrderPDF = (
  order: TestOrderRaw,
  selectedResult?: Result,
  includeAllResults: boolean = false,
  preview: boolean = false
): void => {
  const generator = new TestOrderPDFGenerator();
  generator.generatePDF({ order, selectedResult, includeAllResults });
  
  if (preview) {
    generator.preview();
  } else {
    const filename = `TestOrder_${order.testId}_${order.fullName?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    generator.save(filename);
  }
};