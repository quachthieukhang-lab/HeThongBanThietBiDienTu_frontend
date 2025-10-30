'use client'

import React, { useEffect, useState } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'
import SubcategoryTable from '@/components/admin/subcategory/SubcategoryTable'
import SubcategoryModal from '@/components/admin/subcategory/SubcategoryModal'

type Subcategory = any
type Category = { _id: string; name: string }

export default function SubcategoriesPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [items, setItems] = useState<Subcategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Subcategory | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const loadCategories = async () => {
    try {
      const res = await apiFetch(`${backendUrl}/categories?limit=100`)
      const data = await res.json()
      setCategories(data.items || [])
    } catch (err) {
      console.error(err)
    }
  }

  const loadSubcategories = async (p = page, s = search, c = selectedCategory) => {
    try {
      setLoading(true)
      const q = new URLSearchParams({
        page: String(p),
        limit: String(limit),
      })
      if (s) q.set('search', s)
      if (c) q.set('categoryId', c)

      const res = await apiFetch(`${backendUrl}/subcategories?${q.toString()}`, { cache: 'no-store' })
      const data = await res.json()
      setItems(data.items || [])
      setTotal(data.total || 0)
      setPage(data.page || 1)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Tải subcategories thất bại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
    loadSubcategories(1, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory])

  const handleCreate = async (payload: any) => {
    try {
      const res = await apiFetch(`${backendUrl}/subcategories`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Tạo subcategory thành công')
      setIsOpen(false)
      loadSubcategories(1)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Tạo thất bại')
    }
  }

  const handleUpdate = async (id: string, payload: any) => {
    try {
      const res = await apiFetch(`${backendUrl}/subcategories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Cập nhật thành công')
      setEditing(null)
      setIsOpen(false)
      loadSubcategories(page)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Cập nhật thất bại')
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      const res = await apiFetch(`${backendUrl}/subcategories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Vô hiệu hoá thành công')
      loadSubcategories(page)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Thao tác thất bại')
    }
  }

  const handleActivate = async (id: string) => {
    try {
      const res = await apiFetch(`${backendUrl}/subcategories/${id}/active`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Kích hoạt thành công')
      loadSubcategories(page)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Thao tác thất bại')
    }
  }

  const handleHardDelete = async (id: string) => {
    if (!confirm('Xoá vĩnh viễn subcategory này?')) return
    try {
      const res = await apiFetch(`${backendUrl}/subcategories/${id}/hard`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Xoá vĩnh viễn thành công')
      loadSubcategories(page)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Xoá thất bại')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý Subcategories</h1>
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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => { setEditing(null); setIsOpen(true) }}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle /> Tạo mới
          </button>
        </div>
      </div>

      <SubcategoryTable
        items={items}
        loading={loading}
        onEdit={(c) => { setEditing(c); setIsOpen(true) }}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        onHardDelete={handleHardDelete}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {`Tổng: ${total} mục — Trang ${page}`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => { setPage(p => { const np = Math.max(1, p - 1); loadSubcategories(np); return np }) }}
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
            onClick={() => { setPage(p => { const np = p + 1; loadSubcategories(np); return np }) }}
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

      <SubcategoryModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editing={editing}
        categories={categories}
      />
    </div>
  )
}
