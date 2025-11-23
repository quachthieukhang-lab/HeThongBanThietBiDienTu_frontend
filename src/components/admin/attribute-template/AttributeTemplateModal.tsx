'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, PlusCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  open?: boolean
  onClose?: () => void
  onCreate: (data: any) => Promise<void>
  onUpdate: (id: string, data: any) => Promise<void>
  editing?: any
  subcategories?: { _id: string; name: string }[]
}


function Button({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  disabled = false,
  className = '',
}: any) {
  const base =
    'px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none ' +
    (variant === 'outline'
      ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300')

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
    >
      {children}
    </button>
  )
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
    attributes: [] as any[],
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    console.log(form)
  },[form])
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name ?? '',
        subcategoryId:
          typeof editing.subcategoryId === 'string'
            ? editing.subcategoryId
            : editing.subcategoryId?._id ?? '',
        version: editing.version ?? 1,
        attributes: Array.isArray(editing.attributes)
          ? editing.attributes
          : [],
        isActive: editing.isActive ?? true,
      })
    } else {
      setForm({
        name: '',
        subcategoryId: '',
        version: 1,
        attributes: [],
        isActive: true,
      })
    }
  }, [editing, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!form.subcategoryId) return toast.error('Chọn subcategory')

      const payload = {
        name: form.name || undefined,
        subcategoryId: form.subcategoryId,
        version: form.version,
        isActive: form.isActive,
        attributes: form.attributes,
      }

      if (editing) {
        await onUpdate(editing._id, payload)
        toast.success('Cập nhật thành công')
      } else {
        await onCreate(payload)
        toast.success('Tạo mới thành công')
      }
      setForm({
        name: '',
        subcategoryId: '',
        version: 1,
        attributes: [],
        isActive: true,
      })

      onClose?.()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Lưu thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleAttrChange = (index: number, key: string, value: any) => {
    const updated = [...form.attributes]
    updated[index] = { ...updated[index], [key]: value }
    setForm((f) => ({ ...f, attributes: updated }))
  }

  const addAttribute = () => {
    setForm((f) => ({
      ...f,
      attributes: [
        ...f.attributes,
        { key: '', label: '', type: 'string', required: false, unit: '', options: [] },
      ],
    }))
  }

  const removeAttribute = (index: number) => {
    const updated = form.attributes.filter((_, i) => i !== index)
    setForm((f) => ({ ...f, attributes: updated }))
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[800px] max-w-[95vw]
                     -translate-x-1/2 -translate-y-1/2 bg-white
                     rounded-2xl shadow-2xl max-h-[85vh]
                     flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Dialog.Title className="text-lg font-semibold">
              {editing ? 'Sửa Attribute Template' : 'Tạo Attribute Template'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-6 py-4 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Tên</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Tên template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Subcategory</label>
                <select
                  name="subcategoryId"
                  value={form.subcategoryId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subcategoryId: e.target.value }))
                  }
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Version</label>
                <input
                  type="number"
                  value={form.version}
                  min={1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, version: Number(e.target.value) }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <label className="text-sm font-medium">Active</label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                />
              </div>
            </div>

            {/* Attributes */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Thuộc tính</label>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  <PlusCircle size={16} /> Thêm thuộc tính
                </button>
              </div>

              {form.attributes.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có thuộc tính nào.</p>
              ) : (
                <div className="space-y-2">
                  {form.attributes.map((attr, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap gap-2 border rounded-lg p-3 bg-gray-50"
                    >
                      <input
                        placeholder="Key"
                        className="border rounded px-2 py-1 text-sm flex-1 min-w-[100px]"
                        value={attr.key}
                        onChange={(e) => handleAttrChange(i, 'key', e.target.value)}
                      />
                      <input
                        placeholder="Label"
                        className="border rounded px-2 py-1 text-sm flex-1 min-w-[100px]"
                        value={attr.label}
                        onChange={(e) => handleAttrChange(i, 'label', e.target.value)}
                      />
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={attr.type}
                        onChange={(e) => handleAttrChange(i, 'type', e.target.value)}
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                        <option value="enum">enum</option>
                      </select>
                      <input
                        placeholder="Unit"
                        className="border rounded px-2 py-1 text-sm w-[80px]"
                        value={attr.unit || ''}
                        onChange={(e) => handleAttrChange(i, 'unit', e.target.value)}
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={attr.required || false}
                          onChange={(e) =>
                            handleAttrChange(i, 'required', e.target.checked)
                          }
                        />
                        Bắt buộc
                      </label>
                      <input
                        placeholder='["Red","Blue"]'
                        className="border rounded px-2 py-1 text-sm flex-1 min-w-[150px]"
                        value={
                          Array.isArray(attr.options)
                            ? JSON.stringify(attr.options)
                            : attr.options || ''
                        }
                        onChange={(e) => {
                          try {
                            const val = JSON.parse(e.target.value)
                            handleAttrChange(i, 'options', val)
                          } catch {
                            handleAttrChange(i, 'options', e.target.value)
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeAttribute(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <Dialog.Close asChild>
              <Button variant="outline" onClick={onClose}>
                Huỷ
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Đang lưu...' : editing ? 'Lưu' : 'Tạo'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
