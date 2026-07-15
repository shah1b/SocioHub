import type { Metadata } from "next";
import Link from "next/link";
import { Search, Settings } from "lucide-react";
import { CreatorCard } from "@/components/creator-card";
import { HeaderCircle, ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { categories, suggestedCreators } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        title="Explore"
        subtitle="Discover intentionally — never algorithmically"
        actions={
          <HeaderCircle href="/settings" label="Settings">
            <Settings className="size-4.5" />
          </HeaderCircle>
        }
      />

      <label className="flex items-center gap-2.5 rounded-full bg-card px-5 py-3.5 text-card-foreground shadow-lg shadow-black/30">
        <Search className="size-4 text-card-muted" />
        <input
          type="search"
          placeholder="Search creators, topics, platforms…"
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-card-muted"
        />
      </label>

      <section>
        <SectionHeader title="Categories" href="/categories" />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="glass shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition active:scale-95"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Suggested for you" />
        <p className="mb-3 -mt-1 px-1 text-xs text-faint">
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
