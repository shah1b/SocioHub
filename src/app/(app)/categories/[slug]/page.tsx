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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href="/categories"
          className="glass flex size-8 items-center justify-center rounded-full text-muted transition active:scale-95"
          aria-label="Back to categories"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="text-lg font-semibold">{category.name}</h1>
      </div>

      {items.length > 0 ? (
        items.map((item) => <FeedCard key={item.id} item={item} />)
      ) : (
        <p className="glass rounded-3xl p-6 text-center text-sm text-muted">
          Nothing new in {category.name} right now. Content appears here once
          your platforms are connected.
        </p>
      )}
    </div>
  );
}
