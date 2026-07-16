"use client";

import { useState } from "react";

interface Bar {
  label: string;
  value: number;
}

const W = 760;
const H = 240;
const M = { top: 20, right: 16, bottom: 30, left: 52 };
const BAR_MAX = 24;

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

/* Magnitude comparison across labeled categories → columns in ONE hue
   (identity lives on the axis, not in color). ≤24px bars, 4px rounded
   data-end, square baseline, per-mark hover tooltip with lift, direct
   labels on the extremes only. */
export function PlatformBarChart({ data, title }: { data: Bar[]; title: string }) {
  const [hover, setHover] = useState<number | null>(null);

  const ticks = niceTicks(Math.max(...data.map((d) => d.value)));
  const yMax = ticks[ticks.length - 1];
  const innerW = W - M.left - M.right;
  const band = innerW / data.length;
  const barW = Math.min(BAR_MAX, band * 0.5);
  const baseline = H - M.bottom;
  const y = (v: number) => M.top + (1 - v / yMax) * (baseline - M.top);

  const maxIdx = data.reduce((a, _, i) => (data[i].value > data[a].value ? i : a), 0);
  const minIdx = data.reduce((a, _, i) => (data[i].value < data[a].value ? i : a), 0);

  return (
    <figure className="relative m-0">
      <figcaption className="mb-3 text-sm font-semibold text-[var(--viz-ink)]">
        {title}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={title}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={M.left}
              x2={W - M.right}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? "var(--viz-baseline)" : "var(--viz-grid)"}
              strokeWidth="1"
            />
            <text
              x={M.left - 8}
              y={y(t) + 3.5}
              textAnchor="end"
              fontSize="11"
              fill="var(--viz-muted)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = M.left + band * i + band / 2;
          const top = y(d.value);
          const h = baseline - top;
          const r = Math.min(4, h);
          const showLabel = i === maxIdx || i === minIdx;
          return (
            <g key={d.label}>
              {/* Hit target bigger than the mark: the whole band. */}
              <rect
                x={M.left + band * i}
                y={M.top}
                width={band}
                height={baseline - M.top}
                fill="transparent"
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
                aria-label={`${d.label}: ${d.value.toLocaleString("en-US")}`}
              />
              <path
                d={`M${(cx - barW / 2).toFixed(1)},${baseline}
                   V${(top + r).toFixed(1)}
                   Q${(cx - barW / 2).toFixed(1)},${top.toFixed(1)} ${(cx - barW / 2 + r).toFixed(1)},${top.toFixed(1)}
                   H${(cx + barW / 2 - r).toFixed(1)}
                   Q${(cx + barW / 2).toFixed(1)},${top.toFixed(1)} ${(cx + barW / 2).toFixed(1)},${(top + r).toFixed(1)}
                   V${baseline} Z`}
                fill="var(--viz-accent)"
                opacity={hover === null || hover === i ? 1 : 0.45}
                style={{ transition: "opacity 120ms ease" }}
                pointerEvents="none"
              />
              {showLabel && (
                <text
                  x={cx}
                  y={top - 7}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight="600"
                  fill="var(--viz-ink)"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {fmt(d.value)}
                </text>
              )}
              <text
                x={cx}
                y={H - 8}
                textAnchor="middle"
                fontSize="11"
                fill="var(--viz-muted)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-[var(--viz-border)] bg-[#232322] px-3 py-2 shadow-xl shadow-black/50"
          style={{
            left: `${((M.left + (innerW / data.length) * (hover + 0.5)) / W) * 100}%`,
            top: 16,
            transform: hover > data.length * 0.6 ? "translateX(-110%)" : "translateX(10px)",
          }}
        >
          <p
            className="text-sm font-semibold text-[var(--viz-ink)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {data[hover].value.toLocaleString("en-US")}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--viz-ink-2)]">
            <span className="inline-block size-2.5 rounded-[3px] bg-[var(--viz-accent)]" />
            {data[hover].label}
          </p>
        </div>
      )}
    </figure>
  );
}
