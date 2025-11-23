'use client';

import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Search, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import OrderTable from '@/components/admin/orders/OrderTable';
import UpdateOrderModal from '@/components/admin/orders/UpdateOrderModal';
import axios from 'axios'
import useSWR from 'swr';

const fetcher = (url: string) => {
  const token = localStorage.getItem('accessToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.data);
};
export default function OrdersPage() {

    const [orders, setOrders] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const { data, error, isLoading } = useSWR('http://localhost:3000/orders', fetcher)
    if(data){
        
    }
    const loadOrders = async () => {

    }
    // Load danh sách đơn hàng

    // Xử lý xóa đơn hàng
    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) return;

        try {
            await apiClient(`/orders/${id}`, { method: 'DELETE' });
            setOrders((prev) => prev.filter((o) => o._id !== id));
            toast.success('Đã xóa đơn hàng');
        } catch (error: any) {
            toast.error(error.message || 'Xóa thất bại');
        }
    };

    // Xử lý cập nhật trạng thái thành công
    const handleUpdateSuccess = (updatedOrder: any) => {
        setOrders((prev) =>
            prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
        setEditingOrder(null);
        toast.success('Cập nhật trạng thái thành công');
    };

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
                    <p className="text-gray-500 text-sm mt-1">Theo dõi và xử lý các đơn hàng</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo mã đơn..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                    <button
                        onClick={loadOrders}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Tải lại"
                    >
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <OrderTable
                orders={data}
                isLoading={isLoading}
                onEdit={(order: any) => setEditingOrder(order)}
                onDelete={handleDelete}
            />

            {/* Modal Edit */}
            {editingOrder && (
                <UpdateOrderModal
                    order={editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
}