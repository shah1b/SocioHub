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
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-xs font-medium text-accent"
        >
          See all <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
