"use client";

import { useSyncExternalStore } from "react";
import type { AttentionMode, FeedItem } from "./types";

export const MODES: Record<
  AttentionMode,
  { label: string; description: string; filter: (item: FeedItem) => boolean }
> = {
  relax: {
    label: "Relax",
    description: "Your normal feed",
    filter: () => true,
  },
  focus: {
    label: "Deep Focus",
    description: "No shorts, no reels, no noise",
    filter: (item) => item.type !== "short",
  },
  learning: {
    label: "Learning",
    description: "Only educational content",
    filter: (item) => item.tags.includes("educational"),
  },
  weekend: {
    label: "Weekend",
    description: "Entertainment only",
    filter: (item) => item.tags.includes("entertainment"),
  },
};

const STORAGE_KEY = "flow.attention-mode";

// Tiny localStorage-backed store shared by every component that shows or
// changes the attention mode (top bar, home feed, settings).
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): AttentionMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && stored in MODES ? (stored as AttentionMode) : "relax";
}

function getServerSnapshot(): AttentionMode {
  return "relax";
}

function setMode(mode: AttentionMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  listeners.forEach((notify) => notify());
}

export function useAttention() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { mode, setMode };
}
