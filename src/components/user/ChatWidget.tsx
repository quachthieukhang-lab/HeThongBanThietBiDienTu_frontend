// ChatWidget component - cập nhật UI đẹp hơn
"use client";

import { useState } from "react";
import ChatBox from "./ChatBox";
import { MessageCircle, X, Minimize2 } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-2xl shadow-2xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 z-50 group"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
              Chat với trợ lý ảo
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`fixed right-6 z-50 transition-all duration-300 ${
          minimized 
            ? 'bottom-6 w-80 h-16' 
            : 'bottom-6 w-96 h-[600px] max-h-[80vh]'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold">Trợ lý ảo</div>
                  <div className="text-blue-100 text-xs">Online • Phản hồi ngay</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMinimized(!minimized)}
                  className="text-blue-100 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-blue-500"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setMinimized(false);
                  }}
                  className="text-blue-100 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-blue-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minimized State */}
            {minimized ? (
              <div className="flex-1 flex items-center justify-between px-4 bg-white cursor-pointer" onClick={() => setMinimized(false)}>
                <div className="text-sm text-gray-600">Nhấn để mở rộng chat</div>
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
            ) : (
              /* Expanded Chat Content */
              <div className="flex-1 overflow-hidden">
                <ChatBox />
              </div>
            )}
          </div>

          {/* Drop shadow effect */}
          <div className="absolute inset-0 rounded-2xl shadow-2xl -z-10"></div>
        </div>
      )}
    </>
  );
}