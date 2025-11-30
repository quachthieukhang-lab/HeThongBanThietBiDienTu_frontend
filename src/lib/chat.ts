export async function sendChatMessage(message: string) {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    
    // Nếu không có token, thông báo cần đăng nhập
    if (!token) {
      throw new Error("Vui lòng đăng nhập để sử dụng chat");
    }

    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Details:", {
        status: res.status,
        statusText: res.statusText,
        error: errorText
      });
      
      // Nếu lỗi 401 (Unauthorized) - token không hợp lệ
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      throw new Error(`Lỗi hệ thống: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    // BE mới trả về { response: string, usage: object }
    return data.response || "Xin lỗi, tôi không thể trả lời ngay lúc này.";
    
  } catch (error) {
    console.error("Network error:", error);
    throw error; // Giữ nguyên error để component xử lý
  }
}