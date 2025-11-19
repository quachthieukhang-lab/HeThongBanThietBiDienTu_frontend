"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import type { ReviewLite } from "@/app/user/types/review";

interface Props {
  reviews: ReviewLite[];
  total: number;
  limit?: number;
}

export default function ProductReview({ reviews, total, limit = 3 }: Props) {
  const [showAll, setShowAll] = useState(false);
  const reviewsToShow = showAll ? reviews : reviews.slice(0, limit);

  // Tính rating trung bình và phân bố
  const { avgRating, ratingDistribution } = useMemo(() => {
    if (!reviews.length) return { avgRating: 0, ratingDistribution: [] };
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / reviews.length;
    
    // Tính phân bố rating
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      stars: star,
      count: reviews.filter(r => r.rating === star).length,
      percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
    }));
    
    return { avgRating: avg, ratingDistribution: distribution };
  }, [reviews]);

  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`${
            size === "md" ? "w-5 h-5" : "w-4 h-4"
          } ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Header với rating summary */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Overall rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {avgRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(avgRating)} size="md" />
              <div className="text-gray-600 text-sm mt-2">
                {total} đánh giá
              </div>
            </div>

            {/* Rating distribution */}
            <div className="md:col-span-2 space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-4">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review list */}
        {reviewsToShow.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">★</div>
            <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
            <p className="text-gray-400 text-sm mt-2">Hãy là người đầu tiên đánh giá sản phẩm này</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewsToShow.map((review) => {
              const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
              
              return (
                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                  {/* User info & date */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.userId?.avatarUrl ? (
                        <Image
                          src={review.userId.avatarUrl}
                          alt={review.userId.name}
                          width={44}
                          height={44}
                          className="rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {review.userId?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.userId?.name || "Người dùng"}
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {/* Review content */}
                  <div className="space-y-3">
                    {review.title && (
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {review.title}
                      </h3>
                    )}
                    
                    <p className="text-gray-700 leading-relaxed">
                      {review.content}
                    </p>

                    {/* Review images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto py-2">
                        {review.images.map((img, idx) => {
                          const imageUrl = img.startsWith("http") || img.startsWith("/")
                            ? img
                            : `${apiBase}/${img}`;

                          return (
                            <div key={idx} className="w-24 h-24 relative flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={`review-${idx}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more button */}
        {!showAll && total > limit && (
          <div className="text-center pt-4">
            <button
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setShowAll(true)}
            >
              Xem thêm {total - limit} đánh giá
            </button>
          </div>
        )}
      </div>
    </div>
  );
}