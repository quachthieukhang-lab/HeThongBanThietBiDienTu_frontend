import axios from "axios";
import { isMockEnabled } from "@/mock";

/**
 * apiClient - client chuẩn dùng cho toàn dự án
 * ---------------------------------------------
 *  - Hỗ trợ method (GET, POST, PUT, DELETE)
 *  - Hỗ trợ gửi body
 *  - Tự động gắn accessToken vào header
 *  - Giữ nguyên mockFn khi test
 */
export async function apiClient<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    mockFn?: () => Promise<T>;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", mockFn, body, headers = {} } = options;

  // 🔹 Xử lý mock trước
  if (isMockEnabled) {
    if (!mockFn) throw new Error("Mock function required when isMockEnabled = true");
    return await mockFn();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  try {
    // 🔐 Lấy accessToken từ localStorage (FE)
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
      accessToken = localStorage.getItem("accessToken");
    }

    // 🔧 Config chung
    const config = {
      method,
      url,
      data: body ?? undefined, // axios tự hiểu GET sẽ bỏ qua
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    };

    const res = await axios(config);
    const data = res.data;

    console.log("🔍 apiClient response:", { url, data });

    // ================================
    // CHUẨN HÓA DỮ LIỆU TRẢ VỀ
    // ================================

    // Format phân trang
    if (data?.items && data?.total) return data as T;

    // Format thông thường
    if (data?.data) return data.data as T;
    if (data?.result) return data.result as T;
    if (data?.payload) return data.payload as T;

    // Mặc định
    return data as T;
  } catch (error: any) {
    console.error("❌ apiClient error:", {
      url,
      message: error?.message,
      response: error?.response?.data,
    });

    throw new Error(error?.response?.data?.message || "API request failed");
  }
}
