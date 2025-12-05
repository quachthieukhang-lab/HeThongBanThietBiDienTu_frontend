"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Thêm dòng này
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import type { CategoryLite, SubcategoryWithImage } from "@/app/user/types/category";
import AddressList from "@/components/user/home/AddressList";
import { useCartStore } from "@/app/user/hooks/cartStore";
import SearchAutocomplete from "./SearchAutoComplete";

export function Header() {
  const router = useRouter(); // Sử dụng hook useRouter
  const [userEmail, setUserEmail] = useState<string | null>(null);
   const cartCount = useCartStore((state) => state.cartCount);
   
  const fetchCategories = async (): Promise<CategoryLite[]> => {
    const res = await apiClient<any>("/categories");
    return Array.isArray(res) ? res : res.items ?? [];
  };

  const fetchSubcategories = async (categoryId: string): Promise<SubcategoryWithImage[]> => {
    const res = await apiClient<any>(`/subcategories?categoryId=${categoryId}`);
    return Array.isArray(res) ? res : res.items ?? [];
  };

  const { data: categories, error } = useSWR<CategoryLite[]>("categories", fetchCategories);
  const [subMap, setSubMap] = useState<Record<string, SubcategoryWithImage[]>>({});
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const handleHoverCategory = async (categoryId: string) => {
    setActiveCat(categoryId);
    if (subMap[categoryId]) return;
    try {
      const subs = await fetchSubcategories(categoryId);
      setSubMap((prev) => ({ ...prev, [categoryId]: Array.isArray(subs) ? subs : [subs] }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Lấy user info từ localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userRole");
    router.push("/auth/login"); // Thay thế bằng router.push
  };

  const navItems = [
    // { name: "Tất cả sản phẩm", href: "/user/products" },
    { name: "Máy lạnh", href: "/user/subcategories/may-lanh" },
    { name: "Máy giặt", href: "/user/subcategories/may-giat" },
    { name: "Tủ lạnh", href: "/user/subcategories/tu-lanh" },
    { name: "Tivi", href: "/user/subcategories/tivi" },
    { name: "Máy lọc nước", href: "/user/subcategories/may-loc-nuoc" },
    { name: "Khuyến mãi", href: "/user/khuyen-mai" },
    { name: "Hỗ trợ", href: "/user/support" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-700 via-blue-800 to-purple-600 shadow-xl border-b border-blue-500/20">
      {/* Top Section - Logo, Search, User Actions */}
      <div className="mx-auto px-8 py-3">
        <div className="flex items-center justify-between ml-10px gap-6">
          {/* Logo - Chiếm ít không gian hơn */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg whitespace-nowrap">
              Điện Máy <span className="text-white">Tech</span>
            </div>
          </Link>

          {/* Categories Dropdown - Thu gọn lại */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium min-w-[120px] justify-center shadow-lg hover:shadow-cyan-500/25 text-sm">
                <span>Danh mục</span>
                <ChevronDown size={14} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-gray-900 shadow-2xl rounded-lg overflow-hidden w-[800px] flex border border-cyan-500/30 animate-in fade-in-0 zoom-in-95"
                sideOffset={8}
              >
                <div className="w-[35%] bg-gray-800 border-r border-cyan-500/20 overflow-y-auto max-h-[480px]">
                  {!categories && !error && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-cyan-400" size={20} />
                    </div>
                  )}
                  {error && <div className="text-center text-red-400 py-4 text-sm">Lỗi tải dữ liệu</div>}
                  {categories?.map((cat) => (
                    <button
                      key={cat._id}
                      onMouseEnter={() => handleHoverCategory(cat._id)}
                      className={`w-full text-left px-4 py-3 text-sm transition-all border-b border-gray-700 last:border-0 ${
                        activeCat === cat._id 
                          ? "bg-cyan-900/50 text-cyan-300 font-semibold border-r-2 border-r-cyan-400" 
                          : "text-gray-300 hover:bg-cyan-900/30 hover:text-cyan-200"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <div className="w-[65%] p-6 overflow-y-auto max-h-[480px] bg-gray-900">
                  {activeCat && subMap[activeCat] ? (
                    <div className="grid grid-cols-2 gap-4">
                      {subMap[activeCat].map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/user/subcategories/${sub.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-900/30 transition-all group border border-transparent hover:border-cyan-500/30"
                        >
                          <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 shadow-lg shadow-cyan-400/50"></div>
                          <div>
                            <div className="font-medium text-white group-hover:text-cyan-300">
                              {sub.name}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : activeCat ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="animate-spin text-cyan-400 mr-2" size={16} />
                      <span className="text-cyan-300">Đang tải...</span>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-32 text-cyan-400/60">
                      Chọn danh mục để xem sản phẩm
                    </div>
                  )}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Search Bar - Chiếm nhiều không gian hơn */}
          <div className="flex-1 max-w-3xl min-w-[300px] text-white/80">
            <SearchAutocomplete />
          </div>


          {/* User & Cart & Address - Sắp xếp gọn gàng */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Address Selector */}
            <div className="min-w-[200px] text-white/80">
              <AddressList />
            </div>

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 text-white/80 hover:text-cyan-300 transition-colors font-medium hover:scale-105 text-sm">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <User size={16} className="text-cyan-400" />
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {userEmail || "Tài khoản"}
                  </span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="bg-gray-800 shadow-2xl rounded-lg p-2 w-48 animate-in fade-in-0 zoom-in-95 border border-cyan-500/30" 
                  sideOffset={8}
                >
                  {userEmail ? (
                    <>
                      <DropdownMenu.Item className="p-3 hover:bg-cyan-900/50 rounded-md cursor-pointer text-white text-sm">
                        <Link href="/user/orders" className="w-full block">Đơn hàng của tôi</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="p-3 hover:bg-cyan-900/50 rounded-md cursor-pointer text-white text-sm"
                        onSelect={handleLogout}
                      >
                        Đăng xuất
                      </DropdownMenu.Item>
                    </>
                  ) : (
                    <>
                      <DropdownMenu.Item className="p-3 hover:bg-cyan-900/50 rounded-md cursor-pointer text-white text-sm">
                        <Link href="/auth/login" className="w-full block">Đăng nhập</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="p-3 hover:bg-cyan-900/50 rounded-md cursor-pointer text-white text-sm">
                        <Link href="/auth/register" className="w-full block">Đăng ký</Link>
                      </DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Cart */}
            <Link href="/user/cart" className="relative flex items-center gap-2 text-white/80 hover:text-cyan-300 transition-colors font-medium hover:scale-105 text-sm">
              <div className="p-1.5 bg-white/10 rounded-lg relative">
                <ShoppingCart size={16} className="text-cyan-400" />
                 {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white/20">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
              </div>
              <span className="hidden sm:block">Giỏ hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation - Full width */}
      <nav className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="w-full px-4">
          <ul className="flex items-center justify-center gap-6 py-1 text-sm font-medium overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <li key={item.name} className="flex-shrink-0">
                <Link 
                  href={item.href} 
                  className="text-white/90 hover:text-cyan-300 transition-all py-2 block whitespace-nowrap hover:scale-105 border-b-2 border-transparent hover:border-cyan-400 text-sm"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
