import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  OctagonAlert,
} from "lucide-react";
import type { PipelineStatus } from "@/lib/admin-mock-data";

/* Status is never color alone: fixed status palette + icon + label. */
const STATUS = {
  good: { label: "Healthy", icon: CheckCircle2, color: "var(--viz-good)" },
  warning: { label: "Degraded", icon: AlertTriangle, color: "var(--viz-warning)" },
  serious: { label: "Impaired", icon: CircleAlert, color: "var(--viz-serious)" },
  critical: { label: "Down", icon: OctagonAlert, color: "var(--viz-critical)" },
} as const;

export function StatusPill({ status }: { status: PipelineStatus }) {
  const meta = STATUS[status];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--viz-border)] px-2.5 py-1 text-xs font-semibold"
      style={{ color: meta.color }}
    >
      <Icon className="size-3.5" />
      <span className="text-[var(--viz-ink-2)]">{meta.label}</span>
    </span>
  );
}
