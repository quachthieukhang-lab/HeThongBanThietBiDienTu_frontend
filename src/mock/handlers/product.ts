import type { ProductLite } from "@/app/user/types/product";
import { mockProducts } from "../data/product";

// Giả lập API lấy danh sách products
export async function mockGetProducts(): Promise<ProductLite[]> {
  // Giả lập độ trễ API 300ms
  await new Promise((r) => setTimeout(r, 300));
  return mockProducts;
}

// Giả lập API lấy products theo subcategory slug
export async function mockGetProductsBySubcategoryId(
  subcategoryId: string
): Promise<ProductLite[]> {
  await new Promise((r) => setTimeout(r, 100));
  return mockProducts.filter((p) => p.subcategoryId === subcategoryId);
}

import type { ProductVariant } from "@/app/user/types/product";
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


// Lấy 1 product + danh sách variant
export async function mockGetProductWithVariants(
  productId: string
): Promise<{ product: ProductLite | null; variants: ProductVariant[] }> {
  await new Promise((r) => setTimeout(r, 200));

  const product = mockProducts.find((p) => p._id === productId) ?? null;
  const variants = mockProductVariants.filter((v) => v.productId === productId);
  return { product, variants };
}


