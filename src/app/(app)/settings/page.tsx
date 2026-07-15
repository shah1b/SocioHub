"use client";

import Link from "next/link";
import { Check, ChevronRight, LogIn, ShieldCheck } from "lucide-react";
import { PlatformIcon, PLATFORM_LABELS } from "@/components/platform-icon";
import { SectionHeader } from "@/components/section-header";
import { MODES, useAttention } from "@/lib/attention";
import type { AttentionMode, Platform } from "@/lib/types";

const CONNECTED: Platform[] = ["youtube", "reddit", "x", "rss", "podcast", "twitch"];

export default function SettingsPage() {
  const { mode, setMode } = useAttention();

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Settings</h1>

      <section>
        <SectionHeader title="Attention mode" />
        <div className="glass divide-y divide-glass-border overflow-hidden rounded-3xl">
          {(Object.keys(MODES) as AttentionMode[]).map((key) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition ${
                mode === key ? "bg-accent-soft" : "active:bg-surface"
              }`}
            >
              <span>
                <span className="block text-sm font-medium">
                  {MODES[key].label}
                </span>
                <span className="block text-xs text-muted">
                  {MODES[key].description}
                </span>
              </span>
              {mode === key && <Check className="size-4 text-accent" />}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Connected platforms" />
        <div className="glass divide-y divide-glass-border overflow-hidden rounded-3xl">
          {CONNECTED.map((platform) => (
            <div
              key={platform}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <PlatformIcon platform={platform} className="size-4 text-muted" />
                {PLATFORM_LABELS[platform]}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 px-1 text-xs text-faint">
          Demo connections. Real platform linking arrives with account sync.
        </p>
      </section>

      <section>
        <SectionHeader title="Account" />
        <div className="glass divide-y divide-glass-border overflow-hidden rounded-3xl">
          <Link
            href="/login"
            className="flex items-center justify-between px-4 py-3.5 text-sm font-medium transition active:bg-surface"
          >
            <span className="flex items-center gap-3">
              <LogIn className="size-4 text-muted" /> Sign in
            </span>
            <ChevronRight className="size-4 text-faint" />
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center justify-between px-4 py-3.5 text-sm font-medium transition active:bg-surface"
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-muted" /> Redo onboarding
            </span>
            <ChevronRight className="size-4 text-faint" />
          </Link>
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-faint">
        Flow · Your feed. Your rules. · Privacy first — your data is yours.
      </p>
    </div>
  );
}
