import type { Metadata } from "next";
import Image from "next/image";
import "@/components/admin/chart-chrome.css";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = {
  title: { default: "Flow Admin", template: "%s · Flow Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="viz-root flex min-h-dvh bg-[var(--viz-page)] text-[var(--viz-ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-[var(--viz-border)] bg-[#0d0d0c] lg:flex">
        <div className="flex items-center gap-2.5 px-5 pb-6 pt-6">
          <Image
            src="/icon.webp"
            alt="Flow logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div>
            <p className="text-sm font-bold leading-none">Flow</p>
            <p className="mt-0.5 text-[11px] font-medium text-[var(--viz-muted)]">
              Admin console
            </p>
          </div>
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-[var(--viz-border)] px-5 py-4">
          <p className="text-[11px] text-[var(--viz-muted)]">
            Live aggregates sync from the app every minute. User rows and
            sign-in gating unlock with Supabase admin roles.
          </p>
        </div>
      </aside>

      {/* Compact header for < lg screens. */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-2.5 border-b border-[var(--viz-border)] bg-[#0d0d0c] px-4 py-3 lg:hidden">
        <Image src="/icon.webp" alt="Flow logo" width={26} height={26} className="rounded-md" />
        <p className="text-sm font-bold">Flow Admin</p>
        <AdminNav compact />
      </div>

      <main className="min-w-0 flex-1 px-5 pb-16 pt-16 lg:ml-60 lg:px-10 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
