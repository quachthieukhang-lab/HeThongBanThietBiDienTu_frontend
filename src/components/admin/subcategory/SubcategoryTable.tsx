'use client'

import React from 'react'
import { Pencil, Trash2, Power, PowerOff } from 'lucide-react'

export default function SubcategoryTable({
  items = [],
  loading = false,
  onEdit,
  onDeactivate,
  onActivate,
  onHardDelete,
}: any) {
  return (
    <div className="w-full rounded-lg shadow border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold">Ảnh</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Danh mục cha</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Sort</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Không có mục
                </td>
              </tr>
            ) : (
              items.map((s: any) => (
                <tr key={s._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        width={50}
                        height={50}
                        className="rounded-md border object-cover w-[50px] h-[50px]"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.slug}</td>
                  <td className="px-4 py-3">{s.categoryId?.name ?? s.categoryName ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {s.isActive ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                        Ngừng
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{s.sortOrder ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(s)} className="p-2 rounded hover:bg-indigo-100">
                        <Pencil size={16} className="text-indigo-600" />
                      </button>

                      {s.isActive ? (
                        <button onClick={() => onDeactivate(s._id)} className="p-2 rounded hover:bg-yellow-100">
                          <PowerOff size={16} className="text-yellow-600" />
                        </button>
                      ) : (
                        <button onClick={() => onActivate(s._id)} className="p-2 rounded hover:bg-green-100">
                          <Power size={16} className="text-green-600" />
                        </button>
                      )}

                      <button onClick={() => onHardDelete(s._id)} className="p-2 rounded hover:bg-red-100">
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
    </div>
  )
}
