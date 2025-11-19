import type { SubcategoryBonus, SubcategoryWithImage } from "@/app/user/types/category";

export const mockSubcategories: SubcategoryBonus[] = [
  // --- Category 1: Điện tử - Điện máy ---
  {
    _id: "1a",
    categoryId: "1",
    name: "Tivi",
    slug: "tivi",
    description: "Các dòng tivi thông minh, 4K, OLED từ Samsung, LG, Sony...",
    image: "/images/subcategories/tivi.jpg",
    banner: "/images/banners/tivi-banner.jpg",
  
  },
  {
    _id: "1b",
    categoryId: "1",
    name: "Máy lạnh",
    slug: "may-lanh",
    description: "Máy lạnh tiết kiệm điện, công nghệ Inverter, nhiều thương hiệu.",
    image: "/images/subcategories/may-lanh.jpg",
    banner: "/images/banners/maylanh-banner.jpg",
  
  
  },
  {
    _id: "1c",
    categoryId: "1",
    name: "Máy giặt",
    slug: "may-giat",
    description: "Máy giặt cửa trước, cửa trên, giặt sấy tiện lợi.",
    image: "/images/subcategories/may-giat.jpg",
    banner: "/images/banners/maygiat-banner.jpg",
  
   
  },

  // --- Category 2: Gia dụng ---
  {
    _id: "2a",
    categoryId: "2",
    name: "Nồi cơm điện",
    slug: "noi-com",
    description: "Nồi cơm điện nắp gài, cao tần, đa năng từ Panasonic, Sharp, Philips.",
    image: "/images/subcategories/noi-com.jpg",
    banner: "/images/banners/noicom-banner.jpg",
    
  },
  {
    _id: "2b",
    categoryId: "2",
    name: "Máy xay sinh tố",
    slug: "may-xay",
    description: "Máy xay mini, cầm tay, công suất cao.",
    image: "/images/subcategories/may-xay.jpg",
    banner: "/images/banners/mayxay-banner.jpg",
  
  },

  // --- Category 3: Phụ kiện & Âm thanh ---
  {
    _id: "3a",
    categoryId: "3",
    name: "Tai nghe",
    slug: "tai-nghe",
    description: "Tai nghe Bluetooth, chụp tai, gaming, chống ồn.",
    image: "/images/subcategories/tai-nghe.jpg",
    banner: "/images/banners/tainghe-banner.jpg",
   
  },
  {
    _id: "3b",
    categoryId: "3",
    name: "Cáp sạc",
    slug: "cap-sac",
    description: "Cáp sạc nhanh USB-C, Lightning, Micro, từ Anker, Baseus, Ugreen.",
    image: "/images/subcategories/cap-sac.jpg",
    banner: "/images/banners/capsac-banner.jpg",
    
  },
];

