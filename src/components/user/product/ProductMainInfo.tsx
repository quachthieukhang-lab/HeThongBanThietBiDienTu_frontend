"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import type { ProductLite, ProductVariant } from "@/app/user/types/product";
import { useCart } from "@/app/user/hooks/useCart";
import {
  StarIcon,
  HeartIcon,
  PhotoIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  HomeIcon,
  CogIcon,
  CheckBadgeIcon,
  TruckIcon,
  ShoppingBagIcon,
  PlusIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

interface Props {
  product: ProductLite;
  variants: ProductVariant[];
}

export default function ProductMainInfo({ product, variants }: Props) {
  const { name, images = [], priceFrom, priceTo, servicePackages = [] } = product;
  const { addToCart, buyNow } = useCart();
  const [currentImage, setCurrentImage] = useState<string>(images[0] || "");
  const [selectedServicePackage, setSelectedServicePackage] = useState(
    servicePackages[0] || null
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants[0] || null
  );

  // Tính tổng giá
  const totalPrice = useMemo(() => {
    const basePrice = selectedVariant?.price || priceFrom || 0;
    const servicePrice = selectedServicePackage?.price || 0;
    return basePrice + servicePrice;
  }, [selectedVariant, selectedServicePackage, priceFrom]);

  // Giá hiển thị ban đầu (chỉ sản phẩm)
  const displayPrice = selectedVariant?.price || priceFrom || 0;
  const comparePrice = selectedVariant?.compareAtPrice || priceTo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái - Gallery & Thông tin */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tên sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">✓ Còn hàng</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HeartIcon className="w-6 h-6 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Gallery ảnh */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-6">
                
                {/* Thumbnail sidebar */}
                {images.length > 1 && (
                  <div className="lg:col-span-2 lg:order-first">
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(img)}
                          className={`relative w-16 h-16 rounded-xl border-2 flex-shrink-0 transition-all ${
                            currentImage === img 
                              ? "border-blue-500 shadow-md scale-105" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image 
                            src={img} 
                            alt={`Thumbnail ${idx}`} 
                            fill 
                            className="object-cover rounded-lg" 
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main image */}
                <div className={`relative ${images.length > 1 ? 'lg:col-span-10' : 'col-span-full'}`}>
                  <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden">
                    {currentImage ? (
                      <Image 
                        src={currentImage} 
                        alt={name} 
                        fill 
                        className="object-contain transition-transform duration-300 hover:scale-105" 
                        priority
                        sizes="(max-width: 1024px) 100vw, 80vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <PhotoIcon className="w-16 h-16 opacity-50" />
                        <span className="ml-2">Không có hình ảnh</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cam kết & chính sách */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                Cam kết từ Điện Máy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: ArrowPathIcon, text: "Hư gì đổi nấy 12 tháng tận nhà (miễn phí tháng đầu)" },
                  { icon: WrenchScrewdriverIcon, text: "Bảo hành chính hãng 2 năm, có người đến tận nhà" },
                  { icon: HomeIcon, text: "Lắp đặt miễn phí lúc giao hàng" },
                  { icon: CogIcon, text: "Bảo hành phụ kiện 12 tháng" },
                  { icon: CheckBadgeIcon, text: "Đầy đủ các phụ kiện, thiết bị kèm theo" },
                  { icon: TruckIcon, text: "Giao hàng nhanh trong 2 giờ" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 flex-1">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải - Thông tin mua hàng */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              
              {/* Box giá & mua hàng */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                
                Giá sản phẩm
                <div className="mb-6">
                  {comparePrice && comparePrice > displayPrice ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-red-600">
                          {displayPrice.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                          -{Math.round((1 - displayPrice/comparePrice) * 100)}%
                        </span>
                      </div>
                      <span className="line-through text-gray-400 text-lg">
                        {comparePrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {displayPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {/* Variant selector */}
                {variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Phiên bản:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {variants.map((v) => {
                        const variantLabel = Object.values(v.attributes).join(" / ") || "Mặc định";
                        return (
                          <button
                            key={v._id}
                            onClick={() => setSelectedVariant(v)}
                            className={`p-3 border-2 rounded-xl text-sm font-medium transition-all ${
                              selectedVariant?._id === v._id
                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            {variantLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service Packages */}
                {servicePackages.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Gói dịch vụ:</h3>
                      <span className="text-lg font-bold text-blue-600">
                        {totalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {servicePackages.map(sp => {
                        const isSelected = selectedServicePackage?._id === sp._id;
                        return (
                          <button
                            key={sp._id}
                            onClick={() => setSelectedServicePackage(sp)}
                            className={`p-3 border-2 rounded-lg text-left transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  isSelected ? "text-blue-700" : "text-gray-900"
                                }`}>
                                  {sp.name}
                                </div>
                                {sp.description && (
                                  <div className="text-xs text-gray-500 mt-1">{sp.description}</div>
                                )}
                                {sp.duration && (
                                  <div className="text-xs text-gray-400 mt-1">Thời hạn: {sp.duration}</div>
                                )}
                              </div>
                              <div className={`font-semibold text-sm ml-3 ${
                                isSelected ? "text-blue-700" : "text-blue-600"
                              }`}>
                                +{sp.price.toLocaleString('vi-VN')}₫
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => buyNow(product, selectedVariant ?? undefined)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Mua ngay
                  </button>
                  <button
                    onClick={() => addToCart(product, selectedVariant ?? undefined)}
                    className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Thêm vào giỏ hàng 
                  </button>
                </div>

                {/* Additional info */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4" />
                    <span>Giao hàng miễn phí toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Đổi trả trong 30 ngày</span>
                  </div>
                </div>
              </div>

              {/* Support card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5" />
                  Hỗ trợ 24/7
                </h3>
                <p className="text-gray-300 text-sm mb-4">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Tư vấn kỹ thuật: 1800 1234</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Khiếu nại: 1800 5678</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}