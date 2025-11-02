import type { ProductLite } from "@/types/product";
import { mockProducts } from "../data/product";

// Giả lập API lấy danh sách products
export async function mockGetProducts(): Promise<ProductLite[]> {
  // Giả lập độ trễ API 300ms
  await new Promise((r) => setTimeout(r, 300));
  return mockProducts;
}

import type { ProductVariant } from "@/types/product";
import { mockProductVariants } from "../data/product";
// Giả lập API lấy danh sách product variants theo productId
export async function mockGetProductVariants(
  productId: string ): Promise<{ items: ProductVariant[] }> {
  // Giả lập độ trễ API 300ms
  await new Promise((r) => setTimeout(r, 300));
  const items = mockProductVariants.filter(
    (variant) => variant.productId === productId
  );
  return { items };
}