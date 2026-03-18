// ============================================
// WISHLIST TYPES
// ============================================

export interface WishlistItem {
  id: number;
  userId: number;
  courseId: number;
  courseTitle: string;
  courseThumbnail?: string;
  instructorName: string;
  price: number;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  count: number;
}