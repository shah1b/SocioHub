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
  const initials = creator.name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br font-bold text-white/95 ${
        shape === "circle" ? "rounded-full" : "rounded-2xl"
      } ${creator.gradient} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
