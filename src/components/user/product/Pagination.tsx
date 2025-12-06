"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  total: number;      
  pageSize: number;   
  currentPage: number; // BẮT BUỘC: nhận từ parent
  onChange: (page: number) => void;
  showInfo?: boolean;
}

export default function Pagination({ 
  total, 
  pageSize, 
  currentPage,
  onChange, 
  showInfo = true 
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onChange(page);
  };

  // Validate currentPage
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onChange(1);
    }
  }, [totalPages, currentPage, onChange]);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4">
      {/* Thông tin số lượng */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          {/* Hiển thị <span className="font-semibold">{startItem}-{endItem}</span>  */}
          {/* {" "}trong{" "}<span className="font-semibold">{total}</span> sản phẩm */}
        </div>
      )}

      {/* Nút phân trang */}
      <div className="flex items-center gap-1">
        {/* Nút Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
          } transition-colors`}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Các số trang */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-500"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const page = pageNum as number;
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                }`}
                aria-label={`Trang ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Nút Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
          } transition-colors`}
          aria-label="Trang sau"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Jump to page */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
        <span>Đến trang:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
              handlePageChange(page);
            }
          }}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span>/ {totalPages}</span>
      </div>
    </div>
  );
}