"use client";

import { useState } from "react";
import { Bell, BellOff, Plus } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PlatformIcon, PLATFORM_LABELS } from "@/components/platform-icon";
import { creators } from "@/lib/mock-data";
import type { Platform } from "@/lib/types";

const PLATFORM_ORDER: Platform[] = [
  "youtube",
  "x",
  "reddit",
  "rss",
  "podcast",
  "twitch",
];

/* Warm glow bleeding from the top, huge centered title, frosted dark
   rows with squircle thumbnails and orange badges. */
export default function HubPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    fabrizio: true,
    fireship: true,
  });

  const all = Object.values(creators);

  return (
    <div className="relative">
      <div className="hero-glow pointer-events-none absolute -inset-x-8 -top-16 h-72" />

      <div className="relative pt-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Creator Hub</h1>
        <p className="mt-1 text-sm text-muted">
          {all.length} creators · {new Set(all.map((c) => c.platform)).size}{" "}
          platforms · your rules
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/40 transition active:scale-95">
          <Plus className="size-4" /> Add creator
        </button>
      </div>

      <div className="relative mt-6 space-y-6">
        {PLATFORM_ORDER.map((platform) => {
          const group = all.filter((c) => c.platform === platform);
          if (group.length === 0) return null;
          return (
            <section key={platform}>
              <h2 className="mb-2.5 flex items-center gap-2 px-1 text-lg font-extrabold tracking-tight">
                <PlatformIcon platform={platform} className="size-4.5" />
                {PLATFORM_LABELS[platform]}
                <span className="text-sm font-semibold text-faint">
                  {group.length}
                </span>
              </h2>
              <div className="space-y-2">
                {group.map((creator) => {
                  const enabled = Boolean(notifications[creator.id]);
                  return (
                    <div
                      key={creator.id}
                      className="glass flex items-center gap-3 rounded-[1.5rem] p-3"
                    >
                      <Avatar
                        creator={creator}
                        className="size-12 text-sm"
                        shape="squircle"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold">
                          {creator.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {creator.handle}
                        </p>
                      </div>
                      {enabled && (
                        <span className="flex size-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                          3
                        </span>
                      )}
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [creator.id]: !enabled,
                          }))
                        }
                        aria-label={
                          enabled
                            ? `Mute ${creator.name}`
                            : `Notify on new posts from ${creator.name}`
                        }
                        className={`flex size-10 items-center justify-center rounded-full transition active:scale-90 ${
                          enabled
                            ? "bg-accent-soft text-accent"
                            : "glass text-faint"
                        }`}
                      >
                        {enabled ? (
                          <Bell className="size-4 fill-current" />
                        ) : (
                          <BellOff className="size-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
