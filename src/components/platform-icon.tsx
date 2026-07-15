import { Mic, Rss } from "lucide-react";
import type { Platform } from "@/lib/types";

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  reddit: "Reddit",
  x: "X",
  rss: "RSS",
  twitch: "Twitch",
  podcast: "Podcast",
};

// lucide-react no longer ships brand icons, so the brand glyphs are inlined.
export function PlatformIcon({
  platform,
  className = "size-3.5",
}: {
  platform: Platform;
  className?: string;
}) {
  switch (platform) {
    case "rss":
      return <Rss className={className} aria-label="RSS" />;
    case "podcast":
      return <Mic className={className} aria-label="Podcast" />;
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
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Reddit">
          <path d="M22 12.1c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6a10.9 10.9 0 0 0-5.7-1.8l1-4.6 3.2.7a1.6 1.6 0 1 0 .2-1l-3.6-.8c-.3-.1-.5.1-.6.3l-1.1 5.3c-2.2.1-4.2.7-5.8 1.9-.4-.4-.9-.6-1.5-.6A2.2 2.2 0 0 0 3 14a4 4 0 0 0 0 .5c0 3.3 4 6 9 6s9-2.7 9-6v-.5c.6-.4 1-1.1 1-1.9ZM7.5 13.7a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 0 1-3.2 0Zm8.8 4.3c-1.1.8-2.6 1.3-4.3 1.3s-3.2-.4-4.3-1.3a.5.5 0 0 1 .6-.8c.9.7 2.2 1 3.7 1s2.8-.4 3.7-1a.5.5 0 0 1 .6.8Zm-.9-2.7a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z" />
        </svg>
      );
  }
}
