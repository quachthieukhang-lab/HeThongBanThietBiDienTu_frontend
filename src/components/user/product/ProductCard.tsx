"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import type { ProductLite } from "@/types/product";

export default function ProductCard({ product }: { product: ProductLite }) {
  const { name, slug, thumbnail, priceFrom, priceTo, _id } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(_id);
  const showPrice =
    priceFrom === priceTo
      ? `${priceFrom.toLocaleString("vi-VN")}₫`
      : `${priceFrom.toLocaleString("vi-VN")}₫ - ${priceTo.toLocaleString("vi-VN")}₫`;

  return (
    <div className="group relative bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition flex flex-col">
      {/* ❤️ Icon */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10"
        title={inWishlist ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart
          className={`w-6 h-6 transition-all duration-200 transform hover:scale-110 ${
            inWishlist ? "fill-red-400 text-red-500" : "text-gray-400 hover:text-red-400 hover:fill-red-100"
          }`}
        />
      </button>

      {/* Ảnh sản phẩm */}
      <Link href={`/product/${slug}`} className="relative h-36 md:h-48 lg:h-60 mb-3 rounded-lg overflow-hidden bg-gray-50">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
        )}
      </Link>

      {/* Nội dung */}
      <Link href={`/product/${slug}`} className="flex flex-col flex-1 hover:text-blue-500">
        <h3 className="text-sm font-medium line-clamp-2 mb-1">{name}</h3>
        <p className="text-yellow-500 text-xs font-light mb-1">Online giá quá rẻ</p>
        <p className="text-red-500 text-sm font-semibold">{showPrice}</p>
      </Link>
    </div>
  );
}
