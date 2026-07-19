import { getAdminStats } from "@/lib/admin-data";
import AdminOverview from "./overview-client";

// Live aggregates re-fetch every minute, so app changes show up here
// without a redeploy; the refresh button pulls them on demand.
export const revalidate = 60;

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  return <AdminOverview stats={stats} />;
}
