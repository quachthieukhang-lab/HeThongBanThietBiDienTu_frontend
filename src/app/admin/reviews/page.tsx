'use client'

import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import ReviewTable from '@/components/admin/review/ReviewTable'
import { apiFetch } from '@/lib/api' 

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const loadReviews = async () => {
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('accessToken') || ''

      // Tạo URL query
      const query = new URLSearchParams({ status: 'pending' })
      if (search) query.append('search', search)

      const res = await apiFetch(`${backendUrl}/reviews?${query.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(
          text.includes('<!DOCTYPE html>')
            ? `FE nhận về HTML thay vì JSON. Kiểm tra backend: ${res.status}`
            : text
        )
      }

      const data = await res.json()
      setReviews(Array.isArray(data.items) ? data.items : data.reviews || [])
    } catch (error: any) {
      console.error('Lỗi tải danh sách đánh giá:', error)
      toast.error(error.message || 'Không thể tải danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [search])


  const handleApprove = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('accessToken')
      const res = await apiFetch(`${backendUrl}/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (!res.ok) throw new Error(await res.text())

      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'approved' } : r))
      )
      toast.success('Phê duyệt thành công!')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Phê duyệt thất bại')
    }
  }


  const handleDelete = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('accessToken')
      const res = await apiFetch(`${backendUrl}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(await res.text())

      setReviews((prev) => prev.filter((r) => r._id !== id))
      toast.success('Xóa đánh giá thành công!')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Xóa thất bại')
    }
  }

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý đánh giá</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm đánh giá..."
            className="pl-8 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Đang tải danh sách...</div>
      ) : (
        <ReviewTable
          reviews={reviews}
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
