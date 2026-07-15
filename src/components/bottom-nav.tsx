"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Home, Sparkles, Users } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/assistant", label: "Ask AI", icon: Sparkles, accent: true },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/hub", label: "Hub", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div
        className="glass-strong mx-auto max-w-md border-x-0 border-b-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-stretch justify-around">
          {TABS.map(({ href, label, icon: Icon, accent }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 transition active:scale-95 ${
                  active ? "text-foreground" : "text-faint"
                }`}
              >
                {accent ? (
                  <span
                    className={`flex size-9 -mt-0.5 items-center justify-center rounded-full transition ${
                      active
                        ? "bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/30"
                        : "bg-accent-soft text-accent"
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </span>
                ) : (
                  <Icon className={`size-5 ${active ? "text-accent" : ""}`} />
                )}
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
