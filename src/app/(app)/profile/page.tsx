"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, LoaderCircle, UserRound } from "lucide-react";
import { MODES, useAttention } from "@/lib/attention";
import { creators } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-fuchsia-600",
];

const STORAGE_KEY = "flow.profile";

interface ProfileDraft {
  displayName: string;
  username: string;
  gradient: string;
}

export default function ProfilePage() {
  const { mode } = useAttention();
  const [followedCount, setFollowedCount] = useState(
    Object.keys(creators).length,
  );
  const [draft, setDraft] = useState<ProfileDraft>({
    displayName: "",
    username: "",
    gradient: GRADIENTS[0],
  });
  const [email, setEmail] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Follows chosen during onboarding, when present.
      const onboarding = localStorage.getItem("flow.onboarding");
      if (onboarding) {
        try {
          const picked = JSON.parse(onboarding)?.creators;
          if (Array.isArray(picked) && picked.length > 0) {
            setFollowedCount(picked.length);
          }
        } catch {}
      }
      // Local draft first so the screen is instantly editable.
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!cancelled) setDraft((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
      if (!isSupabaseConfigured) return;
      // Signed-in users get their server profile layered on top.
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      setEmail(user.email ?? user.phone ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", user.id)
        .single();
      if (data && !cancelled) {
        setDraft((prev) => ({
          displayName: data.display_name ?? prev.displayName,
          username: data.username ?? prev.username,
          gradient: data.avatar_url?.startsWith("from-")
            ? data.avatar_url
            : prev.gradient,
        }));
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const initials =
    draft.displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const save = async () => {
    setError(null);
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { error: dbError } = await supabase
            .from("profiles")
            .update({
              display_name: draft.displayName || null,
              username: draft.username.toLowerCase().replace(/[^a-z0-9_]/g, "") || null,
              // The avatar slot stores the chosen gradient until image
              // uploads exist; real image URLs are also supported.
              avatar_url: draft.gradient,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
          if (dbError) {
            setError(
              dbError.message.includes("duplicate")
                ? "That username is taken — try another."
                : dbError.message,
            );
            setSaving(false);
            return;
          }
        }
      } catch {
        // Local save already succeeded; server sync is best-effort.
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/settings"
          className="glass flex size-10 items-center justify-center rounded-full transition active:scale-95"
          aria-label="Back to settings"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
          <p className="text-xs text-muted">
            {email ? `Signed in as ${email}` : "Guest — saved on this device"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center py-2">
        <div
          className={`flex size-24 items-center justify-center rounded-full bg-gradient-to-br text-3xl font-extrabold text-white/95 shadow-xl shadow-black/30 ${draft.gradient}`}
        >
          {initials}
        </div>
        <p className="mt-4 text-xl font-extrabold tracking-tight">
          {draft.displayName || "Your name"}
        </p>
        <p className="text-sm font-medium text-muted">
          @{draft.username || "username"}
        </p>

        {/* Quick stats. */}
        <div className="mt-5 flex w-full gap-2">
          {[
            { label: "Following", value: String(followedCount) },
            { label: "Saved", value: "4" },
            { label: "Mode", value: MODES[mode].label },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass flex-1 rounded-2xl px-3 py-3 text-center"
            >
              <p className="truncate text-[15px] font-extrabold">
                {stat.value}
              </p>
              <p className="text-[11px] font-medium text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2.5">
          {GRADIENTS.map((gradient) => (
            <button
              key={gradient}
              onClick={() => setDraft((prev) => ({ ...prev, gradient }))}
              aria-label="Choose avatar color"
              aria-pressed={draft.gradient === gradient}
              className={`flex size-9 items-center justify-center rounded-full bg-gradient-to-br transition active:scale-90 ${gradient} ${
                draft.gradient === gradient
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                  : ""
              }`}
            >
              {draft.gradient === gradient && (
                <Check className="size-4 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block px-1 text-xs font-bold uppercase tracking-wider text-muted">
            Display name
          </span>
          <input
            value={draft.displayName}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, displayName: e.target.value }))
            }
            placeholder="How should we call you?"
            maxLength={40}
            className="w-full rounded-full bg-card px-5 py-4 text-sm font-medium text-card-foreground shadow-lg shadow-black/30 outline-none placeholder:text-card-muted"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block px-1 text-xs font-bold uppercase tracking-wider text-muted">
            Username
          </span>
          <div className="flex items-center rounded-full bg-card pl-5 shadow-lg shadow-black/30">
            <span className="text-sm font-bold text-card-muted">@</span>
            <input
              value={draft.username}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="username"
              maxLength={24}
              className="w-full bg-transparent px-1.5 py-4 text-sm font-medium text-card-foreground outline-none placeholder:text-card-muted"
            />
          </div>
        </label>
      </div>

      {error && <p className="px-2 text-xs text-red-400">{error}</p>}

      <button
        onClick={save}
        disabled={saving}
        className="bg-brand flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-lg shadow-accent/40 transition active:scale-[0.98] disabled:opacity-60"
      >
        {saving ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : saved ? (
          <>
            <Check className="size-4" /> Saved
          </>
        ) : (
          <>
            <UserRound className="size-4" /> Save profile
          </>
        )}
      </button>

      {!email && (
        <p className="text-center text-xs text-faint">
          <Link href="/login" className="font-bold text-accent">
            Sign in
          </Link>{" "}
          to sync your profile across devices.
        </p>
      )}
    </div>
  );
}
