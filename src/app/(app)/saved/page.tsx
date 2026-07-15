"use client";

import { useState } from "react";
import { Bookmark, Play, Trash2 } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PLATFORM_LABELS } from "@/components/platform-icon";
import { ScreenHeader } from "@/components/screen-header";
import { feedItems } from "@/lib/mock-data";

const initialSaved = feedItems.filter((item, index) => item.saved || index < 3);

export default function SavedPage() {
  const [items, setItems] = useState(initialSaved);

  return (
    <div>
      <ScreenHeader
        title="Watch Later"
        subtitle="Saved from every platform, in one place"
      />

      {items.length === 0 ? (
        <div className="rounded-[1.75rem] bg-card p-10 text-center text-card-foreground shadow-xl shadow-black/40">
          <Bookmark className="mx-auto size-8 text-card-muted" />
          <p className="mt-3 text-[15px] font-bold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-card-muted">
            Tap the bookmark on any item in your feed to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="animate-rise flex items-center gap-3 rounded-[1.5rem] bg-card p-3.5 text-card-foreground shadow-lg shadow-black/30"
            >
              <div className="relative">
                <Avatar
                  creator={item.creator}
                  className="size-14 text-sm"
                  shape="squircle"
                />
                {item.length && (
                  <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-black text-white">
                    <Play className="ml-0.5 size-3 fill-current" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-bold leading-snug">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-card-muted">
                  {item.creator.name} · {PLATFORM_LABELS[item.creator.platform]}
                  {item.length ? ` · ${item.length}` : ""}
                </p>
              </div>
              <button
                onClick={() =>
                  setItems((prev) => prev.filter((x) => x.id !== item.id))
                }
                aria-label={`Remove "${item.title}" from Watch Later`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card-panel text-card-muted transition active:scale-90 active:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
