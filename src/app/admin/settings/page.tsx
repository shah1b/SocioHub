"use client";

import { useState } from "react";

interface Flag {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_FLAGS: Flag[] = [
  { id: "ai-summaries", label: "AI summaries", description: "Generate 2-minute video and 30-second article summaries.", enabled: true },
  { id: "daily-digest", label: "Daily digest", description: "Send the morning digest to all users.", enabled: true },
  { id: "recommendations", label: "Creator recommendations", description: "Quality- and similarity-based suggestions in Explore.", enabled: true },
  { id: "clickbait-filter", label: "Clickbait classifier", description: "Auto-hide items the classifier scores above 0.9.", enabled: true },
  { id: "focus-analytics", label: "Focus analytics (Premium)", description: "Attention-reclaimed stats for premium users.", enabled: false },
  { id: "twitch-ingest", label: "Twitch ingestion", description: "Live-stream tracking pipeline.", enabled: true },
  { id: "signups", label: "New signups", description: "Allow new account creation.", enabled: true },
];

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        on ? "bg-brand" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState(INITIAL_FLAGS);

  const toggle = (id: string) =>
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)),
    );

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
        Feature flags and platform controls. Demo state — changes reset on
        reload until Supabase is wired.
      </p>

      <section className="mt-6 max-w-2xl rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)]">
        <div className="divide-y divide-[var(--viz-border)]">
          {flags.map((flag) => (
            <div key={flag.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{flag.label}</p>
                <p className="mt-0.5 text-xs text-[var(--viz-muted)]">
                  {flag.description}
                </p>
              </div>
              <Toggle
                on={flag.enabled}
                onClick={() => toggle(flag.id)}
                label={flag.label}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
