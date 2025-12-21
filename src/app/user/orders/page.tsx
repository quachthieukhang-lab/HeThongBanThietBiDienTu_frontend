"use client";

import { useEffect, useState } from "react";
import { useOrders } from "@/app/user/hooks/useOrders";
import { useRouter } from "next/navigation";
import ReviewForm from "@/components/user/product/ReviewForm";

export default function OrdersPage() {
  const { orders, fetchOrders, loading } = useOrders();
  const router = useRouter();
  const [openReview, setOpenReview] = useState<{ productId: string; orderId: string; productName: string } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'shipping': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'cancelled': return 'Đã hủy';
      case 'shipping': return 'Đang giao hàng';
      default: return status;
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto py-12 flex justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải đơn hàng...</p>
      </div>
    </div>
  );

  if (!orders.length) return (
    <div className="max-w-6xl mx-auto py-16 text-center">
      <div className="text-6xl mb-6">📦</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Chưa có đơn hàng</h2>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Bạn chưa có đơn hàng nào. Hãy khám phá và bắt đầu mua sắm ngay!</p>
      <button 
        onClick={() => router.push('/products')}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
      >
        🛒 Mua sắm ngay
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Theo dõi và quản lý đơn hàng của bạn</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
             onClick={() => router.push(`/user/orders/${order._id}`)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <span className="text-blue-600 text-lg font-bold">📦</span>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Mã đơn hàng</div>
                      <div className="font-semibold text-gray-900 text-lg">{order.code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-gray-500 text-sm">Ngày đặt</div>
                      <div className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-gray-500 text-sm">Thanh toán</div>
                      <div className="text-gray-900 font-medium">{order.paymentMethod}</div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>

                {/* Order Items */}
                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.quantity} x {item.price.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenReview({ productId: item.productId, orderId: order._id, productName: item.name })}}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Viết đánh giá
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <span className="text-gray-500 text-sm block">Tổng tiền</span>
                <p className="text-2xl font-bold text-blue-600">{order.totalPrice.toLocaleString('vi-VN')}₫</p>
                <p className="text-gray-500 text-sm mt-1">Xem chi tiết →</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Tổng quan đơn hàng</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{orders.length}</div>
            <div className="text-gray-600 text-sm">Tổng đơn</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{orders.filter(o => o.status === 'completed').length}</div>
            <div className="text-gray-600 text-sm">Hoàn thành</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{orders.filter(o => o.status === 'shipping').length}</div>
            <div className="text-gray-600 text-sm">Đang giao</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-gray-600 text-sm">Chờ xử lý</div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {openReview && (
        <ReviewForm
          productId={openReview.productId}
          orderId={openReview.orderId}
          productName={openReview.productName}
          onClose={() => setOpenReview(null)}
          onSubmit={async (review) => {
            try {
              const formData = new FormData();
              formData.append("productId", review.productId);
              formData.append("orderId", review.orderId);
              formData.append("rating", review.rating.toString());
              formData.append("title", review.title || "");
              formData.append("content", review.content);
              review.images.forEach(img => formData.append("images", img));

              // Gửi trực tiếp tới BE NestJS
              const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
              const res = await fetch(`${backendUrl}/reviews`, { // đổi URL theo BE
                method: "POST",
                body: formData,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              });

              if (!res.ok) throw new Error("Failed to create review");

              alert("Gửi đánh giá thành công!");
              setOpenReview(null);
            } catch (err) {
              console.error(err);
              alert("Gửi đánh giá thất bại!");
            }
          }}
        />
      )}
    </div>
  );
}
