'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type ServicePackage = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  type: 'install' | 'warranty' | 'addon' | 'other';
  isActive: boolean;
};

interface ServicePackageTableProps {
  packages: ServicePackage[];
  loading: boolean;
  onEdit: (pkg: ServicePackage) => void;
  onDelete: (pkg: ServicePackage) => void;
}

const ServicePackageTable: React.FC<ServicePackageTableProps> = ({ packages, loading, onEdit, onDelete }) => {
  const typeMap: { [key: string]: string } = { install: 'Cài đặt', warranty: 'Bảo hành', addon: 'Tiện ích', other: 'Khác' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Tên Gói</th>
              <th className="px-6 py-4">Mô Tả</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Thời Hạn</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">Trạng Thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Đang tải...</td></tr>
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{pkg.name}</td>
                  <td className="px-6 py-4 text-gray-600">{pkg.description}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">{pkg.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td className="px-6 py-4 text-gray-600">{pkg.duration || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{typeMap[pkg.type] || pkg.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                      pkg.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {pkg.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => onEdit(pkg)} className="text-blue-600 hover:text-blue-800 transition" title="Chỉnh sửa">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete(pkg)} className="text-red-600 hover:text-red-800 transition" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Không có gói dịch vụ nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicePackageTable;