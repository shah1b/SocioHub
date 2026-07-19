import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./supabase/config";

/* Live aggregates from the admin_dashboard_stats() RPC — counts only,
   no user rows. Null means the backend is unreachable and the console
   should show its demo data instead. */
export interface AdminStats {
  generatedAt: string;
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  totalCreators: number;
  totalItems: number;
  items24h: number;
  totalReactions: number;
  itemsByPlatform: Record<string, number>;
  topItem: { title: string; reactions: number; platform: string } | null;
  latestItemAt: string | null;
}

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createSupabaseClient(supabaseUrl!, supabaseKey!, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase.rpc("admin_dashboard_stats");
    if (error || !data) return null;
    return {
      generatedAt: data.generated_at,
      totalUsers: data.total_users ?? 0,
      newUsers7d: data.new_users_7d ?? 0,
      newUsers30d: data.new_users_30d ?? 0,
      totalCreators: data.total_creators ?? 0,
      totalItems: data.total_items ?? 0,
      items24h: data.items_24h ?? 0,
      totalReactions: data.total_reactions ?? 0,
      itemsByPlatform: data.items_by_platform ?? {},
      topItem: data.top_item ?? null,
      latestItemAt: data.latest_item_at ?? null,
    };
  } catch {
    return null;
  }
}
