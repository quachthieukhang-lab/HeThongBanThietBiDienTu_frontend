'use client';
import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Pencil, Trash2, Layers } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export default function ProductTable({ products, onEdit, onDelete, onManageVariants }: any) {
  return (
    <div className="w-full rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden">
      <ScrollArea.Root className="w-full h-[640px] rounded-b-2xl">
        <ScrollArea.Viewport className="w-full h-full overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-100 text-gray-700 sticky top-0 z-10 shadow-sm">
              <tr>
                {['Ảnh', 'Tên', 'Slug', 'Giá (từ - đến)', 'Trạng thái', 'Hành động'].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {products.length > 0 ? products.map((p: any, idx: number) => (
                <tr key={p._id} className={`${idx%2===0?'bg-white':'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                  <td className="px-5 py-4 align-middle">
                    <img src={p.thumbnail ? `${BASE_URL}/${p.thumbnail}` : (p.images?.[0] ? `${BASE_URL}/${p.images[0]}` : '/no-image.png')}
                      alt={p.name}
                      className="h-12 w-12 object-cover rounded-md border"
                      onError={(e)=> (e.currentTarget.src = '/no-image.png')} />
                  </td>

                  <td className="px-5 py-4 align-middle font-medium">{p.name}</td>
                  <td className="px-5 py-4 align-middle text-gray-600">{p.slug}</td>
                  <td className="px-5 py-4 align-middle">{p.priceFrom ?? 0} - {p.priceTo ?? 0}</td>
                  <td className="px-5 py-4 align-middle capitalize">{p.isPublished ? 'Published' : 'Draft'}</td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onManageVariants(p)} className="p-2 rounded-md text-green-600 hover:bg-green-100">
                        <Layers size={16} />
                      </button>
                      <button onClick={() => onEdit(p)} className="p-2 rounded-md text-blue-600 hover:bg-blue-100">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => onDelete(p._id)} className="p-2 rounded-md text-red-600 hover:bg-red-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 italic">Không có sản phẩm</td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-gray-100 transition hover:bg-gray-200" orientation="vertical">
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-full" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
