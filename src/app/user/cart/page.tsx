/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useCart, CartItem } from "@/app/user/hooks/useCart";
import { useEffect, useState } from "react";
import Image from "next/image";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  // NOTE: useCart() đã tự xử lý session/token/merge
  const { cart, fetchCart, setItemQty, removeItem, sessionId} = useCart();

  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      try {
        await fetchCart(); // fetch chính xác (dựa trên token/session)
      } catch (err) {
        console.error("Init fetchCart error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => { mounted = false; };
  }, [fetchCart, sessionId]); // refetch khi sessionId hoặc trạng thái login thay đổi

  const handleQtyChange = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    try {
      if (newQty <= 0) {
        // Nếu muốn: gọi removeItem (với dialog) — ở đây ta trực tiếp remove nếu giảm xuống 0
        await removeItem(item.productId, item.variantId);
      } else {
        await setItemQty(item.productId, item.variantId, newQty);
      }
      await fetchCart();
    } catch (err) {
      console.error("handleQtyChange error:", err);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto py-12 flex justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải giỏ hàng...</p>
      </div>
    </div>
  );

  if (!cart || cart.length === 0) return (
    <div className="max-w-6xl mx-auto py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
      <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
      
      <a 
        href="/" 
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <ShoppingBag className="w-5 h-5" />
        Tiếp tục mua sắm
      </a>
    </div>
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
        <p className="text-gray-600">
          Bạn đang có <span className="font-semibold text-blue-600">{itemCount}</span> sản phẩm trong giỏ hàng
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.productId + (item.variantId || '')}
                className="flex items-center gap-6 p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={item.thumbnail ? `${API_BASE}/${item.thumbnail}` : "/placeholder.png"}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>

                  {item.facets && typeof item.facets === 'object' && Object.keys(item.facets).length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Phiên bản:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(item.facets).map((value, index) => {
                          let displayValue: any = value;
                          if (typeof value === 'boolean') displayValue = value ? 'Có bơm' : 'Không bơm';
                          if (!displayValue) return null;
                          return (
                            <span 
                              key={index}
                              className="px-3 py-2 border-2 border-blue-200 bg-blue-50 text-blue-700 rounded-lg text-xs font-small"
                            >
                              {displayValue}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-xl font-bold text-blue-600">
                    {item.price.toLocaleString("vi-VN")}₫
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => handleQtyChange(item, -1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                      // allow reducing to 0 (will remove). If you prefer preventing 0, re-enable disabled condition
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-12 text-center font-medium text-gray-900 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item, 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className="text-gray-400 hover:text-red-600 p-2 transition-colors hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                      <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
                        <AlertDialog.Title className="text-lg font-semibold mb-2 text-gray-900">
                          Xác nhận xóa
                        </AlertDialog.Title>
                        <AlertDialog.Description className="text-gray-600 mb-6">
                          Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?
                        </AlertDialog.Description>
                        <div className="flex gap-3 justify-end">
                          <AlertDialog.Cancel asChild>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                              Hủy
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button 
                              onClick={async () => {
                                try {
                                  await removeItem(item.productId, item.variantId);
                                  await fetchCart();
                                } catch (err) {
                                  console.error("Delete action error", err);
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
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
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Tóm tắt đơn hàng
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({itemCount} sản phẩm):</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-4 border-t border-gray-200">
                <span>Tổng cộng:</span>
                <span className="text-2xl text-blue-600">{total.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            <a 
              href="/user/checkout" 
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block mb-4"
            >
              Tiến hành thanh toán
            </a>
            
            <a 
              href="/" 
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
            >
              Tiếp tục mua sắm
            </a>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Ưu đãi đặc biệt:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Miễn phí vận chuyển toàn quốc
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Đổi trả trong 30 ngày
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Bảo hành chính hãng
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
