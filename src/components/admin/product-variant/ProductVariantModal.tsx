'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '@/lib/api'

interface ProductVariantModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: any) => Promise<void>
  onUpdate: (id: string, data: any) => Promise<void>
  editing: any | null
}

interface Product {
  _id: string
  name: string
  thumbnail?: string
  templateId: string
}

interface AttributeTemplate {
  _id: string
  attributes: Array<{
    key: string
    type: 'string' | 'number' | 'boolean' | 'enum' | 'multienum'
    required?: boolean
    options?: (string | number)[]
    min?: number
    max?: number
    filterable?: boolean
  }>
}

interface FormState {
  productId: string
  sku: string
  barcode: string
  attributes: Record<string, any>
  price: number
  compareAtPrice: number
  stock: number
}

export default function ProductVariantModal({ 
  open, 
  onClose, 
  onCreate, 
  onUpdate, 
  editing 
}: ProductVariantModalProps) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  
  const [form, setForm] = useState<FormState>({
    productId: '',
    sku: '',
    barcode: '',
    attributes: {},
    price: 0,
    compareAtPrice: 0,
    stock: 0,
  })
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [attributeTemplates, setAttributeTemplates] = useState<Record<string, AttributeTemplate>>({})
  const [currentTemplate, setCurrentTemplate] = useState<AttributeTemplate | null>(null)
  const [images, setImages] = useState<FileList | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedAttribute, setSelectedAttribute] = useState('')

  // Fetch products và attribute templates
  const fetchProductsAndTemplates = async () => {
    try {
      const [productsRes, templatesRes] = await Promise.all([
        apiFetch(`${backendUrl}/products?limit=100`),
        apiFetch(`${backendUrl}/attribute-templates?limit=100`)
      ])

      if (!productsRes.ok) throw new Error('Failed to fetch products')
      if (!templatesRes.ok) throw new Error('Failed to fetch attribute templates')

      const productsData = await productsRes.json()
      const templatesData = await templatesRes.json()

      const productsList = productsData.items || []
      setProducts(productsList)

      const templatesMap: Record<string, AttributeTemplate> = {}
      templatesData.items?.forEach((template: AttributeTemplate) => {
        templatesMap[template._id] = template
      })
      setAttributeTemplates(templatesMap)

    } catch (err: any) {
      console.error('Fetch data error:', err)
      toast.error('Lỗi khi tải dữ liệu')
    }
  }

  useEffect(() => {
    if (open) {
      fetchProductsAndTemplates()
    }
  }, [open])

  useEffect(() => {
    if (form.productId) {
      const selectedProduct = products.find(p => p._id === form.productId)
      
      if (selectedProduct && selectedProduct.templateId) {
        const template = attributeTemplates[selectedProduct.templateId]
        setCurrentTemplate(template)
      } else {
        setCurrentTemplate(null)
      }
    } else {
      setCurrentTemplate(null)
    }
  }, [form.productId, products, attributeTemplates])

  useEffect(() => {
    if (editing) {
      console.log('Editing effect triggered with editing:', editing)
      
      // Lấy productId từ editing
      const editingProductId = editing.productId?._id || editing.productId || ''
      
      let templateForEditing: AttributeTemplate | null = null
      if (editingProductId) {
        const selectedProduct = products.find(p => p._id === editingProductId)
        if (selectedProduct && selectedProduct.templateId) {
          templateForEditing = attributeTemplates[selectedProduct.templateId]
        }
      }
      
      const originalAttributes = editing.attributes || {}
      const processedAttributes: Record<string, any> = {}
      
      if (templateForEditing) {
        for (const [key, value] of Object.entries(originalAttributes)) {
          const attributeDef = templateForEditing.attributes.find(attr => attr.key === key)
          
          if (attributeDef) {
            // Xử lý kiểu dữ liệu theo template
            if (attributeDef.type === 'number') {
              processedAttributes[key] = Number(value)
            } else if (attributeDef.type === 'boolean') {
              processedAttributes[key] = Boolean(value)
            } else if (attributeDef.type === 'enum' && attributeDef.options) {
              // Tìm giá trị gốc trong options để giữ nguyên kiểu
              const valueStr = String(value)
              const originalOption = attributeDef.options.find((opt: any) => 
                String(opt) === valueStr
              )
              processedAttributes[key] = originalOption !== undefined ? originalOption : value
            } else if (attributeDef.type === 'multienum' && attributeDef.options) {
              // Xử lý mảng
              const values = Array.isArray(value) ? value : [value]
              const processedValues: any[] = []
              
              for (const val of values) {
                const valStr = String(val)
                const originalOption = attributeDef.options.find((opt: any) => 
                  String(opt) === valStr
                )
                processedValues.push(originalOption !== undefined ? originalOption : val)
              }
              processedAttributes[key] = processedValues
            } else {
              processedAttributes[key] = value
            }
          } else {
            processedAttributes[key] = value
          }
        }
        
        // Set current template
        setCurrentTemplate(templateForEditing)
      } else {
        Object.assign(processedAttributes, originalAttributes)
      }
      
      setForm({
        productId: editingProductId,
        sku: editing.sku || '',
        barcode: editing.barcode || '',
        attributes: processedAttributes,
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
        attributes: {},
        price: 0,
        compareAtPrice: 0,
        stock: 0,
      })
      setCurrentTemplate(null)
      setImages(null)
      setImagePreviews([])
      setSelectedAttribute('')
    }
  }, [editing])

  useEffect(() => {
    if (!editing && currentTemplate && form.productId) {
      console.log('Current template changed for new variant, template:', currentTemplate)
      
      const currentAttributes = { ...form.attributes }
      const validAttributes: Record<string, any> = {}
      
      for (const [key, value] of Object.entries(currentAttributes)) {
        const attributeDef = currentTemplate.attributes.find(attr => attr.key === key)
        if (attributeDef) {
          validAttributes[key] = value
        }
      }
      
      if (JSON.stringify(validAttributes) !== JSON.stringify(currentAttributes)) {
        setForm(prev => ({
          ...prev,
          attributes: validAttributes
        }))
      }
    }
  }, [currentTemplate, editing, form.productId])

  const getAvailableAttributes = () => {
    if (!currentTemplate) return []
    
    const currentAttributeKeys = Object.keys(form.attributes)
    return currentTemplate.attributes.filter(attr => !currentAttributeKeys.includes(attr.key))
  }

  // Thêm thuộc tính từ dropdown - XỬ LÝ KIỂU DỮ LIỆU MẶC ĐỊNH
  const handleAddAttribute = () => {
    if (!selectedAttribute) {
      toast.error('Vui lòng chọn thuộc tính')
      return
    }

    const attributeDef = currentTemplate?.attributes.find(attr => attr.key === selectedAttribute)
    if (!attributeDef) return

    if (form.attributes[selectedAttribute] !== undefined) {
      toast.error(`Thuộc tính "${selectedAttribute}" đã được thêm`)
      return
    }

    let defaultValue: any = ''
    
    switch (attributeDef.type) {
      case 'number':
        defaultValue = attributeDef.min || 0
        break
      case 'boolean':
        defaultValue = false
        break
      case 'enum':
        defaultValue = attributeDef.options?.[0] || ''
        break
      case 'multienum':
        defaultValue = attributeDef.options?.[0] ? [attributeDef.options[0]] : []
        break
      default:
        defaultValue = ''
    }

    setForm(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [selectedAttribute]: defaultValue
      }
    }))
    setSelectedAttribute('')
  }

  // Cập nhật giá trị thuộc tính
  const handleUpdateAttributeValue = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value
      }
    }))
  }

  // Xóa thuộc tính
  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...form.attributes }
    delete newAttributes[key]
    setForm(prev => ({ ...prev, attributes: newAttributes }))
  }

  // Render input control dựa trên type của attribute - FIX KIỂU DỮ LIỆU
  const renderAttributeInput = (key: string, value: any, attributeDef: any) => {
    if (!attributeDef) return null

    const baseClass = "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"

    switch (attributeDef.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={e => handleUpdateAttributeValue(key, e.target.value)}
            className={baseClass}
            placeholder={`Nhập ${key}`}
          />
        )
      
      case 'number':
        // Number đơn thuần (không phải enum)
        return (
          <input
            type="number"
            value={value || 0}
            onChange={e => {
              const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value)
              handleUpdateAttributeValue(key, isNaN(numValue) ? 0 : numValue)
            }}
            min={attributeDef.min}
            max={attributeDef.max}
            className={baseClass}
            step="any"
          />
        )
      
      case 'boolean':
        return (
          <select
            value={value ? 'true' : 'false'}
            onChange={e => handleUpdateAttributeValue(key, e.target.value === 'true')}
            className={baseClass}
          >
            <option value="false">Không</option>
            <option value="true">Có</option>
          </select>
        )
      
      case 'enum':
        // QUAN TRỌNG: Xử lý để giữ nguyên kiểu dữ liệu từ options
        const currentValue = value !== undefined && value !== null ? value : ''
        
        return (
          <select
            value={String(currentValue)}
            onChange={e => {
              const selectedValue = e.target.value
              // Tìm option gốc để giữ nguyên kiểu dữ liệu
              const originalOption = attributeDef.options?.find((opt: any) => 
                String(opt) === selectedValue
              )
              handleUpdateAttributeValue(key, originalOption !== undefined ? originalOption : selectedValue)
            }}
            className={baseClass}
          >
            <option value="">Chọn {key}</option>
            {attributeDef.options?.map((option: any) => (
              <option key={option} value={String(option)}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case 'multienum':
        const currentValues = Array.isArray(value) ? value.map(v => String(v)) : []
        return (
          <select
            multiple
            value={currentValues}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, option => {
                const optionValue = option.value
                // Tìm option gốc để giữ nguyên kiểu dữ liệu
                const originalOption = attributeDef.options?.find((opt: any) => 
                  String(opt) === optionValue
                )
                return originalOption !== undefined ? originalOption : optionValue
              })
              handleUpdateAttributeValue(key, selected)
            }}
            className={`${baseClass} h-20`}
            size={Math.min(attributeDef.options?.length || 1, 4)}
          >
            {attributeDef.options?.map((option: any) => (
              <option key={option} value={String(option)}>
                {option}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={e => handleUpdateAttributeValue(key, e.target.value)}
            className={baseClass}
          />
        )
    }
  }

  const availableAttributes = getAvailableAttributes()

  // Các hàm xử lý ảnh
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

  // Hàm submit với validation kiểu dữ liệu
  const handleSubmit = async () => {
    if (!form.productId) {
      toast.error('Vui lòng chọn sản phẩm')
      return
    }

    if (!currentTemplate) {
      toast.error('Không tìm thấy template thuộc tính cho sản phẩm này')
      return
    }

    console.log('=== SUBMIT VALIDATION ===')
    console.log('Current Template:', currentTemplate)
    console.log('Form Attributes:', form.attributes)

    // Validate và chuẩn bị attributes
    const validatedAttributes: Record<string, any> = {}
    const validationErrors: string[] = []

    for (const [key, value] of Object.entries(form.attributes)) {
      const attributeDef = currentTemplate.attributes.find(attr => attr.key === key)
      
      if (!attributeDef) {
        console.warn(`⚠️ Attribute "${key}" không có trong template, bỏ qua`)
        continue
      }

      console.log(`Validating ${key}:`, {
        type: attributeDef.type,
        value: value,
        valueType: typeof value,
        options: attributeDef.options
      })

      let validatedValue = value

      // Validate theo type
      if (attributeDef.type === 'number') {
        validatedValue = Number(value)
        if (isNaN(validatedValue)) {
          validationErrors.push(`${key}: Giá trị phải là số`)
          continue
        }
      }
      
      // Validate enum - QUAN TRỌNG: So sánh dưới dạng string
      if (attributeDef.type === 'enum' && attributeDef.options) {
        const valueStr = String(value)
        const optionsStr = attributeDef.options.map(opt => String(opt))
        
        if (!optionsStr.includes(valueStr)) {
          validationErrors.push(`${key}: Giá trị "${value}" không hợp lệ. Các giá trị hợp lệ: ${attributeDef.options.join(', ')}`)
          continue
        }
        
        // Giữ nguyên kiểu dữ liệu gốc từ options
        const originalOption = attributeDef.options.find((opt: any) => 
          String(opt) === valueStr
        )
        if (originalOption !== undefined) {
          validatedValue = originalOption
        }
      }
      
      // Validate multienum
      if (attributeDef.type === 'multienum' && attributeDef.options) {
        const values = Array.isArray(value) ? value : [value]
        const validatedValues: any[] = []
        
        for (const val of values) {
          const valStr = String(val)
          const optionsStr = attributeDef.options.map(opt => String(opt))
          
          if (!optionsStr.includes(valStr)) {
            validationErrors.push(`${key}: Giá trị "${val}" không hợp lệ. Các giá trị hợp lệ: ${attributeDef.options.join(', ')}`)
            continue
          }
          
          // Giữ nguyên kiểu dữ liệu gốc
          const originalOption = attributeDef.options.find((opt: any) => 
            String(opt) === valStr
          )
          validatedValues.push(originalOption !== undefined ? originalOption : val)
        }
        
        validatedValue = validatedValues
      }

      validatedAttributes[key] = validatedValue
    }

    // Hiển thị lỗi validation
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors)
      toast.error(`Lỗi validation:\n${validationErrors.slice(0, 3).join('\n')}`)
      return
    }

    // Validate required attributes
    const requiredAttributes = currentTemplate.attributes.filter(attr => attr.required)
    const missingRequired = requiredAttributes.filter(reqAttr => {
      const value = validatedAttributes[reqAttr.key]
      return value === undefined || 
             value === null || 
             value === '' ||
             (Array.isArray(value) && value.length === 0)
    })

    if (missingRequired.length > 0) {
      toast.error(`Thiếu thuộc tính bắt buộc: ${missingRequired.map(attr => attr.key).join(', ')}`)
      return
    }

    console.log('=== VALIDATED ATTRIBUTES ===')
    console.log(validatedAttributes)

    setLoading(true)
    try {
      const jsonData: any = {
        productId: form.productId,
        sku: form.sku,
        barcode: form.barcode,
        attributes: validatedAttributes, // Sử dụng attributes đã validated
        price: form.price,
        stock: form.stock,
      }

      if (form.compareAtPrice > 0) {
        jsonData.compareAtPrice = form.compareAtPrice
      }

      if (editing) {
        jsonData.images = imagePreviews
      } else if (imagePreviews.length > 0) {
        jsonData.images = imagePreviews
      }

      console.log('=== FINAL DATA TO SEND ===')
      console.log(jsonData)

      if (editing) {
        await onUpdate(editing._id, jsonData)
      } else {
        await onCreate(jsonData)
      }
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper để debug
  const debugAttribute = (key: string) => {
    if (!currentTemplate) return
    
    const attributeDef = currentTemplate.attributes.find(attr => attr.key === key)
    const currentValue = form.attributes[key]
    
    console.log(`=== DEBUG ${key} ===`)
    console.log('Definition:', attributeDef)
    console.log('Current value:', currentValue)
    console.log('Current value type:', typeof currentValue)
    
    if (attributeDef?.options) {
      console.log('Options:', attributeDef.options)
      console.log('Options types:', attributeDef.options.map((opt: any) => typeof opt))
      console.log('Is value in options?', 
        attributeDef.options.some((opt: any) => String(opt) === String(currentValue))
      )
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
                  disabled={!!editing}
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {editing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Không thể thay đổi sản phẩm khi cập nhật biến thể
                  </p>
                )}
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
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">Thuộc tính biến thể</label>
                <span className="text-xs text-gray-500">
                  {Object.keys(form.attributes).length} thuộc tính đã thêm
                </span>
              </div>

              {/* Dropdown chọn thuộc tính */}
              {currentTemplate && availableAttributes.length > 0 && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <select
                      value={selectedAttribute}
                      onChange={(e) => setSelectedAttribute(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      <option value="">Chọn thuộc tính để thêm...</option>
                      {availableAttributes.map(attr => (
                        <option key={attr.key} value={attr.key}>
                          {attr.key} {attr.required && '(*)'} - {attr.type}
                          {attr.options && ` (${attr.options.length} options)`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    disabled={!selectedAttribute}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors self-end"
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                </div>
              )}

              {/* Hiển thị các thuộc tính đã thêm */}
              {Object.keys(form.attributes).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(form.attributes).map(([key, value]) => {
                    const attributeDef = currentTemplate?.attributes.find(a => a.key === key)
                    return (
                      <div key={key} className="bg-white rounded-lg border p-3 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-800">
                              {key}
                            </span>
                            {attributeDef?.required && (
                              <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Bắt buộc</span>
                            )}
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {attributeDef?.type}
                            </span>
                            {process.env.NODE_ENV === 'development' && (
                              <button
                                type="button"
                                onClick={() => debugAttribute(key)}
                                className="text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-1 py-0.5 rounded"
                                title="Debug attribute"
                              >
                                debug
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(key)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                            title="Xóa thuộc tính"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {renderAttributeInput(key, value, attributeDef)}
                          {attributeDef?.options && attributeDef.type !== 'enum' && attributeDef.type !== 'multienum' && (
                            <div className="text-xs text-gray-500">
                              Có sẵn: {attributeDef.options.join(', ')}
                            </div>
                          )}
                          {attributeDef?.type === 'multienum' && (
                            <div className="text-xs text-gray-500">
                              Đã chọn: {Array.isArray(value) ? value.join(', ') : '[]'}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {!currentTemplate && form.productId && (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Đang tải template thuộc tính...</p>
                </div>
              )}

              {currentTemplate && Object.keys(form.attributes).length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-400 mb-2">
                    <Plus size={32} className="mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">Chưa có thuộc tính nào</p>
                  <p className="text-xs text-gray-500 mt-1">Chọn thuộc tính từ dropdown để thêm</p>
                </div>
              )}
            </div>

            {/* Price, Compare Price, Stock Section */}
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