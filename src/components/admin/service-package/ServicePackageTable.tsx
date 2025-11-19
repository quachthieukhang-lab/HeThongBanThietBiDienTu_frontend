'use client';

import React from 'react';

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
}

const ServicePackageTable: React.FC<ServicePackageTableProps> = ({ packages, loading }) => {
  return (
    <div className="w-full rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-indigo-100 text-gray-700">
          <tr>
            {['Tên Gói', 'Mô Tả', 'Giá', 'Thời Hạn', 'Loại', 'Trạng Thái'].map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {loading ? (
            <tr><td colSpan={6} className="text-center py-10 text-gray-500">Đang tải...</td></tr>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <tr key={pkg._id} className="hover:bg-indigo-50">
                <td className="px-5 py-3 font-medium text-gray-800">{pkg.name}</td>
                <td className="px-5 py-3 text-gray-600">{pkg.description}</td>
                <td className="px-5 py-3 text-gray-600">{pkg.price.toLocaleString('vi-VN')}đ</td>
                <td className="px-5 py-3 text-gray-600">{pkg.duration || '-'}</td>
                <td className="px-5 py-3 text-gray-600 capitalize">{pkg.type}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium capitalize ${
                    pkg.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {pkg.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6} className="text-center py-10 text-gray-500">Không có gói dịch vụ nào.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicePackageTable;