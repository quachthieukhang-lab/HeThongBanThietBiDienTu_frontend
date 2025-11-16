"use client";
import { useCart, CartItem } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function CartPage({ userId }: { userId?: string }) {
  const { cart, fetchCart, setItemQty, removeItem, mergeGuestToUser, sessionId } = useCart(userId);
  const [loading, setLoading] = useState(true);
const API_BASE = "http://localhost:3000";
  useEffect(() => {
    const init = async () => {
      if (!userId && !sessionId) return;
      if (userId && sessionId) {
        await mergeGuestToUser(userId);
      }
      await fetchCart();
      setLoading(false);
    };
    init();
  }, [userId, sessionId]);

  const handleQtyChange = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await removeItem(item.productId, item.variantId);
    } else {
      await setItemQty(item.productId, item.variantId, newQty);
    }
    await fetchCart();
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-12 flex justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
      <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
      <a 
        href="/products" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tiếp tục mua sắm
      </a>
    </div>
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {cart.map((item) => (
          <div
            key={item.productId + item.variantId}
            className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-0"
          >
            {/* Product Image */}
            <div className="flex-shrink-0">
              <Image
                src={item.thumbnail ? `${API_BASE}/${item.thumbnail}` : "/placeholder.png"}
                alt={item.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              {item.variantId && (
                <p className="text-sm text-gray-500 mt-1">Phiên bản: {item.variantId}</p>
              )}
              <p className="text-lg font-semibold text-blue-600 mt-2">
                {item.price.toLocaleString("vi-VN")}₫
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQtyChange(item, -1)}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQtyChange(item, 1)}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                >
                  +
                </button>
              </div>

              {/* Remove Button with Alert Dialog */}
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button className="text-red-600 hover:text-red-700 p-2 transition-colors">
                    🗑️
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                  <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-sm w-full">
                    <AlertDialog.Title className="text-lg font-semibold mb-2">
                      Xác nhận xóa
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-gray-600 mb-4">
                      Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?
                    </AlertDialog.Description>
                    <div className="flex gap-3 justify-end">
                      <AlertDialog.Cancel asChild>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Hủy
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button 
                          onClick={() => removeItem(item.productId, item.variantId).then(fetchCart)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Xóa
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-gray-900">Tổng cộng:</span>
          <span className="text-2xl font-bold text-blue-600">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>
        <a 
          href="/checkout" 
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
        >
          Tiến hành thanh toán
        </a>
      </div>
    </div>
  );
}