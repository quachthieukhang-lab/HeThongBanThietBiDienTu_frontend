"use client";

import { useCart } from "@/app/user/hooks/useCart";
import Image from "next/image";

export default function CheckoutItemList({ userId }: { userId?: string }) {
  const { cart, fetchCart } = useCart(userId);

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
        Không có sản phẩm trong giỏ hàng
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border space-y-4">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>

      {cart.map((item) => (
        <div
          key={item.productId + (item.variantId || "")}
          className="flex items-center gap-4 border-b pb-4 last:border-none"
        >
          {/* Thumbnail */}
          <Image
            src={
              item.thumbnail
                ? `http://localhost:3000/${item.thumbnail}`
                : "/placeholder.png"
            }
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md border"
          />

          {/* Info */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{item.name}</div>

            {/* facets */}
            {item.facets && Object.keys(item.facets).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {Object.values(item.facets).map((value: any, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded"
                  >
                    {String(value)}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-1 text-gray-600">
              Số lượng: <span className="font-medium">{item.quantity}</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right font-semibold text-blue-600">
            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
          </div>
        </div>
      ))}
    </div>
  );
}
