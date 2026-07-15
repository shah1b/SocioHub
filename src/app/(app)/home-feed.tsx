"use client";

import { Sparkles } from "lucide-react";
import { FeedCard } from "@/components/feed-card";
import { MODES, useAttention } from "@/lib/attention";
import { digest, feedItems } from "@/lib/mock-data";

export function HomeFeed() {
  const { mode } = useAttention();
  const items = feedItems.filter(MODES[mode].filter);

  return (
    <div className="space-y-4">
      <section className="glass animate-rise relative overflow-hidden rounded-3xl p-4">
        <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-accent/20 blur-3xl" />
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
          <Sparkles className="size-3" /> Daily digest
        </p>
        <h1 className="mt-1 text-lg font-semibold">
          {digest.greeting} — here&apos;s today&apos;s Flow
        </h1>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {digest.items.map(({ label, count }) => (
            <li
              key={label}
              className="rounded-xl border border-glass-border bg-background/40 px-3 py-2 text-xs text-muted"
            >
              <span className="mr-1.5 font-semibold text-foreground">
                {count}
              </span>
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-faint">
          Everything important. Nothing unnecessary.
        </p>
      </section>

      {mode !== "relax" && (
        <p className="px-1 text-xs text-muted">
          <span className="font-semibold text-accent">
            {MODES[mode].label} mode
          </span>{" "}
          — {MODES[mode].description.toLowerCase()}. Showing {items.length} of{" "}
          {feedItems.length} items.
        </p>
      )}

      {items.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}

      <p className="pb-2 pt-6 text-center text-xs text-faint">
        You&apos;re all caught up. That&apos;s the point. ✦
      </p>
    </div>
  );
}
