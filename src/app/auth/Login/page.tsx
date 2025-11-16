// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@/types/auth";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiClient<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Lưu tokens vào localStorage
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      router.push("/");
    } catch (err: any) {
      setError("Sai email hoặc mật khẩu");
      console.error(err);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
           <p className="text-blue-600 font-semibold text-lg">Điện Máy Tech</p>
          <p className="text-gray-600 text-sm">
            Chào mừng bạn quay trở lại
          </p>
        </div>

        {/* Form với Radix */}
        <Form.Root onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <Form.Field name="email">
            <Form.Control asChild>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-red-500 text-sm mt-1">
              Vui lòng nhập email
            </Form.Message>
            <Form.Message match="typeMismatch" className="text-red-500 text-sm mt-1">
              Email không hợp lệ
            </Form.Message>
          </Form.Field>

          {/* Password Field */}
          <Form.Field name="password">
            <Form.Control asChild>
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-red-500 text-sm mt-1">
              Vui lòng nhập mật khẩu
            </Form.Message>
          </Form.Field>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Form.Submit asChild>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Đăng nhập
            </button>
          </Form.Submit>
        </Form.Root>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <div className="text-sm">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-500 transition-colors">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/auth/Register" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
