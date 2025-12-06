'use client';

import React, { useEffect, useState } from 'react';
import UserTable from '@/components/admin/user/UserTable';
import AddUserModal from '@/components/admin/user/AddUserModal';
import UpdateUserModal from '@/components/admin/user/UpdateUserModal';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import bcrypt from 'bcryptjs';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  // Load danh sách người dùng với pagination và filter
  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      
      // Xây dựng query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await apiFetch(`${backendUrl}/users?${params.toString()}`, {
        cache: 'no-store',
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      setUsers(data.users || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 20,
        total: data.total || 0,
        pages: data.pages || 1,
      });
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      toast.error('Tải danh sách người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, statusFilter]);

 // Thêm người dùng mới
  const handleAdd = async (form: any) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Access Token gửi đi:', token);

    const passwordHash = await bcrypt.hash(form.password, 10);
    if (!token) throw new Error('Bạn chưa đăng nhập!');
    console.log('Form gửi đi:', form);
    const res = await fetch(`${backendUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
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

  // Xóa mềm (vô hiệu hóa)
  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm('Bạn có chắc chắn muốn vô hiệu hóa người dùng này?');
      if (!confirm) return;

      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Bạn chưa đăng nhập!');

      const res = await fetch(`${backendUrl}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: 'blocked' } : u))
      );
      toast.success('Vô hiệu hóa người dùng thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Vô hiệu hóa thất bại');
    }
  };

  // Khôi phục user
  const handleRestore = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Bạn chưa đăng nhập!');

      const res = await fetch(`${backendUrl}/users/${id}/restore`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: 'active' } : u))
      );
      toast.success('Khôi phục người dùng thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Khôi phục thất bại');
    }
  };

  // Xóa cứng (xóa vĩnh viễn)
  const handleHardDelete = async (id: string) => {
    try {
      const confirm = window.confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN người dùng này? Hành động này không thể hoàn tác!');
      if (!confirm) return;

      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Bạn chưa đăng nhập!');

      const res = await fetch(`${backendUrl}/users/${id}/hard`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('Xóa người dùng thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Xóa thất bại');
    }
  };

  // Cập nhật user
  const handleUpdateSuccess = (updatedUser: any) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    setIsEditOpen(false);
    setEditingUser(null);
    toast.success('Cập nhật người dùng thành công!');
  };

  return (
    <div className="p-8 space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý người dùng</h1>
        <div className="flex items-center gap-3">
          {/* Filter status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none appearance-none bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <Filter className="absolute right-2 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* Search */}
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
          
          {/* Add user button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Thêm người dùng
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4 text-gray-500">Đang tải...</div>
      )}

      {/* User Table */}
      <UserTable
        users={users}
        onEdit={(u) => { setEditingUser(u); setIsEditOpen(true); }}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onHardDelete={handleHardDelete}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => loadUsers(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          <span className="text-sm text-gray-600">
            Trang {pagination.page} / {pagination.pages}
          </span>
          
          <button
            onClick={() => loadUsers(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modals */}
      {isAddOpen && (
        <AddUserModal
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleAdd}
        />
      )}

      {isEditOpen && editingUser && (
        <UpdateUserModal
          user={editingUser}
          onClose={() => { setIsEditOpen(false); setEditingUser(null); }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}