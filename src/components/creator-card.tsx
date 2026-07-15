"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar } from "./avatar";
import { PlatformIcon, PLATFORM_LABELS } from "./platform-icon";

export function CreatorCard({ creator }: { creator: Creator }) {
  const [followed, setFollowed] = useState(Boolean(creator.followed));

  return (
    <div className="animate-rise flex items-center gap-3 rounded-[1.5rem] bg-card p-3.5 text-card-foreground shadow-lg shadow-black/30">
      <Avatar creator={creator} className="size-12 text-sm" shape="squircle" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold">{creator.name}</p>
        <p className="flex items-center gap-1.5 truncate text-xs text-card-muted">
          <PlatformIcon platform={creator.platform} className="size-3" />
          {PLATFORM_LABELS[creator.platform]}
          <span>·</span>
          {creator.category}
        </p>
        {creator.suggestedBecause && (
          <p className="mt-0.5 truncate text-[11px] font-semibold text-accent">
            {creator.suggestedBecause}
          </p>
        )}
      </div>
      <button
        onClick={() => setFollowed((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${
          followed ? "bg-card-panel text-card-muted" : "bg-brand text-white"
        }`}
      >
        {followed ? (
          <>
            <Check className="size-3.5" /> Following
          </>
        ) : (
          <>
            <Plus className="size-3.5" /> Follow
          </>
        )}
      </button>
    </div>
  );
}
