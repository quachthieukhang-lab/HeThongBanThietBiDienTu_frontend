import {BrandLite } from "@/app/user/types/brand";
import { mockBrands } from "../data/brand";
// Giả lập API lấy danh sách brands
export async function mockGetBrands(): Promise<BrandLite[]> {
  // Giả lập độ trễ API 300ms
  await new Promise((r) => setTimeout(r, 300));
  return mockBrands;
}