'use client'

import React, { useEffect, useState } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'
import AttributeTemplateTable from '@/components/admin/attribute-template/AttributeTemplateTable'
import AttributeTemplateModal from '@/components/admin/attribute-template/AttributeTemplateModal'

export default function AttributeTemplatesPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [items, setItems] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  const loadSubcategories = async () => {
    try {
      const res = await apiFetch(`${backendUrl}/subcategories`)
      const data = await res.json()
      setSubcategories(data.items || [])
    } catch (err) {
      console.error('Load subcategories', err)
    }
  }

  const loadTemplates = async (p = page, s = search) => {
    try {
      setLoading(true)
      const q = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (s) q.set('search', s)
      const res = await apiFetch(`${backendUrl}/attribute-templates?${q.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setItems(data.items || [])
      setTotal(data.total || 0)
      setPage(data.page || 1)
    } catch (err: any) {
      console.error('Load templates', err)
      toast.error(err?.message || 'Tải attribute templates thất bại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubcategories()
    loadTemplates(1, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleCreate = async (data: any) => {
    try {
      const res = await apiFetch(`${backendUrl}/attribute-templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Tạo thành công')
      setIsOpen(false)
      loadTemplates(1)
    } catch (err: any) {
      console.error('Create template', err)
      toast.error(err?.message || 'Tạo thất bại')
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    try {
      const res = await apiFetch(`${backendUrl}/attribute-templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Cập nhật thành công')
      setEditing(null)
      setIsOpen(false)
      loadTemplates(page)
    } catch (err: any) {
      console.error('Update template', err)
      toast.error(err?.message || 'Cập nhật thất bại')
    }
  }

  const handleHardDelete = async (id: string) => {
    if (!confirm('Xoá vĩnh viễn template này?')) return
    try {
      const res = await apiFetch(`${backendUrl}/attribute-templates/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Đã xoá vĩnh viễn')
      loadTemplates(page)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Xoá thất bại')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý Attribute Templates</h1>
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

      <AttributeTemplateTable
        items={items}
        loading={loading}
        onEdit={(c) => { setEditing(c); setIsOpen(true) }}
        onHardDelete={handleHardDelete}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {`Tổng: ${total} mục — Trang ${page}`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => { const np = Math.max(1, page - 1); setPage(np); loadTemplates(np) }}
            className={`px-3 py-1 rounded border transition-colors ${page <= 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Prev
          </button>
          <button
            disabled={items.length < limit}
            onClick={() => { const np = page + 1; setPage(np); loadTemplates(np) }}
            className={`px-3 py-1 rounded border transition-colors ${items.length < limit ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Next
          </button>
        </div>
      </div>

      <AttributeTemplateModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditing(null)
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editing={editing}
        subcategories={subcategories}
      />
    </div>
  )
}
