'use client'

import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'

export default function AttributeTemplateTable({
  items = [],
  loading = false,
  onEdit,
  onHardDelete,
}: any) {
  return (
    <div className="w-full rounded-lg shadow border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold">Subcategory</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Version</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">#Attrs</th>
              <th className="px-4 py-3 text-center text-xs font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center">Đang tải...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">Không có mục</td>
              </tr>
            ) : (
              items.map((t: any) => (
                console.log(t),
                <tr key={t._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-3 font-medium">
                    {(Array.isArray(t.attributes) &&
                      t.attributes.find((a: any) => a.key === 'att_template_name')?.label) ||
                      t.subcategoryId?.name ||
                      '—'
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {typeof t.subcategoryId === 'object' ? t.subcategoryId?.name ?? '—' : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">{t.version ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    {Array.isArray(t.attributes) ? t.attributes.length : 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 rounded hover:bg-indigo-100"
                      >
                        <Pencil size={16} className="text-indigo-600" />
                      </button>
                      <button
                        onClick={() => onHardDelete(t._id)}
                        className="p-2 rounded hover:bg-red-100"
                      >
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
