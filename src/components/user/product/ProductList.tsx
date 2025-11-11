"use client";

import { useState } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";
import { mockApi } from "@/mock";
import type { ProductLite } from "@/types/product";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

export default function ProductList({subcategoryId}: {subcategoryId?: string}) {
  // --- 1️⃣ Lấy dữ liệu sản phẩm ---
  const fetchProducts = async (): Promise<ProductLite[]> => {
    if (subcategoryId) {
      // Nếu có subcategoryId → chỉ lấy sản phẩm thuộc danh mục đó
      return apiClient(
        `/products?subcategoryId=${subcategoryId}`,
        () => mockApi.getProductsBySubcategory(subcategoryId)
      );
    } else {
      // Nếu không có → lấy toàn bộ
      return apiClient("/products", mockApi.getProducts);
    }
  };

  const { data: products, error, isLoading } = useSWR<ProductLite[]>(
     subcategoryId ? `products-${subcategoryId}` : "products-all",
    fetchProducts
  );

  // --- 2️⃣ State quản lý phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  // --- 3️⃣ Xử lý dữ liệu hiển thị ---
  if (error)
    return (
      <p className="text-red-500 text-center mt-4">
        Không thể tải sản phẩm.
      </p>
    );

  if (isLoading || !products)
    return (
      <p className="text-gray-500 text-center mt-4">
        Đang tải dữ liệu sản phẩm...
      </p>
    );

  const startIdx = (currentPage - 1) * pageSize;
  const visibleProducts = products.slice(startIdx, startIdx + pageSize);

  // --- 4️⃣ Giao diện ---
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {subcategoryId ? "Sản phẩm theo danh mục" : "Sản phẩm nổi bật"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white rounded-lg  p-6 ">
        {visibleProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* Phân trang */}
      <Pagination
        total={products.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
}
