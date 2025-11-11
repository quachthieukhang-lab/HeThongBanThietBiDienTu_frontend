import { mockSubcategories } from "../data/subcategories";
import type { SubcategoryBonus, SubcategoryLite } from "@/types/category";

/** 
 * Giả lập cho endpoint:
 * GET /subcategories?categoryId=... 
 * GET /subcategories 
 */

export async function mockGetSubcategories(
  categoryId?: string
): Promise<{ items: SubcategoryLite[] }> {
  await new Promise((r) => setTimeout(r, 100)); // mô phỏng delay

  let items: SubcategoryLite[];

  if (categoryId) {
    // Lọc mảng phẳng theo categoryId
    items = mockSubcategories.filter((sub) => sub.categoryId === categoryId);
  } else {
    items = [...mockSubcategories]; // tất cả subcategories
  }

  return { items };
}


export async function mockGetSubcategoryBySlug(
  slug: string
): Promise<SubcategoryBonus | null> {
  await new Promise((r) => setTimeout(r, 100));

  if (!slug) return null;

  const all = Object.values(mockSubcategories).flat();
  const subcategory = all.find((sc) => sc.slug === slug) || null;
  return subcategory;
}