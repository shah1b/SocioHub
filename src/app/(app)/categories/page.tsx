import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { categories } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div>
      <SectionHeader title="Your categories" />
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="glass animate-rise rounded-2xl p-4 transition active:scale-95"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <p className="text-sm font-semibold">{category.name}</p>
            <p className="mt-1 text-xs text-faint">
              {category.count} new item{category.count === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
