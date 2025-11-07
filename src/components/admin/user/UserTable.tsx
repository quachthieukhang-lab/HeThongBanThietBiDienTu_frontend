'use client'

import React from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { Pencil, Trash2, RotateCcw } from 'lucide-react'

export default function UserTable({ users, onEdit, onDelete, onRestore }: any) {
  return (
    <div className="w-full rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden">
      <ScrollArea.Root className="w-full h-[600px] rounded-b-2xl">
        <ScrollArea.Viewport className="w-full h-full overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-100 text-gray-700 sticky top-0 z-10 shadow-sm">
              <tr>
                {['Tên', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Hành động'].map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {users.length > 0 ? (
                users.map((u: any, idx: number) => (
                  <tr
                    key={u._id}
                    className={`transition-colors duration-200 hover:bg-indigo-50 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* Tên */}
                    <td className="px-5 py-3 font-medium text-gray-800 break-words max-w-[200px]">
                      {u.name}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3 text-gray-600 break-all max-w-[250px]">{u.email}</td>

                    {/* SĐT */}
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{u.phone || '-'}</td>

                    {/* Vai trò */}
                    <td className="px-5 py-3 space-x-1">
                      {u.roles?.map((r: string, i: number) => (
                        <span
                          key={i}
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                            r === 'admin'
                              ? 'bg-blue-100 text-blue-700'
                              : r === 'customer'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium capitalize ${
                          u.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : u.status === 'blocked'
                            ? 'bg-yellow-100 text-yellow-700'
                            : u.status === 'deleted'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Hành động */}
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        {u.status !== 'deleted' ? (
                          <>
                            <button
                              title="Chỉnh sửa"
                              onClick={() => onEdit(u)}
                              className="p-2 rounded-md text-blue-600 hover:bg-blue-100 hover:scale-110 transition"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              title="Xóa"
                              onClick={() => onDelete(u._id)}
                              className="p-2 rounded-md text-red-600 hover:bg-red-100 hover:scale-110 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            title="Khôi phục"
                            onClick={() => onRestore(u._id)}
                            className="p-2 rounded-md text-green-600 hover:bg-green-100 hover:scale-110 transition"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500 text-sm italic bg-gray-50"
                  >
                    Không có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea.Viewport>

        {/* Thanh cuộn tùy chỉnh */}
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-100 transition hover:bg-gray-200"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-full" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}
