'use client';

import React, { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

type ServicePackage = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  type: 'install' | 'warranty' | 'addon' | 'other';
  isActive: boolean;
};

interface EditServicePackageModalProps {
  pkg: ServicePackage;
  onClose: () => void;
  onSuccess: (id: string, data: Omit<ServicePackage, '_id'>) => Promise<void>;
}

export default function EditServicePackageModal({ pkg, onClose, onSuccess }: EditServicePackageModalProps) {
  const [formData, setFormData] = useState({
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    duration: pkg.duration,
    type: pkg.type,
    isActive: pkg.isActive,
  });
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
      await onSuccess(pkg._id, formData);
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
          <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa Gói Dịch Vụ</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên gói</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Thời hạn</label>
              <input type="text" name="duration" id="duration" value={formData.duration} onChange={handleChange} required placeholder="VD: 12 tháng" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loại gói</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="install">Cài đặt</option>
              <option value="warranty">Bảo hành</option>
              <option value="addon">Tiện ích thêm</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Kích hoạt</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
