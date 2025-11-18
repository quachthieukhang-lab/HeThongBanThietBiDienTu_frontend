'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CategoryModal({
  open = false,
  onClose,
  onCreate,
  onUpdate,
  editing,
}: any) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
    isActive: true,
    path: '',
    metaTitle: '',
    metaDescription: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewBanner, setPreviewBanner] = useState<string | null>(null)

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name ?? '',
        slug: editing.slug ?? '',
        description: editing.description ?? '',
        sortOrder: editing.sortOrder ?? 0,
        isActive: editing.isActive ?? true,
        path: editing.path ?? '',
        metaTitle: editing.metaTitle ?? '',
        metaDescription: editing.metaDescription ?? '',
      })
      setPreviewImage(editing.image ?? null)
      setPreviewBanner(editing.banner ?? null)
      setImageFile(null)
      setBannerFile(null)
    } else {
      setForm({
        name: '',
        slug: '',
        description: '',
        sortOrder: 0,
        isActive: true,
        path: '',
        metaTitle: '',
        metaDescription: '',
      })
      setPreviewImage(null)
      setPreviewBanner(null)
      setImageFile(null)
      setBannerFile(null)
    }
  }, [editing, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setPreviewImage(file ? URL.createObjectURL(file) : null)
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setBannerFile(file)
    setPreviewBanner(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || form.name.trim().length === 0) return alert('Tên bắt buộc')

    const formData = new FormData()
    formData.append('name', form.name)
    if (form.slug) formData.append('slug', form.slug)
    if (form.description) formData.append('description', form.description)
    formData.append('sortOrder', String(form.sortOrder))
    formData.append('isActive', String(form.isActive))
    if (form.path) formData.append('path', form.path)
    if (form.metaTitle) formData.append('metaTitle', form.metaTitle)
    if (form.metaDescription) formData.append('metaDescription', form.metaDescription)

    if (imageFile) formData.append('image', imageFile)
    if (bannerFile) formData.append('banner', bannerFile)

    try {
      if (editing) await onUpdate(editing._id, formData)
      else await onCreate(formData)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || (editing ? 'Cập nhật thất bại' : 'Tạo thất bại'))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[680px] max-w-[95vw]
                     -translate-x-1/2 -translate-y-1/2 bg-white
                     rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {editing ? 'Sửa Category' : 'Tạo Category'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Tên*</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Sort Order</label>
                <input
                  name="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  name="isActive"
                  value={String(form.isActive)}
                  onChange={e =>
                    setForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Image</label>
                <input type="file" onChange={handleImageChange} />
                {previewImage && (
                  <img src={previewImage} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Banner</label>
                <input type="file" onChange={handleBannerChange} />
                {previewBanner && (
                  <img src={previewBanner} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Path (SEO)</label>
              <input
                name="path"
                value={form.path}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Meta Title</label>
                <input
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meta Description</label>
                <input
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded border hover:bg-gray-100">
                  Huỷ
                </button>
              </Dialog.Close>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
                {editing ? 'Lưu' : 'Tạo'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}