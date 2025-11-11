/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import type { SubcategoryLite, SubcategoryWithImage } from "@/types/category";
import { apiClient } from "@/lib/apiClient";
import { mockApi } from "@/mock";


export default function CategorySection() {
  // Gọi toàn bộ subcategories
  const fetchSubcategories = async (): Promise<SubcategoryWithImage[]> =>
    apiClient(`/subcategories`, () => mockApi.getSubcategories());

  const { data: subcategories, error, isLoading } = useSWR<SubcategoryWithImage[]>(
    `subcategories-all`,
    fetchSubcategories
  );
 const [showAll, setShowAll] = useState(false);


  if (isLoading)
    return <p className="text-center text-gray-500 mt-6">Đang tải danh mục...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-6">Không thể tải danh mục.</p>;

  if (!subcategories || subcategories.length === 0)
    return <p className="text-center text-gray-400 mt-6">Chưa có danh mục nào.</p>;
const initialCount = 6;
 const displayList = showAll ? subcategories : subcategories.slice(0, initialCount);
  return (
    
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Danh mục sản phẩm nổi bật
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 justify-center">
        {displayList.map((cat) => (
          <Link
            key={cat._id}
            href={`/subcategories/${cat.slug}`}
            className="group bg-white shadow-md rounded-2xl p-4 flex flex-col items-center transition hover:shadow-lg hover:-translate-y-1"
          >
            {cat.image && (
              <div className="w-16 h-16 mb-3 overflow-hidden rounded-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full group-hover:scale-105 transition"
                />
              </div>
            )}
            <p className="text-base font-medium group-hover:text-primary">
              {cat.name}
            </p>
          </Link>
        ))}
        
      </div>
       {/* Nút Xem thêm / Thu gọn */}
      {subcategories.length > initialCount && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="px-4 py-2 rounded-md border border-primary text-blue-400  font-bold hover:bg-primary hover:text-white  cursor-pointer transition"
          >
            {showAll ? "Thu gọn" : `Xem thêm danh mục (${subcategories.length - initialCount})`}
          </button>
        </div>
      )}
    </section>
  );
}
