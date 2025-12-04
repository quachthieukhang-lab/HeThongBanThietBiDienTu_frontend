'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: FormData) => Promise<void>
  onUpdate: (id: string, data: FormData) => Promise<void>
  editing: any | null
}

export default function ProductModal({ open, onClose, onCreate, onUpdate, editing }: ProductModalProps) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [form, setForm] = useState<any>({
    name: '',
    slug: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    isPublished: true,
    specs: {},
    priceFrom: 0,
    priceTo: 0,
    servicePackageIds: [],
  })
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [servicePackages, setServicePackages] = useState<any[]>([])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<{ thumbnail?: string, images: string[] }>({ images: [] })
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([])

  useEffect(() => {
    console.log('form changed:', form)
  }, [form])

  // Fetch categories, subcategories, brands, service packages
  const fetchData = async () => {
    try {
      const [categoriesRes, servicePackagesRes] = await Promise.all([
        apiFetch(`${backendUrl}/categories`),
        apiFetch(`${backendUrl}/service-packages`)
      ])

      if (!categoriesRes.ok || !servicePackagesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const categoriesData = await categoriesRes.json()
      const servicePackagesData = await servicePackagesRes.json()

      // Xử lý nhiều trường hợp cấu trúc response
      const getItems = (data: any) => {
        if (Array.isArray(data)) return data
        if (data && Array.isArray(data.items)) return data.items
        if (data && data.data && Array.isArray(data.data)) return data.data
        return data || []
      }

      const categoriesItems = getItems(categoriesData)
      const servicePackagesItems = getItems(servicePackagesData)

      // Fetch ALL subcategories pages
      let allSubcategories: any[] = []
      let currentPage = 1
      let totalPages = 1

      do {
        const subcategoriesRes = await apiFetch(`${backendUrl}/subcategories?page=${currentPage}&limit=100`)
        if (!subcategoriesRes.ok) {
          throw new Error('Failed to fetch subcategories')
        }

        const subcategoriesData = await subcategoriesRes.json()
        const subcategoriesItems = getItems(subcategoriesData)

        allSubcategories = [...allSubcategories, ...subcategoriesItems]

        // Xác định tổng số trang
        if (subcategoriesData.pages) {
          totalPages = subcategoriesData.pages
        } else if (subcategoriesData.total && subcategoriesData.limit) {
          totalPages = Math.ceil(subcategoriesData.total / subcategoriesData.limit)
        } else {
          // Nếu không có thông tin phân trang, chỉ lấy trang đầu
          totalPages = 1
        }

        currentPage++
      } while (currentPage <= totalPages)

      // Fetch ALL brands pages
      let allBrands: any[] = []
      currentPage = 1
      totalPages = 1

      do {
        const brandsRes = await apiFetch(`${backendUrl}/brands?page=${currentPage}&limit=100`)
        if (!brandsRes.ok) {
          throw new Error('Failed to fetch brands')
        }

        const brandsData = await brandsRes.json()
        const brandsItems = getItems(brandsData)

        allBrands = [...allBrands, ...brandsItems]

        // Xác định tổng số trang
        if (brandsData.pages) {
          totalPages = brandsData.pages
        } else if (brandsData.total && brandsData.limit) {
          totalPages = Math.ceil(brandsData.total / brandsData.limit)
        } else {
          // Nếu không có thông tin phân trang, chỉ lấy trang đầu
          totalPages = 1
        }

        currentPage++
      } while (currentPage <= totalPages)

      console.log('Total categories:', categoriesItems.length)
      console.log('Total subcategories:', allSubcategories.length)
      console.log('Total brands:', allBrands.length)
      console.log('Total service packages:', servicePackagesItems.length)

      // Log để debug xem mỗi danh mục có bao nhiêu subcategories
      categoriesItems.forEach((category: any) => {
        const subcatsForCategory = allSubcategories.filter(s => {
          if (!s.categoryId) return false
          let subcatCategoryId

          if (typeof s.categoryId === 'object' && s.categoryId !== null && s.categoryId._id) {
            subcatCategoryId = s.categoryId._id
          } else if (typeof s.categoryId === 'string') {
            subcatCategoryId = s.categoryId
          } else if (typeof s.categoryId === 'object' && s.categoryId !== null && s.categoryId.$oid) {
            subcatCategoryId = s.categoryId.$oid
          } else {
            return false
          }

          return String(subcatCategoryId) === String(category._id)
        })

        console.log(`Category "${category.name}" has ${subcatsForCategory.length} subcategories`)
      })

      setCategories(categoriesItems)
      setSubcategories(allSubcategories)
      setBrands(allBrands)
      setServicePackages(servicePackagesItems)

    } catch (err: any) {
      console.error('Fetch data error:', err)
      toast.error(err?.message || 'Lỗi khi tải dữ liệu danh mục')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter subcategories when category changes
  useEffect(() => {
    if (form.categoryId) {
      const filtered = subcategories.filter(s => {
        if (!s.categoryId) return false

        // Xử lý tất cả các trường hợp categoryId
        let subcatCategoryId

        // Trường hợp 1: categoryId là object đầy đủ (populated data)
        if (typeof s.categoryId === 'object' && s.categoryId !== null && s.categoryId._id) {
          subcatCategoryId = s.categoryId._id
        }
        // Trường hợp 2: categoryId là string trực tiếp
        else if (typeof s.categoryId === 'string') {
          subcatCategoryId = s.categoryId
        }
        // Trường hợp 3: categoryId là object với $oid (dạng MongoDB)
        else if (typeof s.categoryId === 'object' && s.categoryId !== null && s.categoryId.$oid) {
          subcatCategoryId = s.categoryId.$oid
        }
        else {
          return false
        }

        return String(subcatCategoryId) === String(form.categoryId)
      })

      console.log('Selected categoryId:', form.categoryId)
      console.log('Filtered subcategories:', filtered)
      setFilteredSubcategories(filtered)

      // Reset subcategoryId nếu danh mục con hiện tại không thuộc danh mục mới
      if (form.subcategoryId && !filtered.some(s => s._id === form.subcategoryId)) {
        setForm(prev => ({ ...prev, subcategoryId: '' }))
      }
    } else {
      setFilteredSubcategories([])
      setForm(prev => ({ ...prev, subcategoryId: '' }))
    }
  }, [form.categoryId, subcategories, form.subcategoryId])

  // Reset form when editing changes
  useEffect(() => {
    if (editing) {
      // Xử lý categoryId từ dữ liệu editing
      let editingCategoryId = ''
      if (editing.categoryId) {
        if (typeof editing.categoryId === 'object' && editing.categoryId !== null && editing.categoryId.$oid) {
          editingCategoryId = editing.categoryId.$oid
        } else if (typeof editing.categoryId === 'object' && editing.categoryId !== null && editing.categoryId._id) {
          editingCategoryId = editing.categoryId._id
        } else if (typeof editing.categoryId === 'string') {
          editingCategoryId = editing.categoryId
        }
      }

      // Xử lý subcategoryId từ dữ liệu editing
      let editingSubcategoryId = ''
      if (editing.subcategoryId) {
        if (typeof editing.subcategoryId === 'object' && editing.subcategoryId !== null && editing.subcategoryId.$oid) {
          editingSubcategoryId = editing.subcategoryId.$oid
        } else if (typeof editing.subcategoryId === 'object' && editing.subcategoryId !== null && editing.subcategoryId._id) {
          editingSubcategoryId = editing.subcategoryId._id
        } else if (typeof editing.subcategoryId === 'string') {
          editingSubcategoryId = editing.subcategoryId
        }
      }

      // Xử lý brandId từ dữ liệu editing
      let editingBrandId = ''
      if (editing.brandId) {
        if (typeof editing.brandId === 'object' && editing.brandId !== null && editing.brandId.$oid) {
          editingBrandId = editing.brandId.$oid
        } else if (typeof editing.brandId === 'object' && editing.brandId !== null && editing.brandId._id) {
          editingBrandId = editing.brandId._id
        } else if (typeof editing.brandId === 'string') {
          editingBrandId = editing.brandId
        }
      }

      // Xử lý servicePackageIds từ dữ liệu editing
      let editingServicePackageIds: string[] = []
      if (editing.servicePackageIds && Array.isArray(editing.servicePackageIds)) {
        editingServicePackageIds = editing.servicePackageIds.map((pkg: any) => {
          if (typeof pkg === 'object' && pkg !== null) {
            if (pkg.$oid) return pkg.$oid
            if (pkg._id) return pkg._id
          }
          return String(pkg)
        })
      }

      setForm({
        name: editing.name || '',
        slug: editing.slug || '',
        categoryId: editingCategoryId,
        subcategoryId: editingSubcategoryId,
        brandId: editingBrandId,
        servicePackageIds: editingServicePackageIds,
        isPublished: editing.isPublished !== undefined ? editing.isPublished : true,
        priceFrom: editing.priceFrom || 0,
        priceTo: editing.priceTo || 0,
        specs: editing.specs || {},
      })

      // Tạo preview cho ảnh hiện tại
      setImagePreviews({
        thumbnail: editing.thumbnail,
        images: editing.images || []
      })
    } else {
      setForm({
        name: '',
        slug: '',
        categoryId: '',
        subcategoryId: '',
        brandId: '',
        servicePackageIds: [],
        isPublished: true,
        priceFrom: 0,
        priceTo: 0,
        specs: {},
      })
      setThumbnail(null)
      setImages(null)
      setImagePreviews({ images: [] })
    }
  }, [editing])

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setThumbnail(file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => ({ ...prev, thumbnail: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    } else {
      // Nếu xóa file, giữ lại ảnh cũ nếu đang edit
      setImagePreviews(prev => ({ ...prev, thumbnail: editing?.thumbnail }))
    }
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
          // Khi đã load xong tất cả files
          if (newPreviews.length === fileArray.length) {
            setImagePreviews(prev => ({
              ...prev,
              images: editing ? [...prev.images, ...newPreviews] : newPreviews
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    } else {
      setImagePreviews(prev => ({
        ...prev,
        images: editing?.images || []
      }))
    }
  }

  const handleServicePackageChange = (servicePackageId: string) => {
    setForm((prev: any) => {
      const isSelected = prev.servicePackageIds.includes(servicePackageId)
      if (isSelected) {
        return {
          ...prev,
          servicePackageIds: prev.servicePackageIds.filter((id: string) => id !== servicePackageId)
        }
      } else {
        return {
          ...prev,
          servicePackageIds: [...prev.servicePackageIds, servicePackageId]
        }
      }
    })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.categoryId || !form.subcategoryId) {
      toast.error('Vui lòng điền đủ tên, danh mục và danh mục con')
      return
    }

    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

    let totalSize = 0;

    if (thumbnail) {
      if (thumbnail.size > MAX_FILE_SIZE) {
        toast.error(`File thumbnail quá lớn (${(thumbnail.size / 1024 / 1024).toFixed(2)}MB). Tối đa 20MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(thumbnail.type)) {
        toast.error(`Định dạng file thumbnail không hợp lệ. Chấp nhận: PNG, JPEG, JPG, WebP, SVG`);
        return;
      }
      totalSize += thumbnail.size;
    }

    if (images && images.length > 0) {
      for (const file of Array.from(images)) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Tối đa 20MB.`);
          return;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`Định dạng file ${file.name} không hợp lệ. Chấp nhận: PNG, JPEG, JPG, WebP, SVG`);
          return;
        }
        totalSize += file.size;
      }
    }

    if (totalSize > MAX_FILE_SIZE) {
      toast.error(`Tổng kích thước files quá lớn (${(totalSize / 1024 / 1024).toFixed(2)}MB). Tối đa 20MB.`);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      data.append('name', form.name.trim());
      data.append('slug', form.slug?.trim() || form.name.trim());
      data.append('categoryId', form.categoryId);
      data.append('subcategoryId', form.subcategoryId);
      data.append('isPublished', String(form.isPublished));
      data.append('priceFrom', String(form.priceFrom || 0));
      data.append('priceTo', String(form.priceTo || 0));

      // KHÔNG gửi servicePackageIds ở đây - sẽ gọi endpoint riêng

      if (form.brandId && form.brandId.trim() !== '') {
        data.append('brandId', form.brandId);
      }

      // Xử lý thumbnail
      if (thumbnail instanceof File) {
        data.append('thumbnail', thumbnail);
      }

      // Xử lý images
      if (images instanceof FileList && images.length > 0) {
        Array.from(images).forEach((file, index) => {
          if (thumbnail && file.name === thumbnail.name && file.size === thumbnail.size) {
            return;
          }
          data.append('images', file);
        });
      }

      if (editing) {
        await onUpdate(editing._id, data);

        try {
          const response = await apiFetch(`${backendUrl}/products/${editing._id}/service-packages`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              servicePackageIds: form.servicePackageIds || []
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update service packages');
          }

          toast.success('Đã cập nhật service packages');
        } catch (pkgError: any) {
          console.error('Failed to update service packages:', pkgError);
          toast.error('Cập nhật product thành công nhưng có lỗi với service packages: ' + (pkgError.message || ''));
        }
      } else {
        await onCreate(data);
      }

    } catch (error: any) {
      console.error('Submit error details:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi gửi dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null)
    setImagePreviews(prev => ({ ...prev, thumbnail: undefined }))
    // Reset input file
    const thumbnailInput = document.getElementById('thumbnail-input') as HTMLInputElement
    if (thumbnailInput) thumbnailInput.value = ''
  }

  const removeImage = (index: number) => {
    if (editing && index < imagePreviews.images.length - (images?.length || 0)) {
      const updatedImages = [...imagePreviews.images]
      updatedImages.splice(index, 1)
      setImagePreviews(prev => ({ ...prev, images: updatedImages }))
    } else {
      if (images) {
        const dt = new DataTransfer()
        const fileArray = Array.from(images)
        fileArray.forEach((file, i) => {
          const actualIndex = editing ? i + (imagePreviews.images.length - fileArray.length) : i
          if (actualIndex !== index) dt.items.add(file)
        })
        setImages(dt.files.length > 0 ? dt.files : null)

        // Cập nhật preview
        const updatedPreviews = imagePreviews.images.filter((_, i) => i !== index)
        setImagePreviews(prev => ({ ...prev, images: updatedPreviews }))
      }
    }
  }

  const removeAllImages = () => {
    setImages(null)
    setImagePreviews(prev => ({ ...prev, images: [] }))
    const imagesInput = document.getElementById('images-input') as HTMLInputElement
    if (imagesInput) imagesInput.value = ''
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
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
            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                placeholder="Slug (tự động tạo nếu để trống)"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Slug sẽ được tạo tự động từ tên sản phẩm nếu để trống</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục *</label>
                <select
                  value={form.categoryId}
                  onChange={e => {
                    setForm({
                      ...form,
                      categoryId: e.target.value,
                      subcategoryId: ''
                    })
                  }}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Danh mục con *</label>
                <select
                  value={form.subcategoryId}
                  onChange={e => setForm({ ...form, subcategoryId: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!form.categoryId}
                  required
                >
                  <option value="">Chọn danh mục con</option>
                  {filteredSubcategories.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
                {form.categoryId && filteredSubcategories.length === 0 && (
                  <p className="text-xs text-yellow-600 mt-1">Không có danh mục con nào cho danh mục này</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thương hiệu</label>
              <select
                value={form.brandId}
                onChange={e => setForm({ ...form, brandId: e.target.value })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Chọn thương hiệu (tùy chọn)</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service Packages</label>
              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                {servicePackages.length === 0 ? (
                  <p className="text-sm text-gray-500">Không có service package nào</p>
                ) : (
                  <div className="space-y-2">
                    {servicePackages.map((pkg) => (
                      <div key={pkg._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-package-${pkg._id}`}
                          checked={form.servicePackageIds.includes(pkg._id)}
                          onChange={() => handleServicePackageChange(pkg._id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`service-package-${pkg._id}`}
                          className="ml-2 text-sm cursor-pointer hover:text-indigo-700"
                        >
                          {pkg.name} {pkg.price ? `($${pkg.price})` : ''}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Chọn các service packages áp dụng cho sản phẩm này</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giá từ</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priceFrom}
                  onChange={e => setForm({ ...form, priceFrom: Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá đến</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priceTo}
                  onChange={e => setForm({ ...form, priceTo: Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border rounded">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium">
                Hiển thị sản phẩm
              </label>
            </div>

            <div className="border rounded p-4">
              <label className="block text-sm font-medium mb-2">Ảnh đại diện (Thumbnail)</label>
              {imagePreviews.thumbnail && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreviews.thumbnail}
                      alt="Thumbnail preview"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-gray-500 mt-1">Ảnh đại diện cho sản phẩm</p>
            </div>

            <div className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Ảnh chi tiết (Gallery)</label>
                {imagePreviews.images.length > 0 && (
                  <button
                    type="button"
                    onClick={removeAllImages}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {imagePreviews.images.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Previews ({imagePreviews.images.length} ảnh):</p>
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.images.map((img, index) => (
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
                'Cập nhật sản phẩm'
              ) : (
                'Thêm sản phẩm mới'
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}