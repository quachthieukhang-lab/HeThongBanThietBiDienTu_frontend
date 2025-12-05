"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";
import ProductList from "@/components/user/product/ProductList";
import type { ProductLite } from "@/app/user/types/product";
import type { Brand } from "@/app/user/types/brand";
import { useSlugToIdMap } from "@/app/user/hooks/useSlugtoIdMap";
import type { PaginatedResponse } from "@/app/user/types/api";
import FAIcon from "@/components/user/home/FAIcon";

export default function BrandPage() {
  const { slug } = useParams();
  const slugStr = (Array.isArray(slug) ? slug[0] : slug)?.toLowerCase();

  const { data: slugToIdMap, isLoading: loadingMap } =
    useSlugToIdMap<Brand>("/brands");

  const id = slugStr && slugToIdMap ? slugToIdMap[slugStr] : undefined;

  const { data: brand, isLoading: loadingBrand } = useSWR<Brand>(
    id ? `/brands/${id}` : null,
    (url: string) => apiClient<Brand>(url)
  );

  const { data: products, isLoading: loadingProd } = useSWR<PaginatedResponse<ProductLite>>(
    brand?._id ? `/products?brandId=${brand._id}` : null,
    (url: string) => apiClient<PaginatedResponse<ProductLite>>(url)
  );

  if (loadingMap || loadingBrand || loadingProd) return <p>Đang tải dữ liệu...</p>;
  if (!id || !brand) return <p>Không tìm thấy thương hiệu này.</p>;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

  // Hàm xử lý URL ảnh
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return ''
    // Nếu đã là URL đầy đủ thì giữ nguyên
    if (imagePath.startsWith('http')) return imagePath
    // Nếu là đường dẫn tương đối thì thêm base URL
    return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-md mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {brand.logoUrl && (
          <div className="w-20 h-20 mb-4 flex items-center justify-center bg-white/30 rounded-full shadow-lg border border-white/20">
            <img src={getImageUrl(brand.logoUrl)} alt={brand.name} className="w-12 h-12" />
          </div>
        )}
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg text-center mb-4">{brand.name}</h1>
        {brand.description && <p className="text-center max-w-2xl text-white/95 text-lg">{brand.description}</p>}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {products && products.items.length > 0 ? (
            <ProductList brandId={brand._id} />
          ) : (
            <p className="text-center text-gray-500 py-8">Chưa có sản phẩm nào thuộc thương hiệu này.</p>
          )}
        </div>
      </div>
    </div>
  );
}
