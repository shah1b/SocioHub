import { Flame, Heart } from "lucide-react";
import type { FeedItem } from "@/lib/types";
import { Avatar } from "./avatar";
import { PlatformIcon } from "./platform-icon";

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n);

/* Horizontal rail of the most-reacted posts and photos across the
   user's platforms — ranked by real reaction counts, capped at six. */
export function TrendingRail({ items }: { items: FeedItem[] }) {
  const trending = [...items]
    .filter((item) => (item.reactions ?? 0) > 0)
    .sort((a, b) => (b.reactions ?? 0) - (a.reactions ?? 0))
    .slice(0, 6);

  if (trending.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2.5 flex items-center gap-1.5 px-1 text-lg font-extrabold tracking-tight">
        <Flame className="size-4.5 text-accent" /> Trending now
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {trending.map((item, index) => (
          <article
            key={item.id}
            className="animate-rise w-56 shrink-0 rounded-3xl bg-card p-3.5 text-card-foreground shadow-lg shadow-black/30"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="flex items-center gap-2">
              <Avatar
                creator={item.creator}
                className="size-8 text-[10px]"
                shape="squircle"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">
                  {item.creator.name}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-card-muted">
                  <PlatformIcon
                    platform={item.creator.platform}
                    className="size-2.5"
                  />
                  {item.category}
                </p>
              </div>
              <span className="rounded-full bg-card-panel px-2 py-0.5 text-[10px] font-extrabold text-card-muted">
                #{index + 1}
              </span>
            </div>
            <p className="mt-2.5 line-clamp-2 text-[13px] font-semibold leading-snug">
              {item.title}
            </p>
            <p className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
              <Heart className="size-3 fill-current" />
              {compact(item.reactions ?? 0)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
