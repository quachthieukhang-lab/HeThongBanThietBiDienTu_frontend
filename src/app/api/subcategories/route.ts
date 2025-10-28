import type { SubcategoryLite } from "@/types/category";

export const mockSubcategories: Record<string, SubcategoryLite[]> = {
  "1": [
    { _id: "1a", name: "Tivi", slug: "tivi" },
    { _id: "1b", name: "Máy lạnh", slug: "may-lanh" },
  ],
  "2": [
    { _id: "2a", name: "Nồi cơm điện", slug: "noi-com" },
    { _id: "2b", name: "Máy xay sinh tố", slug: "may-xay" },
  ],
  "3": [
    { _id: "3a", name: "Tai nghe", slug: "tai-nghe" },
    { _id: "3b", name: "Cáp sạc", slug: "cap-sac" },
  ],
};
