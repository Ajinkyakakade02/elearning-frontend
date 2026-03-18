import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axiosInstance from './axios.config';
import { tokenManager } from '../utils/tokenManager';
import { showToast } from '../utils/toast';

export interface CertificateData {
  id: string;
  userId: number;
  userName: string;
  courseId: number;
  courseTitle: string;
  instructorName?: string;
  issueDate: string;
  completionPercentage: number;
  grade: string;
  certificateUrl?: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  signatureUrl?: string;
}

class CertificateService {
  private templates: CertificateTemplate[] = [
    {
      id: 'default',
      name: 'Default Template',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
    },
    {
      id: 'premium',
      name: 'Premium Template',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
    },
    {
      id: 'gold',
      name: 'Gold Recognition',
      primaryColor: '#bf9e5f',
      secondaryColor: '#8b7355',
    }
  ];

  /**
   * Generate certificate PDF for passed quiz
   */
  async generateCertificate(
    userName: string,
    courseTitle: string,
    score: number,
    percentage: number,
    quizTitle?: string,
    templateId: string = 'gold'
  ): Promise<Blob> {
    try {
      // Find template (not used but kept for future customization)
      this.templates.find(t => t.id === templateId);
      
      const grade = this.calculateGrade(percentage);
      const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const certId = this.generateCertificateId();

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // Gold border
      pdf.setDrawColor('#bf9e5f');
      pdf.setLineWidth(2);
      pdf.rect(10, 10, width - 20, height - 20);

      // Inner border
      pdf.setDrawColor('#8b7355');
      pdf.setLineWidth(0.5);
      pdf.rect(15, 15, width - 30, height - 30);

      this.addGoldCorners(pdf);

      // Title
      pdf.setFont('times', 'bold');
      pdf.setFontSize(40);
      pdf.setTextColor('#bf9e5f');
      pdf.text('CERTIFICATE', width / 2, 50, { align: 'center' });

      pdf.setFont('times', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor('#666666');
      pdf.text('of Recognition', width / 2, 65, { align: 'center' });

      pdf.setFont('times', 'italic');
      pdf.setFontSize(16);
      pdf.setTextColor('#333333');
      pdf.text('This is to certify that', width / 2, 100, { align: 'center' });

      pdf.setFont('times', 'bold');
      pdf.setFontSize(32);
      pdf.setTextColor('#bf9e5f');
      pdf.text(userName, width / 2, 130, { align: 'center' });

      pdf.setFont('times', 'italic');
      pdf.setFontSize(16);
      pdf.setTextColor('#333333');
      pdf.text('has successfully completed the course', width / 2, 160, { align: 'center' });

      pdf.setFont('times', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor('#8b7355');
      const courseLines = pdf.splitTextToSize(courseTitle, 150);
      pdf.text(courseLines, width / 2, 190, { align: 'center' });

      // Calculate Y position based on quiz title
      let scoreY = 210;
      if (quizTitle) {
        pdf.setFont('times', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor('#666666');
        pdf.text(`Quiz: ${quizTitle}`, width / 2, 210, { align: 'center' });
        scoreY = 220;
      }

      pdf.setFont('times', 'normal');
      pdf.setFontSize(14);
      pdf.setTextColor('#333333');
      pdf.text(`with a score of ${percentage}% (Grade: ${grade})`, width / 2, scoreY, { align: 'center' });

      pdf.setFont('times', 'italic');
      pdf.setFontSize(12);
      pdf.setTextColor('#666666');
      pdf.text(`Issued on: ${issueDate}`, width / 2, scoreY + 20, { align: 'center' });

      // Signatures
      pdf.setLineWidth(0.5);
      pdf.setDrawColor('#bf9e5f');

      pdf.line(width / 2 - 60, height - 50, width / 2 - 20, height - 50);
      pdf.setFont('times', 'italic');
      pdf.setFontSize(10);
      pdf.setTextColor('#666666');
      pdf.text('Authorized Signature', width / 2 - 40, height - 40, { align: 'center' });

      pdf.line(width / 2 + 20, height - 50, width / 2 + 60, height - 50);
      pdf.text('Director', width / 2 + 40, height - 40, { align: 'center' });

      pdf.setFontSize(8);
      pdf.setTextColor('#999999');
      pdf.text(`Certificate ID: ${certId}`, width - 50, height - 15);

      return pdf.output('blob');
    } catch (error) {
      console.error('❌ Failed to generate certificate:', error);
      showToast.error('Failed to generate certificate');
      throw error;
    }
  }

  /**
   * Add decorative gold corners to PDF
   */
  private addGoldCorners(pdf: jsPDF) {
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.setDrawColor('#bf9e5f');
    pdf.setLineWidth(1);

    pdf.line(20, 20, 30, 20);
    pdf.line(20, 20, 20, 30);

    pdf.line(width - 20, 20, width - 30, 20);
    pdf.line(width - 20, 20, width - 20, 30);

    pdf.line(20, height - 20, 30, height - 20);
    pdf.line(20, height - 20, 20, height - 30);

    pdf.line(width - 20, height - 20, width - 30, height - 20);
    pdf.line(width - 20, height - 20, width - 20, height - 30);
  }

  /**
   * Generate certificate using HTML template
   */
  async generateHtmlCertificate(
    userName: string,
    courseTitle: string,
    score: number,
    percentage: number,
    quizTitle?: string,
    templateId: string = 'gold'
  ): Promise<Blob> {
    try {
      const grade = this.calculateGrade(percentage);
      const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const certId = this.generateCertificateId();

      const certificateElement = document.createElement('div');
      certificateElement.innerHTML = `
        <div style="
          width: 297mm;
          height: 210mm;
          padding: 10mm;
          background: white;
          font-family: 'Times New Roman', serif;
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 5mm;
            left: 5mm;
            right: 5mm;
            bottom: 5mm;
            border: 3px solid #bf9e5f;
          "></div>
          
          <div style="
            position: absolute;
            top: 10mm;
            left: 10mm;
            right: 10mm;
            bottom: 10mm;
            border: 1px solid #8b7355;
          "></div>

          <div style="position: absolute; top: 12mm; left: 12mm; width: 10mm; height: 10mm; border-top: 2px solid #bf9e5f; border-left: 2px solid #bf9e5f;"></div>
          <div style="position: absolute; top: 12mm; right: 12mm; width: 10mm; height: 10mm; border-top: 2px solid #bf9e5f; border-right: 2px solid #bf9e5f;"></div>
          <div style="position: absolute; bottom: 12mm; left: 12mm; width: 10mm; height: 10mm; border-bottom: 2px solid #bf9e5f; border-left: 2px solid #bf9e5f;"></div>
          <div style="position: absolute; bottom: 12mm; right: 12mm; width: 10mm; height: 10mm; border-bottom: 2px solid #bf9e5f; border-right: 2px solid #bf9e5f;"></div>

          <div style="
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
          ">
            <h1 style="
              font-size: 48px;
              color: #bf9e5f;
              margin-bottom: 5px;
              font-weight: bold;
              text-transform: uppercase;
            ">CERTIFICATE</h1>

            <h2 style="
              font-size: 28px;
              color: #666;
              margin-bottom: 30px;
              text-transform: uppercase;
            ">of Recognition</h2>

            <p style="
              font-size: 18px;
              color: #333;
              margin-bottom: 20px;
              font-style: italic;
            ">This is to certify that</p>

            <h3 style="
              font-size: 42px;
              color: #bf9e5f;
              margin-bottom: 20px;
              font-weight: bold;
              border-bottom: 2px dashed #bf9e5f;
              border-top: 2px dashed #bf9e5f;
              padding: 10px 30px;
            ">${userName}</h3>

            <p style="
              font-size: 18px;
              color: #333;
              margin-bottom: 15px;
              font-style: italic;
            ">has successfully completed the course</p>

            <h4 style="
              font-size: 32px;
              color: #8b7355;
              margin-bottom: 20px;
              font-weight: bold;
            ">${courseTitle}</h4>

            ${quizTitle ? `
              <p style="
                font-size: 16px;
                color: #666;
                margin-bottom: 15px;
              ">Quiz: ${quizTitle}</p>
            ` : ''}

            <div style="
              font-size: 18px;
              color: #333;
              margin-bottom: 20px;
              background: #f9f3e9;
              padding: 10px 30px;
              border-radius: 50px;
            ">
              <span>with a score of <strong>${percentage}%</strong></span>
              <span style="
                display: inline-block;
                padding: 3px 15px;
                background: #bf9e5f;
                color: white;
                border-radius: 30px;
                margin-left: 10px;
                font-weight: bold;
              ">${grade}</span>
            </div>

            <p style="
              font-size: 16px;
              color: #666;
              margin-bottom: 30px;
            ">Issued on: ${issueDate}</p>

            <div style="
              display: flex;
              justify-content: space-between;
              width: 80%;
              margin-top: 20px;
            ">
              <div style="text-align: center; width: 200px;">
                <div style="width: 100%; height: 2px; background: #bf9e5f; margin-bottom: 5px;"></div>
                <p style="font-size: 12px; color: #666; font-style: italic;">Authorized Signature</p>
              </div>
              <div style="text-align: center; width: 200px;">
                <div style="width: 100%; height: 2px; background: #bf9e5f; margin-bottom: 5px;"></div>
                <p style="font-size: 12px; color: #666; font-style: italic;">Director</p>
              </div>
            </div>

            <p style="
              font-size: 10px;
              color: #999;
              margin-top: 20px;
            ">Certificate ID: ${certId}</p>
          </div>
        </div>
      `;

      certificateElement.style.position = 'absolute';
      certificateElement.style.left = '-9999px';
      certificateElement.style.top = '-9999px';
      document.body.appendChild(certificateElement);

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(certificateElement);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      return pdf.output('blob');
    } catch (error) {
      console.error('❌ Failed to generate HTML certificate:', error);
      throw error;
    }
  }

  /**
   * Save certificate to database
   */
  async saveCertificate(certificateData: Omit<CertificateData, 'id'>): Promise<CertificateData | null> {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        showToast.error('Please login to save certificate');
        return null;
      }

      const response = await axiosInstance.post('/api/certificates', certificateData);
      showToast.success('Certificate saved successfully!');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to save certificate:', error);
      return null;
    }
  }

  /**
   * Get user's certificates
   */
  async getUserCertificates(userId: number): Promise<CertificateData[]> {
    try {
      const token = tokenManager.getToken();
      if (!token) return [];

      const response = await axiosInstance.get(`/api/certificates/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch certificates:', error);

      return [
        {
          id: '1',
          userId: userId,
          userName: 'John Doe',
          courseId: 101,
          courseTitle: 'JavaScript Fundamentals',
          instructorName: 'Dr. Sarah Wilson',
          issueDate: new Date().toISOString(),
          completionPercentage: 100,
          grade: 'A'
        },
        {
          id: '2',
          userId: userId,
          userName: 'John Doe',
          courseId: 102,
          courseTitle: 'React Development',
          instructorName: 'Prof. Michael Chen',
          issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          completionPercentage: 100,
          grade: 'A+'
        },
        {
          id: '3',
          userId: userId,
          userName: 'John Doe',
          courseId: 103,
          courseTitle: 'Data Structures',
          instructorName: 'Dr. Emily Brown',
          issueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          completionPercentage: 100,
          grade: 'A'
        }
      ];
    }
  }

  /**
   * Download certificate
   */
  downloadCertificate(blob: Blob, fileName: string = 'certificate.pdf') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Share certificate on social media
   */
  shareCertificate(percentage: number, courseTitle: string) {
    const text = `I scored ${percentage}% on ${courseTitle}! 🎓`;

    if (navigator.share) {
      navigator.share({
        title: 'My Certificate',
        text: text,
        url: window.location.href
      }).catch(() => {
        this.fallbackShare(text);
      });
    } else {
      this.fallbackShare(text);
    }
  }

  /**
   * Fallback sharing method (copy to clipboard)
   */
  private fallbackShare(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Result copied to clipboard!');
    }).catch(() => {
      showToast.error('Failed to share');
    });
  }

  /**
   * Calculate grade based on percentage
   */
  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  }

  /**
   * Generate unique certificate ID
   */
  private generateCertificateId(): string {
    const prefix = 'CERT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Get available templates
   */
  getTemplates(): CertificateTemplate[] {
    return this.templates;
  }
}

// Fix the export
const certificateServiceInstance = new CertificateService();
export default certificateServiceInstance;