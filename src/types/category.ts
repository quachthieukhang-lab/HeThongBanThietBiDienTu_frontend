// src/types/category.ts

/** ===============================
 * CATEGORY TYPES
 * =============================== */

// Bản đầy đủ — phản ánh schema ở backend (NestJS + Mongo)
export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  sortOrder?: number;
  description?: string;
  isActive?: boolean;
  image?: string;
  banner?: string;
  metaTitle?: string;
  metaDescription?: string;
  path?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Bản rút gọn cho FE (ví dụ hiển thị ở Header, Home,...)
export type CategoryLite = Pick<Category, "_id" | "name" | "slug">;

/** ===============================
 * SUBCATEGORY TYPES
 * =============================== */

export interface Subcategory {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder?: number;
  icon?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  banner?: string;
  metaTitle?: string;
  metaDescription?: string;
  path?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Bản rút gọn cho FE (Header, danh mục con,...)
export type SubcategoryLite = Pick<Subcategory, "_id" | "name" | "slug">;
export type SubcategoryWithImage = Pick<Subcategory, "_id" | "name" | "slug" | "image">;