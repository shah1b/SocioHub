"use client";

import Link from "next/link";
import {
  Check,
  ChevronRight,
  LogIn,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { PlatformIcon, PLATFORM_LABELS } from "@/components/platform-icon";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { MODES, useAttention } from "@/lib/attention";
import { useTheme, type ThemePref } from "@/lib/theme";
import type { AttentionMode, Platform } from "@/lib/types";

const CONNECTED: Platform[] = ["youtube", "reddit", "x", "rss", "podcast", "twitch"];

const THEMES: { value: ThemePref; label: string; icon: typeof Moon }[] = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const { mode, setMode } = useAttention();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <ScreenHeader title="Settings" subtitle="Your feed. Your rules." />

      <section>
        <SectionHeader title="Appearance" />
        <div className="glass flex gap-1 rounded-full p-1">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              aria-pressed={theme === value}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold transition active:scale-95 ${
                theme === value
                  ? "bg-card text-card-foreground shadow-md shadow-black/20"
                  : "text-muted"
              }`}
            >
              <Icon className="size-4" />
              {label}
              {theme === value && <Check className="size-3.5 text-accent" />}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Attention mode" />
        <div className="glass divide-y divide-glass-border overflow-hidden rounded-[1.5rem]">
          {(Object.keys(MODES) as AttentionMode[]).map((key) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex w-full items-center justify-between px-4 py-4 text-left transition ${
                mode === key ? "bg-accent-soft" : "active:bg-surface"
              }`}
            >
              <span>
                <span className="block text-[15px] font-bold">
                  {MODES[key].label}
                </span>
                <span className="block text-xs text-muted">
                  {MODES[key].description}
                </span>
              </span>
              {mode === key && (
                <span className="flex size-6 items-center justify-center rounded-full bg-accent text-white">
                  <Check className="size-3.5" />
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Connected platforms" />
        <div className="glass divide-y divide-glass-border overflow-hidden rounded-[1.5rem]">
          {CONNECTED.map((platform) => (
            <div
              key={platform}
              className="flex items-center justify-between px-4 py-4"
            >
              <span className="flex items-center gap-3 text-[15px] font-bold">
                <PlatformIcon platform={platform} className="size-4 text-muted" />
                {PLATFORM_LABELS[platform]}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
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
        <div className="glass divide-y divide-glass-border overflow-hidden rounded-[1.5rem]">
          <Link
            href="/profile"
            className="flex items-center justify-between px-4 py-4 text-[15px] font-bold transition active:bg-surface"
          >
            <span className="flex items-center gap-3">
              <UserRound className="size-4 text-muted" /> Edit profile
            </span>
            <ChevronRight className="size-4 text-faint" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-between px-4 py-4 text-[15px] font-bold transition active:bg-surface"
          >
            <span className="flex items-center gap-3">
              <LogIn className="size-4 text-muted" /> Sign in
            </span>
            <ChevronRight className="size-4 text-faint" />
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center justify-between px-4 py-4 text-[15px] font-bold transition active:bg-surface"
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
