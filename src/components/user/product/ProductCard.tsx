"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/app/user/hooks/useWishList";
import type { ProductLite } from "@/app/user/types/product";

export default function ProductCard({ product }: { product: ProductLite }) {
  const { name, slug, thumbnail, priceFrom, priceTo, _id } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(_id);
  const showPrice =
    priceFrom === priceTo
      ? `${priceFrom.toLocaleString("vi-VN")}₫`
      : `${priceFrom.toLocaleString("vi-VN")}₫ - ${priceTo.toLocaleString("vi-VN")}₫`;

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
        title={inWishlist ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            inWishlist 
              ? "fill-red-500 text-red-500" 
              : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      {/* Product Image */}
      <Link 
        href={`/user/product/${slug}`} 
        className="relative aspect-square mb-3 bg-gray-100 overflow-hidden"
      >
        {thumbnail && (
          <Image
            src={`http://localhost:3000/${thumbnail}`}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        )}
      </Link>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/user/product/${slug}`} className="flex flex-col flex-1">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {name}
          </h3>
          
          <div className="mt-auto space-y-2">
            <div className="text-xs text-green-600 font-medium">
              Online giá rẻ
            </div>
            
            <div className="text-base font-semibold text-red-600">
              {showPrice}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}