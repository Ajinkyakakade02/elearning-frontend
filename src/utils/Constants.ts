// ============================================
// Constants.ts
// Global constants used throughout the application
// ============================================

// API Endpoints
export const API_BASE = '/api';
export const API_AUTH = `${API_BASE}/auth`;
export const API_USERS = `${API_BASE}/users`;
export const API_COURSES = `${API_BASE}/courses`;
export const API_LESSONS = `${API_BASE}/lessons`;
export const API_ENROLLMENTS = `${API_BASE}/enrollments`;
export const API_QUIZZES = `${API_BASE}/quizzes`;
export const API_PROGRESS = `${API_BASE}/progress`;
export const API_REVIEWS = `${API_BASE}/reviews`;
export const API_CERTIFICATES = `${API_BASE}/certificates`;
export const API_WISHLIST = `${API_BASE}/wishlist`;
export const API_ANNOUNCEMENTS = `${API_BASE}/announcements`;


// User Roles
export const ROLE_STUDENT = 'student';


// Course Levels
export const LEVEL_BEGINNER = 'Beginner';
export const LEVEL_INTERMEDIATE = 'Intermediate';
export const LEVEL_ADVANCED = 'Advanced';

// Quiz Difficulty Levels
export const QUIZ_EASY = 'Easy';
export const QUIZ_MEDIUM = 'Medium';
export const QUIZ_HARD = 'Hard';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Local Storage Keys
export const STORAGE_TOKEN = 'auth_token';
export const STORAGE_USER = 'auth_user';
export const STORAGE_DARK_MODE = 'darkMode';
export const STORAGE_WISHLIST = 'wishlist';
export const STORAGE_CERTIFICATES = 'certificates';
export const STORAGE_ANNOUNCEMENTS = 'announcements';
export const STORAGE_READ_ANNOUNCEMENTS = 'readAnnouncements';

// Error Messages
export const ERROR_USER_NOT_FOUND = 'User not found';
export const ERROR_COURSE_NOT_FOUND = 'Course not found';
export const ERROR_LESSON_NOT_FOUND = 'Lesson not found';
export const ERROR_QUIZ_NOT_FOUND = 'Quiz not found';
export const ERROR_EMAIL_EXISTS = 'Email already exists';
export const ERROR_INVALID_CREDENTIALS = 'Invalid email or password';
export const ERROR_UNAUTHORIZED = 'Unauthorized access';
export const ERROR_FORBIDDEN = 'Access forbidden';
export const ERROR_SERVER = 'Something went wrong. Please try again later.';

// Success Messages
export const SUCCESS_LOGIN = 'Logged in successfully!';
export const SUCCESS_REGISTER = 'Registered successfully!';
export const SUCCESS_LOGOUT = 'Logged out successfully!';
export const SUCCESS_PROFILE_UPDATE = 'Profile updated successfully!';
export const SUCCESS_ENROLL = 'Successfully enrolled in course!';
export const SUCCESS_UNENROLL = 'Successfully unenrolled from course!';
export const SUCCESS_REVIEW = 'Review submitted successfully!';
export const SUCCESS_CERTIFICATE = 'Certificate generated successfully!';
export const SUCCESS_WISHLIST_ADD = 'Added to wishlist!';
export const SUCCESS_WISHLIST_REMOVE = 'Removed from wishlist!';

// Validation
export const PASSWORD_MIN_LENGTH = 6;
export const REVIEW_MIN_LENGTH = 10;
export const NAME_MAX_LENGTH = 50;
export const BIO_MAX_LENGTH = 500;

// Date Formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const DISPLAY_DATETIME_FORMAT = 'MMM dd, yyyy h:mm a';

// Theme
export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

// HTTP Status Codes
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_SERVER_ERROR = 500;

// Default Values
export const DEFAULT_AVATAR = '👤';
export const DEFAULT_COURSE_IMAGE = '📚';
export const DEFAULT_LESSON_ICON = '📹';
export const DEFAULT_QUIZ_ICON = '📝';

// App Information
export const APP_NAME = 'E-Learn';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Online Learning Platform';
export const CONTACT_EMAIL = 'support@elearn.com';