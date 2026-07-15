import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="glass flex items-center gap-0.5 rounded-full py-1.5 pl-3.5 pr-2 text-xs font-bold text-foreground/90"
        >
          See all <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
