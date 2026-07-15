"use client";

import { useState } from "react";
import {
  Bookmark,
  BookOpen,
  Clock,
  MessageCircle,
  Mic,
  Play,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ContentType, FeedItem } from "@/lib/types";
import { Avatar } from "./avatar";
import { PlatformIcon, PLATFORM_LABELS } from "./platform-icon";

const TYPE_META: Record<
  ContentType,
  { label: string; icon: typeof Play }
> = {
  video: { label: "Video", icon: Play },
  short: { label: "Short", icon: Zap },
  post: { label: "Post", icon: MessageCircle },
  article: { label: "Article", icon: BookOpen },
  podcast: { label: "Podcast", icon: Mic },
  stream: { label: "Live", icon: Radio },
};

export function FeedCard({ item }: { item: FeedItem }) {
  const [saved, setSaved] = useState(Boolean(item.saved));
  const type = TYPE_META[item.type];
  const TypeIcon = type.icon;
  const live = item.publishedAgo === "LIVE";

  return (
    <article className="glass animate-rise rounded-3xl p-4">
      <div className="flex items-center gap-3">
        <Avatar creator={item.creator} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{item.creator.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <PlatformIcon platform={item.creator.platform} className="size-3" />
            {PLATFORM_LABELS[item.creator.platform]}
            <span className="text-faint">·</span>
            {live ? (
              <span className="flex items-center gap-1 font-medium text-red-400">
                <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
                Live now
              </span>
            ) : (
              item.publishedAgo
            )}
          </p>
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from Watch Later" : "Save for later"}
          className={`flex size-9 items-center justify-center rounded-full transition active:scale-90 ${
            saved ? "bg-accent-soft text-accent" : "text-faint"
          }`}
        >
          <Bookmark className={`size-4.5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      <h2 className="mt-3 text-[15px] font-medium leading-snug">
        {item.title}
      </h2>

      <div className="mt-3 rounded-2xl border border-glass-border bg-background/40 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
          <Sparkles className="size-3" /> AI summary
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {item.aiSummary}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span className="glass rounded-full px-2.5 py-1 font-medium text-foreground/80">
          {item.category}
        </span>
        <span className="flex items-center gap-1">
          <TypeIcon className="size-3.5" />
          {type.label}
        </span>
        {item.length && (
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {item.length}
          </span>
        )}
      </div>
    </article>
  );
}
