"use client";

import { useState } from "react";
import {
  Bookmark,
  BookOpen,
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

const TYPE_META: Record<ContentType, { label: string; icon: typeof Play }> = {
  video: { label: "Video", icon: Play },
  short: { label: "Short", icon: Zap },
  post: { label: "Post", icon: MessageCircle },
  article: { label: "Article", icon: BookOpen },
  podcast: { label: "Podcast", icon: Mic },
  stream: { label: "Live", icon: Radio },
};

/* Floating white card on the black canvas — big radius, black text,
   orange accents, pill-shaped meta chips. */
export function FeedCard({ item }: { item: FeedItem }) {
  const [saved, setSaved] = useState(Boolean(item.saved));
  const type = TYPE_META[item.type];
  const TypeIcon = type.icon;
  const live = item.publishedAgo === "LIVE";
  const playable =
    item.type === "video" || item.type === "podcast" || item.type === "stream";

  return (
    <article className="animate-rise rounded-[1.75rem] bg-card p-4 text-card-foreground shadow-xl shadow-black/40">
      <div className="flex items-center gap-3">
        <Avatar creator={item.creator} className="size-10 text-xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{item.creator.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-card-muted">
            <span className="font-semibold text-accent">
              /{item.category.toLowerCase().replace(/\s+/g, "")}
            </span>
            <span>·</span>
            {live ? (
              <span className="flex items-center gap-1 font-semibold text-red-500">
                <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
                Live
              </span>
            ) : (
              <span>~{item.publishedAgo} ago</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from Watch Later" : "Save for later"}
          className={`flex size-10 items-center justify-center rounded-full transition active:scale-90 ${
            saved ? "bg-accent text-white" : "bg-card-panel text-card-muted"
          }`}
        >
          <Bookmark className={`size-4.5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      <h2 className="mt-3 text-[15px] font-semibold leading-snug">
        {item.title}
      </h2>

      {playable && (
        /* Dark media block inside the white card, like an embedded player. */
        <div
          className={`mt-3 flex items-center gap-3 rounded-3xl p-4 text-white ${
            live
              ? "bg-gradient-to-br from-red-600 to-orange-700"
              : "bg-gradient-to-br from-zinc-900 to-zinc-800"
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              {live ? "Live on" : "On"}{" "}
              {PLATFORM_LABELS[item.creator.platform]}
            </p>
            {item.length && (
              <span className="mt-2 inline-block rounded-lg bg-white/15 px-2.5 py-1 text-sm font-bold">
                {item.length}
              </span>
            )}
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-black">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        </div>
      )}

      <div className="mt-3 rounded-3xl bg-card-panel p-3.5">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
          <Sparkles className="size-3" /> AI summary
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">
          {item.aiSummary}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-card-panel px-3 py-1.5 text-xs font-bold">
          <PlatformIcon
            platform={item.creator.platform}
            className="size-3.5"
          />
          {PLATFORM_LABELS[item.creator.platform]}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-card-panel px-3 py-1.5 text-xs font-bold">
          <TypeIcon className="size-3.5" />
          {type.label}
        </span>
        {item.length && !playable && (
          <span className="rounded-full bg-card-panel px-3 py-1.5 text-xs font-bold">
            {item.length}
          </span>
        )}
      </div>
    </article>
  );
}
