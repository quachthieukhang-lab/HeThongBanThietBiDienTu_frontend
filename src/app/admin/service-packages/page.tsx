'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle, Search } from 'lucide-react';
import AddServicePackageModal from '@/components/admin/service-package/AddServicePackageModal';
import ServicePackageTable from '@/components/admin/service-package/ServicePackageTable';
import EditServicePackageModal from '@/components/admin/service-package/EditServicePackageModal';
import DeleteConfirmationModal from '@/components/admin/service-package/DeleteConfirmationModal';

type ServicePackage = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  type: 'install' | 'warranty' | 'addon' | 'other';
  isActive: boolean;
};

export default function ServicePackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<ServicePackage | null>(null);
  const [search, setSearch] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadServicePackages = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`${backendUrl}/service-packages?search=${encodeURIComponent(search)}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        // API có thể trả về { items: [...] } hoặc [...]
        setPackages(Array.isArray(data) ? data : data.items || []);
      } catch (error: any) {
        console.error('Lỗi khi tải gói dịch vụ:', error);
        toast.error(error.message || 'Tải danh sách gói dịch vụ thất bại');
      } finally {
        setLoading(false);
      }
    };

    loadServicePackages();
  }, [search, backendUrl]);

  const handleCreate = async (formData: Omit<ServicePackage, '_id'>) => {
    try {
      const res = await apiFetch(`${backendUrl}/service-packages`, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) // Ensure price is a number
        }),
      });

      const newPackage = await res.json();
      setPackages(prev => [newPackage, ...prev]);
      setIsAddModalOpen(false);
      toast.success('Tạo gói dịch vụ thành công!');
    } catch (error: any) {
      console.error('Lỗi khi tạo gói dịch vụ:', error);
      toast.error(error.message || 'Tạo gói dịch vụ thất bại.');
      // Re-throw to be caught in the modal if needed
      throw error;
    }
  };

  const handleUpdate = async (id: string, formData: Omit<ServicePackage, '_id'>) => {
    try {
      const res = await apiFetch(`${backendUrl}/service-packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) // Ensure price is a number
        }),
      });

      const updatedPackage = await res.json();
      setPackages(prev => prev.map(p => (p._id === id ? updatedPackage : p)));
      setEditingPackage(null);
      toast.success('Cập nhật gói dịch vụ thành công!');
    } catch (error: any) {
      console.error('Lỗi khi cập nhật gói dịch vụ:', error);
      toast.error(error.message || 'Cập nhật gói dịch vụ thất bại.');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!deletingPackage) return;
    try {
      await apiFetch(`${backendUrl}/service-packages/${id}`, {
        method: 'DELETE',
      });

      setPackages(prev => prev.filter(p => p._id !== id));
      setDeletingPackage(null);
      toast.success('Xóa gói dịch vụ thành công!');
    } catch (error: any) {
      console.error('Lỗi khi xóa gói dịch vụ:', error);
      toast.error(error.message || 'Xóa gói dịch vụ thất bại.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý Gói Dịch Vụ</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm gói dịch vụ..."
              className="pl-8 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Tạo Gói Mới
          </button>
        </div>
      </div>

      <ServicePackageTable
        packages={packages}
        loading={loading}
        onEdit={(pkg) => setEditingPackage(pkg)}
        onDelete={(pkg) => setDeletingPackage(pkg)}
      />

      {isAddModalOpen && (
        <AddServicePackageModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleCreate} />
      )}

      {editingPackage && (
        <EditServicePackageModal
          pkg={editingPackage}
          onClose={() => setEditingPackage(null)}
          onSuccess={handleUpdate}
        />
      )}

      {deletingPackage && (
        <DeleteConfirmationModal
          isOpen={!!deletingPackage}
          onClose={() => setDeletingPackage(null)}
          onConfirm={() => handleDelete(deletingPackage._id)}
          itemName={deletingPackage.name}
          itemType="gói dịch vụ"
        />
      )}
    </div>
  );
}