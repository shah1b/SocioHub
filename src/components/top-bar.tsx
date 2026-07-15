"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Settings } from "lucide-react";
import { MODES, useAttention } from "@/lib/attention";
import type { AttentionMode } from "@/lib/types";

export function TopBar() {
  const { mode, setMode } = useAttention();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="glass-strong mx-auto flex h-14 max-w-md items-center justify-between border-x-0 border-t-0 px-4">
        <Link href="/" className="text-brand text-xl font-bold tracking-tight">
          Flow
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="glass flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-xs font-medium text-foreground/90 transition active:scale-95"
              aria-expanded={open}
            >
              <span className="size-1.5 rounded-full bg-accent" />
              {MODES[mode].label}
              <ChevronDown className="size-3.5 text-muted" />
            </button>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div className="glass-strong animate-rise absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-background/80 p-1.5 shadow-2xl shadow-black/50">
                  {(Object.keys(MODES) as AttentionMode[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setMode(key);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
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
                      {mode === key && (
                        <Check className="size-4 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link
            href="/settings"
            className="glass flex size-8 items-center justify-center rounded-full text-muted transition active:scale-95"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
