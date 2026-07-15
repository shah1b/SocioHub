import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-md px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </>
  );
}
