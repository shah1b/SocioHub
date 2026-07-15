"use client";

import { useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PLATFORM_LABELS } from "@/components/platform-icon";
import { feedItems } from "@/lib/mock-data";

const initialSaved = feedItems.filter((item, index) => item.saved || index < 3);

export default function SavedPage() {
  const [items, setItems] = useState(initialSaved);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Watch Later</h1>
        <p className="text-xs text-muted">
          Saved from every connected platform, in one place.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-3xl p-10 text-center">
          <Bookmark className="size-8 text-faint" />
          <p className="text-sm font-medium">Nothing saved yet</p>
          <p className="text-xs text-muted">
            Tap the bookmark on any item in your feed to save it here.
          </p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="glass animate-rise flex items-start gap-3 rounded-2xl p-3.5"
          >
            <Avatar creator={item.creator} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              <p className="mt-1 text-xs text-muted">
                {item.creator.name} · {PLATFORM_LABELS[item.creator.platform]}
                {item.length ? ` · ${item.length}` : ""}
              </p>
            </div>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((x) => x.id !== item.id))
              }
              aria-label={`Remove "${item.title}" from Watch Later`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-faint transition active:scale-90 active:text-red-400"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
