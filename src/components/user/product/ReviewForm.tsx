"use client";

import { useState } from "react";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  productName: string;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    title?: string;
    content: string;
    images: File[];
    orderId: string;
    productId: string;
  }) => void;
}

export default function ReviewForm({
  productId,
  orderId,
  productName,
  onClose,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, title, content, images, orderId, productId });
      setRating(0);
      setTitle("");
      setContent("");
      setImages([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => (
    <div className="flex items-center gap-2">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition-transform cursor-pointer`}
        >★</button>
      ))}
      <span className="ml-2 text-gray-600">{rating ? `${rating} sao` : "Chọn số sao"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Viết đánh giá</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{productName}</h4>
            <p className="text-sm text-gray-600">Mã sản phẩm: {productId}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Đánh giá của bạn *</label>
              <StarRating rating={rating} onChange={setRating} />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề đánh giá</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề (tùy chọn)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh giá *</label>
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={4}
                placeholder="Chia sẻ cảm nhận về sản phẩm..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh đính kèm</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(img)} alt={`preview ${i}`} className="w-20 h-20 object-cover rounded-lg border"/>
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
                  </div>
                ))}
              </div>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Hủy</button>
              <button type="submit" disabled={isSubmitting || !rating || !content.trim()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium">{isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
