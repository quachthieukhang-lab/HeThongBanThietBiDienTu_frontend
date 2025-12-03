"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProductLite, ProductVariant } from "@/app/user/types/product";
import toast from "react-hot-toast";
import { useCartStore } from "@/app/user/hooks/cartStore";
import type { CartItem } from "@/app/user/types/cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  const API_BASE = "http://localhost:3000";

  // Zustand store
  const setCartCount = useCartStore((state) => state.setCartCount);

  // --------------------------
  // 1) TẠO SESSION CHO GUEST
  // --------------------------
  useEffect(() => {
    let sid = sessionStorage.getItem("cartSessionId");

    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("cartSessionId", sid);
    }

    setSessionId(sid);
  }, []);

  // --------------------------
  // Helper: Cập nhật store và state
  // --------------------------
  const syncCartState = useCallback((data: any) => {
    const items = data?.items || [];
    setCart(items);

    // update count
    const count = items.reduce((sum: number, it: CartItem) => sum + it.quantity, 0);
    setCartCount(count);
  }, [setCartCount]);

  // --------------------------
  // 2) FETCH CART
  // --------------------------
  const fetchCart = useCallback(async () => {
    if (!sessionId) return;

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}/carts/me?sessionId=${sessionId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.error("Fetch cart failed:", await res.text());
        return;
      }

      const data = await res.json();
      syncCartState(data);

    } catch (err) {
      console.error("FetchCart error:", err);
    }
  }, [sessionId, syncCartState]);

  // Fetch cart khi sessionId có giá trị
  useEffect(() => {
    if (sessionId) fetchCart();
  }, [sessionId, fetchCart]);

  // --------------------------
  // 3) ADD TO CART
  // --------------------------
 const addToCart = async (
  product: ProductLite,
  variant?: ProductVariant,
  quantity = 1,
  selectedPackages: any[] = []
) => {
    try {
      const token = localStorage.getItem("accessToken");

      const payload: any = {
        productId: product._id,
        quantity,
        sessionId, 
        
      };

      if (variant) payload.variantId = variant._id;

      if (selectedPackages.length > 0) {
        payload.servicePackages = selectedPackages.map(sp => ({
          _id: sp._id,
          name: sp.name,
          price: sp.price,
          duration: sp.duration,
          type: sp.type,
        }));
      }
      const res = await fetch(`${API_BASE}/carts/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("AddToCart failed:", await res.text());
        toast.error("Không thể thêm vào giỏ hàng!");
        return;
      }

      toast.success("Đã thêm vào giỏ hàng!");
      await fetchCart();

    } catch (err) {
      console.error("addToCart error:", err);
      toast.error("Lỗi khi thêm vào giỏ");
    }
  };

  // --------------------------
  // 4) BUY NOW
  // --------------------------
  const buyNow = async (
  product: ProductLite,
  variant?: ProductVariant,
  selectedPackages: any[] = []
) => {
  await addToCart(product, variant, 1, selectedPackages);
  window.location.href = "/user/cart";
};


  // --------------------------
  // 5) SET QTY
  // --------------------------
  const setItemQty = async (productId: string, variantId: string | undefined, quantity: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}/carts/items`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productId,
          variantId,
          quantity,
          sessionId,
        }),
      });

      if (!res.ok) {
        console.error("setItemQty failed:", await res.text());
        return;
      }

      await fetchCart();

    } catch (err) {
      console.error("setItemQty error:", err);
    }
  };

  // --------------------------
  // 6) REMOVE ITEM
  // --------------------------
  const removeItem = async (productId: string, variantId?: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE}/carts/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productId,
          variantId,
          sessionId,
        }),
      });

      if (!res.ok) {
        console.error("removeItem failed:", await res.text());
        return;
      }

      await fetchCart();

    } catch (err) {
      console.error("removeItem error:", err);
    }
  };

  return {
    cart,
    sessionId,
    fetchCart,
    addToCart,
    buyNow,
    setItemQty,
    removeItem,
  };
}
