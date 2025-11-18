'use client'

import React from 'react'
import { Pencil, Trash2, Image } from 'lucide-react'

export default function ProductTable({ items = [], loading, onEdit, onHardDelete }: any) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

  // Hàm xử lý URL ảnh
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return ''
    // Nếu đã là URL đầy đủ thì giữ nguyên
    if (imagePath.startsWith('http')) return imagePath
    // Nếu là đường dẫn tương đối thì thêm base URL
    return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold">Ảnh</th>
            <th className="px-4 py-2 text-left text-xs font-semibold">Tên</th>
            <th className="px-4 py-2 text-left text-xs font-semibold">Slug</th>
            <th className="px-4 py-2 text-center text-xs font-semibold">Giá từ</th>
            <th className="px-4 py-2 text-center text-xs font-semibold">Giá đến</th>
            <th className="px-4 py-2 text-center text-xs font-semibold">Trạng thái</th>
            <th className="px-4 py-2 text-center text-xs font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y">
          {loading ? (
            <tr><td colSpan={7} className="py-4 text-center">Đang tải...</td></tr>
          ) : !items || items.length === 0 ? (
            <tr><td colSpan={7} className="py-4 text-center text-gray-500">Không có sản phẩm</td></tr>
          ) : (
            items.map((p: any) => (
              <tr key={p._id} className="hover:bg-indigo-50 transition">
                <td className="px-4 py-2">
                  {p.thumbnail ? (
                    <img 
                      src={getImageUrl(p.thumbnail)} 
                      alt={p.name} 
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        // Fallback nếu ảnh không load được
                        console.error('Failed to load image:', p.thumbnail)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                      <Image size={24} className="text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2 text-gray-500">{p.slug}</td>
                <td className="px-4 py-2 text-center">{p.priceFrom ?? '—'}</td>
                <td className="px-4 py-2 text-center">{p.priceTo ?? '—'}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.isPublished ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(p)} className="p-2 rounded hover:bg-indigo-100">
                      <Pencil size={16} className="text-indigo-600" />
                    </button>
                    <button onClick={() => onHardDelete(p._id)} className="p-2 rounded hover:bg-red-100">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}