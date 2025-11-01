import type { ProductLite } from "@/types/product";

export const mockProducts: ProductLite[] = [
  {
    _id: "p1",
    name: "Smart Tivi Samsung 43 inch 4K",
    slug: "smart-tivi-samsung-43-inch-4k",
    thumbnail: "/images/products/tivi-samsung.jpg",
    priceFrom: 7900000,
    priceTo: 8500000,
    rating: 4.6,
  },
  {
    _id: "p2",
    name: "Máy lạnh Panasonic Inverter 1 HP",
    slug: "may-lanh-panasonic-inverter-1hp",
    thumbnail: "/images/products/maylanh-panasonic.jpg",
    priceFrom: 8800000,
    priceTo: 9500000,
    rating: 4.8,
  },
  {
    _id: "p3",
    name: "Laptop ASUS Vivobook 15",
    slug: "laptop-asus-vivobook-15",
    thumbnail: "/images/products/laptop-asus.jpg",
    priceFrom: 14500000,
    priceTo: 15900000,
    rating: 4.7,
  },
  {
    _id: "p4",
    name: "Tai nghe Bluetooth Sony WH-1000XM5",
    slug: "tai-nghe-sony-wh1000xm5",
    thumbnail: "/images/products/sony-wh1000xm5.jpg",
    priceFrom: 6990000,
    priceTo: 6990000,
    rating: 4.9,
  },
];

import type { ProductVariantLite } from "@/types/product";

export const mockProductVariants: ProductVariantLite[] = [
  {
    _id: "v1",
    productId: "p1", // Tivi Samsung
    sku: "TVSAM43A",
    attributes: { size: "43 inch", color: "Đen" },
    facets: { size: "43 inch", color: "Đen" },
    price: 7900000,
    compareAtPrice: 8500000,
    stock: 42,
    images: ["/images/products/tivi-samsung.jpg"],
    isActive: true,
  },
  {
    _id: "v2",
    productId: "p2", // Máy lạnh Panasonic
    sku: "MLPAN1HP",
    attributes: { capacity: "1 HP", inverter: "Có" },
    facets: { capacity: "1 HP", inverter: "Có" },
    price: 8800000,
    compareAtPrice: 9500000,
    stock: 30,
    images: ["/images/products/maylanh-panasonic.jpg"],
    isActive: true,
  },
  {
    _id: "v3",
    productId: "p3", // Laptop ASUS
    sku: "LTPASUS15A",
    attributes: { cpu: "i5", ram: "8GB", storage: "512GB" },
    facets: { cpu: "i5", ram: "8GB", storage: "512GB" },
    price: 14500000,
    compareAtPrice: 15900000,
    stock: 20,
    images: ["/images/products/laptop-asus.jpg"],
    isActive: true,
  },
  {
    _id: "v4",
    productId: "p4", // Tai nghe Sony
    sku: "SONY1000XM5-BLK",
    attributes: { color: "Đen", type: "Bluetooth" },
    facets: { color: "Đen", type: "Bluetooth" },
    price: 6990000,
    compareAtPrice: 7990000,
    stock: 55,
    images: ["/images/products/sony-wh1000xm5.jpg"],
    isActive: true,
  },
];
