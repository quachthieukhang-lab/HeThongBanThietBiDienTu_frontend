// mock/handlers/review.ts
import type { ReviewLite, ReviewStatus, PaginatedReviews } from "@/app/user/types/review";
import { mockReviews } from "../data/review";

// Giả lập BE trả về danh sách review theo productId
export async function mockGetReviewsByProductId(
  productId: string,
  opts?: { status?: ReviewStatus; page?: number; limit?: number }
): Promise<PaginatedReviews<ReviewLite>> {
  const { status = "approved", page = 1, limit = 10 } = opts || {};

  await new Promise((r) => setTimeout(r, 200)); // giả lập delay

  let items = mockReviews.filter((r) => r.productId === productId);
  if (status) items = items.filter((r) => r.status === status);

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);

  return { items: pageItems, page, limit, total, pages };
}
