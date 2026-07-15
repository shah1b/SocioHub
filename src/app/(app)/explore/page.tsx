import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { CreatorCard } from "@/components/creator-card";
import { SectionHeader } from "@/components/section-header";
import { categories, suggestedCreators } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <label className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3">
        <Search className="size-4 text-faint" />
        <input
          type="search"
          placeholder="Search creators, topics, platforms…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
        />
      </label>

      <section>
        <SectionHeader title="Categories" href="/categories" />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="glass shrink-0 rounded-full px-4 py-2 text-sm font-medium transition active:scale-95"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Suggested for you" />
        <p className="mb-3 -mt-1 text-xs text-faint">
          Based on quality and your interests — never on engagement bait.
        </p>
        <div className="space-y-2.5">
          {suggestedCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
    </div>
  );
}
