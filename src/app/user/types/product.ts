import type { Category, Subcategory } from "./category";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: string; // ref -> Category
  subcategoryId: string; // ref -> Subcategory
  brandId?: string;
  specs?: Record<string, any>;
  templateId: string;
  templateVersion: number;
  images?: string[];
  thumbnail?: string;
  isPublished: boolean;
  priceFrom: number;
  priceTo: number;
  facets?: Record<string, any>;
  variantFacetSummary?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Dành cho hiển thị danh sách sản phẩm (tối giản)
export type ProductLite = Pick<
  Product,
  "_id" | "name" | "slug" | "thumbnail" | "priceFrom" | "priceTo" | "images" | "categoryId" | "subcategoryId"
> & { rating?: number };

// Chi tiết variant
export interface ProductVariant {
  _id: string;
  productId: string;
  sku?: string;
  barcode?: string;
  attributes: Record<string, any>;
  facets?: Record<string, any>;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images?: string[];
  isActive: boolean;
}

export type ProductVariantLite = Pick<
  ProductVariant,
  //chỉ lấy những trường cần thiết để hiển thị danh sách variant
  "_id" | "productId" | "sku" | "attributes" | "facets" | "price" | "compareAtPrice" | "stock" | "images" | "isActive"
>;