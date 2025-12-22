/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import CheckoutItemList from "@/components/user/checkout/CheckoutItemList";
import PaymentMethodSelector, { PaymentMethod } from "@/components/user/checkout/PaymentMethodSelector";
import CheckoutSummary from "@/components/user/checkout/CheckoutSummary";
import AddressList from "@/components/user/home/AddressList";
import { MapPin, ShoppingCart, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [cartEmpty, setCartEmpty] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  /** CHECK IF CART EMPTY */
  useEffect(() => {
  const checkCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const sid = sessionStorage.getItem("cartSessionId");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const res = await fetch(
      `${backendUrl}/carts/me?sessionId=${sid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      setCartEmpty(true);
    }
  };

  checkCart();
}, []);

  /** CART EMPTY PAGE */
  if (cartEmpty) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán
        </p>
        <a
          href="/user/cart"
          className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
        >
          Quay lại giỏ hàng
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header nhỏ gọn */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <a href="/" className="hover:text-blue-600 transition">Trang chủ</a>
        <span>›</span>
        <a href="/cart" className="hover:text-blue-600 transition">Giỏ hàng</a>
        <span>›</span>
        <span className="text-blue-600 font-medium">Thanh toán</span>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-6">THANH TOÁN ĐƠN HÀNG</h1>

      {/* Main Layout - 2 cột cân đối */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT - Thông tin đơn hàng */}
        <div className="lg:col-span-2 space-y-4">
          {/* Địa chỉ giao hàng - Card nhỏ */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 ">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-gray-900 text-sm ">ĐỊA CHỈ GIAO HÀNG</h2>
            </div>
            <div className="text-gray-800">
                <AddressList onSelect={setSelectedAddressId} />
            </div>
            

            {!selectedAddressId && (
              <div className="mt-2 p-2 rounded bg-amber-50 text-amber-700 text-xs border border-amber-200">
                ⚠️ Vui lòng chọn địa chỉ giao hàng
              </div>
            )}
          </div>

          {/* Sản phẩm - Card nhỏ */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-gray-900 text-sm">SẢN PHẨM ĐÃ CHỌN</h2>
            </div>
            <CheckoutItemList userId={userId || undefined} />
          </div>

          {/* Phương thức thanh toán - Card nhỏ */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-gray-900 text-sm">PHƯƠNG THỨC THANH TOÁN</h2>
            </div>
            <PaymentMethodSelector onChange={setPaymentMethod} />
          </div>
        </div>

        {/* RIGHT - Tóm tắt đơn hàng */}
        <div className="lg:sticky lg:top-4 h-fit">
          <CheckoutSummary
            userId={userId || undefined}
            addressId={selectedAddressId}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
}