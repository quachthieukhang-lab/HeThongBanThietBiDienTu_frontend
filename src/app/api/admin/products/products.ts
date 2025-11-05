import { apiFetch } from '@/lib/api'; // Đường dẫn tuỳ bạn, import apiFetch bạn đã có
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/products`;

// 🟢 Lấy danh sách sản phẩm (có phân trang, tìm kiếm, lọc)
export async function getProducts(query?: Record<string, any>) {
  const params = new URLSearchParams(query || {}).toString();
  const res = await apiFetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
  return res.json();
}

// 🟢 Lấy chi tiết 1 sản phẩm
export async function getProduct(id: string) {
  const res = await apiFetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Không thể tải thông tin sản phẩm');
  return res.json();
}

// 🟢 Tạo mới sản phẩm
export async function createProduct(data: any) {
  const res = await apiFetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Thêm sản phẩm thất bại');
  return res.json();
}

// 🟢 Cập nhật sản phẩm
export async function updateProduct(id: string, data: any) {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cập nhật sản phẩm thất bại');
  return res.json();
}

// 🟢 Xoá sản phẩm
export async function deleteProduct(id: string) {
  const res = await apiFetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Xoá sản phẩm thất bại');
  return res.json();
}

// ------------------------------
// 🔹 Các API con cho Variant
// ------------------------------

// 🟢 Lấy danh sách biến thể của sản phẩm
export async function getVariants(productId: string) {
  const res = await apiFetch(`${API_URL}/${productId}/variants`);
  if (!res.ok) throw new Error('Không thể tải danh sách biến thể');
  return res.json();
}

// 🟢 Tạo biến thể
export async function createVariant(productId: string, data: any) {
  const res = await apiFetch(`${API_URL}/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Thêm biến thể thất bại');
  return res.json();
}

// 🟢 Cập nhật biến thể
export async function updateVariant(productId: string, variantId: string, data: any) {
  const res = await apiFetch(`${API_URL}/${productId}/variants/${variantId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cập nhật biến thể thất bại');
  return res.json();
}

// 🟢 Xoá biến thể
export async function deleteVariant(productId: string, variantId: string) {
  const res = await apiFetch(`${API_URL}/${productId}/variants/${variantId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Xoá biến thể thất bại');
  return res.json();
}
