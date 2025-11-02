"use client";
import Link from "next/link";
import Image from "next/image";
import type { SubcategoryLite } from "@/types/category";
import { mockSubcategories } from "@/mock/data/subcategories";

export default function CategorySection() {
  // Giả sử category "1" là nhóm Điện tử - Điện máy
  const featured = mockSubcategories["1"];

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Danh mục sản phẩm nổi bật
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {featured.map((cat) => (
          <Link
            key={cat._id}
            href={`/category/${cat.slug}`}
            className="group bg-white shadow-md rounded-2xl p-4 flex flex-col items-center transition hover:shadow-lg hover:-translate-y-1"
          >
            {cat.image && (
              <div className="w-9 mb-3 aspect-square overflow-hidden rounded-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full group-hover:scale-105 transition"
                />
              </div>
            )}
            <p className="text-base font-medium group-hover:text-primary">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
