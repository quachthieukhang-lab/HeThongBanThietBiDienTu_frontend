'use client';

import React, { useState } from 'react';
import { X, Truck, CreditCard, User, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';

interface UpdateOrderModalProps {
  order: any;
  onClose: () => void;
  onSuccess: (updatedOrder: any) => void;
}

export default function UpdateOrderModal({ order, onClose, onSuccess }: UpdateOrderModalProps) {
  const [status, setStatus] = useState(order.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiClient(`/orders/${order._id}`, {
        method: 'PATCH',
        body: { status },
      });
      onSuccess(res);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết đơn hàng <span className="text-indigo-600">#{order.code || order._id.slice(-6).toUpperCase()}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cột trái: Thông tin khách hàng */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <User size={16} /> Thông tin người nhận
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Họ tên:</span> {order.shippingAddress?.fullName}</p>
                    <p><span className="font-medium">SĐT:</span> {order.shippingAddress?.phone}</p>
                    <p className="flex gap-2 items-start">
                        <MapPin size={16} className="shrink-0 mt-0.5" />
                        <span>
                            {order.shippingAddress?.line1}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}
                        </span>
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <CreditCard size={16} /> Thanh toán
                </h3>
                <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Phương thức:</span> <span className="uppercase">{order.paymentMethod}</span></p>
                    <p><span className="font-medium">Tổng tiền:</span> <span className="text-indigo-600 font-bold text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</span></p>
                </div>
            </div>
          </div>

          {/* Cột phải: Danh sách sản phẩm & Trạng thái */}
          <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-800 mb-3">Sản phẩm ({order.items?.length || 0})</h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                    {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    {new Intl.NumberFormat('vi-VN').format(item.price)} đ x {item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl">
                <h3 className="font-semibold text-indigo-900 flex items-center gap-2 mb-3">
                    <Truck size={16} /> Cập nhật trạng thái
                </h3>
                <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white text-sm"
                >
                    <option value="pending">Chờ thanh toán (Pending)</option>
                    <option value="processing">Đang xử lý (Processing)</option>
                    <option value="shipped">Đang giao hàng (Shipped)</option>
                    <option value="delivered">Đã giao thành công (Delivered)</option>
                    <option value="cancelled">Đã hủy (Cancelled)</option>
                    <option value="refunded">Hoàn tiền (Refunded)</option>
                </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 font-medium bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
                Đóng
            </button>
            <button 
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-white font-medium bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center gap-2"
            >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>

      </div>
    </div>
  );
}