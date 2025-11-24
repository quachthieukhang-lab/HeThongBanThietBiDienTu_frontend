"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/apiClient";

export interface SlugEntity {
  _id: string;
  slug: string;
}

/**
 * useSlugToIdMap
 * ----------------------------------
 * ✅ Fetch toàn bộ entity có slug (dạng phân trang)
 * ✅ Gộp tất cả các trang vào 1 mảng duy nhất
 * ✅ Tạo map slugLowercase -> _id để tra cứu nhanh
 */
export function useSlugToIdMap<T extends SlugEntity>(endpoint: string) {
  const { data, error, isLoading } = useSWR<Record<string, string>>(
    endpoint, // SWR key — duy nhất cho endpoint này
    async () => {
      let all: T[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        // ✅ Gọi API (apiClient đã giữ nguyên structure)
        const res = await apiClient<any>(`${endpoint}?page=${page}&limit=100`);

        // Nếu response hợp lệ
        const items: T[] = res.items ?? res.data ?? (Array.isArray(res) ? res : []);
        if (!items.length) break;

        // Gộp kết quả
        all = all.concat(items);

        // Cập nhật số trang để lặp tiếp
        totalPages = res.pages ?? 1;
        page++;
      } while (page <= totalPages);

      // ✅ Tạo map slug -> id
      const map: Record<string, string> = {};
      for (const item of all) {
        if (item?.slug && item?._id) {
          map[item.slug.toLowerCase()] = item._id;
        }
      }
      return map;
    }
  );

  return { data, error, isLoading };
}
