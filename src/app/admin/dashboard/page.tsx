'use client'

import React, { useMemo, useState, useEffect } from 'react'
import {
  CreditCard,
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { apiClient } from '@/lib/apiClient'

type DashboardData = {
  totalRevenue: number
  ordersToday: {
    count: number
    pending: number
  }
  inventory: {
    lowStock: number
    totalProducts: number
  }
  users: {
    total: number
  }
  revenueChart: {
    date: string
    revenue: number
    orders: number
  }[]
  orderStatus: {
    status: string
    count: number
  }[]
}

// Fetcher cho SWR
const fetcher = (url: string) => apiClient(url).then(res => res.data)

export default function DashboardPage() {
  const [dashData, setDashData] = useState<DashboardData>({
    totalRevenue: 0,
    ordersToday: { count: 0, pending: 0 },
    inventory: { lowStock: 0, totalProducts: 0 },
    users: { total: 0 },
    revenueChart: [],
    orderStatus: []
  })
  const [isLoading, setIsLoading] = useState(true)
  // Helper functions (declare before useMemo usage)
  const mapStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    }
    return colorMap[status] || '#6b7280'
  }

  const fmtVND = (v: number) =>
    v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient('/dashboard')
        // apiClient returns axios response; prefer response.data
        const payload = response?.data ?? response
        console.log('Full Response:', response)
        console.log('Payload:', payload)
        if (payload) {
          setDashData(payload)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const revenueData = useMemo(() => {
    return dashData.revenueChart.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }))
  }, [dashData.revenueChart])

  const statusData = useMemo(() => {
    return dashData.orderStatus.map(item => ({
      status: mapStatusName(item.status),
      count: item.count,
      color: getStatusColor(item.status)
    }))
  }, [dashData.orderStatus])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hệ thống</p>
      </div>

      {/* 4 KPI Cards chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <p className="text-lg font-semibold mt-1">{fmtVND(dashData.totalRevenue)}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{dashData.orderStatus.reduce((sum, item) => sum + item.count, 0)} đơn hàng</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đơn hàng hôm nay</p>
              <p className="text-lg font-semibold mt-1">{dashData.ordersToday.count}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{dashData.ordersToday.pending} đang chờ xử lý</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sản phẩm sắp hết</p>
              <p className="text-lg font-semibold mt-1">{dashData.inventory.lowStock}</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <Package size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Tổng {dashData.inventory.totalProducts} sản phẩm</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Người dùng</p>
              <p className="text-lg font-semibold mt-1">{dashData.users.total}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Tổng số tài khoản</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu 7 ngày */}
        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              Doanh thu 7 ngày
            </h3>
            <div className="text-sm text-gray-500">
              Tổng: {fmtVND(revenueData.reduce((sum, day) => sum + day.revenue, 0))}
            </div>
          </div>
          <div className="h-64">
            <RevenueChart data={revenueData} />
          </div>
        </div>

        {/* Biểu đồ trạng thái đơn hàng */}
        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BarChart3 size={18} className="text-green-600" />
              Trạng thái đơn hàng
            </h3>
            <div className="text-sm text-gray-500">
              Tổng: {dashData.orderStatus.reduce((sum, item) => sum + item.count, 0)} đơn
            </div>
          </div>
          <div className="h-64">
            <StatusChart data={statusData} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border hover:shadow-md transition-colors"
        >
          <CreditCard size={20} className="text-blue-600" />
          <div>
            <div className="font-medium">Quản lý đơn hàng</div>
            <div className="text-sm text-gray-500">Xem tất cả đơn hàng</div>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border hover:shadow-md transition-colors"
        >
          <Package size={20} className="text-green-600" />
          <div>
            <div className="font-medium">Quản lý sản phẩm</div>
            <div className="text-sm text-gray-500">Thêm sản phẩm mới</div>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border hover:shadow-md transition-colors"
        >
          <Users size={20} className="text-purple-600" />
          <div>
            <div className="font-medium">Quản lý users</div>
            <div className="text-sm text-gray-500">Xem người dùng</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// Biểu đồ doanh thu
function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)

  return (
    <div className="w-full h-full flex items-end justify-between gap-2 px-4">
      {data.map((day, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div className="text-xs text-gray-500 text-center mb-1">
            {day.date}
          </div>
          <div className="flex flex-col items-center gap-1 flex-1 w-full">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
              style={{
                height: `${(day.revenue / maxRevenue) * 80}%`,
                minHeight: '20px'
              }}
            />
            <div className="text-xs text-gray-600 text-center">
              {fmtVND(day.revenue)}
            </div>
            <div className="text-xs text-gray-400">
              {day.orders} đơn
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Biểu đồ trạng thái đơn hàng
function StatusChart({ data }: { data: { status: string; count: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="relative w-48 h-48 mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.reduce((acc, item, index) => {
            const previousPercent = acc
            const percent = (item.count / total) * 100
            const dashArray = `${percent} ${100 - percent}`

            return (
              <g key={item.status}>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-previousPercent}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-700"
                />
              </g>
            )
          }, 0)}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-500">Tổng đơn</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1">{item.status}</span>
            <span className="font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function for currency formatting
function fmtVND(v: number) {
  return v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
}

