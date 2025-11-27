import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login', // <-- Đổi thành route bạn muốn làm mặc định
        permanent: false, // `false` để trình duyệt không cache redirect này vĩnh viễn
      },
    ]
  },
  images: {
    
    domains: ['localhost'],
  },
  
};

export default nextConfig;
