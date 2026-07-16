"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Database,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
  UsersRound,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/creators", label: "Creators", icon: UsersRound },
  { href: "/admin/content", label: "Content & ingestion", icon: Database },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  if (compact) {
    return (
      <nav className="ml-auto flex gap-1 overflow-x-auto">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`rounded-lg p-2 ${
                active
                  ? "bg-[var(--viz-accent-wash)] text-[var(--viz-accent)]"
                  : "text-[var(--viz-muted)]"
              }`}
            >
              <Icon className="size-4.5" />
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
              active
                ? "bg-[var(--viz-accent-wash)] text-[var(--viz-ink)]"
                : "text-[var(--viz-ink-2)] hover:bg-white/5"
            }`}
          >
            <Icon
              className="size-4"
              style={active ? { color: "var(--viz-accent)" } : undefined}
            />
            {label}
          </Link>
        );
      })}
      <Link
        href="/"
        target="_blank"
        className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[var(--viz-muted)] transition hover:bg-white/5"
      >
        <ArrowUpRight className="size-4" />
        Open the app
      </Link>
    </nav>
  );
}
