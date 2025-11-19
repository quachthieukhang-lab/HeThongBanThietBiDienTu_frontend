"use client";
import { useWishlist } from "@/app/user/hooks/useWishList";
import ProductCard from "@/components/user/product/ProductCard";

export default function WishlistSection() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="text-center text-gray-500">
        
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Danh sách yêu thích</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
