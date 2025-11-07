'use client'

import React from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/admin/ui/button'

export default function ReviewTable({ reviews, onApprove, onDelete }: any) {
  return (
    <div className="w-full border rounded-lg overflow-hidden shadow bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Người dùng</th>
            <th className="px-4 py-2 text-left">Sản phẩm</th>
            <th className="px-4 py-2 text-left">Nội dung</th>
            <th className="px-4 py-2 text-left">Số sao</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
            <th className="px-4 py-2 text-left">Ngày gửi</th>
            <th className="px-4 py-2 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500">
                Không có đánh giá nào
              </td>
            </tr>
          ) : (
            reviews.map((r: any, index: number) => (
              <tr key={r._id || index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{r.userId?.name || 'Ẩn danh'}</td>
                <td className="px-4 py-2">{r.productId?.name || 'Không rõ'}</td>
                <td className="px-4 py-2">{r.comment || '--'}</td>
                <td className="px-4 py-2">{r.rating} ⭐</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      r.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {r.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '--'}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    {r.status !== 'approved' && (
                      <Button size="sm" variant="outline" onClick={() => onApprove(r._id)}>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => onDelete(r._id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
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
