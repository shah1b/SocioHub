"use client";

import { useMemo, useRef, useState } from "react";

interface Point {
  date: string;
  value: number;
}

const W = 760;
const H = 260;
const M = { top: 16, right: 76, bottom: 28, left: 52 };

function niceTicks(max: number): number[] {
  const rough = max / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((s) => s * pow).find((s) => s >= rough) ?? pow;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.5; v += step) ticks.push(v);
  return ticks;
}

const fmt = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : String(v);

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/* Single-series trend line: 2px round-capped line, 10% area wash,
   hairline solid gridlines, crosshair + tooltip, end-dot with surface
   ring and a direct label at the endpoint. One series → no legend. */
export function DauLineChart({ data, title }: { data: Point[]; title: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { xs, ys, path, area, ticks, yMax } = useMemo(() => {
    const values = data.map((d) => d.value);
    const rawMax = Math.max(...values);
    const tickList = niceTicks(rawMax);
    const top = tickList[tickList.length - 1];
    const x = (i: number) =>
      M.left + (i / (data.length - 1)) * (W - M.left - M.right);
    const y = (v: number) =>
      M.top + (1 - v / top) * (H - M.top - M.bottom);
    const xsArr = data.map((_, i) => x(i));
    const ysArr = values.map(y);
    const d = xsArr
      .map((px, i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${ysArr[i].toFixed(1)}`)
      .join(" ");
    const baseline = H - M.bottom;
    const a = `${d} L${xsArr[xsArr.length - 1].toFixed(1)},${baseline} L${xsArr[0].toFixed(1)},${baseline} Z`;
    return { xs: xsArr, ys: ysArr, path: d, area: a, ticks: tickList, yMax: top };
  }, [data]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (px - M.left) / (W - M.left - M.right);
    const i = Math.round(ratio * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const last = data.length - 1;
  const xTickIdx = [0, Math.floor(last / 3), Math.floor((2 * last) / 3), last];

  return (
    <figure className="relative m-0">
      <figcaption className="mb-3 text-sm font-semibold text-[var(--viz-ink)]">
        {title}
      </figcaption>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none"
        role="img"
        aria-label={`${title}, ${data.length} days, latest ${fmt(data[last].value)}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => {
          const y = M.top + (1 - t / yMax) * (H - M.top - M.bottom);
          return (
            <g key={t}>
              <line
                x1={M.left}
                x2={W - M.right}
                y1={y}
                y2={y}
                stroke={t === 0 ? "var(--viz-baseline)" : "var(--viz-grid)"}
                strokeWidth="1"
              />
              <text
                x={M.left - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="11"
                fill="var(--viz-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(t)}
              </text>
            </g>
          );
        })}

        {xTickIdx.map((i) => (
          <text
            key={i}
            x={xs[i]}
            y={H - 8}
            textAnchor="middle"
            fontSize="11"
            fill="var(--viz-muted)"
          >
            {fmtDate(data[i].date)}
          </text>
        ))}

        <path d={area} fill="var(--viz-accent)" opacity="0.1" />
        <path
          d={path}
          fill="none"
          stroke="var(--viz-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {hover !== null && (
          <line
            x1={xs[hover]}
            x2={xs[hover]}
            y1={M.top}
            y2={H - M.bottom}
            stroke="var(--viz-ink-2)"
            strokeWidth="1"
          />
        )}
        {hover !== null && (
          <circle
            cx={xs[hover]}
            cy={ys[hover]}
            r="4"
            fill="var(--viz-accent)"
            stroke="var(--viz-surface)"
            strokeWidth="2"
          />
        )}

        <circle
          cx={xs[last]}
          cy={ys[last]}
          r="4"
          fill="var(--viz-accent)"
          stroke="var(--viz-surface)"
          strokeWidth="2"
        />
        <text
          x={xs[last] + 10}
          y={ys[last] + 4}
          fontSize="12"
          fontWeight="600"
          fill="var(--viz-ink)"
        >
          {fmt(data[last].value)}
        </text>
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-[var(--viz-border)] bg-[#232322] px-3 py-2 shadow-xl shadow-black/50"
          style={{
            left: `${(xs[hover] / W) * 100}%`,
            top: 24,
            transform: xs[hover] > W * 0.7 ? "translateX(-110%)" : "translateX(12px)",
          }}
        >
          <p className="text-sm font-semibold text-[var(--viz-ink)]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {data[hover].value.toLocaleString("en-US")}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--viz-ink-2)]">
            <span className="inline-block h-0.5 w-3 rounded bg-[var(--viz-accent)]" />
            {fmtDate(data[hover].date)}
          </p>
        </div>
      )}
    </figure>
  );
}
