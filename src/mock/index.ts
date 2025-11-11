import { mockGetCategories } from "./handlers/categories";
import { mockGetSubcategories, mockGetSubcategoryBySlug } from "./handlers/subcategories";
import { mockGetProductsBySubcategoryId } from "./handlers/product";
import { mockGetReviewsByProductId } from "./handlers/review"; 
import type { CategoryLite, SubcategoryBonus, SubcategoryLite, SubcategoryWithImage } from "@/types/category";
import type { BrandLite } from "@/types/brand";
import type { ProductLite } from "@/types/product";
import type { ProductVariant } from "@/types/product";
import type { PaginatedReviews, Review, ReviewLite } from "@/types/review";

import { mock } from "node:test";
// Bật/tắt mock dựa trên biến môi trường
export const isMockEnabled =
  process.env.NEXT_PUBLIC_USE_MOCK?.toLowerCase() === "true";

/** Giả lập API cho FE */
export const mockApi = {
  async getCategories(): Promise<CategoryLite[]> {
    // phải GỌI hàm, không phải trả về hàm
    const data = await mockGetCategories();
    return data;
  },
  // // Lấy subcategories theo categoryId
  // async getSubcategories(categoryId: string): Promise<SubcategoryWithImage[]> {
  //   const { items } = await mockGetSubcategories(categoryId);
  //   return items;
  // },
  // Trong mock/index.ts
async getSubcategories(categoryId?: string): Promise<SubcategoryWithImage[]> {
  const { items } = await mockGetSubcategories(categoryId); // có thể undefined
  return items;
},

  // Lấy subcategory theo slug
  async getSubcategoryBySlug(slug: string): Promise<SubcategoryBonus | null> {
    const data = await mockGetSubcategoryBySlug(slug);
    return data;
  },
  //Lấy brands
  async getBrands() : Promise<BrandLite[]> {
    const data = await import("./handlers/brand").then((mod) => mod.mockGetBrands());
    return data;
  },
  //lấy products
  async getProducts(): Promise<ProductLite[]> {
    const data = await import("./handlers/product").then((mod) => mod.mockGetProducts());
    return data;
  },
  //lấy products theo subcategory slug
  async getProductsBySubcategory(subcategoryId: string): Promise<ProductLite[]> {
    const data = await import("./handlers/product").then((mod) =>
      mockGetProductsBySubcategoryId(subcategoryId)
    );
    return data;
  },
  //lấy product variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const { items } = await import("./handlers/product").then((mod) =>
      mod.mockGetProductVariants(productId)
    );
    return items;
  },
  async getProductWithVariants(productId: string) {
  const { product, variants } = await import("./handlers/product").then((mod) =>
    mod.mockGetProductWithVariants(productId)
  );
  return { product, variants };
  },
  async getReviewsByProductId(productId: string, page = 1, limit = 10): Promise<PaginatedReviews<ReviewLite>> {
  const { mockGetReviewsByProductId } = await import("./handlers/review");
  const data = await mockGetReviewsByProductId(productId, { page, limit });
  return data; // Giữ nguyên cấu trúc { items, page, limit, total, pages }
}
};

 

