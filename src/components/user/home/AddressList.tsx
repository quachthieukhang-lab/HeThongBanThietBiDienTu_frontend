// components/AddressSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown, Plus, Check, Edit2, Trash2, Star } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  ward?: string;
  district?: string;
  city: string;
  province?: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}
interface AddressSelectorProps {
  onSelect?: (addressId: string | null) => void;
}

export default function AddressSelector({ onSelect }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    ward: "",
    district: "",
    city: "",
    province: "",
    country: "VN",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    setLoading(false); // không còn loading
    setAddresses([]);  // giữ rỗng danh sách
    setSelectedAddress(null); // không có địa chỉ nào được chọn
    return;
  }

  fetchAddresses();
}, []);

  const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:3000/addresses/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setAddresses(data);

      const defaultAddr =
        data.find((a: Address) => a.isDefault) || data[0] || null;

      setSelectedAddress(defaultAddr);

      if (onSelect) {
  onSelect(defaultAddr?._id ?? null);
}
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  const handleSetDefault = async (addressId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:3000/addresses/${addressId}/set-default`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Đã đặt làm địa chỉ mặc định");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Lỗi khi đặt địa chỉ mặc định");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem("accessToken");
    
    // Giải mã token để lấy userId (nếu token là JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    const url = editingAddress 
      ? `http://localhost:3000/addresses/${editingAddress._id}`
      : 'http://localhost:3000/addresses';

    const method = editingAddress ? "PATCH" : "POST";

    // Sửa lại addressData cho khớp với form
    const addressData = {
      userId: userId,
      fullName: formData.fullName,
      phone: formData.phone, // Thêm phone từ form
      line1: formData.line1,
      line2: formData.line2 || "",
      ward: formData.ward,
      district: formData.district,
      city: formData.city,
      province: formData.province,
      country: formData.country, // Thay county bằng country
      postalCode: formData.postalCode, // Thay SouthCode bằng postalCode
      isDefault: formData.isDefault
    };

    // Debug: log dữ liệu
    console.log('Data being sent:', addressData);

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Thêm authorization
      },
      body: JSON.stringify(addressData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
    }

    const result = await res.json();
    console.log('Success:', result);
    
    // Xử lý thành công
    toast.success(editingAddress ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công");
    setShowAddForm(false);
    setEditingAddress(null);
    fetchAddresses(); // Refresh danh sách
    
  } catch (error) {
    console.error('Error saving address:', error);
    toast.error("Lỗi khi lưu địa chỉ");
  }
};

  const handleDelete = async (addressId: string) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:3000/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Xóa địa chỉ thành công");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Lỗi khi xóa địa chỉ");
    }
  };

  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || "",
      ward: address.ward || "",
      district: address.district || "",
      city: address.city,
      province: address.province || "",
      country: address.country,
      postalCode: address.postalCode || "",
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      ward: "",
      district: "",
      city: "",
      province: "",
      country: "VN",
      postalCode: "",
      isDefault: addresses.length === 0, // Auto default if first address
    });
  };

  const formatAddress = (address: Address) => {
    return `${address.line1}${address.ward ? `, ${address.ward}` : ''}${address.district ? `, ${address.district}` : ''}, ${address.city}`;
  };

  const startAddNew = () => {
    setEditingAddress(null);
    resetForm();
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/80">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">Đang tải...</span>
      </div>
    );
  }
  if (!localStorage.getItem("accessToken")) {
  return (
    <div className="flex items-center gap-2 text-white/80">
      <MapPin className="w-4 h-4" />
      <span className="text-sm">Địa chỉ</span>
    </div>
  );
}

  return (
    
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 hover:text-cyan-300 transition-colors font-medium">
          <MapPin className="w-4 h-4" />
          <span className="text-sm max-w-[180px] truncate">
            {selectedAddress 
              ? `${formatAddress(selectedAddress)}`
              : "Chọn địa chỉ"
            }
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white shadow-2xl rounded-lg p-4 w-96 max-h-[80vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 border border-gray-200"
          sideOffset={8}
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Địa chỉ giao hàng
            </h3>
            <p className="text-sm text-gray-600 mt-1">Quản lý địa chỉ nhận hàng của bạn</p>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">
                {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ cụ thể *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.line1}
                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phường/Xã
                    </label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phường/Xã"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Quận/Huyện"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Thành phố"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingAddress(null);
                      }}
                      className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {editingAddress ? "Cập nhật" : "Thêm mới"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {addresses.length === 0 && !showAddForm ? (
              <div className="text-center py-6">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chưa có địa chỉ nào</p>
                <p className="text-gray-400 text-xs mt-1">Thêm địa chỉ để bắt đầu mua sắm</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address._id}
                   onClick={() => {
                        setSelectedAddress(address);
                        onSelect(address._id);
                    }}
                  className={`p-3 rounded-lg border ${
                    address.isDefault 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {address.fullName}
                        </span>
                        {address.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {formatAddress(address)}
                      </p>
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => startEdit(address)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add New Address Button */}
          {!showAddForm && (
            <>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-4" />
              <button
                onClick={startAddNew}
                className="w-full p-3 text-blue-600 hover:bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm địa chỉ mới
              </button>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}