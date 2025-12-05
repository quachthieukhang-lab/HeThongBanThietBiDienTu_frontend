'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName, itemType }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Xác nhận xóa</h2>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa {itemType} <span className="font-bold">{itemName}</span> không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-center gap-4 w-full">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Hủy
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
