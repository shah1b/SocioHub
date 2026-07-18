"use client";

import { useState } from "react";
import Image from "next/image";
import type { Creator } from "@/lib/types";

export function Avatar({
  creator,
  className = "size-9 text-xs",
  shape = "circle",
}: {
  creator: Creator;
  className?: string;
  /** "circle" for author rows, "squircle" for story tiles and list thumbnails. */
  shape?: "circle" | "squircle";
}) {
  const [failed, setFailed] = useState(false);
  const rounded = shape === "circle" ? "rounded-full" : "rounded-2xl";

  const initials = creator.name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br font-bold text-white/95 ${rounded} ${creator.gradient} ${className}`}
      aria-hidden
    >
      {/* Gradient initials always paint first; the real profile image
          covers them once it loads, and disappears again on error. */}
      {initials}
      {creator.avatarUrl && !failed && (
        <Image
          src={creator.avatarUrl}
          alt={`${creator.name} avatar`}
          fill
          sizes="96px"
          className="object-cover"
          onError={() => setFailed(true)}
          unoptimized
        />
      )}
    </div>
  );
}
