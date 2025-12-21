"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { Card, Flex, Box, Text, Button, RadioCards } from "@radix-ui/themes";

type LoginRole = 'user' | 'admin';

// SVG Icons với thiết kế hiện đại
const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const PersonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<LoginRole>('user');
  const [loading, setLoading] = useState(false);


 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // 1) LOGIN
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
    console.log("Backend URL:", backendUrl);
    const res = await fetch(`${backendUrl}/auth/login`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      }),
    });

    if (!res.ok) {
      throw new Error("Sai email hoặc mật khẩu");
    }

    const data = await res.json();

    // 2) Lưu token
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // 3) Lấy userInfo
    const userRes = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${data.accessToken}` }
    });

    const userInfo = await userRes.json();
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("userId", userInfo.sub);

    // 4) MERGE CART (CHỈ GỬI sessionId)
    const sid = sessionStorage.getItem("cartSessionId");
    if (sid) {
      await fetch(`${backendUrl}/carts/merge`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.accessToken}`
        },
        body: JSON.stringify({ sessionId: sid })  // ⬅⬅⬅ CHỈ sessionId
      });

      // Remove guest cart
      sessionStorage.removeItem("cartSessionId");
    }

    toast.success("Đăng nhập thành công!");
    console.log(userInfo);

    // 5) Chuyển hướng dựa trên vai trò
    if (userInfo.roles.includes("admin")) {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
    
  } catch (err) {
    console.error(err);
    toast.error("Đăng nhập thất bại");
    setError("Sai email hoặc mật khẩu");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <StoreIcon />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Điện Máy Tech</h1>
                <p className="text-sm text-gray-600">Công nghệ - Giá trị - Tin cậy</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
          </div>

          {/* Compact Role Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Vai trò đăng nhập</span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Khách hàng</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Quản trị</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all duration-200 ${
                  selectedRole === 'user'
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <PersonIcon />
                <span className="text-sm font-medium">Khách hàng</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all duration-200 ${
                  selectedRole === 'admin'
                    ? 'bg-white text-blue-700 shadow-sm border border-blue-300'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <DashboardIcon />
                <span className="text-sm font-medium">Quản trị</span>
              </button>
            </div>
          </div>

          {/* Admin Notice - Compact */}
          {selectedRole === 'admin' && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-700 font-medium">
                  Sử dụng tài khoản quản trị viên
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <Form.Root onSubmit={handleLogin}>
            <div className="space-y-5">
              {/* Email Field */}
              <Form.Field name="email">
                <div className="space-y-2">
                  <Form.Label className="text-sm font-semibold text-gray-700">
                    Email
                  </Form.Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <EnvelopeIcon />
                    </div>
                    <Form.Control asChild>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white placeholder-gray-400"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </Form.Control>
                  </div>
                  <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
                    Vui lòng nhập email
                  </Form.Message>
                  <Form.Message match="typeMismatch" className="text-red-500 text-xs mt-1">
                    Email không hợp lệ
                  </Form.Message>
                </div>
              </Form.Field>

              {/* Password Field */}
              <Form.Field name="password">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Form.Label className="text-sm font-semibold text-gray-700">
                      Mật khẩu
                    </Form.Label>
                    {selectedRole === 'user' && (
                      <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors">
                        Quên mật khẩu?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <LockIcon />
                    </div>
                    <Form.Control asChild>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white placeholder-gray-400"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                      />
                    </Form.Control>
                  </div>
                  <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
                    Vui lòng nhập mật khẩu
                  </Form.Message>
                </div>
              </Form.Field>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <WarningIcon />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Form.Submit asChild>
                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập {selectedRole === 'admin' ? 'Quản trị' : ''}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </Form.Submit>
            </div>
          </Form.Root>

          {/* Footer Links - Chỉ hiển thị cho user */}
          {selectedRole === 'user' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{' '}
                <Link href="/auth/Register" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Hero Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Trải nghiệm mua sắm công nghệ tuyệt vời
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Khám phá thế giới công nghệ với hàng ngàn sản phẩm chất lượng, giá tốt và dịch vụ hoàn hảo
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-lg">Sản phẩm chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-lg">Giao hàng nhanh toàn quốc</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-lg">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-24 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-40 w-16 h-16 bg-white/15 rounded-full blur-md"></div>
      </div>
    </div>
  );
}
