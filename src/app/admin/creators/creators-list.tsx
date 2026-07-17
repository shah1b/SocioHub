"use client";

import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PLATFORM_LABELS } from "@/components/platform-icon";
import type { Creator } from "@/lib/types";

export function CreatorsList({
  initial,
  live,
}: {
  initial: Creator[];
  live: boolean;
}) {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState(initial);

  const shown = catalog.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.handle.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Creators</h1>
          <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
            {catalog.length} creators in the catalog ·{" "}
            {live ? "live from Supabase" : "demo data"}
          </p>
        </div>
        <div className="flex gap-2">
          <label className="flex w-64 items-center gap-2 rounded-xl border border-[var(--viz-border)] bg-[var(--viz-surface)] px-3.5 py-2.5">
            <Search className="size-4 text-[var(--viz-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--viz-muted)]"
            />
          </label>
          <button className="bg-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition active:scale-95">
            <Plus className="size-4" /> Add creator
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((creator) => (
          <div
            key={creator.id}
            className="flex items-center gap-3 rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-4"
          >
            <Avatar creator={creator} className="size-11 text-xs" shape="squircle" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{creator.name}</p>
              <p className="truncate text-xs text-[var(--viz-muted)]">
                {creator.handle} · {PLATFORM_LABELS[creator.platform]} ·{" "}
                {creator.category}
              </p>
            </div>
            <button
              onClick={() =>
                setCatalog((prev) => prev.filter((c) => c.id !== creator.id))
              }
              aria-label={`Remove ${creator.name} from catalog`}
              className="rounded-lg border border-[var(--viz-border)] p-2 text-[var(--viz-muted)] transition hover:bg-white/5 hover:text-[var(--viz-critical)]"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {shown.length === 0 && (
          <p className="col-span-full rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-10 text-center text-sm text-[var(--viz-muted)]">
            No creators match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
