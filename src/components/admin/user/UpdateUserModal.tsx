'use client';

import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { apiFetch } from '@/lib/api';

interface UpdateUserModalProps {
  user: any;
  onClose: () => void;
  onUpdateSuccess?: (updatedUser: any) => void;
}

export default function UpdateUserModal({
  user,
  onClose,
  onUpdateSuccess,
}: UpdateUserModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: 'customer',
  });
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        role: user.roles?.[0] || 'customer',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setLoading(true);
    try {
      const res = await apiFetch(`${backendUrl}/users/${user._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: form.name, phone: form.phone, roles: [form.role] }),
      });


      if (!res.ok) throw new Error(await res.text());
      const updatedUser = await res.json();
      onUpdateSuccess?.(updatedUser);
      setOpen(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => { setOpen(val); if (!val) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[420px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Cập nhật người dùng
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition" aria-label="Đóng">
                ✕
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <div className="flex gap-6">
                {['admin', 'customer'].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={form.role === r}
                      onChange={handleChange}
                      className="accent-indigo-600 w-4 h-4"
                    />
                    <span className="text-gray-700">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Hủy
                </button>
              </Dialog.Close>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                disabled={loading}
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
