"use client";
import { useState, useEffect } from "react";
import type { ProductLite, ProductVariant } from "@/types/product";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export function useCart(userId?: string) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  const API_BASE = "http://localhost:3000";

  // Khởi tạo sessionId cho guest
  useEffect(() => {
    const initializeSession = () => {
      let sid = sessionStorage.getItem("cartSessionId");
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("cartSessionId", sid);
      }
      setSessionId(sid);
      setIsInitialized(true);
    };

    initializeSession();
  }, []);

  // Fetch cart sau khi đã có sessionId hoặc userId
  useEffect(() => {
    if (!isInitialized) return;

    const loadCart = async () => {
      if (userId && sessionId) {
        // Khi đăng nhập, merge guest cart vào user cart
        await mergeGuestToUser(userId);
      }
      await fetchCart();
    };

    loadCart();
  }, [userId, isInitialized]);

  const fetchCart = async () => {
    try {
      const query = userId ? `userId=${userId}` : `sessionId=${sessionId}`;

      const res = await fetch(`${API_BASE}/carts/me?${query}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          // Cart chưa tồn tại, tạo cart rỗng
          setCart([]);
          return;
        }
        const text = await res.text();
        console.error("Fetch cart failed:", text);
        return;
      }

      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (
    product: ProductLite,
    variant?: ProductVariant,
    quantity = 1
  ) => {
    try {
      const payload: any = {
        productId: product._id,
        quantity,
      };

      // Chỉ thêm userId hoặc sessionId, không thêm cả hai
      if (userId) {
        payload.userId = userId;
      } else {
        payload.sessionId = sessionId;
      }

      if (variant) payload.variantId = variant._id;

      const res = await fetch(`${API_BASE}/carts/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const buyNow = async (product: ProductLite, variant?: ProductVariant) => {
    await addToCart(product, variant);
    window.location.href = "/cart";
  };

  const setItemQty = async (productId: string, variantId: string | undefined, quantity: number) => {
    try {
      const payload: any = { 
        productId, 
        variantId, 
        quantity 
      };

      if (userId) {
        payload.userId = userId;
      } else {
        payload.sessionId = sessionId;
      }

      const res = await fetch(`${API_BASE}/carts/items`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error setting quantity:", error);
    }
  };

  const removeItem = async (productId: string, variantId: string | undefined) => {
    try {
      const payload: any = { 
        productId, 
        variantId 
      };

      if (userId) {
        payload.userId = userId;
      } else {
        payload.sessionId = sessionId;
      }

      const res = await fetch(`${API_BASE}/carts/items`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const mergeGuestToUser = async (userId: string) => {
    if (!sessionId) return;
    
    try {
      await fetch(`${API_BASE}/carts/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId }),
      });
      
      // Clear session sau khi merge
      sessionStorage.removeItem("cartSessionId");
      setSessionId("");
    } catch (error) {
      console.error("Error merging carts:", error);
    }
  };

  return { 
    cart, 
    sessionId, 
    addToCart, 
    buyNow, 
    fetchCart, 
    mergeGuestToUser, 
    setItemQty, 
    removeItem 
  };
}