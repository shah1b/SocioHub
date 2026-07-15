"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Home, Sparkles, Users } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/assistant", label: "Ask AI", icon: Sparkles, accent: true },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/hub", label: "Creator Hub", icon: Users },
];

/* Floating dock of circular buttons hovering over the content —
   one solid orange primary, the rest frosted glass. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 14px)" }}
    >
      <div className="glass-strong flex items-center gap-2 rounded-full bg-background/70 p-2 shadow-2xl shadow-black/60">
        {TABS.map(({ href, label, icon: Icon, accent }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex size-12 items-center justify-center rounded-full transition active:scale-90 ${
                accent
                  ? "bg-accent text-white shadow-lg shadow-accent/40"
                  : active
                    ? "bg-card text-card-foreground"
                    : "glass text-foreground/80"
              }`}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
