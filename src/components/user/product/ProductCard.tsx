"use client";
import Image from "next/image";
import Link from "next/link";
import type { ProductLite } from "@/types/product";

export default function ProductCard({ product }: { product: ProductLite }) {
  const { name, slug, thumbnail, priceFrom, priceTo, rating } = product;

  const showPrice =
    priceFrom === priceTo
      ? `${priceFrom.toLocaleString("vi-VN")}₫`
      : `${priceFrom.toLocaleString("vi-VN")}₫ - ${priceTo.toLocaleString(
          "vi-VN"
        )}₫`;

  return (
    <Link
      href={`/product/${slug}`}
      className="group bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition flex flex-col hover:text-blue-300"
    >
      <div className="relative h-36 md:h-48 lg:h-60 mb-3 rounded-lg overflow-hidden bg-gray-50 ">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        )}
      </div>
      
      <h3 className="text-sm font-medium line-clamp-2 mb-1 ">{name}</h3>
      <p className="text-yellow-500 text-xs font-light mb-1">Online giá quá rẻ</p>
      <p className="text-red-500 text-sm font-semibold">{showPrice}</p>
      {rating && (
        <p className="text-xs text-yellow-500 mt-1">
          ⭐ {rating.toFixed(1)} / 5
        </p>
      )}
    </Link>
  );
}
