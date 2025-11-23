'use client'

import React, { useEffect, useState } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'
import ProductTable from '@/components/admin/product/ProductTable'
import ProductModal from '@/components/admin/product/ProductModal'

export default function ProductsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  const loadProducts = async (p = page, s = search) => {
    try {
      setLoading(true)
      const q = new URLSearchParams({ page: String(p), limit: String(limit) })
      if (s) q.set('search', s)

      const res = await apiFetch(`${backendUrl}/products?${q.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setProducts(data.items || [])
      setTotal(data.total || 0)
      setPage(data.page || 1)
    } catch (err: any) {
      console.error('Load products', err)
      toast.error(err?.message || 'Tải danh sách sản phẩm thất bại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(1, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleCreate = async (formData: FormData) => {
    try {
      const res = await apiFetch(`${backendUrl}/products`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Tạo sản phẩm thành công')
      setIsOpen(false)
      loadProducts(1)
    } catch (err: any) {
      console.error('Create product', err)
      toast.error(err?.message || 'Không thể tạo sản phẩm')
    }
  }

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      const res = await apiFetch(`${backendUrl}/products/${id}`, {
        method: 'PATCH',
        body: formData,
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Cập nhật sản phẩm thành công')
      setEditing(null)
      setIsOpen(false)
      loadProducts(page)
    } catch (err: any) {
      console.error('Update product', err)
      toast.error(err?.message || 'Không thể cập nhật sản phẩm')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá vĩnh viễn sản phẩm này?')) return
    try {
      const res = await apiFetch(`${backendUrl}/products/${id}/hard`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Đã xoá sản phẩm')
      loadProducts(page)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Không thể xoá sản phẩm')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý Sản phẩm</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            <input
              className="pl-8 pr-3 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-indigo-400"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditing(null)
              setIsOpen(true)
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Table */}
      <ProductTable
        items={products}
        loading={loading}
        onEdit={(p: any) => {
          setEditing(p)
          setIsOpen(true)
        }}
        onHardDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {`Tổng: ${total} sản phẩm — Trang ${page}`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => {
              const np = Math.max(1, page - 1)
              setPage(np)
              loadProducts(np)
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
            disabled={products.length < limit}
            onClick={() => {
              const np = page + 1
              setPage(np)
              loadProducts(np)
            }}
            className={`px-3 py-1 rounded border transition-colors ${
              products.length < limit
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditing(null)
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editing={editing}
      />
    </div>
  )
}
