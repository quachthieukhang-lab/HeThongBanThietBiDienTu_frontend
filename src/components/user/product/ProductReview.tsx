"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import type { ReviewLite } from "@/types/review";

interface Props {
  reviews: ReviewLite[]; // tất cả review đã fetch từ page
  total: number;         // tổng số review
  limit?: number;        // số review hiển thị ban đầu (mặc định 3)
}

export default function ProductReview({ reviews, total, limit = 3 }: Props) {
  const [showAll, setShowAll] = useState(false);

  // Reviews để hiển thị
  const reviewsToShow = showAll ? reviews : reviews.slice(0, limit);

  // --- Tính rating trung bình ---
  const avgRating = useMemo(() => {
    if (!reviewsToShow.length) return 0;
    const sum = reviewsToShow.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviewsToShow.length;
  }, [reviewsToShow]);

  return (
    <div className="bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header: avg rating */}
        <div className="  bg-white p-4 rounded-lg shadow-sm">
          {<h2 className="text-lg font-semibold mb-3 text-blue-600" >Đánh giá sản phẩm </h2>}
          <div className="flex items-center gap-2">
               
            <div className="flex items-center text-yellow-500 text-lg">
             {<p>Đánh giá :</p>}
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx} className={idx < Math.round(avgRating) ? "fas" : "far"}>
                  ★
                </span>
              ))}
            </div>
            
            <span className="font-semibold text-gray-800">{avgRating.toFixed(1)}/5</span>
          </div>
          <span className="text-gray-500 text-sm">{total} đánh giá</span>
        </div>

        {/* Review list */}
        {reviewsToShow.length === 0 ? (
          <div className="text-gray-500 text-center py-6">Chưa có đánh giá nào</div>
        ) : (
          reviewsToShow.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {review.userId?.avatarUrl ? (
                    <Image
                      src={review.userId.avatarUrl}
                      alt={review.userId.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      {review.userId?.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="font-medium">{review.userId?.name || "Người dùng"}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={idx < review.rating ? "fas" : "far"}>
                    ★
                  </span>
                ))}
              </div>

              {review.title && <h3 className="font-semibold">{review.title}</h3>}
              <p className="text-gray-700 text-sm">{review.content}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto mt-2">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 relative flex-shrink-0 rounded border">
                      <Image src={img} alt={`review-${idx}`} fill className="object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Nút xem tất cả */}
        {!showAll && total > limit && (
          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-blue-300 text-white rounded-lg"
              onClick={() => setShowAll(true)}
            >
              Xem tất cả đánh giá
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
