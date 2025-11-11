import type { ProductLite } from "@/types/product";

export const mockProducts: ProductLite[] = [
  {
    _id: "p1",
    name: "Smart Tivi Samsung 43 inch 4K",
    slug: "smart-tivi-samsung-43-inch-4k",
    categoryId: "1",
    subcategoryId: "1a",
    thumbnail: "/images/products/tivi-samsung.jpg",
    images: [
      "/images/products/tivi-samsung.jpg",
      "/images/products/tivi-samsung-side.jpg",
      "/images/products/tivi-samsung-back.jpg",
    ],
    priceFrom: 7900000,
    priceTo: 8500000,
    rating: 4.6,
  },
  {
    _id: "p2",
    name: "Máy lạnh Panasonic Inverter 1 HP",
    slug: "may-lanh-panasonic-inverter-1hp",
    categoryId: "1",
    subcategoryId: "1b",
    thumbnail: "/images/products/maylanh-panasonic.jpg",
    images: [
      "/images/products/maylanh-panasonic.jpg",
      "/images/products/maylanh-panasonic-side.jpg",
    ],
    priceFrom: 8800000,
    priceTo: 9500000,
    rating: 4.8,
  },
  {
    _id: "p3",
    name: "Máy giặt Toshiba Inverter 8.5kg",
    slug: "may-giat-toshiba-8-5kg",
    categoryId: "1",
    subcategoryId: "1c",
    thumbnail: "/images/products/may-giat-toshiba.jpg",
    images: [
      "/images/products/may-giat-toshiba.jpg",
      "/images/products/may-giat-toshiba-top.jpg",
    ],
    priceFrom: 6500000,
    priceTo: 6900000,
    rating: 4.4,
  },
  {
    _id: "p6",
    name: "Tai nghe Bluetooth Sony WH-1000XM5",
    slug: "tai-nghe-sony-wh1000xm5",
    categoryId: "3",
    subcategoryId: "3a",
    thumbnail: "/images/products/sony-wh1000xm5.jpg",
    images: [
      "/images/products/sony-wh1000xm5.jpg",
      "/images/products/sony-wh1000xm5-side.jpg",
    ],
    priceFrom: 6990000,
    priceTo: 7990000,
    rating: 4.9,
  },
];

import type { ProductVariant } from "@/types/product";

export const mockProductVariants: ProductVariant[] = [
  // --- Smart Tivi Samsung ---
  {
    _id: "v1",
    productId: "p1",
    sku: "TVSAM43-BLACK",
    attributes: { "Kích thước": "43 inch", "Màu sắc": "Đen", "Độ phân giải": "4K" },
    facets: { "Kích thước": "43 inch", "Màu sắc": "Đen", "Độ phân giải": "4K" },
    price: 7900000,
    compareAtPrice: 8500000,
    stock: 5,
    images: [
      "/images/products/tivi-samsung.jpg",
      "/images/products/tivi-samsung-side.jpg",
    ],
    isActive: true,
  },
  {
    _id: "v2",
    productId: "p1",
    sku: "TVSAM43-WHITE",
    attributes: { "Kích thước": "43 inch", "Màu sắc": "Trắng", "Độ phân giải": "4K" },
    facets: { "Kích thước": "43 inch", "Màu sắc": "Trắng", "Độ phân giải": "4K" },
    price: 8500000,
    stock: 3,
    images: [
      "/images/products/tivi-samsung-white.jpg",
      "/images/products/tivi-samsung-white-side.jpg",
    ],
    isActive: true,
  },

  // --- Máy lạnh Panasonic ---
  {
    _id: "v3",
    productId: "p2",
    sku: "AC-PANA1HP",
    attributes: { "Công suất": "1 HP", "Loại": "Inverter", "Màu sắc": "Trắng" },
    facets: { "Công suất": "1 HP", "Loại": "Inverter", "Màu sắc": "Trắng" },
    price: 8800000,
    stock: 4,
    images: ["/images/products/maylanh-panasonic.jpg"],
    isActive: true,
  },
  {
    _id: "v4",
    productId: "p2",
    sku: "AC-PANA1.5HP",
    attributes: { "Công suất": "1.5 HP", "Loại": "Inverter", "Màu sắc": "Trắng" },
    facets: { "Công suất": "1.5 HP", "Loại": "Inverter", "Màu sắc": "Trắng" },
    price: 9500000,
    stock: 2,
    images: ["/images/products/maylanh-panasonic-1.5hp.jpg"],
    isActive: true,
  },

  // --- Máy giặt Toshiba ---
  {
    _id: "v5",
    productId: "p3",
    sku: "WM-TOSH8.5KG",
    attributes: { "Khối lượng giặt": "8.5kg", "Loại": "Inverter", "Màu sắc": "Trắng" },
    facets: { "Khối lượng giặt": "8.5kg", "Loại": "Inverter", "Màu sắc": "Trắng" },
    price: 6500000,
    stock: 6,
    images: ["/images/products/may-giat-toshiba.jpg"],
    isActive: true,
  },
  {
    _id: "v6",
    productId: "p3",
    sku: "WM-TOSH9KG",
    attributes: { "Khối lượng giặt": "9kg", "Loại": "Inverter", "Màu sắc": "Trắng" },
    facets: { "Khối lượng giặt": "9kg", "Loại": "Inverter", "Màu sắc": "Trắng" },
    price: 6900000,
    stock: 3,
    images: ["/images/products/may-giat-toshiba-9kg.jpg"],
    isActive: true,
  },

  // --- Tai nghe Sony ---
  {
    _id: "v7",
    productId: "p6",
    sku: "SONY-WH1000XM5-BLACK",
    attributes: { "Màu sắc": "Đen", "Kết nối": "Bluetooth", "Tần số": "4-40kHz" },
    facets: { "Màu sắc": "Đen", "Kết nối": "Bluetooth", "Tần số": "4-40kHz" },
    price: 6990000,
    stock: 10,
    images: ["/images/products/sony-wh1000xm5.jpg"],
    isActive: true,
  },
  {
    _id: "v8",
    productId: "p6",
    sku: "SONY-WH1000XM5-SILVER",
    attributes: { "Màu sắc": "Bạc", "Kết nối": "Bluetooth", "Tần số": "4-40kHz" },
    facets: { "Màu sắc": "Bạc", "Kết nối": "Bluetooth", "Tần số": "4-40kHz" },
    price: 7990000,
    stock: 7,
    images: ["/images/products/sony-wh1000xm5-silver.jpg"],
    isActive: true,
  },
];
