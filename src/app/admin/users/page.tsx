'use client';

import React, { useEffect, useState } from 'react';
import UserTable from '@/components/admin/user/UserTable';
import AddUserModal from '@/components/admin/user/AddUserModal';
import UpdateUserModal from '@/components/admin/user/UpdateUserModal';
import { PlusCircle, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import bcrypt from 'bcryptjs'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  // 🧩 Load danh sách người dùng
  const loadUsers = async () => {
    try {
      const res = await apiFetch(`${backendUrl}/users?search=${encodeURIComponent(search)}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      toast.error('Tải danh sách người dùng thất bại');
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  // 🧩 Thêm người dùng mới
  const handleAdd = async (form: any) => {
  try {
    const token = localStorage.getItem('access_token');
    console.log('Access Token gửi đi:', token);

    const passwordHash = await bcrypt.hash(form.password, 10);
    if (!token) throw new Error('Bạn chưa đăng nhập!');
    console.log('Form gửi đi:', form);
    const res = await fetch(`${backendUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // gửi accessToken
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password, // cần ít nhất 6 ký tự
        passwordHash,
        phone: form.phone,
        roles: [form.role],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const newUser = await res.json();
    setUsers((prev) => [...prev, newUser]);
    setIsAddOpen(false);
    toast.success('Thêm người dùng thành công!');
  } catch (error: any) {
    console.error('Lỗi thêm người dùng:', error);
    toast.error(error?.message || 'Thêm người dùng thất bại');
  }
};

  // 🧩 Xóa user
  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch(`${backendUrl}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: 'deleted' } : u))
      );
      toast.success('Xóa người dùng thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Xóa thất bại');
    }
  };

  // 🧩 Khôi phục user
  const handleRestore = async (id: string) => {
    try {
      const res = await apiFetch(`${backendUrl}/users/${id}/restore`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: data.status || 'active' } : u))
      );

      toast.success('Khôi phục người dùng thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Khôi phục thất bại');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý người dùng</h1>
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
            <PlusCircle size={18} /> Thêm người dùng
          </button>
        </div>
      </div>

      <UserTable
        users={users}
        onEdit={(u) => { setEditingUser(u); setIsEditOpen(true); }}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {isAddOpen && <AddUserModal onClose={() => setIsAddOpen(false)} onSuccess={handleAdd} />}

      {isEditOpen && editingUser && (
        <UpdateUserModal
          user={editingUser}
          onClose={() => { setIsEditOpen(false); setEditingUser(null); }}
          onUpdateSuccess={(updatedUser) => {
            setUsers((prev) =>
              prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            );
            setIsEditOpen(false);
            setEditingUser(null);
            toast.success('Cập nhật người dùng thành công!');
          }}
        />
      )}
    </div>
  );
}
