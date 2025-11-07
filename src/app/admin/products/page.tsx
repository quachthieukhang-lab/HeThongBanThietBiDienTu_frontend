'use client'

import React, { useEffect, useState } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'
import ProductTable from '@/components/admin/product/ProductTable'
import ProductModal from '@/components/admin/product/ProductModal'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        search: search,
        page: '1',
        limit: '50'
      })
      const res = await apiFetch(`/products?${queryParams}`)
      const data = await res.json()
      setProducts(data.items || [])
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const handleCreate = async (formData: FormData) => {
    try {
      await apiFetch('/products', { 
        method: 'POST', 
        body: formData,
      })
      toast.success('Tạo sản phẩm thành công')
      setIsOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Không thể tạo sản phẩm')
    }
  }

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      await apiFetch(`/products/${id}`, { 
        method: 'PATCH', 
        body: formData 
      })
      toast.success('Cập nhật sản phẩm thành công')
      setIsOpen(false)
      setEditing(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật sản phẩm')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa vĩnh viễn sản phẩm này?')) return
    try {
      await apiFetch(`/products/${id}/hard`, { method: 'DELETE' })
      toast.success('Đã xóa sản phẩm')
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa sản phẩm')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="border rounded px-3 py-1 text-sm"
          />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={16} />
          Thêm sản phẩm
        </button>
      </div>

      <ProductTable
        items={products}
        loading={loading}
        onEdit={(p: any) => {
          setEditing(p)
          setIsOpen(true)
        }}
        onHardDelete={handleDelete}
      />

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