import { apiFetch } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/brands`;

export const getBrands = async (query?: any) => {
  const queryString = query
    ? '?' + new URLSearchParams(query).toString()
    : '';
  const res = await apiFetch(`${API_URL}${queryString}`);
  if (!res.ok) throw new Error(`Lỗi tải brands: ${res.status}`);
  return res.json();
};

export const getBrand = async (id: string) => {
  const res = await apiFetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Không tìm thấy brand ${id}`);
  return res.json();
};

export const createBrand = async (brand: any, file?: File) => {
  const formData = new FormData();
  Object.keys(brand).forEach((key) => formData.append(key, brand[key]));
  if (file) formData.append('logoUrl', file);

  const res = await apiFetch(API_URL, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Tạo brand thất bại (${res.status})`);
  return res.json();
};

export const updateBrand = async (id: string, brand: any, file?: File) => {
  const formData = new FormData();
  Object.keys(brand).forEach((key) => formData.append(key, brand[key]));
  if (file) formData.append('logoUrl', file);

  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  if (!res.ok) throw new Error(`Cập nhật brand thất bại (${res.status})`);
  return res.json();
};

export const deleteBrand = async (id: string) => {
  const res = await apiFetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Xóa brand thất bại (${res.status})`);
  return res.json();
};
