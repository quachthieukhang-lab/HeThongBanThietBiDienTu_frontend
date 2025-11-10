export function Footer() {
  return (
    <footer className="bg-gray-700 text-gray-300 mt-8">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 px-6 py-10">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Liên hệ</h4>
          <p>📍 123 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ</p>
          <p>📞 0123 456 789</p>
          <p>✉️ hotro@dienmayonline.vn</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2">
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Bảo hành & sửa chữa</a></li>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Liên hệ hỗ trợ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Kết nối với chúng tôi</h4>
          <p className="text-sm">Facebook • YouTube • Zalo</p>
        </div>
      </div>
      <div className="text-center text-sm bg-gray-800 py-3">
        © 2025 Điện Máy Online - Niên luận CT250
      </div>
    </footer>
  );
}
