import type { Platform } from "@/lib/types";

export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  threads: "Threads",
  x: "X",
  twitch: "Twitch",
  kick: "Kick",
};

// lucide-react no longer ships brand icons, so the glyphs are simple
// inline shapes drawn to read at small sizes.
export function PlatformIcon({
  platform,
  className = "size-3.5",
}: {
  platform: Platform;
  className?: string;
}) {
  switch (platform) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="YouTube">
          <path d="M23 7.5a4 4 0 0 0-2.8-2.9C18.2 4 12 4 12 4s-6.2 0-8.2.6A4 4 0 0 0 1 7.5 42 42 0 0 0 .5 12 42 42 0 0 0 1 16.5a4 4 0 0 0 2.8 2.9c2 .6 8.2.6 8.2.6s6.2 0 8.2-.6a4 4 0 0 0 2.8-2.9A42 42 0 0 0 23.5 12 42 42 0 0 0 23 7.5ZM9.8 15.3V8.7L15.7 12l-5.9 3.3Z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="X">
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L7.1 3.8H5.3l12.5 16.3Z" />
        </svg>
      );
    case "twitch":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Twitch">
          <path d="M4.3 1 1.6 5.7v16h5.4V25h3l3.2-3.3h4.6l6.6-6.6V1H4.3Zm17.9 13-3.8 3.8h-6l-3.2 3.2v-3.2H4.6V3.2h17.6V14ZM17.9 6.9v6h-2.2v-6h2.2Zm-5.9 0v6H9.8v-6H12Z" transform="scale(0.92)" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Facebook">
          <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-label="Instagram">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Threads">
          <path d="M12.4 22.9h-.1c-3.2 0-5.7-1.1-7.4-3.2C3.4 17.9 2.6 15.2 2.6 12c0-3.2.8-5.9 2.4-7.7C6.7 2.2 9.2 1.1 12.4 1.1c2.5 0 4.6.6 6.2 1.9 1.5 1.2 2.6 2.9 3.1 5l-2.3.6c-.9-3.4-3.2-5.1-7-5.1-2.5 0-4.4.8-5.6 2.3C5.5 7.3 4.9 9.5 4.9 12c0 2.5.6 4.7 1.9 6.2 1.2 1.5 3.1 2.3 5.6 2.3 2.2 0 3.7-.5 4.9-1.7 1.3-1.3 1.3-2.9 1.1-3.9-.1-.6-.4-1.2-.7-1.7-.5 2.6-2.3 4.1-5 4.1-1.5 0-2.8-.4-3.7-1.2a3.6 3.6 0 0 1-1.3-2.9c0-2.3 2-4 5-4 .8 0 1.6.1 2.4.2-.2-1.3-.9-2-2.3-2.1-1.2 0-2.2.3-2.7 1l-1.9-1.3c1-1.4 2.6-2.1 4.7-2 3 .2 4.6 2 4.9 5.1l.1.1c1.2.9 2.1 2.2 2.4 3.8.3 1.6.2 4-1.7 5.9-1.6 1.6-3.6 2.4-6.5 2.4Zm-.1-9.4c-1.2 0-2.6.5-2.6 1.7 0 .5.2.8.5 1.1.5.4 1.2.6 2.1.6 1.6 0 2.5-.8 2.7-2.4a8.6 8.6 0 0 0-2.7-1Z" />
        </svg>
      );
    case "kick":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Kick">
          <path d="M3 2h6v6h2V6h2V4h2V2h6v6h-2v2h-2v2h2v2h2v6h-6v-2h-2v-2h-2v2H9v4H3V2Z" />
        </svg>
      );
  }
}
