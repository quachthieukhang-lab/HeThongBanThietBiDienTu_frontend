"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";
import { mockApi } from "@/mock";
import ProductList from "@/components/user/product/ProductList";
import type { ProductLite } from "@/types/product";
import type { SubcategoryBonus, SubcategoryLite } from "@/types/category";

export default function SubcategoryPage() {
  const { slug } = useParams();

  // --- Lấy thông tin danh mục con ---
   const fetchSubcategory = async (): Promise<SubcategoryBonus | null> => {
    const res = await apiClient(
      `/subcategories/${slug}`,
      () => mockApi.getSubcategoryBySlug(slug as string)
    );
    // đảm bảo trả về null nếu không có data
    return res ?? null;
  };

 // --- Lấy danh sách sản phẩm theo subcategoryId ---
const fetchProducts = async (): Promise<ProductLite[]> => {
  if (!subcategory?._id) return []; // Nếu chưa có ID thì trả mảng rỗng
  return apiClient(
    `/products?subcategoryId=${subcategory._id}`,
    () => mockApi.getProductsBySubcategory(subcategory._id)
  );
};


  const { data: subcategory, isLoading: loadingSub } = useSWR<SubcategoryBonus | null>(
    slug ? `subcategory-${slug}` : null,
    fetchSubcategory
  );

  const { data: products, isLoading: loadingProd } = useSWR<ProductLite[]>(
  subcategory?._id ? `products-${subcategory._id}` : null,
  fetchProducts
);

  if (loadingSub || loadingProd)
    return <p className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</p>;

  if (!subcategory || !products)
    return <p className="text-center mt-10 text-gray-400">Không tìm thấy danh mục này.</p>;

  return (
  <div className="min-h-screen bg-gray-50">
    {/* Banner */}
    {subcategory.banner && (
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden shadow-md">
        <Image
          src={subcategory.banner}
          alt={subcategory.name}
          fill
          priority
          className="object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
            {subcategory.name}
          </h1>
          {subcategory.description && (
            <p className="max-w-2xl text-base md:text-lg opacity-90">
              {subcategory.description}
            </p>
          )}
        </div>
      </div>
    )}

    {/* Nội dung chính */}
    <div className=" mx-auto px-8 py-10">
      

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <ProductList subcategoryId={subcategory._id} />
      </div>
    </div>
  </div>
);


}
