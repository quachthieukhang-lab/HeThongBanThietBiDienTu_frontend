"use client";

import { useState } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";
import { mockApi } from "@/mock";
import type { ProductLite } from "@/app/user/types/product";
import type { PaginatedResponse } from "@/app/user/types/api";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";


interface ProductListProps {
  subcategoryId?: string;
  brandId?: string;
}

export default function ProductList({ subcategoryId, brandId }: ProductListProps) {
  // --- 1️⃣ State quản lý phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // --- 2️⃣ Hàm fetch dữ liệu ---
  const fetchProducts = async (): Promise<PaginatedResponse<ProductLite>> => {
    let url = `/products?page=${currentPage}&limit=${pageSize}`;
    if (subcategoryId) url += `&subcategoryId=${subcategoryId}`;
    if (brandId) url += `&brandId=${brandId}`;

    const res = await apiClient<PaginatedResponse<ProductLite>>(url);
    return res;
  };

  // --- 3️⃣ Gọi API với SWR ---
  const { data, error, isLoading } = useSWR([subcategoryId, brandId, currentPage], fetchProducts);

  const products = data?.items ?? [];
  const total = data?.total ?? 0;


  // --- 4️⃣ Xử lý trạng thái ---
  if (error) return <p className="text-red-500 text-center mt-4">Không thể tải sản phẩm.</p>;
  if (isLoading) return <p className="text-gray-500 text-center mt-4">Đang tải dữ liệu sản phẩm...</p>;

  if (products.length === 0)
    return <p className="text-center text-gray-500 py-8">Chưa có sản phẩm nào.</p>;

  // --- 5️⃣ Giao diện ---
  return (
  <section className="py-8">
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {subcategoryId ? "Sản phẩm theo danh mục" : "Sản phẩm nổi bật"}
        </h2>
        <p className="text-gray-600 text-sm">
          {subcategoryId 
            ? "Khám phá các sản phẩm chất lượng trong danh mục" 
            : "Những sản phẩm được ưa chuộng nhất"
          }
        </p>
      </div>

      {/* Products grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-400 text-sm mt-2">Vui lòng thử lại với bộ lọc khác</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <Pagination
              total={total}
              pageSize={pageSize}
              onChange={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}
    </div>
  </section>
);
}
