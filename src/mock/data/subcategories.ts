import type { SubcategoryWithImage } from "@/types/category";

export const mockSubcategories: Record<string, SubcategoryWithImage[]> = {
  "1": [
    { _id: "1a", name: "Tivi", slug: "tivi", image: "/images/subcategories/tivi.jpg" },
    { _id: "1b", name: "Máy lạnh", slug: "may-lanh", image: "/images/subcategories/may-lanh.jpg" },
    { _id: "1c", name: "Máy giặt", slug: "may-giat", image: "/images/subcategories/may-giat.jpg" },
  ],
  "2": [
    { _id: "2a", name: "Nồi cơm điện", slug: "noi-com", image: "/images/subcategories/noi-com.jpg" },
    { _id: "2b", name: "Máy xay sinh tố", slug: "may-xay", image: "/images/subcategories/may-xay.jpg" },
  ],
  "3": [
    { _id: "3a", name: "Tai nghe", slug: "tai-nghe", image: "/images/subcategories/tai-nghe.jpg" },
    { _id: "3b", name: "Cáp sạc", slug: "cap-sac", image: "/images/subcategories/cap-sac.jpg" },
  ],
};
