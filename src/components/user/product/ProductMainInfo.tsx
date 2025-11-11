"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductLite, ProductVariant } from "@/types/product";

interface Props {
  product: ProductLite;
  variants: ProductVariant[];
}

export default function ProductMainInfo({ product, variants }: Props) {
  const { name, images = [], priceFrom, priceTo } = product;

  const [currentImage, setCurrentImage] = useState<string>(images[0] || "");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants[0] || null
  );

  const displayPrice = selectedVariant?.price || priceFrom;
  const comparePrice = selectedVariant?.compareAtPrice || priceTo;

  return (
    <div className="bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">

        {/* Cột trái: Tên + Gallery + Cam kết */}
        <div className="space-y-4">
          {/* Tên sản phẩm trên cùng */}
          
            <h1 className="text-2xl font-semibold">{name}</h1>
         

          {/* Gallery ảnh */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="relative w-full aspect-[4/3] mb-3">
              {currentImage ? (
                <Image src={currentImage} alt={name} fill className="object-contain rounded" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  Không có hình ảnh
                </div>
              )}
            </div>

            {/* Gallery thumbnail */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`relative w-20 h-20 rounded border flex-shrink-0 ${
                      currentImage === img ? "border-blue-500" : "border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cam kết & chính sách */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-600">Điện Máy cam kết</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✔</span>
                <span>Hư gì đổi nấy 12 tháng tận nhà (miễn phí tháng đầu)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✔</span>
                <span>Bảo hành chính hãng 2 năm, có người đến tận nhà</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✔</span>
                <span>Lắp đặt miễn phí lúc giao hàng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✔</span>
                <span>Bảo hành phụ kiện 12 tháng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✔</span>
                <span>Đầy đủ các phụ kiện, thiết bị kèm theo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cột phải: Thông tin sản phẩm + Variant + Nút */}
        <div className="space-y-4 mt-12">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Giá */}
            <div className="mb-4">
              {comparePrice && comparePrice > displayPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-xl font-bold">{displayPrice.toLocaleString()}₫</span>
                  <span className="line-through text-gray-400">{comparePrice.toLocaleString()}₫</span>
                </div>
              ) : (
                <span className="text-xl font-bold">{displayPrice.toLocaleString()}₫</span>
              )}
            </div>

            {/* Variant */}
            {variants.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Chọn phiên bản:</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const variantLabel = Object.values(v.attributes).join(" / ") || "Mặc định";
                    return (
                      <button
                        key={v._id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1 border rounded text-sm ${
                          selectedVariant?._id === v._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        {variantLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex gap-4 mt-4">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Thêm vào giỏ hàng
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                Mua ngay
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
