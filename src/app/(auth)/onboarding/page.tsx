"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PlatformIcon, PLATFORM_LABELS } from "@/components/platform-icon";
import { creators, suggestedCreators } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["youtube", "reddit", "x", "rss", "twitch", "podcast"];

const INTERESTS: Record<string, string[]> = {
  Sports: ["Football", "Formula 1", "NBA"],
  Technology: ["AI", "Apple", "Startups", "Coding"],
  Entertainment: ["Movies", "Anime", "Music", "Gaming"],
  Learning: ["Science", "Books", "Finance"],
};

const RULES = [
  "Hide politics",
  "Hide celebrity drama",
  "Hide shorts & reels",
  "Hide clickbait",
  "Hide rage content",
  "Hide spoilers",
  "Only educational",
  "Chronological order",
];

const STEPS = ["Platforms", "Interests", "Creators", "Your rules"] as const;

function useToggleSet() {
  const [set, setSet] = useState<Set<string>>(new Set());
  const toggle = (value: string) =>
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  return [set, toggle] as const;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [platforms, togglePlatform] = useToggleSet();
  const [interests, toggleInterest] = useToggleSet();
  const [picked, togglePicked] = useToggleSet();
  const [rules, toggleRule] = useToggleSet();

  const allCreators = [...Object.values(creators), ...suggestedCreators];

  const finish = async () => {
    localStorage.setItem(
      "flow.onboarding",
      JSON.stringify({
        platforms: [...platforms],
        interests: [...interests],
        creators: [...picked],
        rules: [...rules],
      }),
    );

    // Signed-in users get their choices persisted to Supabase too.
    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          if (platforms.size > 0) {
            await supabase.from("platform_connections").upsert(
              [...platforms].map((platform) => ({
                user_id: user.id,
                platform,
              })),
              { onConflict: "user_id,platform" },
            );
          }
          await supabase.from("feed_rules").upsert({
            user_id: user.id,
            hide_topics: [...rules],
          });
          await supabase
            .from("profiles")
            .update({ onboarded: true })
            .eq("id", user.id);
        }
      } catch {
        // Demo-friendly: never block entering the app on persistence.
      }
    }

    router.push("/");
  };

  const next = () => (step === STEPS.length - 1 ? finish() : setStep(step + 1));

  return (
    <div className="animate-rise flex min-h-[85dvh] flex-col" key={step}>
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="glass flex size-10 items-center justify-center rounded-full"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <Image
            src="/icon.webp"
            alt="Flow logo"
            width={40}
            height={40}
            className="rounded-xl"
            priority
          />
        )}
        <div className="flex flex-1 justify-center gap-1.5">
          {STEPS.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === step
                  ? "w-7 bg-accent"
                  : index < step
                    ? "w-3 bg-accent/50"
                    : "w-3 bg-surface-strong"
              }`}
            />
          ))}
        </div>
        <span className="w-10 text-right text-xs font-bold text-faint">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <div className="flex-1 pt-8">
        {step === 0 && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Connect your platforms
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              Flow pulls everything into one clean feed. Pick where your
              content lives.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {PLATFORMS.map((platform) => {
                const selected = platforms.has(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`flex items-center gap-3 rounded-[1.5rem] p-4 text-sm font-bold shadow-lg transition active:scale-95 ${
                      selected
                        ? "bg-card text-card-foreground shadow-black/30"
                        : "glass shadow-black/20"
                    }`}
                  >
                    <PlatformIcon platform={platform} className="size-5" />
                    {PLATFORM_LABELS[platform]}
                    {selected && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-accent text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-faint">
              Instagram, Facebook and TikTok are coming later — their APIs
              limit what third-party apps can show.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight">
              What do you care about?
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              Only these topics will ever appear in your feed.
            </p>
            <div className="mt-6 space-y-5">
              {Object.entries(INTERESTS).map(([group, topics]) => (
                <div key={group}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                    {group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => {
                      const selected = interests.has(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => toggleInterest(topic)}
                          className={`rounded-full px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
                            selected ? "bg-accent text-white" : "glass"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Pick your creators
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              You decide exactly who appears. Nobody else.
            </p>
            <div className="mt-6 space-y-2">
              {allCreators.map((creator) => {
                const selected = picked.has(creator.id);
                return (
                  <button
                    key={creator.id}
                    onClick={() => togglePicked(creator.id)}
                    className={`flex w-full items-center gap-3 rounded-[1.5rem] p-3 text-left transition active:scale-[0.98] ${
                      selected
                        ? "bg-card text-card-foreground shadow-lg shadow-black/30"
                        : "glass"
                    }`}
                  >
                    <Avatar creator={creator} shape="squircle" className="size-11 text-xs" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold">
                        {creator.name}
                      </span>
                      <span
                        className={`block truncate text-xs ${selected ? "text-card-muted" : "text-muted"}`}
                      >
                        {PLATFORM_LABELS[creator.platform]} · {creator.category}
                      </span>
                    </span>
                    <span
                      className={`flex size-6 items-center justify-center rounded-full transition ${
                        selected
                          ? "bg-accent text-white"
                          : "border border-glass-border"
                      }`}
                    >
                      {selected && <Check className="size-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Build your algorithm
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              Your rules decide what gets through — not engagement metrics.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {RULES.map((rule) => {
                const selected = rules.has(rule);
                return (
                  <button
                    key={rule}
                    onClick={() => toggleRule(rule)}
                    className={`rounded-full px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
                      selected ? "bg-accent text-white" : "glass"
                    }`}
                  >
                    {rule}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <button
        onClick={next}
        className="bg-brand mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-lg shadow-accent/40 transition active:scale-[0.98]"
      >
        {step === STEPS.length - 1 ? "Enter your Flow" : "Continue"}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
