'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

interface ProductVariantModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: FormData) => Promise<void>
  onUpdate: (id: string, data: FormData) => Promise<void>
  editing: any | null
}

interface Attribute {
  key: string
  value: any
}

interface Product {
  _id: string
  name: string
  thumbnail?: string
}

export default function ProductVariantModal({ 
  open, 
  onClose, 
  onCreate, 
  onUpdate, 
  editing 
}: ProductVariantModalProps) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  
  const [form, setForm] = useState({
    productId: '',
    sku: '',
    barcode: '',
    attributes: [] as Attribute[],
    price: 0,
    compareAtPrice: 0,
    stock: 0,
  })
  const [loading, setLoading] = useState(false)
  const [newAttribute, setNewAttribute] = useState({ key: '', value: '' })
  const [products, setProducts] = useState<Product[]>([])
  const [images, setImages] = useState<FileList | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const fetchProducts = async () => {
    try {
      const res = await apiFetch(`${backendUrl}/products?limit=100`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data.items || [])
    } catch (err: any) {
      console.error('Fetch products error:', err)
      toast.error('Lỗi khi tải danh sách sản phẩm')
    }
  }

  useEffect(() => {
    if (open) {
      fetchProducts()
    }
  }, [open])

  useEffect(() => {
    if (editing) {
      const attributesArray: Attribute[] = []
      if (editing.attributes && typeof editing.attributes === 'object') {
        Object.entries(editing.attributes).forEach(([key, value]) => {
          attributesArray.push({ key, value })
        })
      }

      setForm({
        productId: editing.productId?._id || editing.productId || '',
        sku: editing.sku || '',
        barcode: editing.barcode || '',
        attributes: attributesArray,
        price: editing.price || 0,
        compareAtPrice: editing.compareAtPrice || 0,
        stock: editing.stock || 0,
      })

      setImagePreviews(editing.images || [])
    } else {
      setForm({
        productId: '',
        sku: '',
        barcode: '',
        attributes: [],
        price: 0,
        compareAtPrice: 0,
        stock: 0,
      })
      setImages(null)
      setImagePreviews([])
    }
  }, [editing])

  const handleAddAttribute = () => {
    if (!newAttribute.key.trim()) {
      toast.error('Vui lòng nhập key cho thuộc tính')
      return
    }

    setForm(prev => ({
      ...prev,
      attributes: [...prev.attributes, { ...newAttribute }]
    }))
    setNewAttribute({ key: '', value: '' })
  }

  const handleRemoveAttribute = (index: number) => {
    setForm(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setImages(files)
    
    if (files && files.length > 0) {
      const newPreviews: string[] = []
      const fileArray = Array.from(files)
      
      fileArray.forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          if (newPreviews.length === fileArray.length) {
            setImagePreviews(prev => editing ? [...prev, ...newPreviews] : newPreviews)
          }
        }
        reader.readAsDataURL(file)
      })
    } else {
      setImagePreviews(prev => editing ? prev : [])
    }
  }

  const removeImage = (index: number) => {
    if (editing && index < imagePreviews.length - (images?.length || 0)) {
      const updatedImages = [...imagePreviews]
      updatedImages.splice(index, 1)
      setImagePreviews(updatedImages)
    } else {
      if (images) {
        const dt = new DataTransfer()
        const fileArray = Array.from(images)
        fileArray.forEach((file, i) => {
          const actualIndex = editing ? i + (imagePreviews.length - fileArray.length) : i
          if (actualIndex !== index) dt.items.add(file)
        })
        setImages(dt.files.length > 0 ? dt.files : null)
        
        // Update previews
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index)
        setImagePreviews(updatedPreviews)
      }
    }
  }

  const removeAllImages = () => {
    setImages(null)
    setImagePreviews(editing ? [] : [])
    const imagesInput = document.getElementById('images-input') as HTMLInputElement
    if (imagesInput) imagesInput.value = ''
  }

  const handleSubmit = async () => {
    if (!form.productId) {
      toast.error('Vui lòng chọn sản phẩm')
      return
    }

    if (form.price < 0) {
      toast.error('Giá không được âm')
      return
    }

    if (form.stock < 0) {
      toast.error('Tồn kho không được âm')
      return
    }

    // Validate file size and type
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

    if (images) {
      for (const file of Array.from(images)) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Tối đa 20MB.`);
          return;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`Định dạng file ${file.name} không hợp lệ. Chấp nhận: PNG, JPEG, JPG, WebP, SVG`);
          return;
        }
      }
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('productId', form.productId)
      data.append('sku', form.sku)
      data.append('barcode', form.barcode)
      
      const attributesObj: Record<string, any> = {}
      form.attributes.forEach(attr => {
        const numValue = parseFloat(attr.value)
        attributesObj[attr.key] = isNaN(numValue) ? attr.value : numValue
      })
      data.append('attributes', JSON.stringify(attributesObj))
      
      data.append('price', form.price.toString())
      if (form.compareAtPrice > 0) {
        data.append('compareAtPrice', form.compareAtPrice.toString())
      }
      data.append('stock', form.stock.toString())

      // Append image files
      if (images && images.length > 0) {
        Array.from(images).forEach((file) => {
          data.append('images', file)
        })
      } else if (editing && imagePreviews.length > 0) {
        data.append('images', JSON.stringify(imagePreviews))
      }

      if (editing) {
        await onUpdate(editing._id, data)
      } else {
        await onCreate(data)
      }
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-4xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {editing ? 'Cập nhật biến thể' : 'Thêm biến thể mới'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sản phẩm *</label>
                <select
                  value={form.productId}
                  onChange={e => setForm(prev => ({ ...prev, productId: e.target.value }))}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="Mã SKU"
                  value={form.sku}
                  onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Barcode</label>
              <input
                type="text"
                placeholder="Mã vạch"
                value={form.barcode}
                onChange={e => setForm(prev => ({ ...prev, barcode: e.target.value }))}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Attributes Section */}
            <div className="border rounded p-4">
              <label className="block text-sm font-medium mb-2">Thuộc tính</label>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Key (ví dụ: color)"
                  value={newAttribute.key}
                  onChange={e => setNewAttribute(prev => ({ ...prev, key: e.target.value }))}
                  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Value (ví dụ: red)"
                  value={newAttribute.value}
                  onChange={e => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 flex items-center justify-center gap-1"
                >
                  <Plus size={16} />
                  Thêm
                </button>
              </div>

              {form.attributes.length > 0 && (
                <div className="space-y-2">
                  {form.attributes.map((attr, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">
                        <strong>{attr.key}:</strong> {attr.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giá *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.price}
                  onChange={e => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá so sánh</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={form.compareAtPrice}
                  onChange={e => setForm(prev => ({ ...prev, compareAtPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tồn kho *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.stock}
                  onChange={e => setForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Hình ảnh</label>
                {imagePreviews.length > 0 && (
                  <button
                    type="button"
                    onClick={removeAllImages}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Previews ({imagePreviews.length} ảnh):</p>
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <input
                id="images-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 10 ảnh, định dạng: PNG, JPEG, JPG, WebP, SVG</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : editing ? (
                'Cập nhật biến thể'
              ) : (
                'Thêm biến thể mới'
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}