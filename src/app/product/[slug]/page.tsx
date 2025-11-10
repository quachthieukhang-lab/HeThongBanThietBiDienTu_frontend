"use client";

import ProductMainInfo from "@/components/user/product/ProductMainInfo";
import ProductSpecs from "@/components/user/product/ProductSpecs";
import ProductReview from "@/components/user/product/ProductReview";
import type { ProductLite, ProductVariant } from "@/types/product";
import type { ReviewLite, PaginatedReviews } from "@/types/review";
import { apiClient } from "@/lib/apiClient";
import { mockApi } from "@/mock";
import useSWR from "swr";
import { use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);

  // --- Fetch product & variants ---
  const fetchProductWithVariants = async (): Promise<{
    product: ProductLite | null;
    variants: ProductVariant[];
  }> => {
    const products = await apiClient("/products", mockApi.getProducts);
    const found = products.find((p) => p.slug === slug);
    if (!found) return { product: null, variants: [] };

    return apiClient(
      `/products/${found._id}/with-variants`,
      () => mockApi.getProductWithVariants(found._id)
    );
  };

  const { data: productData, isLoading: loadingProduct } = useSWR(
    `product-with-variants-${slug}`,
    fetchProductWithVariants
  );

  const product = productData?.product || null;
  const variants = productData?.variants || [];

  // --- Fetch reviews ---
  const fetchReviews = async (): Promise<PaginatedReviews<ReviewLite>> => {
    if (!product?._id) return { items: [], page: 1, limit: 10, total: 0, pages: 1 };
    return apiClient(
      `/reviews?productId=${product._id}`,
      () => mockApi.getReviewsByProductId(product._id)
    );
  };

  const { data: reviewData, isLoading: loadingReviews } = useSWR(
    product?._id ? `reviews-${product._id}` : null,
    fetchReviews
  );

  // --- Loading / error states ---
  if (loadingProduct) {
    return <div className="p-6 text-gray-400">Đang tải dữ liệu sản phẩm...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-gray-500">Sản phẩm không tồn tại</div>;
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 bg-gray-100 min-h-screen py-6">
      <ProductMainInfo product={product} variants={variants} />
      <ProductSpecs product={product} variants={variants} />
      {loadingReviews ? (
        <div className="p-4 text-center text-gray-500">Đang tải đánh giá...</div>
      ) : (
        <ProductReview reviews={reviewData?.items || []} 
        total={reviewData?.total ?? 0}
        limit={3}/>
      )}
    </div>
  );
}
