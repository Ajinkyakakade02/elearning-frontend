// src/types/payment.types.ts

import { PRICING } from '../constants/pricing';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' | 'COD';
export type ItemType = 'COURSE' | 'QUIZ' | 'BUNDLE' | 'DSA_SHEET';

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  paymentDate: string;
  itemType: ItemType;
  itemId: number;
  itemName: string;
  metadata?: Record<string, any>;
}

export interface PaymentRequest {
  itemType: ItemType;
  itemId: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  amount?: number; // Optional, will use default ₹99 if not provided
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    payment: Payment;
    redirectUrl?: string; // For payment gateway redirect
  };
  error?: string;
}

export interface PurchaseItem {
  id: number;
  title: string;
  type: ItemType;
  price: number;
  purchaseDate: string;
  status: PaymentStatus;
  transactionId: string;
  thumbnailUrl?: string;
  instructorName?: string;
  courseId?: number;
  quizId?: number;
}

export interface PurchaseSummary {
  totalSpent: number;
  courseCount: number;
  quizCount: number;
  bundleCount: number;
  recentPurchases: PurchaseItem[];
  formattedTotalSpent: string; // Formatted with ₹ symbol
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validUntil: string;
  applicableItems?: ItemType[];
}

// Helper function to create a payment request
export const createPaymentRequest = (
  itemType: ItemType,
  itemId: number,
  paymentMethod: PaymentMethod = 'CARD'
): PaymentRequest => ({
  itemType,
  itemId,
  paymentMethod,
  amount: 99 // Always ₹99
});

// Helper function to format payment amount
export const formatPaymentAmount = (amount: number): string => {
  return PRICING.formatPrice(amount);
};

// Helper to check if payment was successful
export const isPaymentSuccessful = (payment: Payment): boolean => {
  return payment.status === 'SUCCESS';
};

// Helper to get payment status color (for UI)
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'SUCCESS':
      return '#10b981'; // Green
    case 'PENDING':
      return '#f59e0b'; // Orange
    case 'FAILED':
      return '#ef4444'; // Red
    case 'REFUNDED':
      return '#6b7280'; // Gray
    default:
      return '#6b7280';
  }
};

// Helper to get payment status icon
export const getPaymentStatusIcon = (status: PaymentStatus): string => {
  switch (status) {
    case 'SUCCESS':
      return '✅';
    case 'PENDING':
      return '⏳';
    case 'FAILED':
      return '❌';
    case 'REFUNDED':
      return '↩️';
    default:
      return '❓';
  }
};