// src/services/api.config.ts

/**
 * API Endpoints Configuration
 * Centralized place for all backend API endpoints
 */

export const API_ENDPOINTS = {



  // ============================================
  // AUTHENTICATION ENDPOINTS
  // ============================================
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    CHECK_EMAIL: '/auth/check-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    RESEND_OTP: '/auth/resend-otp',
    CHANGE_PASSWORD: '/auth/change-password',
    GOOGLE: '/auth/google',
    GITHUB: '/auth/github',
    GOOGLE_CALLBACK: '/auth/google/callback',
    GITHUB_CALLBACK: '/auth/github/callback',
  },

  // ============================================
  // USERS ENDPOINTS
  // ============================================
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPDATE_AVATAR: '/users/profile/avatar',
    MY_COURSES: '/users/courses',
    MY_ENROLLMENTS: '/users/enrollments',
    PROGRESS: '/users/progress',
    STATS: '/users/stats',
    ALL_USERS: '/users',
    USER_BY_ID: (id: number) => `/users/${id}`,
    UPDATE_USER: (id: number) => `/users/${id}`,
    DELETE_USER: (id: number) => `/users/${id}`,
  },

  // ============================================
  // COURSES ENDPOINTS
  // ============================================
  COURSES: {
    // ✅ FIXED: Added ALL endpoint that your useQuiz.ts is looking for
    ALL: '/courses/public',
    GET_ALL: '/courses/public',
    GET_PUBLIC: '/courses/public',
    GET_BY_ID: (id: number) => `/courses/${id}`,
    GET_BY_CATEGORY: (categoryId: number) => `/courses/category/${categoryId}`,
    SEARCH: '/courses/search',
    ENROLL: (courseId: number) => `/courses/${courseId}/enroll`,
    CHECK_ENROLLMENT: (courseId: number) => `/courses/${courseId}/enrollment-status`,
    GET_LESSONS: (courseId: number) => `/courses/${courseId}/lessons`,
    GET_LESSON: (courseId: number, lessonId: number) => `/courses/${courseId}/lessons/${lessonId}`,
    UPDATE_LESSON_PROGRESS: (courseId: number, lessonId: number) => `/courses/${courseId}/lessons/${lessonId}/progress`,
    GET_COURSE_PROGRESS: (courseId: number) => `/courses/${courseId}/progress`,
    GET_REVIEWS: (courseId: number) => `/courses/${courseId}/reviews`,
    ADD_REVIEW: (courseId: number) => `/courses/${courseId}/reviews`,
    CREATE_COURSE: '/courses',
    UPDATE_COURSE: (id: number) => `/courses/${id}`,
    DELETE_COURSE: (id: number) => `/courses/${id}`,
    ADD_LESSON: (courseId: number) => `/courses/${courseId}/lessons`,
    UPDATE_LESSON: (courseId: number, lessonId: number) => `/courses/${courseId}/lessons/${lessonId}`,
    DELETE_LESSON: (courseId: number, lessonId: number) => `/courses/${courseId}/lessons/${lessonId}`,
    PUBLISH_COURSE: (id: number) => `/courses/${id}/publish`,
    UNPUBLISH_COURSE: (id: number) => `/courses/${id}/unpublish`,
  },

  // ============================================
  // QUIZZES ENDPOINTS (PLURAL - matches your code)
  // ============================================
  QUIZZES: {
    // Basic CRUD
    GET_ALL: '/quiz',
    GET_BY_ID: (id: number) => `/quiz/${id}`,
    GET_BY_CATEGORY: (category: string) => `/quiz/category/${category}`,
    
    // ✅ FIXED: Added BY_COURSE endpoint
    BY_COURSE: (courseId: number) => `/quiz/course/${courseId}`,
    
    // ✅ FIXED: Added BY_LESSON endpoint
    BY_LESSON: (lessonId: number) => `/quiz/lesson/${lessonId}`,
    
    // Quiz taking
    START: (quizId: number) => `/quiz/${quizId}/start`,
    SUBMIT: (attemptId: number) => `/quiz/attempt/${attemptId}/submit`,
    GET_QUESTIONS: (quizId: number) => `/quiz/${quizId}/questions`,
    
    // Attempts and results
    ATTEMPT: (quizId: number) => `/quiz/${quizId}/attempt`,
    RESULTS: (attemptId: number) => `/quiz/attempt/${attemptId}/results`,
    MY_ATTEMPTS: '/quiz/attempts',
    MY_ATTEMPT_BY_QUIZ: (quizId: number) => `/quiz/${quizId}/my-attempts`,
    
    // ✅ FIXED: Added ATTEMPTS endpoint
    ATTEMPTS: (quizId: number) => `/quiz/${quizId}/attempts`,
    
    // Topic-based quizzes
    DSA_TOPICS: '/quiz/dsa/topics',
    DSA_TOPIC: (topic: string) => `/quiz/dsa/${topic}`,
    JEE_TOPICS: '/quiz/jee/topics',
    JEE_SUBJECT: (subject: string) => `/quiz/jee/${subject}`,
    NEET_TOPICS: '/quiz/neet/topics',
    NEET_SUBJECT: (subject: string) => `/quiz/neet/${subject}`,
    UPSC_TOPICS: '/quiz/upsc/topics',
    UPSC_SUBJECT: (subject: string) => `/quiz/upsc/${subject}`,
    MHTCET_TOPICS: '/quiz/mhtcet/topics',
    MHTCET_SUBJECT: (subject: string) => `/quiz/mhtcet/${subject}`,
    
  },

  // ============================================
  // ENROLLMENTS ENDPOINTS (PLURAL - matches your code)
  // ============================================
  ENROLLMENTS: {
    ENROLL: '/enrollments',
    MY_COURSES: '/enrollments/my-courses',
    GET_MY_ENROLLMENTS: '/enrollments',
    GET_BY_ID: (id: number) => `/enrollments/${id}`,
    GET_BY_COURSE: (courseId: number) => `/enrollments/course/${courseId}`,
    CHECK_ENROLLMENT: (courseId: number) => `/enrollments/check/${courseId}`,
    
    // ✅ FIXED: Added PROGRESS endpoint
    PROGRESS: (courseId: number) => `/enrollments/course/${courseId}/progress`,
    
    UPDATE_PROGRESS: (enrollmentId: number) => `/enrollments/${enrollmentId}/progress`,
    COMPLETE_COURSE: (enrollmentId: number) => `/enrollments/${enrollmentId}/complete`,
  },

  // ============================================
  // PAYMENT ENDPOINTS
  // ============================================
  PAYMENT: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY_PAYMENT: '/payments/verify',
    PURCHASE_COURSE: (courseId: number) => `/payments/course/${courseId}`,
    PURCHASE_QUIZ: (quizId: number) => `/payments/quiz/${quizId}`,
    PURCHASE_BUNDLE: '/payments/bundle',
    HISTORY: '/payments/history',
    GET_BY_ID: (id: number) => `/payments/${id}`,
    USER_PAYMENTS: '/payments/user',
    CHECK_STATUS: (transactionId: string) => `/payments/status/${transactionId}`,
  },

  // ============================================
  // WISHLIST ENDPOINTS
  // ============================================
  WISHLIST: {
    GET_MY_WISHLIST: '/wishlist',
    ADD_TO_WISHLIST: (courseId: number) => `/wishlist/add/${courseId}`,
    REMOVE_FROM_WISHLIST: (courseId: number) => `/wishlist/remove/${courseId}`,
    CHECK_IN_WISHLIST: (courseId: number) => `/wishlist/check/${courseId}`,
    CLEAR_WISHLIST: '/wishlist/clear',
  },

  // ============================================
  // CERTIFICATE ENDPOINTS
  // ============================================
  CERTIFICATE: {
    GET_MY_CERTIFICATES: '/certificates',
    GET_BY_ID: (id: number) => `/certificates/${id}`,
    GET_BY_COURSE: (courseId: number) => `/certificates/course/${courseId}`,
    GENERATE: (courseId: number) => `/certificates/generate/${courseId}`,
    DOWNLOAD: (id: number) => `/certificates/${id}/download`,
    VERIFY: (certificateNumber: string) => `/certificates/verify/${certificateNumber}`,
  },

  // ============================================
  // CATEGORY ENDPOINTS
  // ============================================
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: (id: number) => `/categories/${id}`,
    GET_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    GET_COURSES: (categoryId: number) => `/categories/${categoryId}/courses`,
  },

  // ============================================
  // PROGRESS ENDPOINTS
  // ============================================
  PROGRESS: {
    GET_COURSE_PROGRESS: (courseId: number) => `/progress/course/${courseId}`,
    GET_LESSON_PROGRESS: (courseId: number, lessonId: number) => `/progress/course/${courseId}/lesson/${lessonId}`,
    UPDATE_WATCH_TIME: (courseId: number, lessonId: number) => `/progress/course/${courseId}/lesson/${lessonId}/watch`,
    MARK_COMPLETED: (courseId: number, lessonId: number) => `/progress/course/${courseId}/lesson/${lessonId}/complete`,
    GET_OVERALL_STATS: '/progress/stats',
  },

  // ============================================
  // NOTIFICATION ENDPOINTS
  // ============================================
  NOTIFICATIONS: {
    GET_MY_NOTIFICATIONS: '/notifications',
    MARK_AS_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/notifications/read-all',
    DELETE: (id: number) => `/notifications/${id}`,
    GET_UNREAD_COUNT: '/notifications/unread/count',
  },

  // ============================================
  // ANNOUNCEMENT ENDPOINTS
  // ============================================
  ANNOUNCEMENTS: {
    GET_ALL: '/announcements',
    GET_BY_ID: (id: number) => `/announcements/${id}`,
    GET_LATEST: '/announcements/latest',
  },

  // ============================================
  // STATIC DATA ENDPOINTS
  // ============================================
  STATIC: {
    EXAM_SECTIONS: '/static/exam-sections',
    DSA_TOPICS: '/static/dsa-topics',
    FAQ: '/static/faq',
    PRICING: '/static/pricing',
  },

  DSA: {
    PROBLEMS_BY_TOPIC: (topic: string) => `/dsa/problems/topic/${topic}`,
    PROBLEMS_BY_TOPIC_AND_PLATFORM: (topic: string, platform: string) => 
      `/dsa/problems/topic/${topic}/platform/${platform}`,
    PROBLEMS_BY_TOPIC_AND_DIFFICULTY: (topic: string, difficulty: string) => 
      `/dsa/problems/topic/${topic}/difficulty/${difficulty}`,
    SEARCH_PROBLEMS: '/dsa/problems/search',
  },
  
  VIDEOS: {
    GET_BY_TOPIC: (topicId: string) => `/videos/topic/${topicId}`,
    GET_ALL: '/videos',
  }
};

// ============================================
// PRICING CONSTANTS
// ============================================
export const PRICING = {
  COURSE_DEFAULT: 99,
  QUIZ_DEFAULT: 99,
  BUNDLE_DISCOUNT: 0,
  CURRENCY: '₹',
  FORMAT: (price: number) => `₹ ${price}/-`,
  BUNDLES: {
    JEE_FULL: 99 * 3,
    NEET_FULL: 99 * 3,
    UPSC_PRELIMS: 99 * 6,
    DSA_COMPLETE: 99 * 5,
  }
};

/**
 * Build a URL with query parameters
 */
export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  if (!params) return endpoint;
  
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

export default API_ENDPOINTS;