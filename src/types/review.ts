// types/review.ts
export type UserLite = {
  _id: string;
  name: string;
  avatarUrl?: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  _id: string;
  productId: string;
  userId: UserLite;
  orderId: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

// Chỉ dùng cho hiển thị FE
export type ReviewLite = Pick<
  Review,
  "_id" | "productId" | "userId" | "rating" | "title" | "content" | "images" | "status" | "createdAt"
>;

// Kiểu dữ liệu trả về khi phân trang
export interface PaginatedReviews<T = ReviewLite> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
