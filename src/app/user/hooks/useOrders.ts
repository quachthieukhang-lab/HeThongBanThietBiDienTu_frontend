"use client";
import { ServicePackageLite } from "@/app/user/types/product";
import { useState, useEffect, useCallback } from "react";

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  facets?: any[];
  servicePackages?: ServicePackageLite[]; 
}

export interface Order {
  _id: string;
  code: string;
  items: OrderItem[];
  subTotal: number;
  shippingFee: number;
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    ward?: string;
    district?: string;
    city?: string;
  };
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể lấy đơn hàng");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, fetchOrders, loading };
}
