// src/services/wishlist.service.ts

import { WishlistItem } from '../types/wishlist.types';
import { showToast } from '../utils/toast';

class WishlistService {
  private wishlist: WishlistItem[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        this.wishlist = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage');
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to storage');
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getItems(): WishlistItem[] {
    return [...this.wishlist];
  }

  isInWishlist(courseId: number): boolean {
    return this.wishlist.some(item => item.courseId === courseId);
  }

  async addToWishlist(item: WishlistItem): Promise<void> {
    // Check if already exists
    if (this.isInWishlist(item.courseId)) {
      showToast.info('Course already in wishlist');
      return;
    }

    this.wishlist.push(item);
    this.saveToStorage();
    this.notifyListeners();
    return Promise.resolve();
  }

  async removeFromWishlist(courseId: number): Promise<void> {
    const index = this.wishlist.findIndex(item => item.courseId === courseId);
    if (index !== -1) {
      this.wishlist.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
    }
    return Promise.resolve();
  }

  async toggleWishlist(item: WishlistItem): Promise<boolean> {
    const exists = this.isInWishlist(item.courseId);
    if (exists) {
      await this.removeFromWishlist(item.courseId);
      return false;
    } else {
      await this.addToWishlist(item);
      return true;
    }
  }

  clearWishlist(): void {
    this.wishlist = [];
    this.saveToStorage();
    this.notifyListeners();
  }
}

export const wishlistService = new WishlistService();