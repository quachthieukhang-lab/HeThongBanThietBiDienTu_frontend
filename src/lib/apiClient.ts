import axios from "axios";
import { isMockEnabled } from "@/mock";

/**
 * Gọi API thật hoặc mock tương ứng
 * @param path   Đường dẫn API, ví dụ "/categories"
 * @param mockFn Hàm mock tương ứng
 */
export async function apiClient<T>(
  path: string,
  // nếu mockFn trả về T thì apiClient cũng trả về T
  mockFn: () => Promise<T>
): Promise<T> {
  if (isMockEnabled) return mockFn();
  // Gọi API thật
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  // Gọi API bằng axios
  // Do backend trả về dạng { items: [...] } nên cần xử lý thêm
  const res = await axios.get<T>(url);
  return (res.data as any).items ?? res.data;
}
