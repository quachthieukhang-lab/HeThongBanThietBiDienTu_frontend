"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const banners = [
  "/images/banners/LDP-dien-may-1236x600.png",
  "/images/banners/LDP-dien-may-1236x700-a.png",
  "/images/banners/LDP-dien-may-1236x700.png",
];
// const banners = [
//   "/images/banners/baner1.png"
// ]
export default function BannerSection() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[650px] overflow-hidden rounded-2xl shadow-lg">
      {banners.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`banner-${i}`}
          width={1200}
          height={400}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === current ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Optional overlay gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
