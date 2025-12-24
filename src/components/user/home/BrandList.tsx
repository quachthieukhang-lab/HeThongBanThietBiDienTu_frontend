'use client'

import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { BrandLite } from '@/app/user/types/brand'
import { apiClient } from "@/lib/apiClient";

type PaginatedBrands = {
  items: BrandLite[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export default function BrandList() {
  const fetchBrands = async (): Promise<PaginatedBrands> => {
    const res = await apiClient<PaginatedBrands>("/brands");
    return res;
  };

  const { data, error, isValidating } = useSWR<PaginatedBrands>("/brands", fetchBrands);
  const brands = data?.items ?? [];
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  if (error) return <p className="text-red-500 text-center mt-4">Vui lòng chờ trong giây lát và tải lại trang</p>
  if (!brands && isValidating) return <p className="text-gray-500 text-center mt-4">Đang tải...</p>

  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Danh mục hãng sản phẩm</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
        {brands?.map((brand: BrandLite) => (
          <Link
            href={`/user/brand/${brand.slug}`}
            key={brand._id}
            className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            {brand.logoUrl ? (
              <Image
                src={`${backendUrl}/${brand.logoUrl}`}
                alt={brand.name}
                width={64}
                height={64}
                className="object-contain mb-2"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mb-2 rounded-lg text-gray-400 text-sm">
                No Logo
              </div>
            )}

            <h3 className="text-sm font-medium text-gray-700 text-center">{brand.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
