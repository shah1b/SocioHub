import type { Kpi } from "@/lib/admin-mock-data";

/* 12-point-max sparkline: de-emphasis hue for history, accent for the
   current period, end-dot with a surface ring. */
function Sparkline({ points }: { points: number[] }) {
  const w = 96;
  const h = 28;
  const pad = 3;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);
  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const lastX = x(points.length - 1);
  const lastY = y(points[points.length - 1]);
  const prevX = x(points.length - 2);
  const prevY = y(points[points.length - 2]);

  return (
    <svg width={w} height={h} aria-hidden className="shrink-0">
      <path
        d={path}
        fill="none"
        stroke="var(--viz-de-emphasis)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${prevX.toFixed(1)},${prevY.toFixed(1)} L${lastX.toFixed(1)},${lastY.toFixed(1)}`}
        fill="none"
        stroke="var(--viz-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="4" fill="var(--viz-accent)" stroke="var(--viz-surface)" strokeWidth="2" />
    </svg>
  );
}

export function StatTile({ kpi }: { kpi: Kpi }) {
  const positive = kpi.delta >= 0;
  const good = positive === kpi.upIsGood;
  const sign = positive ? "+" : "−";
  const magnitude = Math.abs(kpi.delta).toFixed(1);

  return (
    <div className="rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)] p-4">
      <p className="text-xs font-medium text-[var(--viz-muted)]">{kpi.label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-3">
        <p className="text-[26px] font-semibold leading-none text-[var(--viz-ink)]">
          {kpi.value}
        </p>
        <Sparkline points={kpi.trend} />
      </div>
      <p className="mt-2 text-xs text-[var(--viz-ink-2)]">
        <span
          className="font-semibold"
          style={{ color: good ? "var(--viz-good)" : "var(--viz-critical)" }}
        >
          {sign}
          {magnitude}
          {kpi.value.includes("%") ? " pts" : "%"}
        </span>{" "}
        <span className="text-[var(--viz-muted)]">{kpi.deltaLabel}</span>
      </p>
    </div>
  );
}
