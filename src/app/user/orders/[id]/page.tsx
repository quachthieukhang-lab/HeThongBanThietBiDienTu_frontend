"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Order, OrderItem } from "@/app/user/hooks/useOrders";

const API_BASE = "http://localhost:3000";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể lấy đơn hàng");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white border-green-500';
      case 'pending': return 'bg-yellow-500 text-white border-yellow-500';
      case 'cancelled': return 'bg-red-500 text-white border-red-500';
      case 'shipping': return 'bg-blue-500 text-white border-blue-500';
      default: return 'bg-gray-500 text-white border-gray-500';
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
    <div className="max-w-4xl mx-auto py-12 flex justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
      <p className="text-gray-600">Đơn hàng không tồn tại hoặc bạn không có quyền truy cập</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header với background màu */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chi tiết đơn hàng</h1>
            <div className="flex items-center gap-4 text-blue-100">
              <span className="font-medium">Mã đơn hàng: {order.code}</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)} shadow-md`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Sản phẩm đã đặt
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item: OrderItem, index) => (
                  <div 
                    key={item.productId + item.variantId} 
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      index % 2 === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{item.name}</div>
                      {item.facets && typeof item.facets === "object" && (
                        <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
                          {Object.entries(item.facets).map(([key, value]) => (
                            <span key={key} className="px-2 py-1 bg-white rounded border text-gray-700">
                              {key}: <strong>{value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className="text-gray-500 text-sm mb-1">Số lượng</div>
                      <div className="text-lg font-bold text-blue-600">{item.quantity}</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {item.price.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Summary & Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Tổng thanh toán
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold text-gray-900">{order.subTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-semibold text-gray-900">{order.shippingFee.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-green-600">{order.totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Địa chỉ giao hàng
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm font-bold">👤</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{order.shippingAddress.fullName}</div>
                    <div className="text-gray-600">{order.shippingAddress.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">🏠</span>
                  </div>
                  <div className="text-gray-700">
                    {order.shippingAddress.line1}, {order.shippingAddress.ward},<br />
                    {order.shippingAddress.district}, {order.shippingAddress.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Phương thức thanh toán
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-lg">💳</span>
                </div>
                <span className="font-semibold text-gray-900 text-lg">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}