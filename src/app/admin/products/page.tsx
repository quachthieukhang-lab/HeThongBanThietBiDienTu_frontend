'use client';
import React, { useEffect, useState } from 'react';
import ProductTable from '@/components/admin/product/ProductTable';
import AddProductModal from '@/components/admin/product/AddProductModal';
import UpdateProductModal from '@/components/admin/product/UpdateProductModal';
import VariantModal from '@/components/admin/product/VariantModal';
import { PlusCircle, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [variantOpenFor, setVariantOpenFor] = useState<any>(null);

  const loadProducts = async () => {
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products${q}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setProducts(data.items || []);
    } catch (err) {
      console.error(err);
      toast.error('Tải danh sách sản phẩm thất bại');
    }
  };

  useEffect(() => { loadProducts(); }, [search]);

  const handleAdd = async (form: any) => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products`, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
      setIsAddOpen(false);
      toast.success('Thêm sản phẩm thành công!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Thêm thất bại');
    }
  };

  const handleUpdate = async (id: string, form: any) => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setProducts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
      setIsEditOpen(false);
      setEditingProduct(null);
      toast.success('Cập nhật sản phẩm thành công!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa sản phẩm này? (Toàn bộ variant sẽ bị xóa)')) return;
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Đã xóa');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý sản phẩm</h1>

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

          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            <PlusCircle size={18} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={(p) => { setEditingProduct(p); setIsEditOpen(true); }}
        onDelete={handleDelete}
        onManageVariants={(p) => setVariantOpenFor(p)}
      />

      {isAddOpen && <AddProductModal onClose={() => setIsAddOpen(false)} onSuccess={handleAdd} />}

      {isEditOpen && editingProduct && (
        <UpdateProductModal product={editingProduct} onClose={() => { setIsEditOpen(false); setEditingProduct(null); }} onUpdateSuccess={handleUpdate} />
      )}

      {variantOpenFor && (
        <VariantModal product={variantOpenFor} onClose={() => setVariantOpenFor(null)} onUpdateVariants={loadProducts} />
      )}
    </div>
  );
}
