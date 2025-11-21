'use client';

import React from 'react';
import { Eye, Trash2, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderTableProps {
  orders: any[];
  isLoading: boolean;
  onEdit: (order: any) => void;
  onDelete: (id: string) => void;
}

// Helper hiển thị màu sắc trạng thái
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'shipped': return 'bg-purple-100 text-purple-700';
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'refunded': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

// Helper hiển thị tên trạng thái tiếng Việt
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Chờ thanh toán',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    refunded: 'Hoàn tiền',
  };
  return map[status] || status;
};

export default function OrderTable({ orders, isLoading, onEdit, onDelete }: OrderTableProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500">Chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Ngày đặt</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order.code || order._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {order.shippingAddress?.fullName || 'Khách lẻ'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {order.shippingAddress?.phone}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {order.createdAt 
                    ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi }) 
                    : '-'}
                </td>
                <td className="px-6 py-4 font-semibold text-indigo-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Xem & Cập nhật"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(order._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}