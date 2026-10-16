import Link from "next/link";

import { cn } from "@/lib/cn";
import type { FeedbackListFilter, FeedbackStatus } from "@/lib/feedback/types";

const TABS: { id: FeedbackListFilter; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "published", label: "Published" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All" },
];

type FeedbackFiltersProps = {
  current: FeedbackListFilter;
  counts: Record<FeedbackStatus, number>;
};

export function FeedbackFilters({ current, counts }: FeedbackFiltersProps) {
  const all = counts.pending + counts.published + counts.archived;

  return (
    <nav aria-label="Feedback status" className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const count =
          tab.id === "all" ? all : counts[tab.id as FeedbackStatus];
        const href =
          tab.id === "pending"
            ? "/admin/feedback"
            : `/admin/feedback?status=${tab.id}`;
        const selected = current === tab.id;

        return (
          <Link
            key={tab.id}
            href={href}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
              selected
                ? "bg-foreground text-background"
                : "text-muted [@media(hover:hover)]:hover:text-foreground",
            )}
          >
            {tab.label}
            <span className={cn("ml-2 font-mono text-xs", selected ? "text-background/70" : "text-muted")}>
              {count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}