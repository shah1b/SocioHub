import type { Metadata } from "next";
import { StatusPill } from "@/components/admin/status-pill";
import { PLATFORM_LABELS } from "@/components/platform-icon";
import { getAdminStats } from "@/lib/admin-data";
import { ingestPerPlatform, pipelines } from "@/lib/admin-mock-data";
import type { Platform } from "@/lib/types";

export const metadata: Metadata = { title: "Content & ingestion" };
export const revalidate = 60;

export default async function AdminContentPage() {
  const stats = await getAdminStats();
  const live = stats !== null;

  const intake = live
    ? Object.entries(stats.itemsByPlatform).map(([platform, count]) => ({
        platform: PLATFORM_LABELS[platform as Platform] ?? platform,
        count,
        unit: "items",
      }))
    : ingestPerPlatform.map((p) => ({
        platform: p.platform,
        count: p.perDay,
        unit: "items/day",
      }));
  const total = intake.reduce((sum, p) => sum + p.count, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Content & ingestion</h1>
      <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
        {live
          ? `Live from Supabase — ${stats.totalItems.toLocaleString("en-US")} items from ${stats.totalCreators} creators, refreshed every minute.`
          : "What the pipelines are pulling in, and their health."}
      </p>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5">
          <h2 className="text-sm font-semibold">
            {live ? "Content by platform — live" : "Daily intake by platform"}
          </h2>
          <div className="mt-3 divide-y divide-[var(--viz-border)]">
            {intake.map((p) => (
              <div key={p.platform} className="flex items-center justify-between py-3">
                <p className="text-sm font-semibold">{p.platform}</p>
                <p
                  className="text-sm text-[var(--viz-ink-2)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {p.count.toLocaleString("en-US")} {p.unit}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between py-3">
              <p className="text-sm font-bold">Total</p>
              <p
                className="text-sm font-bold"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {total.toLocaleString("en-US")} {intake[0]?.unit ?? "items"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5">
          <h2 className="text-sm font-semibold">Pipeline health</h2>
          <div className="mt-3 divide-y divide-[var(--viz-border)]">
            {pipelines.map((p) => (
              <div key={p.name} className="flex items-center gap-4 py-3">
                <StatusPill status={p.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-[var(--viz-muted)]">{p.detail}</p>
                </div>
                <p className="shrink-0 text-xs text-[var(--viz-muted)]">{p.lastRun}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-3 rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-5">
        <h2 className="text-sm font-semibold">AI processing</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Summaries generated today", value: "41,208" },
            { label: "Categorization accuracy (sampled)", value: "96.7%" },
            { label: "Queue backlog", value: "312 items" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--viz-border)] p-4"
            >
              <p className="text-xs text-[var(--viz-muted)]">{s.label}</p>
              <p className="mt-1 text-xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
