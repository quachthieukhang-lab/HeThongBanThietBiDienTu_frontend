import { mockSubcategories } from "../data/subcategories";
import type { SubcategoryLite } from "@/types/category";

/** 
 * Giả lập cho endpoint:
 * GET /subcategories?categoryId=... 
 * GET /subcategories 
 */
export async function mockGetSubcategories(
  categoryId?: string
): Promise<{ items: SubcategoryLite[] }> {
  await new Promise((r) => setTimeout(r, 100));

  if (categoryId) {
    // Tương ứng BE: GET /subcategories?categoryId=xxx
    return { items: mockSubcategories[categoryId] || [] };
  }

  // Tương ứng BE: GET /subcategories
  const all = Object.values(mockSubcategories).flat();
  return { items: all };
}
