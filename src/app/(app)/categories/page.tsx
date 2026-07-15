import type { Metadata } from "next";
import Link from "next/link";
import { ScreenHeader } from "@/components/screen-header";
import { categories } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div>
      <ScreenHeader
        title="Categories"
        subtitle="Only the topics you chose — nothing else"
      />
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="animate-rise rounded-[1.5rem] bg-card p-4 text-card-foreground shadow-lg shadow-black/30 transition active:scale-95"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <p className="text-[15px] font-bold">{category.name}</p>
            <p className="mt-1 text-xs font-semibold text-accent">
              {category.count} new
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
