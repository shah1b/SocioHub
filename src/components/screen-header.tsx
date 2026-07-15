"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronDown, Settings } from "lucide-react";
import { MODES, useAttention } from "@/lib/attention";
import type { AttentionMode } from "@/lib/types";

/* Big bold screen title with optional circular glass actions on the right. */
export function ScreenHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3 pt-2">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2 pt-1">{actions}</div>}
    </div>
  );
}

export function HeaderCircle({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="glass flex size-10 items-center justify-center rounded-full text-foreground/90 transition active:scale-95"
    >
      {children}
    </Link>
  );
}

/* Home header: the attention mode IS the feed name — a huge bold
   dropdown, "For You ⌄"-style. */
export function FeedHeader() {
  const { mode, setMode } = useAttention();
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 flex items-center justify-between pt-2">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 text-3xl font-extrabold tracking-tight transition active:scale-[0.98]"
        >
          {MODES[mode].label}
          <span className="glass flex size-7 items-center justify-center rounded-full">
            <ChevronDown
              className={`size-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="glass-strong animate-rise absolute left-0 z-50 mt-3 w-64 overflow-hidden rounded-3xl bg-background/85 p-1.5 shadow-2xl shadow-black/60">
              {(Object.keys(MODES) as AttentionMode[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setMode(key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
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
                  {mode === key && <Check className="size-4 text-accent" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <HeaderCircle href="/settings" label="Settings">
        <Settings className="size-4.5" />
      </HeaderCircle>
    </div>
  );
}
