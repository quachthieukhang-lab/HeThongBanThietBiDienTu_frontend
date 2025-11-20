"use client";

import { useState } from "react";
import { Truck, CreditCard, Wallet } from "lucide-react";

export type PaymentMethod = "cod" | "credit_card" | "paypal";

export default function PaymentMethodSelector({
  onChange,
}: {
  onChange: (method: PaymentMethod) => void;
}) {
  const [selected, setSelected] = useState<PaymentMethod>("cod");

  const select = (method: PaymentMethod) => {
    setSelected(method);
    onChange(method);
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-4">
      <h2 className="text-xl font-semibold mb-4">Hình thức thanh toán</h2>

      {/* COD */}
      <button
        onClick={() => select("cod")}
        className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left hover:bg-gray-50 
        ${selected === "cod" ? "border-blue-500 bg-blue-50" : ""}`}
      >
        <Truck className="w-5 h-5 text-blue-600" />
        <div>
          <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
          <div className="text-sm text-gray-600">Không cần thanh toán trước</div>
        </div>
      </button>

      {/* Credit Card / Bank Transfer */}
      <button
        onClick={() => select("credit_card")}
        className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left hover:bg-gray-50 
        ${selected === "credit_card" ? "border-blue-500 bg-blue-50" : ""}`}
      >
        <CreditCard className="w-5 h-5 text-blue-600" />
        <div>
          <div className="font-semibold">Chuyển khoản / Thẻ tín dụng</div>
          <div className="text-sm text-gray-600">
            Hiển thị QR / thông tin chuyển khoản sau khi đặt hàng
          </div>
        </div>
      </button>

      {/* PayPal */}
      <button
        onClick={() => select("paypal")}
        className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left hover:bg-gray-50 
        ${selected === "paypal" ? "border-blue-500 bg-blue-50" : ""}`}
      >
        <Wallet className="w-5 h-5 text-blue-600" />
        <div>
          <div className="font-semibold">Thanh toán PayPal</div>
          <div className="text-sm text-gray-600">
            Redirect sang PayPal để thanh toán an toàn
          </div>
        </div>
      </button>
    </div>
  );
}
