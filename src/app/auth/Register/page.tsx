// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@/types/auth";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const res = await apiClient<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      router.push("/");
    } catch (err) {
      setError("Email đã tồn tại hoặc dữ liệu không hợp lệ.");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h1>
          <p className="text-blue-600 font-medium">Hệ thống Điện Máy Tech</p>
          <p className="text-gray-600 text-sm mt-2">Tạo tài khoản mới</p>
        </div>

        {/* Form với Radix */}
        <Form.Root onSubmit={handleRegister} className="space-y-4">
          <Form.Field name="name">
            <Form.Control asChild>
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Control>
            <Form.Message match="valueMissing" className="text-red-500 text-sm mt-1">
              Vui lòng nhập họ tên
            </Form.Message>
          </Form.Field>

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

          {/* Phone - không bắt buộc nên không cần validation */}
          <input
            type="text"
            placeholder="Số điện thoại (tuỳ chọn)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Form.Submit asChild>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Đăng ký
            </button>
          </Form.Submit>
        </Form.Root>

        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/auth/Login" className="text-blue-600 hover:text-blue-500 font-medium">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}
