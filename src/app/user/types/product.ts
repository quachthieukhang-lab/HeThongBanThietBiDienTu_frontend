import type { Category, Subcategory } from "./category";

export interface ServicePackageLite {
  _id: string;
  name: string;
  price: number;
  description?: string;
  duration?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: string; 
  subcategoryId: string; 
  brandId?: string | { _id: string; name: string; logo?: string }; // Có thể là object khi populated
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
  // THAY ĐỔI: servicePackages thành servicePackageIds
  servicePackageIds?: ServicePackageLite[] | string[]; // Có thể là mảng object (populated) hoặc string IDs
  createdAt?: string;
  updatedAt?: string;
}

// Dành cho hiển thị danh sách sản phẩm
export type ProductLite = Pick<
  Product,
  "_id" | "name" | "slug" | "thumbnail" | "priceFrom" | "priceTo" | 
  "images" | "categoryId" | "subcategoryId" | "brandId" | "servicePackageIds" // SỬA: servicePackageIds
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