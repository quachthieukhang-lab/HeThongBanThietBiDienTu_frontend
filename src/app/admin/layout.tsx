'use client'

import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { LayoutDashboard, BarChart3, Users, Boxes, Package, Tag, Star, Gift, ChevronDown, ChevronRight } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false)

  const links = [
    { label: 'Trang Chủ', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Báo Cáo Thống Kê', href: '/admin/reports', icon: <BarChart3 size={18} /> },
    { label: 'Người Dùng', href: '/admin/users', icon: <Users size={18} /> },
    { label: 'Danh Mục Sản Phẩm', href: '/admin/categories', icon: <Boxes size={18} />, sub: [
      { label: 'Danh mục chính', href: '/admin/categories' },
      { label: 'Danh mục con', href: '/admin/subcategories' },
    ]},
    { label: 'Gói Dịch Vụ Sản Phẩm', href: '/admin/packages', icon: <Package size={18} /> },
    { label: 'Quản Lý Đơn Hàng', href: '/admin/orders', icon: <Tag size={18} /> },
    { label: 'Thương Hiệu', href: '/admin/brands', icon: <Star size={18} /> },
    { label: 'Đánh Giá', href: '/admin/reviews', icon: <Star size={18} /> },
    { label: 'Khuyến Mãi', href: '/admin/promotions', icon: <Gift size={18} /> },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-indigo-600 to-purple-600 text-white fixed top-0 left-0 h-full overflow-y-auto shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-10">Quản Trị Viên</h2>

          <nav className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-white/70 mb-3">Tổng Quan</p>
            {links.slice(0, 2).map(link => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition ${
                    pathname === link.href ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}

            <p className="text-xs uppercase tracking-wider text-white/70 mt-6 mb-3">Quản Lý</p>

            {links.slice(2).map(link => (
              <div key={link.href}>
                {/* Nếu có submenu */}
                {link.sub ? (
                  <>
                    <div
                      onClick={() => setOpenCategoryMenu(p => !p)}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition ${
                        pathname.startsWith('/admin/categories') ||
                        pathname.startsWith('/admin/subcategories')
                          ? 'bg-white/20 font-semibold'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                      {openCategoryMenu ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    {openCategoryMenu && (
                      <div className="ml-10 mt-1 space-y-1">
                        {link.sub.map(sub => (
                          <Link key={sub.href} href={sub.href}>
                            <div
                              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                pathname === sub.href
                                  ? 'bg-white/20 font-semibold'
                                  : 'hover:bg-white/10'
                              }`}
                            >
                              {sub.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={link.href}>
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition ${
                        pathname === link.href ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-10 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <AvatarFallback>NH</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Ngô Nhựt Hào</p>
                <p className="text-xs text-gray-200">nnhao@gmail.com</p>
              </div>
            </div>
            <button className="mt-4 w-full text-left text-sm text-gray-200 hover:text-white transition">
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 p-6 min-h-screen">{children}</main>
    </div>
  )
}
