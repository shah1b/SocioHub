"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Creator } from "@/lib/types";
import { Avatar } from "./avatar";
import { PlatformIcon, PLATFORM_LABELS } from "./platform-icon";

export function CreatorCard({ creator }: { creator: Creator }) {
  const [followed, setFollowed] = useState(Boolean(creator.followed));

  return (
    <div className="glass animate-rise flex items-center gap-3 rounded-2xl p-3">
      <Avatar creator={creator} className="size-11 text-sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{creator.name}</p>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted">
          <PlatformIcon platform={creator.platform} className="size-3" />
          {PLATFORM_LABELS[creator.platform]}
          <span className="text-faint">·</span>
          {creator.category}
        </p>
        {creator.suggestedBecause && (
          <p className="mt-0.5 truncate text-[11px] text-accent/90">
            {creator.suggestedBecause}
          </p>
        )}
      </div>
      <button
        onClick={() => setFollowed((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
          followed
            ? "glass text-muted"
            : "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
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
