'use client'

import React from 'react'
import { Pencil, Trash2, Power, PowerOff } from 'lucide-react'

function fmtDate(d?: string) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleString('vi-VN', { hour12: false })
}

export default function AttributeTemplateTable({
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
              <th className="px-4 py-3 text-left text-xs font-semibold">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Subcategory ID</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Version</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">#Attrs</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Cập nhật</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center">Đang tải...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">Không có mục</td>
              </tr>
            ) : (
              items.map((t: any) => (
                <tr key={t._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3 font-medium">{t.name ?? (t.subcategoryId?.name ?? '—')}</td>
                  <td className="px-4 py-3 text-gray-600">{typeof t.subcategoryId === 'string' ? t.subcategoryId : t.subcategoryId?._id ?? '—'}</td>
                  <td className="px-4 py-3 text-center">{t.version ?? '—'}</td>
                  <td className="px-4 py-3 text-center">{Array.isArray(t.attributes) ? t.attributes.length : 0}</td>
                  <td className="px-4 py-3 text-center">
                    {t.isActive ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Active</span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{fmtDate(t.updatedAt ?? t.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(t)} className="p-2 rounded hover:bg-indigo-100"><Pencil size={16} className="text-indigo-600" /></button>
                      {t.isActive ? (
                        <button onClick={() => onDeactivate(t._id)} className="p-2 rounded hover:bg-yellow-100"><PowerOff size={16} className="text-yellow-600" /></button>
                      ) : (
                        <button onClick={() => onActivate(t._id)} className="p-2 rounded hover:bg-green-100"><Power size={16} className="text-green-600" /></button>
                      )}
                      <button onClick={() => onHardDelete(t._id)} className="p-2 rounded hover:bg-red-100"><Trash2 size={16} className="text-red-600" /></button>
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
