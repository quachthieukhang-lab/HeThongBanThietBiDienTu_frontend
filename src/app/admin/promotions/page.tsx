'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle, Search } from 'lucide-react';
import PromotionTable from '@/components/admin/promotion/PromotionTable';
import PromotionModal, { PromotionFormData } from '@/components/admin/promotion/PromotionModal';
import DeleteConfirmationModal from '@/components/admin/promotion/DeleteConfirmationModal';
import dayjs from 'dayjs'; // Import dayjs

export enum DiscountType {
  Percentage = 'percentage',
  FixedAmount = 'fixed_amount',
}

export type Promotion = {
  _id: string;
  name: string;
  description: string;
  discount_type: DiscountType;
  code: string;
  discount_value: number;
  discount_amount: number; // Thêm lại trường này
  start_date: Date;
  end_date: Date;
  status: boolean; // Đổi tên từ isActive
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  // ... (giữ nguyên useEffect loadPromotions) ...
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`${backendUrl}/promotions?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        setPromotions(Array.isArray(data) ? data : data.items || []);
      } catch (error: any) {
        toast.error(error.message || 'Tải danh sách khuyến mãi thất bại');
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      loadPromotions();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, backendUrl]);

  // Cập nhật handleSave dùng dayjs
  const handleSave = async (formData: PromotionFormData, id?: string) => {
    const isEditMode = !!id;
    const url = isEditMode ? `${backendUrl}/promotions/${id}` : `${backendUrl}/promotions`;
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      // Dùng dayjs để parse và format sang ISO string chuẩn UTC
      // .startOf('day') set về 00:00:00
      // .endOf('day') set về 23:59:59
      const startDate = dayjs(formData.start_date).startOf('day').toISOString();
      const endDate = dayjs(formData.end_date).endOf('day').toISOString();

      const res = await apiFetch(url, {
        method: method,
        body: JSON.stringify({
          ...formData,
          discount_type: formData.discount_type.toUpperCase(),
          start_date: startDate,
          end_date: endDate,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      const savedPromotion = await res.json();

      if (isEditMode) {
        setPromotions(prev => prev.map(p => (p._id === id ? savedPromotion : p)));
        setEditingPromotion(null);
        toast.success('Cập nhật khuyến mãi thành công!');
      } else {
        setPromotions(prev => [savedPromotion, ...prev]);
        setIsAddModalOpen(false);
        toast.success('Tạo khuyến mãi thành công!');
      }
    } catch (error: any) {
      const errorMessage = isEditMode ? 'Cập nhật thất bại.' : 'Tạo mới thất bại.';
      toast.error(error.message ? `${errorMessage} ${error.message}` : errorMessage);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!deletingPromotion) return;
    try {
      await apiFetch(`${backendUrl}/promotions/${id}`, { method: 'DELETE' });
      setPromotions(prev => prev.filter(p => p._id !== id));
      setDeletingPromotion(null);
      toast.success('Xóa khuyến mãi thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Xóa khuyến mãi thất bại.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* ... (giữ nguyên phần UI) ... */}
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý Khuyến Mãi</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm..." className="pl-8 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            <PlusCircle size={18} /> Tạo Mới
          </button>
        </div>
      </div>

      <PromotionTable promotions={promotions} loading={loading} onEdit={setEditingPromotion} onDelete={setDeletingPromotion} />

      {(isAddModalOpen || editingPromotion) && (
        <PromotionModal
          promotion={editingPromotion}
          onClose={() => { setIsAddModalOpen(false); setEditingPromotion(null); }}
          onSuccess={handleSave} />
      )}
      {deletingPromotion && (
        <DeleteConfirmationModal isOpen={!!deletingPromotion} onClose={() => setDeletingPromotion(null)} onConfirm={() => handleDelete(deletingPromotion._id)} itemName={deletingPromotion.name} itemType="khuyến mãi" />
      )}
    </div>
  );
}