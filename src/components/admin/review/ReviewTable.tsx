'use client'

import React from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ReviewTable({ reviews, onApprove, onDelete }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Người dùng</th>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Nội dung</th>
              <th className="px-6 py-4 text-center">Số sao</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày gửi</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  Không có đánh giá nào
                </td>
              </tr>
            ) : (
              reviews.map((r: any) => (
                <tr key={r._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.userId?.name || 'Ẩn danh'}</td>
                  <td className="px-6 py-4 text-gray-600">{r.productId?.name || 'Không rõ'}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{r.comment || '--'}</td>
                  <td className="px-6 py-4 text-center font-semibold text-amber-600">{r.rating} ⭐</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {r.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.createdAt ? format(new Date(r.createdAt), 'dd/MM/yyyy', { locale: vi }) : '--'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {r.status !== 'approved' && (
                        <button onClick={() => onApprove(r._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Duyệt">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => onDelete(r._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Xóa">
                        <Trash2 size={18} />
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
