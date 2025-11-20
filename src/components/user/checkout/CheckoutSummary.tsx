"use client";

import { useCart } from "@/app/user/hooks/useCart";
import { useState } from "react";
import toast from "react-hot-toast";
import { PaymentMethod } from "./PaymentMethodSelector";

export default function CheckoutSummary({
  userId,
  addressId,
  paymentMethod,
}: {
  userId?: string;
  addressId: string | null;
  paymentMethod: PaymentMethod;
}) {
  const { cart } = useCart();

  if (cart.length === 0)
    return (
      <div className="bg-white p-6 rounded-lg border text-gray-500">
        Không có sản phẩm
      </div>
    );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!addressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
     
    try {
      const token = localStorage.getItem("accessToken");
        console.log("🚨 DEBUG ORDER CREATION:");
    console.log({
  cartItems: cart,
  addressId,
  paymentMethod,
  tokenExists: !!token,
});

      // 1. Tạo order
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId,
          paymentMethod,
        }),
      });

      if (!res.ok) throw new Error("Lỗi đặt hàng");

      const order = await res.json();

      // 2. Giả lập thanh toán online nếu không phải COD
      if (paymentMethod !== "cod") {
        // Hiển thị thông tin giả lập
        toast.success(
          `Giả lập thanh toán ${paymentMethod === "credit_card" ? "Chuyển khoản/Thẻ" : "PayPal"} thành công`
        );
      }

      toast.success("Đặt hàng thành công!");
      window.location.href = `/orders/${order._id}`;
    } catch (err) {
      console.log(err);
      toast.error("Không thể đặt hàng");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-4">
      <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

      <div className="flex justify-between text-gray-600">
        <span>Tạm tính</span>
        <span>{subtotal.toLocaleString("vi-VN")}₫</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Phí vận chuyển</span>
        <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
      </div>

      <div className="flex justify-between text-lg font-semibold pt-4 border-t">
        <span>Tổng cộng</span>
        <span className="text-blue-600">{total.toLocaleString("vi-VN")}₫</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700"
      >
        Đặt hàng
      </button>
    </div>
  );
}
