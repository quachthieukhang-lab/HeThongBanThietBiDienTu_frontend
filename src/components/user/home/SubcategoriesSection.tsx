"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import type { SubcategoryWithImage } from "@/types/category";
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
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Danh mục sản phẩm nổi bật
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 justify-center">
        {displayList.map((s) => (
          <Link
            key={s._id}
            href={`/subcategories/${s.slug}`} // chỉ hiển thị slug trong URL
            className="group bg-white shadow-md rounded-2xl p-4 flex flex-col items-center transition hover:shadow-lg hover:-translate-y-1"
          >
            <div className="w-16 h-16 mb-3 flex items-center justify-center overflow-hidden rounded-xl text-2xl">
              <i className={s.icon}></i>
            </div>
            <p className="text-base font-medium group-hover:text-primary">{s.name}</p>
          </Link>
        ))}
      </div>

      {featuredSubcategories.length > initialDisplayCount && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="px-4 py-2 rounded-md border border-primary text-blue-400 font-bold  hover:bg-indigo-400 hover:text-white cursor-pointer transition"
          >
            {showAll
              ? "Thu gọn"
              : `Xem thêm danh mục (${featuredSubcategories.length - initialDisplayCount})`}
          </button>

          {showAll && (
            <Link
              href="/subcategories"
              className="px-4 py-2 rounded-md border border-primary text-blue-400 font-bold hover:bg-indigo-400 hover:text-white cursor-pointer transition"
            >
              Xem tất cả
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
