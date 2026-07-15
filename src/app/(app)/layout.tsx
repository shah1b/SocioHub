import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="mx-auto max-w-md px-4 pb-32 pt-3">{children}</main>
      <BottomNav />
    </>
  );
}
