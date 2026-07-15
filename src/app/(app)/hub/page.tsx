"use client";

import { useState } from "react";
import { Bell, BellOff, Plus } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PlatformIcon, PLATFORM_LABELS } from "@/components/platform-icon";
import { SectionHeader } from "@/components/section-header";
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

export default function HubPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    fabrizio: true,
    fireship: true,
  });

  const all = Object.values(creators);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Creator Hub</h1>
          <p className="text-xs text-muted">
            {all.length} creators across{" "}
            {new Set(all.map((c) => c.platform)).size} platforms
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white transition active:scale-95">
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      {PLATFORM_ORDER.map((platform) => {
        const group = all.filter((c) => c.platform === platform);
        if (group.length === 0) return null;
        return (
          <section key={platform}>
            <SectionHeader title={PLATFORM_LABELS[platform]} />
            <div className="space-y-2">
              {group.map((creator) => {
                const enabled = Boolean(notifications[creator.id]);
                return (
                  <div
                    key={creator.id}
                    className="glass flex items-center gap-3 rounded-2xl p-3"
                  >
                    <Avatar creator={creator} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {creator.name}
                      </p>
                      <p className="flex items-center gap-1.5 truncate text-xs text-muted">
                        <PlatformIcon
                          platform={creator.platform}
                          className="size-3"
                        />
                        {creator.handle}
                      </p>
                    </div>
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
                      className={`flex size-9 items-center justify-center rounded-full transition active:scale-90 ${
                        enabled ? "bg-accent-soft text-accent" : "text-faint"
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
  );
}
