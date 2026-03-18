// ============================================
// CERTIFICATE TYPES
// ============================================

export interface Certificate {
  id: string;
  userId: number;
  userName: string;
  courseId: number;
  courseTitle: string;
  issueDate: string;
  completionPercentage: number;
  instructorName?: string;
  grade?: string;
}

export interface CertificateData {
  userName: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
  instructorName?: string;
  courseDuration?: string;
}