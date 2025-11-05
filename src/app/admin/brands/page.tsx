'use client';
import React, { useEffect, useState } from 'react';
import BrandTable from '@/components/admin/brand/BrandTable';
import AddBrandModal from '@/components/admin/brand/AddBrandModal';
import UpdateBrandModal from '@/components/admin/brand/UpdateBrandModal';
import { PlusCircle, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/app/api/admin/brands/brands';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const loadBrands = async () => {
    try {
      const data = await getBrands({ q: search });
      setBrands(data.items || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách brands:', error);
      toast.error('Tải danh sách brands thất bại');
    }
  };

  useEffect(() => {
    loadBrands();
  }, [search]);

  const handleAdd = async (form: any, file?: File) => {
    try {
      const newBrand = await createBrand(form, file);
      setBrands((prev) => [...prev, newBrand]);
      setIsAddOpen(false);
      toast.success('Thêm brand thành công!');
    } catch (error: any) {
      console.error('Lỗi thêm brand:', error);
      toast.error(error?.message || 'Thêm brand thất bại');
    }
  };

  const handleUpdate = async (id: string, form: any, file?: File) => {
    try {
      const updatedBrand = await updateBrand(id, form, file);
      setBrands((prev) => prev.map((b) => (b._id === updatedBrand._id ? updatedBrand : b)));
      toast.success('Cập nhật brand thành công!');
    } catch (error: any) {
      console.error('Lỗi cập nhật brand:', error);
      toast.error(error?.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b._id !== id));
      toast.success('Xóa brand thành công!');
    } catch (error: any) {
      console.error('Lỗi xóa brand:', error);
      toast.error(error?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý thương hiệu</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="pl-8 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Thêm thương hiệu
          </button>
        </div>
      </div>

      <BrandTable
        brands={brands}
        onEdit={(b) => {
          setEditingBrand(b);
          setIsEditOpen(true);
        }}
        onDelete={handleDelete}
      />

      {isAddOpen && <AddBrandModal onClose={() => setIsAddOpen(false)} onSuccess={handleAdd} />}

      {isEditOpen && editingBrand && (
        <UpdateBrandModal
          brand={editingBrand}
          onClose={() => {
            setIsEditOpen(false);
            setEditingBrand(null);
          }}
          onUpdateSuccess={handleUpdate}
        />
      )}
    </div>
  );
}
