"use client";

import { useCart } from "@/app/user/hooks/useCart";
import Image from "next/image";

export default function CheckoutItemList({ userId }: { userId?: string }) {
  const { cart } = useCart(userId);

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border text-center text-gray-500">
        Không có sản phẩm trong giỏ hàng
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Sản phẩm</h2>

      {cart.map((item: any) => (
        <div
          key={item.productId + (item.variantId || "")}
          className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-white transition-colors"
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
            className="rounded-md border flex-shrink-0"
          />

          {/* Info */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">{item.name}</div>

            {/* facets */}
            {item.facets && Object.keys(item.facets).length > 0 && (
              <div className="mt-1 mb-2 flex flex-wrap gap-1">
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

            {/* Service Packages - THÊM VÀO ĐÂY */}
            {item.servicePackages && item.servicePackages.length > 0 && (
              <div className="mt-2 mb-3">
                <div className="text-xs text-gray-500 mb-1">Gói dịch vụ:</div>
                <div className="space-y-1">
                  {item.servicePackages.map((sp: any) => (
                    <div key={sp._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">• {sp.name}</span>
                      <span className="font-medium text-green-600">+{sp.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-600 text-sm">
                Số lượng: <span className="font-medium">{item.quantity}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Đơn giá</div>
                <div className="font-semibold text-blue-600">
                  {item.price.toLocaleString("vi-VN")}₫
                </div>
              </div>
            </div>
          </div>

          {/* Tổng tiền item */}
          <div className="text-right min-w-[120px]">
            <div className="text-gray-500 text-sm mb-1">Thành tiền</div>
            <div className="font-bold text-lg text-blue-700">
              {(() => {
                const baseTotal = item.price * item.quantity;
                const serviceTotal = (item.servicePackages || []).reduce(
                  (sum: number, sp: any) => sum + (sp.price || 0) * item.quantity,
                  0
                );
                return (baseTotal + serviceTotal).toLocaleString("vi-VN");
              })()}₫
            </div>
            {/* Hiển thị breakdown nếu có service packages */}
            {item.servicePackages && item.servicePackages.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                (gồm {item.quantity} gói dịch vụ)
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}