'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

interface Props {
  open?: boolean
  onClose?: () => void
  onCreate: (data: any) => Promise<void>
  onUpdate: (id: string, data: any) => Promise<void>
  editing?: any
  subcategories?: { _id: string; name: string }[]
}

export default function AttributeTemplateModal({
  open = false,
  onClose,
  onCreate,
  onUpdate,
  editing,
  subcategories = [],
}: Props) {
  const [form, setForm] = useState({
    name: '',
    subcategoryId: '',
    version: 1,
    attributes: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name ?? '',
        subcategoryId:
          typeof editing.subcategoryId === 'string'
            ? editing.subcategoryId
            : editing.subcategoryId?._id ?? '',
        version: editing.version ?? 1,
        attributes: JSON.stringify(editing.attributes ?? [], null, 2),
        isActive: editing.isActive ?? true,
      })
    } else {
      setForm({
        name: '',
        subcategoryId: '',
        version: 1,
        attributes: '',
        isActive: true,
      })
    }
  }, [editing, open])

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // validate required
      if (!form.subcategoryId) return toast.error('Chọn subcategory (subcategoryId)')

      let attributesParsed: any = []
      if (form.attributes && form.attributes.trim() !== '') {
        try {
          attributesParsed = JSON.parse(form.attributes)
          if (!Array.isArray(attributesParsed)) {
            return toast.error('Attributes phải là mảng JSON (ví dụ: [ { "key": "..."} ])')
          }
        } catch {
          return toast.error('Attributes không phải JSON hợp lệ')
        }
      }

      const payload = {
        name: form.name || undefined,
        subcategoryId: form.subcategoryId,
        version: form.version,
        isActive: form.isActive,
        attributes: attributesParsed,
      }

      if (editing) {
        await onUpdate(editing._id, payload)
      } else {
        await onCreate(payload)
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Lưu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[720px] max-w-[95vw]
                     -translate-x-1/2 -translate-y-1/2 bg-white
                     rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {editing ? 'Sửa Attribute Template' : 'Tạo Attribute Template'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Tên (name)</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={change}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Tên template (có thể để trống để lấy từ subcategory)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Subcategory</label>
                <select
                  name="subcategoryId"
                  value={form.subcategoryId}
                  onChange={change}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">-- Chọn subcategory --</option>
                  {subcategories.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Version</label>
                <input
                  name="version"
                  type="number"
                  value={form.version}
                  onChange={change}
                  className="w-full border rounded px-3 py-2"
                  min={1}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="block text-sm font-medium">Active</label>
                <input
                  name="isActive"
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Attributes (JSON array)</label>
              <textarea
                name="attributes"
                value={form.attributes}
                onChange={change}
                rows={8}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                placeholder='Ví dụ: [{"key":"brand","label":"Brand","type":"string"}]'
              />
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded border hover:bg-gray-100">
                  Huỷ
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loading ? 'Đang lưu...' : editing ? 'Lưu' : 'Tạo'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
