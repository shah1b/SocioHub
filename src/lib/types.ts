export type Platform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "threads"
  | "x"
  | "twitch"
  | "kick";

export type ContentType =
  | "video"
  | "short"
  | "post"
  | "article"
  | "podcast"
  | "stream";

export type ContentTag = "educational" | "entertainment" | "news" | "live";

export type AttentionMode = "relax" | "focus" | "learning" | "weekend";

export interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  category: string;
  /** Tailwind gradient classes for the avatar fallback. */
  gradient: string;
  /** Public profile image; falls back to gradient initials when unset/broken. */
  avatarUrl?: string;
  followed?: boolean;
  suggestedBecause?: string;
}

export interface FeedItem {
  id: string;
  creator: Creator;
  type: ContentType;
  title: string;
  aiSummary: string;
  category: string;
  tags: ContentTag[];
  /** Relative time label, e.g. "2h". */
  publishedAgo: string;
  /** Video/podcast length or article read time, e.g. "12:40" or "6 min read". */
  length?: string;
  /** Total reactions across the source platform — powers Trending. */
  reactions?: number;
  saved?: boolean;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  count: number;
}
