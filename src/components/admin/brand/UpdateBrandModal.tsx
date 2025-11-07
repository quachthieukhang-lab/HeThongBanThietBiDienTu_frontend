'use client';
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UpdateBrandModalProps {
  brand: any;
  onClose: () => void;
  onUpdateSuccess: (id: string, form: any, file?: File) => void;
}

export default function UpdateBrandModal({ brand, onClose, onUpdateSuccess }: UpdateBrandModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(brand.name || '');
    setSlug(brand.slug || '');
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Tên thương hiệu là bắt buộc');
    setLoading(true);
    try {
      await onUpdateSuccess(brand._id, { name, slug }, file || undefined);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[420px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800">Cập nhật thương hiệu</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tên thương hiệu</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Logo (nếu muốn thay đổi)</label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                  Hủy
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
