"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PlatformBarChart } from "@/components/admin/bar-chart";
import { DauLineChart } from "@/components/admin/line-chart";
import { StatTile } from "@/components/admin/stat-tile";
import { StatusPill } from "@/components/admin/status-pill";
import {
  RANGES,
  dauSeries,
  ingestPerPlatform,
  kpisByRange,
  pipelines,
  type RangeKey,
} from "@/lib/admin-mock-data";

export default function AdminOverview() {
  const [range, setRange] = useState<RangeKey>("30d");
  const days = RANGES[range].days;
  const series = dauSeries.slice(-days);
  const ingest = ingestPerPlatform.map(({ platform, perDay }) => ({
    label: platform,
    value: perDay * days,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
            How Flow is doing — growth, attention respected, pipelines healthy.
          </p>
        </div>

        {/* One filter row above the charts; it scopes everything below. */}
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpisByRange[range].map((kpi) => (
          <StatTile key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-5">
        <section className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5 xl:col-span-3">
          <DauLineChart
            data={series}
            title={`Daily active users — ${RANGES[range].label.toLowerCase()}`}
          />
        </section>
        <section className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5 xl:col-span-2">
          <PlatformBarChart
            data={ingest}
            title={`Items ingested by platform — ${RANGES[range].label.toLowerCase()}`}
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
