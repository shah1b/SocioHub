"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Layers,
  ListFilter,
  Sparkles,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import type { Platform } from "@/lib/types";

const PLATFORM_RING: Platform[] = ["youtube", "reddit", "x", "rss", "twitch", "podcast"];

const SLIDES = [
  {
    icon: Layers,
    title: "Every platform.\nOne clean feed.",
    body: "Connect YouTube, Reddit, X, RSS, Twitch and podcasts. Flow brings only the creators you chose into a single timeline — no recommendations you never asked for.",
  },
  {
    icon: ListFilter,
    title: "You build\nthe algorithm.",
    body: "Hide shorts, politics, clickbait, spoilers. Show only educational content, only new uploads, in chronological order. Your rules decide what gets through.",
  },
  {
    icon: Sparkles,
    title: "AI that respects\nyour attention.",
    body: "Two-minute video summaries, a morning digest, and an assistant that answers from your feed — built to save your time, never to keep you scrolling.",
  },
] as const;

export default function WelcomePage() {
  const router = useRouter();
  // -1 = splash; 0..2 = slides.
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (step === -1) {
      const timer = setTimeout(() => setStep(0), 1700);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const markWelcomed = () => localStorage.setItem("flow.welcomed", "1");

  if (step === -1) {
    return (
      <div className="flex min-h-[85dvh] flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-10 animate-pulse rounded-full bg-accent/25 blur-3xl" />
          <Image
            src="/icon.webp"
            alt="Flow logo"
            width={104}
            height={104}
            className="animate-rise relative rounded-[2rem] shadow-2xl shadow-accent/40"
            priority
          />
        </div>
        <p className="animate-rise mt-8 text-4xl font-extrabold tracking-tight">
          Flow
        </p>
        <p className="animate-rise mt-2 text-sm font-medium text-muted">
          Your feed. Your rules.
        </p>
        <div className="mt-10 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-pulse rounded-full bg-accent"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const slide = SLIDES[step];
  const Icon = slide.icon;
  const last = step === SLIDES.length - 1;

  return (
    <div className="animate-rise flex min-h-[85dvh] flex-col" key={step}>
      <div className="flex items-center justify-between">
        <Image src="/icon.webp" alt="Flow logo" width={36} height={36} className="rounded-xl" />
        <button
          onClick={() => {
            markWelcomed();
            router.push("/");
          }}
          className="text-sm font-semibold text-faint transition active:scale-95"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="relative mb-10 flex h-40 items-center justify-center">
          <div className="absolute size-36 rounded-full bg-accent/15 blur-2xl" />
          {/* Orbit of platform glyphs around the slide icon. */}
          {PLATFORM_RING.map((platform, i) => {
            const angle = (i / PLATFORM_RING.length) * 2 * Math.PI - Math.PI / 2;
            return (
              <span
                key={platform}
                className="glass absolute flex size-10 items-center justify-center rounded-2xl"
                style={{
                  transform: `translate(${Math.cos(angle) * 88}px, ${Math.sin(angle) * 70}px)`,
                  opacity: step === 0 ? 1 : 0.25,
                  transition: "opacity 300ms ease",
                }}
              >
                <PlatformIcon platform={platform} className="size-4.5" />
              </span>
            );
          })}
          <span className="bg-brand relative flex size-20 items-center justify-center rounded-[1.6rem] text-white shadow-xl shadow-accent/40">
            <Icon className="size-9" />
          </span>
        </div>

        <h1 className="whitespace-pre-line text-center text-[34px] font-extrabold leading-[1.1] tracking-tight">
          {slide.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-center text-[15px] leading-relaxed text-muted">
          {slide.body}
        </p>
      </div>

      <div className="mb-5 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-7 bg-accent" : "w-3 bg-surface-strong"
            }`}
          />
        ))}
      </div>

      {last ? (
        <div className="space-y-3">
          <Link
            href="/signup"
            onClick={markWelcomed}
            className="bg-brand flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-lg shadow-accent/40 transition active:scale-[0.98]"
          >
            Get started <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            onClick={markWelcomed}
            className="glass flex w-full items-center justify-center rounded-full py-4 text-[15px] font-bold transition active:scale-[0.98]"
          >
            I already have an account
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setStep(step + 1)}
          className="bg-brand flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-lg shadow-accent/40 transition active:scale-[0.98]"
        >
          Continue <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}
