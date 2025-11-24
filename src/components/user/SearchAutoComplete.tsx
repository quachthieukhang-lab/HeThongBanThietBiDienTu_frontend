"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";
import type { ProductLite } from "@/app/user/types/product";
import type { SubcategoryBonus } from "@/app/user/types/category";
import type { BrandLite } from "@/app/user/types/brand";
import type { PaginatedResponse } from "@/app/user/types/api";

export default function SearchAutocomplete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch tất cả (NHƯNG phải unwrap res.items)
  const { data: productsRes } = useSWR<PaginatedResponse<ProductLite>>(
  "/products?page=1&limit=500",
  apiClient
);

const { data: subsRes } = useSWR<PaginatedResponse<SubcategoryBonus>>(
  "/subcategories?page=1&limit=200",
  apiClient
);

const { data: brandsRes } = useSWR<PaginatedResponse<BrandLite>>(
  "/brands?page=1&limit=200",
  apiClient
);


  // BE trả dạng object => unwrap items
  const products = Array.isArray(productsRes) ? productsRes : productsRes?.items ?? [];
  const subcategories = Array.isArray(subsRes) ? subsRes : subsRes?.items ?? [];
  const brands = Array.isArray(brandsRes) ? brandsRes : brandsRes?.items ?? [];

  // Filter
  const q = debouncedTerm.toLowerCase();
  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(q)
  );
  const filteredSubcategories = subcategories.filter((s: any) =>
    s.name.toLowerCase().includes(q)
  );
  const filteredBrands = brands.filter((b: any) =>
    b.name.toLowerCase().includes(q)
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="🔍 Tìm kiếm sản phẩm, danh mục, thương hiệu..."
        className="w-full pl-3 pr-3 py-2 bg-white/10 border border-cyan-500/30 rounded-lg text-white placeholder-white/60 text-sm"
      />

      {debouncedTerm && (
        <div className="absolute w-full bg-gray-900 border border-cyan-500/20 mt-1 rounded-lg shadow-xl z-50 max-h-80 overflow-auto">
          
          {/* Products */}
          {filteredProducts.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-1">Sản phẩm</div>
              {filteredProducts.slice(0, 5).map((p: any) => (
                <Link key={p._id} href={`/user/product/${p.slug}`} className="block px-2 py-1 hover:bg-cyan-900/30 rounded">
                  {p.name}
                </Link>
              ))}
            </div>
          )}

          {/* Subcategories */}
          {filteredSubcategories.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-1">Danh mục</div>
              {filteredSubcategories.slice(0, 5).map((s: any) => (
                <Link key={s._id} href={`/user/subcategories/${s.slug}`} className="block px-2 py-1 hover:bg-cyan-900/30 rounded">
                  {s.name}
                </Link>
              ))}
            </div>
          )}

          {/* Brands */}
          {filteredBrands.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-1">Thương hiệu</div>
              {filteredBrands.slice(0, 5).map((b: any) => (
                <Link key={b._id} href={`/user/brands/${b.slug}`} className="block px-2 py-1 hover:bg-cyan-900/30 rounded">
                  {b.name}
                </Link>
              ))}
            </div>
          )}

          {/* No result */}
          {filteredProducts.length === 0 &&
            filteredSubcategories.length === 0 &&
            filteredBrands.length === 0 && (
              <div className="p-2 text-gray-400 text-sm text-center">
                Không có kết quả phù hợp
              </div>
            )}
        </div>
      )}
    </div>
  );
}
