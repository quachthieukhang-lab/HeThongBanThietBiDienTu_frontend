"use client";

import type { ProductLite, ProductVariant } from "@/types/product";

interface Props {
  product: ProductLite;
  variants: ProductVariant[];
}

export default function ProductSpecs({ product, variants }: Props) {
  // Lấy tất cả thuộc tính từ variant để hiển thị key/value
  const variantAttributes: Record<string, Set<string>> = {};

  variants.forEach((v) => {
    Object.entries(v.attributes).forEach(([key, value]) => {
      if (!variantAttributes[key]) variantAttributes[key] = new Set();
      variantAttributes[key].add(String(value));
    });
  });

  return (
  <div className="bg-white py-6">
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      
      {/* Thông tin variant - Đơn giản hóa */}
      {Object.keys(variantAttributes).length > 0 && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Các tùy chọn có sẵn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(variantAttributes).map(([key, values]) => (
              <div key={key} className="space-y-2">
                <h3 className="font-medium text-gray-700 capitalize">{key}</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(values).map((value, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin giá - Focus vào điều quan trọng */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giá</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {product.priceFrom.toLocaleString('vi-VN')}₫
            </div>
            <div className="text-sm text-blue-600 mt-1">Giá thấp nhất</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {product.priceTo.toLocaleString('vi-VN')}₫
            </div>
            <div className="text-sm text-green-600 mt-1">Giá cao nhất</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">
              {variants.length} phiên bản
            </div>
            <div className="text-sm text-purple-600 mt-1">Tùy chọn</div>
          </div>
        </div>
      </div>

    </div>
  </div>
);
}