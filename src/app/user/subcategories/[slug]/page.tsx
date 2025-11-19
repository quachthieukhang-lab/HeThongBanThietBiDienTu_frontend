"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";
import ProductList from "@/components/user/product/ProductList";
import type { ProductLite } from "@/app/user/types/product";
import type { SubcategoryBonus } from "@/app/user/types/category";
import { useSlugToIdMap } from "@/app/user/hooks/useSlugtoIdMap";
import type { PaginatedResponse } from "@/app/user/types/api";
import FAIcon from "@/components/user/home/FAIcon";

export default function SubcategoryPage() {
  const { slug } = useParams();
  const slugStr = (Array.isArray(slug) ? slug[0] : slug)?.toLowerCase();

  // --- Lấy map slug -> id ---
  const { data: slugToIdMap, isLoading: loadingMap, error: errorMap } =
    useSlugToIdMap<SubcategoryBonus>("/subcategories");

  const id = slugStr && slugToIdMap ? slugToIdMap[slugStr] : undefined;

  // --- Fetch subcategory ---
  const {
    data: subcategory,
    isLoading: loadingSub,
    error: errorSub,
  } = useSWR<SubcategoryBonus>(
    id ? `/subcategories/${id}` : null,
    (url: string) => apiClient<SubcategoryBonus>(url)
  );

  // --- Fetch products ---
  const {
    data: products,
    isLoading: loadingProd,
    error: errorProd,
  } = useSWR<PaginatedResponse<ProductLite>>(
    subcategory?._id ? `/products?subcategoryId=${subcategory._id}` : null,
    (url: string) => apiClient<PaginatedResponse<ProductLite>>(url)
  );

  // --- Fallback UI ---
  if (loadingMap || loadingSub || loadingProd)
    return <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>;

  if (errorMap || errorSub || errorProd)
    return (
      <p className="text-center text-red-500 mt-10">
        Lỗi tải dữ liệu, vui lòng thử lại sau.
      </p>
    );

  if (!slugToIdMap) return <p>Đang tải danh mục...</p>;
  if (!id || !subcategory)
    return <p className="text-center mt-10 text-gray-400">Không tìm thấy danh mục này.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Đã sửa gradient và layout */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-xl shadow-md mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Icon FontAwesome - Đã fix hiển thị icon */}
        {subcategory.icon && (
          <div className="w-20 h-20 mb-4 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            {subcategory.icon ? (
    <FAIcon icon={subcategory.icon} className="w-8 h-8 text-slate-700 group-hover:text-slate-900" />
  ) : (
    <div className="w-8 h-8 rounded bg-slate-200" />
  )}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center mb-4">
          {subcategory.name}
        </h1>

        {subcategory.description && (
          <p className="text-center max-w-2xl text-white/95 text-lg mt-2 px-4 md:px-0">
            {subcategory.description}
          </p>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {products && products?.items.length > 0 ? (
            <ProductList subcategoryId={subcategory._id} />
          ) : (
            <p className="text-center text-gray-500 py-8">
              Chưa có sản phẩm nào trong danh mục này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}