'use client'
import React from 'react'
import Image from 'next/image'
import { Pencil, Trash2, Power, PowerOff } from 'lucide-react'

export default function CategoryTable({ items = [], loading = false, onEdit, onDeactivate, onActivate, onHardDelete }: any) {
  return (
    <div className="w-full rounded-lg shadow border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold">Ảnh</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Tên danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Slug</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Thứ tự</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Đường dẫn</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {loading ? (
              <tr><td colSpan={7} className="py-6 text-center">Đang tải...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="py-6 text-center text-gray-500">Không có danh mục nào</td></tr>
            ) : (
              items.map((c: any) => (
                <tr key={c._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.name}
                        width={50}
                        height={50}
                        className="rounded-md border object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-100 border rounded-md flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.slug}</td>
                  <td className="px-4 py-3 text-center">
                    {c.isActive ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Đang hoạt động</span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">Ngừng hoạt động</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{c.sortOrder ?? 0}</td>
                  <td className="px-4 py-3">{c.path}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(c)} className="p-2 rounded hover:bg-indigo-100">
                        <Pencil size={16} className="text-indigo-600" />
                      </button>
                      {c.isActive ? (
                        <button onClick={() => onDeactivate(c._id)} className="p-2 rounded hover:bg-yellow-100">
                          <PowerOff size={16} className="text-yellow-600" />
                        </button>
                      ) : (
                        <button onClick={() => onActivate(c._id)} className="p-2 rounded hover:bg-green-100">
                          <Power size={16} className="text-green-600" />
                        </button>
                      )}
                      <button onClick={() => onHardDelete(c._id)} className="p-2 rounded hover:bg-red-100">
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
