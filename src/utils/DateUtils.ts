// ============================================
// DateUtils.ts
// Utility functions for date formatting and manipulation
// ============================================

export const DateUtils = {
  /**
   * Format date to display string
   * @param date - Date object or string
   * @returns Formatted date string (e.g., "Jan 15, 2024")
   */
  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format date with time
   * @param date - Date object or string
   * @returns Formatted datetime string (e.g., "Jan 15, 2024 3:30 PM")
   */
  formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  },

  /**
   * Get relative time (e.g., "2 hours ago", "yesterday")
   * @param date - Date object or string
   * @returns Relative time string
   */
  getRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
      return diffSec <= 5 ? 'Just now' : `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffDay === 1) {
      return 'Yesterday';
    } else if (diffDay < 7) {
      return `${diffDay} days ago`;
    } else if (diffWeek < 4) {
      return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
    } else if (diffMonth < 12) {
      return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
    } else {
      return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
    }
  },

  /**
   * Check if date is today
   * @param date - Date to check
   * @returns boolean
   */
  isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  },

  /**
   * Check if date is yesterday
   * @param date - Date to check
   * @returns boolean
   */
  isYesterday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
  },

  /**
   * Get start of day (midnight)
   * @param date - Date object
   * @returns Date at 00:00:00
   */
  getStartOfDay(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Get end of day (23:59:59)
   * @param date - Date object
   * @returns Date at 23:59:59
   */
  getEndOfDay(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /**
   * Add days to date
   * @param date - Starting date
   * @param days - Number of days to add
   * @returns New date
   */
  addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /**
   * Subtract days from date
   * @param date - Starting date
   * @param days - Number of days to subtract
   * @returns New date
   */
  subtractDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
  },

  /**
   * Get difference in days between two dates
   * @param date1 - First date
   * @param date2 - Second date
   * @returns Number of days
   */
  daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
  },

  /**
   * Format for API (ISO string)
   * @param date - Date object
   * @returns ISO string
   */
  toISO(date: Date): string {
    return date.toISOString();
  },

  /**
   * Parse from API (ISO string)
   * @param isoString - ISO date string
   * @returns Date object
   */
  fromISO(isoString: string): Date {
    return new Date(isoString);
  },

  /**
   * Get age from birthdate
   * @param birthdate - Birth date
   * @returns Age in years
   */
  getAge(birthdate: Date | string): number {
    const today = new Date();
    const birth = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  /**
   * Check if date is in the past
   * @param date - Date to check
   * @returns boolean
   */
  isPast(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.getTime() < Date.now();
  },

  /**
   * Check if date is in the future
   * @param date - Date to check
   * @returns boolean
   */
  isFuture(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.getTime() > Date.now();
  },

  /**
   * Get the day name (e.g., "Monday")
   * @param date - Date object
   * @returns Day name
   */
  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  },

  /**
   * Get the month name (e.g., "January")
   * @param date - Date object
   * @returns Month name
   */
  getMonthName(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long' });
  }
};

export default DateUtils;