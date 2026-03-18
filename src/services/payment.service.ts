// src/services/payment.service.ts

import axiosInstance from './axios.config';
import { showToast } from '../utils/toast';

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paymentDate: string;
  itemType: 'COURSE' | 'QUIZ' | 'BUNDLE';
  itemId: number;
  itemName: string;
}

export interface PurchaseItem {
  id: number;
  title: string;
  type: 'course' | 'quiz';
  price: number;
  purchaseDate: string;
  status: string;
}

class PaymentService {
  private readonly baseUrl = '/api/payments';

  /**
   * Process payment for a course
   */
  async purchaseCourse(courseId: number, paymentMethod: string = 'CARD'): Promise<Payment> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/course/${courseId}`, {
        paymentMethod
      });
      
      if (response.data.success) {
        showToast.success('Course purchased successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Purchase course error:', error);
      showToast.error(error.response?.data?.message || 'Failed to purchase course');
      throw error;
    }
  }

  /**
   * Process payment for a quiz
   */
  async purchaseQuiz(quizId: number, paymentMethod: string = 'CARD'): Promise<Payment> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/quiz/${quizId}`, {
        paymentMethod
      });
      
      if (response.data.success) {
        showToast.success('Quiz purchased successfully!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Purchase quiz error:', error);
      showToast.error(error.response?.data?.message || 'Failed to purchase quiz');
      throw error;
    }
  }

  /**
   * Get all purchases for current user
   */
  async getUserPurchases(): Promise<PurchaseItem[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/my-purchases`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Get purchases error:', error);
      return [];
    }
  }

  /**
   * Check if user has purchased a specific item
   */
  async checkPurchase(itemType: 'COURSE' | 'QUIZ', itemId: number): Promise<boolean> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/check/${itemType}/${itemId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      return false;
    } catch (error) {
      console.error('Check purchase error:', error);
      return false;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<Payment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/history`);
      
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Get payment history error:', error);
      return [];
    }
  }

  /**
   * Get purchase summary (for progress page)
   */
  async getPurchaseSummary(): Promise<{
    totalSpent: number;
    courseCount: number;
    quizCount: number;
    recentPurchases: PurchaseItem[];
  }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/summary`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      // Return mock data if API not ready
      return {
        totalSpent: 0,
        courseCount: 0,
        quizCount: 0,
        recentPurchases: []
      };
    } catch (error) {
      console.error('Get purchase summary error:', error);
      
      // Return mock data for development
      return {
        totalSpent: 0,
        courseCount: 0,
        quizCount: 0,
        recentPurchases: []
      };
    }
  }

  /**
   * Initiate payment with Razorpay (if integrated)
   */
  async initiateRazorpayPayment(amount: number, itemDetails: {
    name: string;
    description: string;
    id: number;
    type: string;
  }): Promise<any> {
    // This would integrate with Razorpay SDK
    // For now, return mock success
    return {
      success: true,
      transactionId: 'TXN' + Date.now()
    };
  }
}

export const paymentService = new PaymentService();