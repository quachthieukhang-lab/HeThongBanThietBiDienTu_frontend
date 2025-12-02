'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'
import ProductVariantTable from '@/components/admin/product-variant/ProductVariantTable'
import ProductVariantModal from '@/components/admin/product-variant/ProductVariantModal'

interface ProductVariant {
  _id: string
  productId: string
  sku?: string
  barcode?: string
  attributes: Record<string, any>
  facets: Record<string, any>
  price: number
  compareAtPrice?: number
  stock: number
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductVariantsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    productId: searchParams.get('productId') || '',
    isActive: searchParams.get('isActive') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20')
  })

  const fetchVariants = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
      })

      const res = await apiFetch(`${backendUrl}/product-variants?${queryParams}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch variants')
      }

      const data = await res.json()
      setVariants(data.items || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)

      // Update URL
      const newParams = new URLSearchParams(searchParams)
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value.toString())
        } else {
          newParams.delete(key)
        }
      })
      router.replace(`?${newParams.toString()}`, { scroll: false })
    } catch (err: any) {
      console.error('Fetch variants error:', err)
      toast.error(err?.message || 'Lỗi khi tải danh sách biến thể')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVariants()
  }, [filters])

  const handleCreate = async (data: any) => {
    try {
      const res = await apiFetch(`${backendUrl}/product-variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to create variant')
      }

      toast.success('Tạo biến thể thành công')
      setModalOpen(false)
      fetchVariants()
    } catch (err: any) {
      console.error('Create variant error:', err)
      toast.error(err?.message || 'Lỗi khi tạo biến thể')
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    try {
      const res = await apiFetch(`${backendUrl}/product-variants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update variant')
      }

      toast.success('Cập nhật biến thể thành công')
      setModalOpen(false)
      setEditingVariant(null)
      fetchVariants()
    } catch (err: any) {
      console.error('Update variant error:', err)
      toast.error(err?.message || 'Lỗi khi cập nhật biến thể')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await apiFetch(`${backendUrl}/product-variants/${id}/active?value=${isActive}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Failed to update variant status')
      }

      toast.success(isActive ? 'Đã kích hoạt biến thể' : 'Đã vô hiệu hóa biến thể')
      fetchVariants()
    } catch (err: any) {
      console.error('Toggle active error:', err)
      toast.error(err?.message || 'Lỗi khi cập nhật trạng thái')
    }
  }

  const handleAdjustStock = async (id: string, delta: number) => {
    try {
      const res = await apiFetch(`${backendUrl}/product-variants/${id}/stock?delta=${delta}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Failed to adjust stock')
      }

      toast.success(`Đã điều chỉnh tồn kho ${delta >= 0 ? '+' : ''}${delta}`)
      fetchVariants()
    } catch (err: any) {
      console.error('Adjust stock error:', err)
      toast.error(err?.message || 'Lỗi khi điều chỉnh tồn kho')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa biến thể này?')) return

    try {
      const res = await apiFetch(`${backendUrl}/product-variants/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete variant')
      }

      toast.success('Xóa biến thể thành công')
      fetchVariants()
    } catch (err: any) {
      console.error('Delete variant error:', err)
      toast.error(err?.message || 'Lỗi khi xóa biến thể')
    }
  }

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingVariant(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Biến thể Sản phẩm</h1>
          <p className="text-gray-600">Tổng số: {total} biến thể</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm biến thể
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="SKU, barcode..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product ID</label>
            <input
              type="text"
              placeholder="ID sản phẩm..."
              value={filters.productId}
              onChange={e => setFilters(prev => ({ ...prev, productId: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={filters.isActive}
              onChange={e => setFilters(prev => ({ ...prev, isActive: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sắp xếp</label>
            <select
              value={filters.sort}
              onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="-createdAt">Mới nhất</option>
              <option value="price">Giá tăng dần</option>
              <option value="-price">Giá giảm dần</option>
              <option value="sku">SKU A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductVariantTable
        variants={variants}
        loading={loading}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        onAdjustStock={handleAdjustStock}
        onDelete={handleDelete}
        currentPage={filters.page}
        totalPages={pages}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />

      {/* Modal */}
      <ProductVariantModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editing={editingVariant}
      />
    </div>
  )
}