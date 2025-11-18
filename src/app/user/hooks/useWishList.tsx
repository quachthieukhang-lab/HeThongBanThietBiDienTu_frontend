// src/hooks/useWishlist.ts
"use client";
import { useState, useEffect } from "react";
import type { ProductLite } from "@/app/user/types/product";

const STORAGE_KEY = "wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<ProductLite[]>([]);

  // Load từ localStorage khi mở trang
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  // Cập nhật localStorage mỗi khi wishlist thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: ProductLite) => {
    setWishlist((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p._id !== id));
  };

  const toggleWishlist = (product: ProductLite) => {
    setWishlist((prev) =>
      prev.find((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  };

  const isInWishlist = (id: string) => wishlist.some((p) => p._id === id);

  return { wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist };
}
