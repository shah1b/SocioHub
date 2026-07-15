"use client";

import { Sparkles } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { FeedCard } from "@/components/feed-card";
import { FeedHeader } from "@/components/screen-header";
import { MODES, useAttention } from "@/lib/attention";
import { creators, digest, feedItems } from "@/lib/mock-data";

export function HomeFeed() {
  const { mode } = useAttention();
  const items = feedItems.filter(MODES[mode].filter);
  const storyCreators = Object.values(creators).slice(0, 8);

  return (
    <div>
      <FeedHeader />

      {/* Story-style row of your creators — squircle tiles with names. */}
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {storyCreators.map((creator) => (
          <button
            key={creator.id}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5 transition active:scale-95"
          >
            <Avatar
              creator={creator}
              className="size-16 text-base"
              shape="squircle"
            />
            <span className="w-full truncate text-center text-[11px] font-medium text-muted">
              {creator.name.split(" ")[0].toLowerCase()}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3.5">
        {/* Daily digest — warm glow card. */}
        <section className="animate-rise relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-orange-600 via-orange-700 to-[#3a0f02] p-4 text-white shadow-xl shadow-black/40">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-200">
            <Sparkles className="size-3" /> Daily digest
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight">
            {digest.greeting} — here&apos;s today&apos;s Flow
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {digest.items.map(({ label, count }) => (
              <span
                key={label}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur"
              >
                {count} {label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs font-medium text-orange-100/80">
            Everything important. Nothing unnecessary.
          </p>
        </section>

        {mode !== "relax" && (
          <p className="px-1 text-xs text-muted">
            <span className="font-bold text-accent">
              {MODES[mode].label} mode
            </span>{" "}
            — {MODES[mode].description.toLowerCase()}. Showing {items.length}{" "}
            of {feedItems.length} items.
          </p>
        )}

        {items.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}

        <p className="pb-2 pt-6 text-center text-xs text-faint">
          You&apos;re all caught up. That&apos;s the point. ✦
        </p>
      </div>
    </div>
  );
}
