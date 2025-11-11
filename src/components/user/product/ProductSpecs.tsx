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
    <div className="bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Thông tin variant */}
        {Object.keys(variantAttributes).length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm text-blue-600">
            <h2 className="text-lg font-semibold mb-3">Thông tin phiên bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-sm">
              {Object.entries(variantAttributes).map(([key, values]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 py-1">
                  <span className="font-medium">{key}</span>
                  <span>{Array.from(values).join(" / ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thông tin cơ bản sản phẩm */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-blue-600">Thông tin sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-sm">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium">Giá từ</span>
              <span>{product.priceFrom.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium">Giá đến</span>
              <span>{product.priceTo.toLocaleString()}₫</span>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
