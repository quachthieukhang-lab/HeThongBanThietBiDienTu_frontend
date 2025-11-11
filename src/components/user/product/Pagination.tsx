"use client";

import { useState } from "react";

interface PaginationProps {
  total: number;      // tổng sản phẩm
  pageSize: number;   // số sản phẩm mỗi trang
  onChange: (page: number) => void;
}

export default function Pagination({ total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const [current, setCurrent] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrent(page);
    onChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {[...Array(totalPages)].map((_, idx) => {
        const page = idx + 1;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg border ${
              current === page
                ? "bg-primary text-white border-primary"
                : "bg-white hover:bg-gray-100 border-gray-300"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
