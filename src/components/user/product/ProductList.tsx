"use client";
import { apiClient } from "@/lib/apiClient";
import useSWR from "swr";
import ProductCard from "./ProductCard";
import type { ProductLite } from "@/types/product";
import { mockApi } from "@/mock";

export default function ProductList() {

    const fetchProducts = async () : Promise<ProductLite[]> => {
     return apiClient("/products", mockApi.getProducts)};

    const {data : products , error , isLoading } = useSWR<ProductLite[]>("products", fetchProducts);

  if (error) return <p className="text-red-500 text-center mt-4">Không thể tải sản phẩm.</p>
  if (isLoading) return <p className="text-gray-500 text-center mt-4">Đang tải...</p>

  return (

    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Sản phẩm nổi bật
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {products?.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
