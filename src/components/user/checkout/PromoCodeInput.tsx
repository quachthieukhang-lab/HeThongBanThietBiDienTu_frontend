"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { DiscountType } from "./CheckoutSummary";

interface PromoCodeInputProps {
  subtotal: number;
  setDiscountedTotal: (total: number) => void;
  setAppliedPromotion: (promo: { name: string; discount_type: DiscountType; discount_value: number; code: string } | null) => void;
}

export default function PromoCodeInput({ subtotal, setDiscountedTotal, setAppliedPromotion }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!code) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:3000/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể lấy danh sách mã giảm giá");

      const promotions = await res.json();

      const promotion = promotions.find((p: any) => p.code === code);
      if (!promotion) throw new Error("Mã giảm giá không hợp lệ hoặc hết hạn");

      let discountedTotal = subtotal;
      if (promotion.discount_type === DiscountType.PERCENTAGE) {
        discountedTotal = subtotal * (1 - promotion.discount_value / 100);
      } else if (promotion.discount_type === DiscountType.FIXED_AMOUNT) {
        discountedTotal = subtotal - promotion.discount_value;
      }
      discountedTotal = Math.max(discountedTotal, 0);

      setDiscountedTotal(discountedTotal);
      setAppliedPromotion({
        name: promotion.code,
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        code: promotion.code
      });

      toast.success(
        `Áp dụng mã giảm giá thành công! ${
          promotion.discount_type === DiscountType.PERCENTAGE
            ? `Giảm ${promotion.discount_value}%`
            : `Giảm ${promotion.discount_value.toLocaleString("vi-VN")}₫`
        }`
      );
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Không thể áp dụng mã giảm giá");
      setAppliedPromotion(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-full">
      <input
        type="text"
        placeholder="Nhập mã giảm giá"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 border border-gray-300  min-w-35 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={handleApplyPromo}
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shrink-0 px-5 py-2  rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
      >
        {loading ? "Đang áp dụng..." : "Áp dụng"}
      </button>
    </div>
  );
}