'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Promotion, DiscountType } from '@/app/admin/promotions/page';
import { format } from 'date-fns';

interface PromotionTableProps {
  promotions: Promotion[];
  loading: boolean;
  onEdit: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
}

const PromotionTable: React.FC<PromotionTableProps> = ({ promotions, loading, onEdit, onDelete }) => {
  const discountTypeMap: { [key in DiscountType]: string } = {
    [DiscountType.Percentage]: 'Phần trăm (%)',
    [DiscountType.FixedAmount]: 'Số tiền cố định (VND)',
  };

  const getStatus = (startDate: string, endDate: string, isActive: boolean) => {
    const now = new Date();
    if (!isActive) return { text: 'Vô hiệu', color: 'bg-gray-100 text-gray-700' };
    if (new Date(startDate) > now) return { text: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-700' };
    if (new Date(endDate) < now) return { text: 'Đã kết thúc', color: 'bg-red-100 text-red-700' };
    return { text: 'Đang diễn ra', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Tên Khuyến Mãi</th>
              <th className="px-6 py-4">Mã KM</th>
              <th className="px-6 py-4">Loại Giảm Giá</th>
              <th className="px-6 py-4">Giá Trị</th>
              <th className="px-6 py-4">Ngày Bắt Đầu</th>
              <th className="px-6 py-4">Ngày Kết Thúc</th>
              <th className="px-6 py-4">Trạng Thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-500">Đang tải...</td></tr>
            ) : promotions.length > 0 ? (
              promotions.map((promo) => {
                const status = getStatus(promo.start_date, promo.end_date, promo.isActive);
                return (
                  <tr key={promo._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{promo.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{discountTypeMap[promo.discount_type]}</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">
                      {promo.discount_type === DiscountType.Percentage
                        ? `${promo.discount_value}%`
                        : promo.discount_value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{format(new Date(promo.start_date), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4 text-gray-600">{format(new Date(promo.end_date), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => onEdit(promo)} className="text-blue-600 hover:text-blue-800 transition" title="Chỉnh sửa"><Pencil size={18} /></button>
                        <button onClick={() => onDelete(promo)} className="text-red-600 hover:text-red-800 transition" title="Xóa"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={8} className="text-center py-10 text-gray-500">Không có chương trình khuyến mãi nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionTable;
