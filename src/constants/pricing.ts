// src/constants/pricing.ts

/**
 * Centralized pricing configuration for the entire application
 * All prices are in Indian Rupees (₹)
 */

export const PRICING = {
  // Default prices
  COURSE_DEFAULT: 99,
  QUIZ_DEFAULT: 99,
  DSA_SHEET_DEFAULT: 99,
  
  // Bundle pricing
  BUNDLE: {
    JEE_FULL: 99 * 3, // Physics, Chemistry, Mathematics
    NEET_FULL: 99 * 3, // Physics, Chemistry, Biology
    UPSC_PRELIMS: 99 * 6, // History, Geography, Polity, Economy, Environment, Science
    UPSC_MAINS: 99 * 4, // GS Papers I, II, III, IV
    UPSC_CSAT: 99 * 5, // Comprehension, LR, QA, DI, DM
    UPSC_ETHICS: 99 * 5, // All ethics topics
    UPSC_ESSAY: 99 * 2, // Essay & Optional
    MHT_CET_PCM: 99 * 3, // Physics, Chemistry, Mathematics
    MHT_CET_PCB: 99 * 3, // Physics, Chemistry, Biology
    DSA_ALL: 99 * 3, // All DSA Patterns, Top 150, Blind 75
  },
  
  // Discounted prices (if any)
  DISCOUNTED: {
    COURSE: 99, // Same as default (no discount)
    QUIZ: 99,
  },
  
  // Currency symbol
  CURRENCY_SYMBOL: '₹',
  
  // Price suffix
  SUFFIX: '/-',
  
  // Helper function to format price
  formatPrice: (price: number): string => {
    return `${PRICING.CURRENCY_SYMBOL} ${price}${PRICING.SUFFIX}`;
  },
  
  // Helper function to format bundle price
  formatBundlePrice: (itemCount: number): string => {
    const total = itemCount * PRICING.COURSE_DEFAULT;
    return `${PRICING.CURRENCY_SYMBOL} ${total}${PRICING.SUFFIX}`;
  }
} as const;

// Type for pricing keys
export type PricingKey = keyof typeof PRICING;

// Individual price constants for easy access
export const COURSE_PRICE = PRICING.COURSE_DEFAULT;
export const QUIZ_PRICE = PRICING.QUIZ_DEFAULT;
export const DSA_SHEET_PRICE = PRICING.DSA_SHEET_DEFAULT;

// Export formatted price strings
export const FORMATTED_COURSE_PRICE = PRICING.formatPrice(COURSE_PRICE);
export const FORMATTED_QUIZ_PRICE = PRICING.formatPrice(QUIZ_PRICE);
export const FORMATTED_DSA_SHEET_PRICE = PRICING.formatPrice(DSA_SHEET_PRICE);