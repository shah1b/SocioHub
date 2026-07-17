import type { Metadata } from "next";
import { getCreators } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CreatorsList } from "./creators-list";

export const metadata: Metadata = { title: "Creators" };
export const revalidate = 120;

export default async function AdminCreatorsPage() {
  const catalog = await getCreators();
  return <CreatorsList initial={catalog} live={isSupabaseConfigured} />;
}
