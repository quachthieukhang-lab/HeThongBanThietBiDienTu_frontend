import axios from "axios";
import { isMockEnabled } from "@/mock";

/**
 * apiClient - Hàm fetch API chung cho toàn project.
 * --------------------------------------------------
 * ✅ Hỗ trợ mock (nếu bật isMockEnabled)
 * ✅ Tự động thêm baseURL từ .env
 * ✅ Chuẩn hóa dữ liệu trả về (giữ nguyên cấu trúc phân trang)
 * ✅ Bắt lỗi gọn gàng, dễ debug
 */
export async function apiClient<T>(
  path: string,
  mockFn?: () => Promise<T>
): Promise<T> {
  // 🔹 Nếu đang bật chế độ mock (dành cho dev / test)
  if (isMockEnabled) {
    if (!mockFn) throw new Error("Mock function required when isMockEnabled = true");
    return await mockFn();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

    const res = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const data = res.data; // Axios luôn chứa response JSON tại đây

    console.log("🔍 apiClient response:", { url, data });

    /**
     * ✅ CHUẨN HÓA DỮ LIỆU TRẢ VỀ
     * --------------------------------
     * Giữ nguyên các cấu trúc phân trang { items, total, pages, ... }
     * để các hàm khác có thể đọc được total / pages.
     */
    if (Array.isArray(data)) return data as any;

    // ⚙️ Nếu backend trả dạng phân trang, giữ nguyên
    if (data?.items && data?.total) return data as any;

    // ⚙️ Các dạng khác vẫn hỗ trợ như cũ
    if (data?.data) return data.data as any;
    if (data?.result) return data.result as any;
    if (data?.payload) return data.payload as any;

    // ⚙️ Mặc định: trả về toàn bộ data
    return data as any;
  } catch (error: any) {
    console.error("❌ apiClient error:", {
      url: path,
      message: error?.message,
      response: error?.response?.data,
    });
    throw new Error(error?.response?.data?.message || "API request failed");
  }
}
