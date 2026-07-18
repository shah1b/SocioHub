import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  creators as mockCreators,
  feedItems as mockFeedItems,
  suggestedCreators as mockSuggested,
} from "./mock-data";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./supabase/config";
import type { ContentTag, ContentType, Creator, FeedItem, Platform } from "./types";

/* Public catalog + feed reads use a cookie-less client so pages can be
   statically revalidated; per-user reads go through supabase/server.ts. */
function publicClient() {
  return createSupabaseClient(supabaseUrl!, supabaseKey!, {
    auth: { persistSession: false },
  });
}

const GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-red-400 to-rose-600",
  "from-cyan-400 to-sky-600",
  "from-yellow-300 to-amber-500",
  "from-purple-400 to-fuchsia-600",
  "from-green-400 to-emerald-600",
];

function gradientFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

function relativeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function lengthLabel(type: ContentType, seconds: number | null): string | undefined {
  if (!seconds) return undefined;
  if (type === "article") return `${Math.max(1, Math.round(seconds / 60))} min read`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

interface CreatorRow {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  category: string;
  avatar_url: string | null;
}

interface FeedRow {
  id: string;
  platform: Platform;
  type: ContentType;
  title: string;
  ai_summary: string | null;
  category: string;
  tags: string[];
  duration_seconds: number | null;
  published_at: string;
  creator: CreatorRow | null;
}

function mapCreator(row: CreatorRow): Creator {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    platform: row.platform,
    category: row.category,
    gradient: gradientFor(row.name),
    avatarUrl: row.avatar_url ?? undefined,
  };
}

/** Newest-first feed from Supabase; the bundled demo feed when the
    backend is unconfigured, unreachable, or empty. */
export async function getFeedItems(): Promise<FeedItem[]> {
  if (!isSupabaseConfigured) return mockFeedItems;
  try {
    const { data, error } = await publicClient()
      .from("feed_items")
      .select(
        "id, platform, type, title, ai_summary, category, tags, duration_seconds, published_at, creator:creators(id, name, handle, platform, category, avatar_url)",
      )
      .order("published_at", { ascending: false })
      .limit(40)
      .overrideTypes<FeedRow[]>();
    if (error || !data || data.length === 0) return mockFeedItems;
    return data
      .filter((row) => row.creator)
      .map((row) => {
        const live = row.type === "stream";
        return {
          id: row.id,
          creator: mapCreator(row.creator!),
          type: row.type,
          title: row.title,
          aiSummary: row.ai_summary ?? "",
          category: row.category,
          tags: (row.tags ?? []) as ContentTag[],
          publishedAgo: live ? "LIVE" : relativeAgo(row.published_at),
          length: lengthLabel(row.type, row.duration_seconds),
        };
      });
  } catch {
    return mockFeedItems;
  }
}

/** Full creator catalog from Supabase; bundled demo catalog otherwise. */
export async function getCreators(): Promise<Creator[]> {
  if (!isSupabaseConfigured)
    return [...Object.values(mockCreators), ...mockSuggested];
  try {
    const { data, error } = await publicClient()
      .from("creators")
      .select("id, name, handle, platform, category, avatar_url")
      .order("name")
      .overrideTypes<CreatorRow[]>();
    if (error || !data || data.length === 0)
      return [...Object.values(mockCreators), ...mockSuggested];
    return data.map(mapCreator);
  } catch {
    return [...Object.values(mockCreators), ...mockSuggested];
  }
}
