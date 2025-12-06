"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";
import { useSlugToIdMap } from "@/app/user/hooks/useSlugtoIdMap";

import ProductMainInfo from "@/components/user/product/ProductMainInfo";
import ProductSpecs from "@/components/user/product/ProductSpecs";
import ProductReview from "@/components/user/product/ProductReview";

import type { ProductLite, ProductVariant } from "@/app/user/types/product";
import type { ReviewLite, PaginatedReviews } from "@/app/user/types/review";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const slugStr = (Array.isArray(slug) ? slug[0] : slug)?.toLowerCase();

  // --- 1️⃣ Map slug → id (dùng hook chung) ---
  const { data: slugToIdMap, isLoading: loadingMap, error: errorMap } =
    useSlugToIdMap<ProductLite>("/products");

  const productId = slugStr && slugToIdMap ? slugToIdMap[slugStr] : undefined;

  // --- 2️⃣ Fetch thông tin chi tiết sản phẩm ---
  const {
    data: product,
    isLoading: loadingProd,
    error: errorProd,
  } = useSWR<ProductLite>(
    productId ? `/products/${productId}` : null,
    (url: string) => apiClient<ProductLite>(url)
  );

  // --- 3️⃣ Fetch các biến thể sản phẩm ---
  const {
    data: variants,
    isLoading: loadingVar,
    error: errorVar,
  } = useSWR<ProductVariant[]>(
    productId ? `/products/${productId}/variants` : null,
    (url: string) => apiClient<ProductVariant[]>(url)
  );

  // --- 4️⃣ Fetch đánh giá sản phẩm ---
  const {
    data: reviews,
    isLoading: loadingRev,
    error: errorRev,
  } = useSWR<PaginatedReviews<ReviewLite>>(
    productId ? `/reviews/product/${productId}` : null,
    (url: string) => apiClient<PaginatedReviews<ReviewLite>>(url)
  );

  useEffect(() => {
    if (reviews) {
      console.log('Reviews data:', reviews);
    }
  }, [reviews]);
  // --- 🌀 Trạng thái tải ---
  if (loadingMap || loadingProd || loadingVar)
    return <p className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</p>;

  // --- ⚠️ Lỗi ---
  if (errorMap || errorProd || errorVar)
    return (
      <p className="text-center mt-10 text-red-500">
        Lỗi tải dữ liệu sản phẩm, vui lòng thử lại.
      </p>
    );

  // --- 🚫 Không tìm thấy sản phẩm ---
  if (!product)
    return (
      <p className="text-center mt-10 text-gray-400">
        Sản phẩm không tồn tại hoặc đã bị xoá.
      </p>
    );

  // --- ✅ Hiển thị nội dung chính ---
  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen py-8 px-4">
      <ProductMainInfo product={product} variants={variants || []} />
      <ProductSpecs product={product} variants={variants || []} />
      
      {loadingRev ? (
        <div className="text-center text-gray-500">Đang tải đánh giá...</div>
      ) : (
        <ProductReview
          productId={product._id}
          productName={product.name}
          reviews={reviews?.items || []}
          total={reviews?.total ?? 0}
        />
      )}
    </div>
  );
}
