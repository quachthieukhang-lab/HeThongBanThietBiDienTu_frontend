// 'use client'

// import React, { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card'
// import { Users, ShoppingBag, FolderTree, BarChart3 } from 'lucide-react'
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
// import * as Separator from '@radix-ui/react-separator'

// // Màu dùng cho biểu đồ
// const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444']

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     users: 0,
//     products: 0,
//     categories: 0,
//   })

//   const [chartData, setChartData] = useState<any[]>([])
//   const [pieData, setPieData] = useState<any[]>([])

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [userRes, productRes, categoryRes] = await Promise.all([
//           fetch('/users'),
//           fetch('/products'),
//           fetch('/categories'),
//         ])
//         const [users, products, categories] = await Promise.all([
//           userRes.json(),
//           productRes.json(),
//           categoryRes.json(),
//         ])

//         setStats({
//           users: users.length || 0,
//           products: products.length || 0,
//           categories: categories.length || 0,
//         })

//         // Dữ liệu demo cho biểu đồ (bạn có thể thay bằng API thống kê thực tế)
//         setChartData([
//           { name: 'Users', value: users.length },
//           { name: 'Products', value: products.length },
//           { name: 'Categories', value: categories.length },
//         ])
//         setPieData([
//           { name: 'Users', value: users.length },
//           { name: 'Products', value: products.length },
//           { name: 'Categories', value: categories.length },
//         ])
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard tổng quan</h1>
//       <p className="text-gray-600">Theo dõi hoạt động hệ thống thương mại điện tử của bạn</p>

//       <Separator.Root className="bg-gray-200 h-[1px] my-4" />

//       {/* Thẻ thống kê */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="shadow-sm border border-gray-200">
//           <CardHeader className="flex items-center justify-between">
//             <CardTitle className="text-gray-800">Người dùng</CardTitle>
//             <Users className="text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-3xl font-semibold text-gray-900">{stats.users}</p>
//             <p className="text-gray-500 text-sm">Tổng số tài khoản</p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border border-gray-200">
//           <CardHeader className="flex items-center justify-between">
//             <CardTitle className="text-gray-800">Sản phẩm</CardTitle>
//             <ShoppingBag className="text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-3xl font-semibold text-gray-900">{stats.products}</p>
//             <p className="text-gray-500 text-sm">Tổng số mặt hàng</p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border border-gray-200">
//           <CardHeader className="flex items-center justify-between">
//             <CardTitle className="text-gray-800">Danh mục</CardTitle>
//             <FolderTree className="text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <p className="text-3xl font-semibold text-gray-900">{stats.categories}</p>
//             <p className="text-gray-500 text-sm">Số lượng danh mục</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Biểu đồ */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="shadow-sm border border-gray-200">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-gray-800">
//               <BarChart3 className="text-indigo-500" /> Biểu đồ thống kê
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border border-gray-200">
//           <CardHeader>
//             <CardTitle className="text-gray-800">Phân bố dữ liệu</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="value"
//                   label
//                 >
//                   {pieData.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the dashboard page of the application.</p>
    </div>
  )
}