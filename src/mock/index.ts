import { mockGetCategories } from "./handlers/categories";
import { mockGetSubcategories } from "./handlers/subcategories";
import type { CategoryLite, SubcategoryLite } from "@/types/category";
import type { BrandLite } from "@/types/brand";
import type { ProductLite } from "@/types/product";
import type { ProductVariant } from "@/types/product";
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
  // Lấy subcategories theo categoryId
  async getSubcategories(categoryId: string): Promise<SubcategoryLite[]> {
    const { items } = await mockGetSubcategories(categoryId);
    return items;
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
  //lấy product variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const { items } = await import("./handlers/product").then((mod) =>
      mod.mockGetProductVariants(productId)
    );
    return items;
  }
};
