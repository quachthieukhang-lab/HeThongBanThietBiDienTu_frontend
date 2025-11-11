"use client";
import Link from "next/link";
import { ShoppingCart, User, Search, ChevronDown, Loader2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useSWR from "swr";
import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { mockApi } from "@/mock";
import type { CategoryLite, SubcategoryLite } from "@/types/category";

export function Header() {
  /** --- FETCH DATA --- */
  // Hàm lấy categories
  const fetchCategories = async (): Promise<CategoryLite[]> =>
    apiClient("/categories", mockApi.getCategories);

  // Hàm lấy subcategories theo categoryId
  const fetchSubcategories = async (categoryId: string): Promise<SubcategoryLite[]> =>
    apiClient(`/subcategories?categoryId=${categoryId}`, () =>
      mockApi.getSubcategories(categoryId)
    );
  
   // Sử dụng SWR để lấy categories 
  const { data: categories, error } = useSWR<CategoryLite[]>("categories", fetchCategories);
  const [subMap, setSubMap] = useState<Record<string, SubcategoryLite[]>>({});

  const handleHoverCategory = async (categoryId: string) => {
  if (subMap[categoryId]) return; // đã load rồi thì thôi
  try {
    const subs = await fetchSubcategories(categoryId);

    // Chắc chắn luôn là mảng, dù BE trả object hay array
    const subsArray = Array.isArray(subs) ? subs : [subs];

    setSubMap((prev) => ({ ...prev, [categoryId]: subsArray }));

    console.log("Updated subMap:", { ...subMap, [categoryId]: subsArray });
  } catch (err) {
    console.error("Lỗi tải subcategory:", err);
  }
};


  /** --- UI --- */
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3 gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 whitespace-nowrap">
          Điện Máy Online
        </Link>

        {/* --- Danh mục sản phẩm --- */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              <ChevronDown size={18} />
              <span className="font-medium">Danh mục</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white shadow-lg rounded-xl p-4 grid grid-cols-2 gap-6 w-[480px]"
              sideOffset={8}
            >
              {!categories && !error && (
                <div className="col-span-2 flex justify-center py-4">
                  <Loader2 className="animate-spin text-gray-400" />
                </div>
              )}

              {error && (
                <div className="col-span-2 text-center text-red-500">Lỗi tải dữ liệu</div>
              )}

              {categories?.map((cat) => (
                <div
                  key={cat._id}
                  onMouseEnter={() => handleHoverCategory(cat._id)}
                  className="transition-all"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{cat.name}</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    
                    {Array.isArray(subMap[cat._id]) ? (
                      subMap[cat._id].map((sub) => (
                        <li key={sub._id}>
                          <Link href={`/category/${sub.slug}`} className="hover:text-blue-600">
                            {sub.name}
                           
                          </Link>
                        </li>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        {!subMap[cat._id] ? "Đang tải..." : "Không có dữ liệu"}
                      </p>
                    )}
                 

                  </ul>
                  {!subMap[cat._id] && (
                    <p className="text-xs text-gray-400 italic">Đang tải...</p>
                  )}
                </div>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* --- Thanh tìm kiếm --- */}
        <div className="flex items-center w-full max-w-md border rounded-xl px-3 py-2 bg-gray-50">
          <Search className="text-blue-500 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full outline-none bg-transparent text-blue-600"
          />
        </div>

        {/* --- User và Cart --- */}
        <div className="flex items-center gap-4 whitespace-nowrap">
          {/* User dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                <User size={20} />
                <span>Tài khoản</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white shadow-md rounded-lg p-2 w-40"
                sideOffset={8}
              >
                <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded">
                  <Link href="/auth/login">Đăng nhập</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="p-2 hover:bg-gray-100 rounded">
                  <Link href="/auth/register">Đăng ký</Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Giỏ hàng */}
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-blue-600"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* --- Thanh nav nhỏ phía dưới --- */}
      <nav className="bg-blue-400 text-white text-sm">
        <ul className="container mx-auto flex gap-6 px-6 py-2">
          <li><Link href="/products">Tất cả sản phẩm</Link></li>
          <li><Link href="/khuyen-mai">Khuyến mãi</Link></li>
          <li><Link href="/chinh-sach">Chính sách bảo hành</Link></li>
          <li><Link href="/lien-he">Liên hệ</Link></li>
        </ul>
      </nav>
    </header>
  );
}
