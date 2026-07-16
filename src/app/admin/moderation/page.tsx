"use client";

import { useState } from "react";
import { Check, EyeOff, ShieldAlert } from "lucide-react";
import { flaggedItems } from "@/lib/admin-mock-data";

export default function AdminModerationPage() {
  const [items, setItems] = useState(flaggedItems);

  const resolve = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Moderation</h1>
      <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
        Items the classifiers flagged for review. Flow hides clickbait and
        spam by default — you decide what stays out.
      </p>

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-10 text-center">
            <ShieldAlert className="mx-auto size-7 text-[var(--viz-muted)]" />
            <p className="mt-3 text-sm font-semibold">Queue clear</p>
            <p className="mt-1 text-sm text-[var(--viz-muted)]">
              Nothing waiting for review.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-[var(--viz-muted)]">
                  {item.creator} · {item.platform} · flagged {item.flaggedAgo}{" "}
                  ago
                </p>
                <p className="mt-1.5 inline-block rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-[var(--viz-serious)]">
                  {item.reason}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resolve(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--viz-border)] px-3 py-2 text-xs font-semibold text-[var(--viz-ink-2)] transition hover:bg-white/5"
                >
                  <Check className="size-3.5" /> Allow
                </button>
                <button
                  onClick={() => resolve(item.id)}
                  className="bg-brand inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition active:scale-95"
                >
                  <EyeOff className="size-3.5" /> Keep hidden
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
