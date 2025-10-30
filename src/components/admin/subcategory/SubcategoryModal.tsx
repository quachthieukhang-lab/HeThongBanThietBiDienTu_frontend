// 'use client'

// import React, { useEffect, useState } from 'react'
// import * as Dialog from '@radix-ui/react-dialog'
// import { X } from 'lucide-react'

// export default function SubcategoryModal({
//   open = false,
//   onClose,
//   onCreate,
//   onUpdate,
//   editing,
//   categories = [],
// }: any) {
//   const [form, setForm] = useState({
//     name: '',
//     slug: '',
//     categoryId: '',
//     description: '',
//     sortOrder: 0,
//     isActive: true,
//     image: '',
//     banner: '',
//     path: '',
//     metaTitle: '',
//     metaDescription: '',
//   })

//   useEffect(() => {
//     if (editing) {
//       setForm({
//         name: editing.name ?? '',
//         slug: editing.slug ?? '',
//         categoryId: editing.categoryId ?? editing.category?._id ?? '',
//         description: editing.description ?? '',
//         sortOrder: editing.sortOrder ?? 0,
//         isActive: editing.isActive ?? true,
//         image: editing.image ?? '',
//         banner: editing.banner ?? '',
//         path: editing.path ?? '',
//         metaTitle: editing.metaTitle ?? '',
//         metaDescription: editing.metaDescription ?? '',
//       })
//     } else {
//       setForm({
//         name: '',
//         slug: '',
//         categoryId: '',
//         description: '',
//         sortOrder: 0,
//         isActive: true,
//         image: '',
//         banner: '',
//         path: '',
//         metaTitle: '',
//         metaDescription: '',
//       })
//     }
//   }, [editing, open])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target as any
//     setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!form.name || form.name.trim().length === 0) return alert('Tên bắt buộc')
//     if (!form.categoryId || form.categoryId.trim().length === 0) return alert('Chọn danh mục cha')

//     const payload: any = {
//       name: form.name,
//       slug: form.slug || undefined,
//       categoryId: form.categoryId,
//       description: form.description || undefined,
//       sortOrder: form.sortOrder,
//       isActive: form.isActive,
//       image: form.image || undefined,
//       banner: form.banner || undefined,
//       path: form.path || undefined,
//       metaTitle: form.metaTitle || undefined,
//       metaDescription: form.metaDescription || undefined,
//     }

//     if (editing) await onUpdate(editing._id, payload)
//     else await onCreate(payload)
//   }

//   return (
//     <Dialog.Root open={open} onOpenChange={onClose}>
//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 bg-black/40" />

//         <Dialog.Content className="fixed left-1/2 top-1/2 w-[700px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl">
//           <div className="flex items-center justify-between mb-4">
//             <Dialog.Title className="text-lg font-semibold">{editing ? 'Sửa Subcategory' : 'Tạo Subcategory'}</Dialog.Title>
//             <Dialog.Close asChild>
//               <button className="p-1 text-gray-500 hover:text-gray-700"><X /></button>
//             </Dialog.Close>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-3 max-h-[60vh] overflow-auto pr-2">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="text-sm font-medium">Tên*</label>
//                 <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Slug</label>
//                 <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="text-sm font-medium">Danh mục cha*</label>
//                 <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-3 py-2">
//                   <option value="">-- Chọn danh mục --</option>
//                   {categories.map((c: any) => (
//                     <option key={c._id} value={c._id}>{c.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Sort Order</label>
//                 <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Description</label>
//               <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="text-sm font-medium">Image URL</label>
//                 <input name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//                 {form.image && <img src={form.image} alt="preview" className="w-24 h-24 object-cover rounded border mt-2" />}
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Banner URL</label>
//                 <input name="banner" value={form.banner} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//                 {form.banner && <img src={form.banner} alt="preview" className="w-full h-24 object-cover rounded border mt-2" />}
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Path (SEO)</label>
//               <input name="path" value={form.path} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="text-sm font-medium">Meta Title</label>
//                 <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Meta Description</label>
//                 <input name="metaDescription" value={form.metaDescription} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 mt-5">
//               <Dialog.Close asChild>
//                 <button type="button" className="px-4 py-2 rounded border hover:bg-gray-100">Huỷ</button>
//               </Dialog.Close>

//               <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">{editing ? 'Lưu' : 'Tạo'}</button>
//             </div>
//           </form>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   )
// }
'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SubcategoryModal({
  open = false,
  onClose,
  onCreate,
  onUpdate,
  editing,
  categories = [],
}: any) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryId: '',
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

  // --- Load dữ liệu khi chỉnh sửa ---
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name ?? '',
        slug: editing.slug ?? '',
        categoryId: typeof editing.categoryId === 'string'
          ? editing.categoryId
          : editing.categoryId?._id ?? editing.category?._id ?? '',
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
        categoryId: '',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
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
    if (!form.categoryId || (typeof form.categoryId === 'string' && form.categoryId.trim().length === 0))
      return alert('Chọn danh mục cha')

    const formData = new FormData()
    formData.append('name', form.name)
    if (form.slug) formData.append('slug', form.slug)
    formData.append('categoryId', typeof form.categoryId === 'string' ? form.categoryId : form.categoryId._id)
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

        <Dialog.Content className="fixed left-1/2 top-1/2 w-[700px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">{editing ? 'Sửa Subcategory' : 'Tạo Subcategory'}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-500 hover:text-gray-700"><X /></button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Tên*</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Danh mục cha*</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Sort Order</label>
                <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Image</label>
                <input type="file" onChange={handleImageChange} />
                {previewImage && <img src={previewImage} alt="preview" className="mt-2 w-24 h-24 object-cover rounded border" />}
              </div>
              <div>
                <label className="text-sm font-medium">Banner</label>
                <input type="file" onChange={handleBannerChange} />
                {previewBanner && <img src={previewBanner} alt="preview" className="mt-2 w-24 h-24 object-cover rounded border" />}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Path (SEO)</label>
              <input name="path" value={form.path} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Meta Title</label>
                <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="text-sm font-medium">Meta Description</label>
                <input name="metaDescription" value={form.metaDescription} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded border hover:bg-gray-100">Huỷ</button>
              </Dialog.Close>

              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">{editing ? 'Lưu' : 'Tạo'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
