"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import { PlatformBarChart } from "@/components/admin/bar-chart";
import { DauLineChart } from "@/components/admin/line-chart";
import { StatTile } from "@/components/admin/stat-tile";
import { StatusPill } from "@/components/admin/status-pill";
import type { AdminStats } from "@/lib/admin-data";
import {
  RANGES,
  dauSeries,
  ingestPerPlatform,
  kpisByRange,
  pipelines,
  type Kpi,
  type RangeKey,
} from "@/lib/admin-mock-data";
import { PLATFORM_LABELS } from "@/components/platform-icon";
import type { Platform } from "@/lib/types";

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : n.toLocaleString("en-US");

export default function AdminOverview({ stats }: { stats: AdminStats | null }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [range, setRange] = useState<RangeKey>("30d");
  const days = RANGES[range].days;
  const series = dauSeries.slice(-days);

  const live = stats !== null;

  // Real aggregates when the backend answers; demo KPIs otherwise.
  const kpis: Kpi[] = live
    ? [
        { label: "Total users", value: compact(stats.totalUsers), delta: stats.newUsers7d, deltaLabel: "joined in the last 7 days", upIsGood: true, deltaIsCount: true },
        { label: "Creators in catalog", value: compact(stats.totalCreators), delta: 0, deltaLabel: "across all platforms", upIsGood: true, deltaIsCount: true },
        { label: "Content items", value: compact(stats.totalItems), delta: stats.items24h, deltaLabel: "ingested in the last 24 h", upIsGood: true, deltaIsCount: true },
        { label: "Total reactions", value: compact(stats.totalReactions), delta: 0, deltaLabel: stats.topItem ? `top: “${stats.topItem.title.slice(0, 32)}…”` : "across the feed", upIsGood: true, deltaIsCount: true },
      ]
    : kpisByRange[range];

  const ingest = live
    ? Object.entries(stats.itemsByPlatform).map(([platform, count]) => ({
        label: PLATFORM_LABELS[platform as Platform] ?? platform,
        value: count,
      }))
    : ingestPerPlatform.map(({ platform, perDay }) => ({
        label: platform,
        value: perDay * days,
      }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            Overview
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--viz-border)] px-2.5 py-1 text-[11px] font-bold"
              style={{ color: live ? "var(--viz-good)" : "var(--viz-warning)" }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: live ? "var(--viz-good)" : "var(--viz-warning)" }}
              />
              <span className="text-[var(--viz-ink-2)]">
                {live ? "Live from Supabase" : "Demo data"}
              </span>
            </span>
          </h1>
          <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
            {live
              ? `Synced with the app · updated ${new Date(stats.generatedAt).toLocaleTimeString("en-US")} (refreshes every minute)`
              : "How Flow is doing — growth, attention respected, pipelines healthy."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startRefresh(() => router.refresh())}
            aria-label="Refresh stats"
            className="flex size-10 items-center justify-center rounded-xl border border-[var(--viz-border)] bg-[var(--viz-surface)] text-[var(--viz-ink-2)] transition hover:bg-white/5"
          >
            <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          {/* One filter row above the charts; it scopes the demo series. */}
          <div
            role="group"
            aria-label="Date range"
            className="flex rounded-xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-1"
          >
            {(Object.keys(RANGES) as RangeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                aria-pressed={range === key}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition ${
                  range === key
                    ? "bg-white/10 text-[var(--viz-ink)]"
                    : "text-[var(--viz-muted)] hover:text-[var(--viz-ink-2)]"
                }`}
              >
                {range === key && <Check className="size-4" strokeWidth={3} />}
                {RANGES[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatTile key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-5">
        <section className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5 xl:col-span-3">
          <DauLineChart
            data={series}
            title={`Daily active users — ${RANGES[range].label.toLowerCase()}${live ? " (demo series until analytics events land)" : ""}`}
          />
        </section>
        <section className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5 xl:col-span-2">
          <PlatformBarChart
            data={ingest}
            title={
              live
                ? "Content items by platform — live"
                : `Items ingested by platform — ${RANGES[range].label.toLowerCase()}`
            }
          />
        </section>
      </div>

      <section className="mt-3 rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5">
        <h2 className="text-sm font-semibold">Ingestion pipelines</h2>
        <div className="mt-3 divide-y divide-[var(--viz-border)]">
          {pipelines.map((p) => (
            <div key={p.name} className="flex items-center gap-4 py-3">
              <StatusPill status={p.status} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-[var(--viz-muted)]">
                  {p.detail}
                </p>
              </div>
              <p className="shrink-0 text-xs text-[var(--viz-muted)]">
                {p.lastRun}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
