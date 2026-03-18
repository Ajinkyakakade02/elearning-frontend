// ============================================
// COURSE TYPES - For courses, lessons, enrollments
// ============================================

/**
 * Course interface - Represents a course from the backend
 * All fields match what the Spring Boot API returns
 */
export interface Course {
  // Core course information
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;        // ✅ This matches your components
  instructorName: string;       // ✅ This matches your components
  categoryName: string;         // ✅ This matches your components
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;        // ✅ This matches your components
  totalLessons: number;         // ✅ This matches your components
  
  // 👈 NOTE: All courses are now ₹99/-
  price: number;                // Always 99
  
  rating: number;
  totalStudents: number;        // ✅ This matches your components
  isPublished: boolean;
  
  // Timestamp fields
  createdAt?: string;
  updatedAt?: string;
  
  // Backend might send these as well
  instructor?: {
    id: number;
    fullName: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

/**
 * Lesson interface - Represents a single lesson in a course
 */
export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl?: string;
  durationMinutes: number;
  lessonOrder: number;
  isPreview: boolean;
}

/**
 * Enrollment interface - Tracks user's course enrollment
 */
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  completedLessons: string;
  enrolledAt: string;
  completedAt?: string;
  lastAccessed?: string;
  course?: Course;
}

/**
 * Progress interface - Tracks user's progress in lessons
 */
export interface Progress {
  id: number;
  userId: number;
  lessonId: number;
  courseId: number;
  isCompleted: boolean;
  watchDurationSeconds: number;
  lastPositionSeconds: number;
  notes?: string;
  completedAt?: string;
  lastAccessed: string;
}

/**
 * Category interface - Course categories
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

/**
 * EnrollmentResponse interface - API response for enrollments
 */
export interface EnrollmentResponse {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  completedLessons: string;
  enrolledAt: string;
  completedAt: string | null;
  lastAccessed: string;
  course?: Course;
}

// 👈 ADDED: Price constants
export const COURSE_PRICE = 99;
export const COURSE_PRICE_DISPLAY = '₹99/-';