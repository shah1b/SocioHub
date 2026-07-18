// Demo data for the admin dashboard until Supabase + ingestion are live.

export type RangeKey = "7d" | "30d" | "90d";

export const RANGES: Record<RangeKey, { label: string; days: number }> = {
  "7d": { label: "Last 7 days", days: 7 },
  "30d": { label: "Last 30 days", days: 30 },
  "90d": { label: "Last 90 days", days: 90 },
};

/* Daily active users, one point per day, oldest → newest (90 days). */
export const dauSeries: { date: string; value: number }[] = (() => {
  const out: { date: string; value: number }[] = [];
  const base = new Date("2026-07-15T00:00:00Z");
  let level = 8200;
  // Deterministic pseudo-random walk so the demo is stable across renders.
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 89; i >= 0; i--) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - i);
    const weekday = d.getUTCDay();
    const weekendDip = weekday === 0 || weekday === 6 ? -600 : 0;
    level += 55 + (rand() - 0.45) * 320;
    out.push({
      date: d.toISOString().slice(0, 10),
      value: Math.max(6000, Math.round(level + weekendDip)),
    });
  }
  return out;
})();

export interface Kpi {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  upIsGood: boolean;
  trend: number[];
}

export const kpisByRange: Record<RangeKey, Kpi[]> = {
  "7d": [
    { label: "Daily active users", value: "13.1K", delta: 4.2, deltaLabel: "vs prior 7 days", upIsGood: true, trend: [11.9, 12.1, 12.4, 12.2, 12.6, 12.9, 13.1] },
    { label: "New signups", value: "1,842", delta: 9.8, deltaLabel: "vs prior 7 days", upIsGood: true, trend: [210, 232, 248, 260, 291, 296, 305] },
    { label: "Avg session (intentional)", value: "11m 20s", delta: -3.1, deltaLabel: "vs prior 7 days", upIsGood: false, trend: [12.1, 12.0, 11.8, 11.7, 11.5, 11.4, 11.3] },
    { label: "Premium conversion", value: "6.4%", delta: 0.5, deltaLabel: "vs prior 7 days", upIsGood: true, trend: [5.8, 5.9, 6.0, 6.1, 6.2, 6.3, 6.4] },
  ],
  "30d": [
    { label: "Daily active users", value: "12.4K", delta: 11.6, deltaLabel: "vs prior 30 days", upIsGood: true, trend: [10.2, 10.5, 10.9, 11.1, 11.6, 12.0, 12.4] },
    { label: "New signups", value: "7,318", delta: 14.2, deltaLabel: "vs prior 30 days", upIsGood: true, trend: [820, 905, 1010, 1050, 1180, 1215, 1301] },
    { label: "Avg session (intentional)", value: "11m 48s", delta: -1.9, deltaLabel: "vs prior 30 days", upIsGood: false, trend: [12.3, 12.2, 12.1, 12.0, 11.9, 11.9, 11.8] },
    { label: "Premium conversion", value: "6.1%", delta: 0.9, deltaLabel: "vs prior 30 days", upIsGood: true, trend: [5.1, 5.3, 5.5, 5.6, 5.8, 6.0, 6.1] },
  ],
  "90d": [
    { label: "Daily active users", value: "10.8K", delta: 38.4, deltaLabel: "vs prior 90 days", upIsGood: true, trend: [7.4, 8.0, 8.7, 9.3, 9.9, 10.4, 10.8] },
    { label: "New signups", value: "21,480", delta: 41.0, deltaLabel: "vs prior 90 days", upIsGood: true, trend: [1900, 2150, 2300, 2520, 2660, 2810, 2980] },
    { label: "Avg session (intentional)", value: "12m 04s", delta: -4.6, deltaLabel: "vs prior 90 days", upIsGood: false, trend: [12.9, 12.7, 12.6, 12.4, 12.3, 12.2, 12.1] },
    { label: "Premium conversion", value: "5.7%", delta: 1.4, deltaLabel: "vs prior 90 days", upIsGood: true, trend: [4.3, 4.6, 4.9, 5.1, 5.3, 5.5, 5.7] },
  ],
};

/* Items ingested per platform (scaled per range on the overview). */
export const ingestPerPlatform: { platform: string; perDay: number }[] = [
  { platform: "YouTube", perDay: 4210 },
  { platform: "Instagram", perDay: 3480 },
  { platform: "Facebook", perDay: 2950 },
  { platform: "X", perDay: 2140 },
  { platform: "Threads", perDay: 980 },
  { platform: "Twitch", perDay: 340 },
  { platform: "Kick", perDay: 180 },
];

export type PipelineStatus = "good" | "warning" | "serious" | "critical";

export const pipelines: {
  name: string;
  status: PipelineStatus;
  detail: string;
  lastRun: string;
}[] = [
  { name: "YouTube Data API poller", status: "good", detail: "All quotas healthy", lastRun: "2 min ago" },
  { name: "Instagram Graph sync", status: "good", detail: "Streaming normally", lastRun: "just now" },
  { name: "Facebook Pages poller", status: "warning", detail: "14 pages timing out (retrying)", lastRun: "6 min ago" },
  { name: "X API sync", status: "serious", detail: "Rate-limited — backoff until 14:20 UTC", lastRun: "41 min ago" },
  { name: "Threads + Kick crawl", status: "good", detail: "Nightly run complete", lastRun: "5 h ago" },
  { name: "AI summarizer queue", status: "good", detail: "312 items/min, p95 1.8 s", lastRun: "live" },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
  status: "active" | "suspended";
  joined: string;
  creatorsFollowed: number;
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Amara Okafor", email: "amara@example.com", plan: "premium", status: "active", joined: "2026-07-12", creatorsFollowed: 34 },
  { id: "u2", name: "Jonas Weber", email: "jonas.w@example.com", plan: "free", status: "active", joined: "2026-07-11", creatorsFollowed: 12 },
  { id: "u3", name: "Priya Nair", email: "priya.n@example.com", plan: "premium", status: "active", joined: "2026-07-10", creatorsFollowed: 51 },
  { id: "u4", name: "Diego Fuentes", email: "diego@example.com", plan: "free", status: "suspended", joined: "2026-07-09", creatorsFollowed: 3 },
  { id: "u5", name: "Mei Chen", email: "mei.chen@example.com", plan: "free", status: "active", joined: "2026-07-08", creatorsFollowed: 18 },
  { id: "u6", name: "Tunde Alabi", email: "tunde@example.com", plan: "premium", status: "active", joined: "2026-07-06", creatorsFollowed: 27 },
  { id: "u7", name: "Sofia Rossi", email: "sofia.r@example.com", plan: "free", status: "active", joined: "2026-07-04", creatorsFollowed: 9 },
  { id: "u8", name: "Lucas Martin", email: "lucas.m@example.com", plan: "free", status: "active", joined: "2026-07-02", creatorsFollowed: 22 },
];

export interface FlaggedItem {
  id: string;
  title: string;
  creator: string;
  platform: string;
  reason: string;
  flaggedAgo: string;
}

export const flaggedItems: FlaggedItem[] = [
  { id: "fl1", title: "You WON'T BELIEVE what this club just did…", creator: "TransferGossipDaily", platform: "YouTube", reason: "Clickbait classifier (0.96)", flaggedAgo: "18m" },
  { id: "fl2", title: "Miracle supplement doubles your focus", creator: "BioHackPro", platform: "Facebook", reason: "Spam / misleading claim", flaggedAgo: "1h" },
  { id: "fl3", title: "Leaked: full match replay stream", creator: "streamz4free", platform: "Kick", reason: "Copyright risk", flaggedAgo: "3h" },
];
