'use client';

import React, { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Promotion, DiscountType } from '@/app/admin/promotions/page';
import { format } from 'date-fns';

interface PromotionModalProps {
  promotion?: Promotion | null; // If provided, modal is in edit mode
  onClose: () => void;
  onSuccess: (data: Omit<Promotion, '_id'>, id?: string) => Promise<void>;
}

const getInitialFormData = (promotion?: Promotion | null) => {
  if (promotion) {
    return {
      name: promotion.name,
      description: promotion.description,
      discount_type: promotion.discount_type,
      code: promotion.code,
      discount_value: promotion.discount_value,
      start_date: format(new Date(promotion.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(promotion.end_date), 'yyyy-MM-dd'),
      isActive: promotion.isActive,
    };
  }
  return {
    name: '',
    description: '',
    discount_type: DiscountType.Percentage,
    code: '',
    discount_value: 0,
    start_date: '',
    end_date: '',
    isActive: true,
  };
};

export default function PromotionModal({ promotion, onClose, onSuccess }: PromotionModalProps) {
  const isEditMode = !!promotion;
  const [formData, setFormData] = useState(() => getInitialFormData(promotion));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = { ...formData, discount_value: Number(formData.discount_value) };
      await onSuccess(dataToSubmit, promotion?._id);
    } catch (error) {
      // Error toast is shown in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Chỉnh sửa Khuyến Mãi' : 'Tạo Khuyến Mãi Mới'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên khuyến mãi</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Mã khuyến mãi</label>
              <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
              <select name="discount_type" id="discount_type" value={formData.discount_type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="percentage">Phần trăm</option>
                <option value="fixed_amount">Số tiền cố định</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm</label>
              <input type="number" name="discount_value" id="discount_value" value={formData.discount_value} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
              <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Kích hoạt</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? (isEditMode ? 'Đang lưu...' : 'Đang tạo...') : (isEditMode ? 'Lưu thay đổi' : 'Tạo Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}