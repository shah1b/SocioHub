import type { Creator } from "@/lib/types";

export function Avatar({
  creator,
  className = "size-9 text-xs",
}: {
  creator: Creator;
  className?: string;
}) {
  const initials = creator.name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white/95 ${creator.gradient} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
