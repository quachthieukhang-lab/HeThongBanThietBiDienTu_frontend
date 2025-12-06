"use client";

import { useCart } from "@/app/user/hooks/useCart";
import { useState , useEffect} from "react";
import toast from "react-hot-toast";
import { PaymentMethod } from "./PaymentMethodSelector";
import PromoCodeInput from "./PromoCodeInput";

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

interface AppliedPromotion {
  name: string;
  discount_type: DiscountType;
  discount_value: number;
  code: string;
}

interface CartData {
  items: any[];
  totalPrice: number;
  totalQuantity: number;
}

export default function CheckoutSummary({
  userId,
  addressId,
  paymentMethod,
}: {
  userId?: string;
  addressId: string | null;
  paymentMethod: PaymentMethod;
}) {
  const { cart, fetchCart } = useCart();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const shippingFee = 30000;
  
  // Lấy cart data từ API (có totalPrice đã tính từ BE)
  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("accessToken");
      const sid = sessionStorage.getItem("cartSessionId");
      
      if (!token || !sid) return;
      
      try {
        const res = await fetch(
          `http://localhost:3000/carts/me?sessionId=${sid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setCartData(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    
    fetchCartData();
  }, [cart]); // Khi cart thay đổi

  // Sử dụng totalPrice từ BE
  const subtotal = cartData?.totalPrice || 0;
  const [discountedTotal, setDiscountedTotal] = useState(subtotal + shippingFee);
  const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null);

  useEffect(() => {
    if (!appliedPromotion) {
      setDiscountedTotal(subtotal + shippingFee);
    }
  }, [subtotal, shippingFee, appliedPromotion]);

  if (!cartData || cart.length === 0)
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-gray-500 text-center py-12">
        Không có sản phẩm trong giỏ hàng
      </div>
    );

  const handlePlaceOrder = async () => {
    if (!addressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      // Gửi lên BE để BE tự tính toán lại
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId,
          paymentMethod,
          // Gửi promoCode lên để BE tự tính toán
          promoCode: appliedPromotion?.code || null,
          totalPrice: discountedTotal,
        }),
      });

      if (!res.ok) throw new Error("Lỗi đặt hàng");

      toast.success("Đặt hàng thành công!");
      window.location.href = `/user/orders`;
    } catch (err) {
      console.log(err);
      toast.error("Không thể đặt hàng");
    }
  };

  // ... phần JSX giữ nguyên
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-full min-w-[300px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

      <div className="space-y-4">
        {/* Tạm tính */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Tạm tính</span>
          <span className="font-medium text-gray-900">{subtotal.toLocaleString("vi-VN")}₫</span>
        </div>

        {/* Phí vận chuyển */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">{shippingFee.toLocaleString("vi-VN")}₫</span>
        </div>

        {/* Mã giảm giá */}
        <div className="py-4 border-b border-gray-100 w-full">
          <div className="mb-3 w-full">
            <span className="text-gray-700 font-medium mb-2 block">Mã giảm giá</span>
            <PromoCodeInput
              subtotal={subtotal + shippingFee}
              setDiscountedTotal={setDiscountedTotal}
              setAppliedPromotion={setAppliedPromotion}
            />
          </div>
          
          {appliedPromotion && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-green-800 font-medium">
                    {appliedPromotion.name}
                  </span>
                </div>
                <span className="text-green-700 font-semibold">
                  {appliedPromotion.discount_type === DiscountType.PERCENTAGE
                    ? `-${appliedPromotion.discount_value}%`
                    : `-${appliedPromotion.discount_value.toLocaleString("vi-VN")}₫`
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tổng cộng */}
        <div className="flex justify-between items-center py-4">
          <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
          <div className="text-right">
            {appliedPromotion && subtotal + shippingFee !== discountedTotal && (
              <div className="text-sm text-gray-500 line-through mb-1">
                {(subtotal + shippingFee).toLocaleString("vi-VN")}₫
              </div>
            )}
            <div className="text-2xl font-bold text-blue-600">
              {discountedTotal.toLocaleString("vi-VN")}₫
            </div>
          </div>
        </div>

        {/* Nút đặt hàng */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}