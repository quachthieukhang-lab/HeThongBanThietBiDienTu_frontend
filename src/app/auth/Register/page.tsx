// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import toast from "react-hot-toast";

// SVG Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

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

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      toast.success(`Chào mừng ${form.name} đến với Điện Máy Tech! 🎉`);
      router.push("/");
      
    } catch (err: any) {
      setError(err.message || "Email đã tồn tại hoặc dữ liệu không hợp lệ.");
      toast.error('Đăng ký thất bại!');
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-600">Tạo tài khoản mới để bắt đầu mua sắm</p>
          </div>

          {/* Form */}
          <Form.Root onSubmit={handleRegister}>
            <div className="space-y-5">
              {/* Name Field */}
              <Form.Field name="name">
                <div className="space-y-2">
                  <Form.Label className="text-sm font-semibold text-gray-700">
                    Họ và tên
                  </Form.Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <UserIcon />
                    </div>
                    <Form.Control asChild>
                      <input
                        type="text"
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white placeholder-gray-400"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </Form.Control>
                  </div>
                  <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
                    Vui lòng nhập họ tên
                  </Form.Message>
                </div>
              </Form.Field>

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
                  <Form.Label className="text-sm font-semibold text-gray-700">
                    Mật khẩu
                  </Form.Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <LockIcon />
                    </div>
                    <Form.Control asChild>
                      <input
                        type="password"
                        placeholder="Tạo mật khẩu mới"
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

              {/* Phone Field - Optional */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Số điện thoại <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <PhoneIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white placeholder-gray-400"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

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
                      <span>Đang đăng ký...</span>
                    </>
                  ) : (
                    <>
                      <span>Tạo tài khoản</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </Form.Submit>
            </div>
          </Form.Root>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{' '}
              <Link href="/auth/Login" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Tham gia cộng đồng Điện Máy Tech
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Đăng ký ngay để nhận ưu đãi đặc biệt và trải nghiệm mua sắm công nghệ tuyệt vời
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-lg">Ưu đãi đặc biệt cho thành viên mới</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-lg">Theo dõi đơn hàng dễ dàng</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-lg">Lưu lại sản phẩm yêu thích</span>
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