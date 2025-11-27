"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import type { SubcategoryWithImage } from "@/app/user/types/category";
import { apiClient } from "@/lib/apiClient";

export default function SubcategoriesSection() {
  const [showAll, setShowAll] = useState(false);

  // --- Fetch toàn bộ subcategory ---
  const fetchAllSubcategories = async (): Promise<SubcategoryWithImage[]> => {
    const limit = 100;
    let page = 1;
    let all: SubcategoryWithImage[] = [];

    while (true) {
      const res = await apiClient<any>(`/subcategories?limit=${limit}&page=${page}`);
      const items: SubcategoryWithImage[] =
        res?.items ?? res?.data ?? (Array.isArray(res) ? res : []);
      if (!Array.isArray(items) || items.length === 0) break;
      all = all.concat(items);
      const totalPages = res?.pages ?? 1;
      if (page >= totalPages) break;
      page++;
    }

    return all;
  };

  const { data: subcategories, error, isLoading } = useSWR<SubcategoryWithImage[]>(
    "subcategories-all",
    fetchAllSubcategories
  );

  if (isLoading) return <p className="text-center mt-6 text-gray-500">Đang tải danh mục...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">Không thể tải danh mục.</p>;
  if (!subcategories || subcategories.length === 0)
    return <p className="text-center mt-6 text-gray-400">Chưa có danh mục nào.</p>;

  // --- Lọc subcategory nổi bật ---
  const featuredSubcategories = subcategories.filter(
    (s) => s.isActive && [1, 2, 3].includes(s.sortOrder ?? 0)
  );

  const initialDisplayCount = 6;
  const displayList = showAll
    ? featuredSubcategories
    : featuredSubcategories.slice(0, initialDisplayCount);

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Thiết Bị Điện Tử
          </h2>
          <p className="text-slate-600 text-lg">
            Khám phá công nghệ mới nhất cho cuộc sống hiện đại
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {displayList.map((s, index) => {
            const uniqueKey = s._id?.$oid || s._id || `fallback-${index}`;
            
            // Xử lý đường dẫn ảnh giống như ProductCard
            const imageSrc = s.image 
              ? `http://localhost:3000/${s.image}`
              : null;

            return (
              <Link
                key={uniqueKey}
                href={`/user/subcategories/${s.slug}`}
                className="group bg-white rounded-xl p-5 flex flex-col items-center text-center border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-16 h-16 mb-4 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors overflow-hidden">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={s.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 64px, 64px"
                      onError={(e) => {
                        // Fallback khi ảnh lỗi
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    // Fallback khi không có ảnh
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <span className="text-xl">📦</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>
        
        {featuredSubcategories.length > initialDisplayCount && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-8 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-sm hover:shadow-md"
            >
              {showAll
                ? "Thu Gọn"
                : `Xem Thêm ${featuredSubcategories.length - initialDisplayCount} Danh Mục`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}