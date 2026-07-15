import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FeedCard } from "@/components/feed-card";
import { categories, feedItems } from "@/lib/mock-data";

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const items = feedItems.filter(
    (item) => item.category.toLowerCase().replace(/\s+/g, "-") === slug,
  );

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/categories"
          className="glass flex size-10 items-center justify-center rounded-full transition active:scale-95"
          aria-label="Back to categories"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {category.name}
        </h1>
      </div>

      {items.length > 0 ? (
        items.map((item) => <FeedCard key={item.id} item={item} />)
      ) : (
        <div className="rounded-[1.75rem] bg-card p-8 text-center text-card-foreground shadow-xl shadow-black/40">
          <p className="text-[15px] font-bold">Nothing new here</p>
          <p className="mt-1 text-sm text-card-muted">
            {category.name} content appears once your platforms are connected.
          </p>
        </div>
      )}
    </div>
  );
}
