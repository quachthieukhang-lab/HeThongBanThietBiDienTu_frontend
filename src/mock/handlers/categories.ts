import { mockCategories } from "../data/categories";
import type { CategoryLite } from "@/app/user/types/category";

// Giả lập API lấy danh sách categories
export async function mockGetCategories(): Promise<CategoryLite[]> {
  // Giả lập độ trễ API 300ms
  await new Promise((r) => setTimeout(r, 300));
  return mockCategories;
}
