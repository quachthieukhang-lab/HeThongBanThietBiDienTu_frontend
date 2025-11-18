'use client'

import React, { useState, useEffect } from 'react'
import { Edit2, Power, Trash2, Package, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

interface ProductVariant {
  _id: string
  productId: string | { _id: string; name: string }
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

interface Product {
  _id: string
  name: string
}

interface ProductVariantTableProps {
  variants: ProductVariant[]
  loading: boolean
  onEdit: (variant: ProductVariant) => void
  onToggleActive: (id: string, isActive: boolean) => void
  onAdjustStock: (id: string, delta: number) => void
  onDelete: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ProductVariantTable({
  variants,
  loading,
  onEdit,
  onToggleActive,
  onAdjustStock,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: ProductVariantTableProps) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [stockAdjustments, setStockAdjustments] = useState<Record<string, number>>({})
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (variants.length === 0) {
        setProductsLoading(false)
        return
      }

      try {
        const productIds = Array.from(new Set(
          variants.map(variant => 
            typeof variant.productId === 'object' 
              ? variant.productId._id 
              : variant.productId
          ).filter(Boolean)
        ))

        if (productIds.length === 0) {
          setProductsLoading(false)
          return
        }

        const productPromises = productIds.map(async (productId) => {
          try {
            const res = await apiFetch(`${backendUrl}/products/${productId}`)
            if (res.ok) {
              const product = await res.json()
              return product
            }
            return null
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error)
            return null
          }
        })

        const productsData = await Promise.all(productPromises)
        const productsMap: Record<string, Product> = {}
        
        productsData.forEach(product => {
          if (product && product._id) {
            productsMap[product._id] = product
          }
        })

        setProducts(productsMap)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Lỗi khi tải thông tin sản phẩm')
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [variants, backendUrl])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getProductName = (variant: ProductVariant): string => {
    if (typeof variant.productId === 'object' && variant.productId.name) {
      return variant.productId.name
    }

    const productId = typeof variant.productId === 'object' 
      ? variant.productId._id 
      : variant.productId
    
    return products[productId]?.name || `Product (${productId})`
  }

  const handleStockAdjustment = (variantId: string, delta: number) => {
    setStockAdjustments(prev => ({ ...prev, [variantId]: (prev[variantId] || 0) + delta }))
  }

  const applyStockAdjustment = (variantId: string) => {
    const delta = stockAdjustments[variantId] || 0
    if (delta === 0) return

    onAdjustStock(variantId, delta)
    setStockAdjustments(prev => ({ ...prev, [variantId]: 0 }))
  }

  const renderAttributes = (attributes: Record<string, any>) => {
    if (!attributes || typeof attributes !== 'object') return '-'
    
    return Object.entries(attributes).map(([key, value]) => (
      <div key={key} className="text-xs">
        <strong>{key}:</strong> {String(value)}
      </div>
    ))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải danh sách biến thể...</p>
        </div>
      </div>
    )
  }

  if (variants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có biến thể nào</h3>
        <p className="text-gray-600">Bắt đầu bằng cách thêm biến thể đầu tiên.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thuộc tính
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá & Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {variants.map((variant) => (
              <tr key={variant._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {variant.sku || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Barcode: {variant.barcode || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {productsLoading ? (
                        <span className="text-gray-400">Đang tải...</span>
                      ) : (
                        <>Product: {getProductName(variant)}</>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {renderAttributes(variant.attributes)}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(variant.price)}
                      </div>
                      {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(variant.compareAtPrice)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Tồn kho: {variant.stock}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStockAdjustment(variant._id, -1)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Giảm 1"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          value={stockAdjustments[variant._id] || 0}
                          onChange={e => setStockAdjustments(prev => ({
                            ...prev,
                            [variant._id]: parseInt(e.target.value) || 0
                          }))}
                          className="w-16 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          onClick={() => handleStockAdjustment(variant._id, 1)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Tăng 1"
                        >
                          <Plus size={14} />
                        </button>
                        {(stockAdjustments[variant._id] || 0) !== 0 && (
                          <button
                            onClick={() => applyStockAdjustment(variant._id)}
                            className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                          >
                            Áp dụng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    variant.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {variant.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(variant.createdAt)}
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onToggleActive(variant._id, !variant.isActive)}
                      className={`p-2 rounded ${
                        variant.isActive 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={variant.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      <Power size={16} />
                    </button>
                    
                    <button
                      onClick={() => onEdit(variant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    <button
                      onClick={() => onDelete(variant._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}