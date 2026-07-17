import { getFeedItems } from "@/lib/data";
import { HomeFeed } from "./home-feed";

// Public feed: statically rendered and refreshed every two minutes.
export const revalidate = 120;

export default async function HomePage() {
  const items = await getFeedItems();
  return <HomeFeed items={items} />;
}
