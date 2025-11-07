'use client'

import React, { useEffect, useState } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'
import CategoryTable from '@/components/admin/category/CategoryTable'
import CategoryModal from '@/components/admin/category/CategoryModal'

type Category = any

export default function CategoriesPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [items, setItems] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const load = async (p = page, s = search) => {
    try {
      setLoading(true)
      const q = new URLSearchParams({
        page: String(p),
        limit: String(limit),
      })
      if (s) q.set('search', s)
      const res = await apiFetch(`${backendUrl}/categories?${q.toString()}&sort=sortOrder`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setItems(data.items || [])
      setPage(data.page || 1)
      setTotal(data.total || 0)
    } catch (err: any) {
      console.error('Load categories error', err)
      toast.error(err?.message || 'Tải categories thất bại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1, search)
  }, [search])

  const handleCreate = async (formData: FormData) => {
    try {
      const res = await apiFetch(`${backendUrl}/categories`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Tạo category thành công')
      setIsOpen(false)
      load(1, search)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Tạo thất bại')
    }
  }

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      const res = await apiFetch(`${backendUrl}/categories/${id}`, {
        method: 'PATCH',
        body: formData,
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Cập nhật thành công')
      setEditing(null)
      setIsOpen(false)
      load(page, search)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Cập nhật thất bại')
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      const res = await apiFetch(`${backendUrl}/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Vô hiệu hoá thành công')
      load(page, search)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Thao tác thất bại')
    }
  }

  const handleActivate = async (id: string) => {
    try {
      const res = await apiFetch(`${backendUrl}/categories/${id}/active`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Kích hoạt thành công')
      load(page, search)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Thao tác thất bại')
    }
  }

  const handleHardDelete = async (id: string) => {
    if (!confirm('Xoá vĩnh viễn category này?')) return
    try {
      const res = await apiFetch(`${backendUrl}/categories/${id}/hard`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Xoá vĩnh viễn thành công')
      load(page, search)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Xoá thất bại')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý Categories</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            <input
              className="pl-8 pr-3 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-400"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setEditing(null); setIsOpen(true) }}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle /> Tạo mới
          </button>
        </div>
      </div>

      <CategoryTable
        items={items}
        loading={loading}
        onEdit={(c) => { setEditing(c); setIsOpen(true) }}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        onHardDelete={handleHardDelete}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {`Tổng: ${total} item — Trang ${page}`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => {
                const np = Math.max(1, p - 1)
                load(np)
                return np
              })
            }}
            className={`px-3 py-1 rounded border transition-colors ${
              page <= 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Prev
          </button>

          <button
            disabled={items.length < limit}
            onClick={() => {
              setPage((p) => {
                const np = p + 1
                load(np)
                return np
              })
            }}
            className={`px-3 py-1 rounded border transition-colors ${
              items.length < limit
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <CategoryModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editing={editing}
      />
    </div>
  )
}
