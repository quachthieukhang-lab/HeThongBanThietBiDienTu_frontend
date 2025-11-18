// src/types/api.ts
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
