import type { FeedbackSubmission } from "@/lib/feedback/types";

import { FeedbackRowActions } from "./FeedbackRowActions";

type FeedbackCardProps = {
  submission: FeedbackSubmission;
};

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function FeedbackCard({ submission }: FeedbackCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-foreground/20 sm:p-7">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {submission.status === "published" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Published
            </span>
          ) : submission.status === "archived" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/60 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-muted">
              <span className="size-1.5 rounded-full bg-muted/60" aria-hidden="true" />
              Archived
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase text-amber-800 dark:text-amber-400">
              <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              Pending Review
            </span>
          )}

          {submission.permissionToPublish ? (
            <span className="inline-flex items-center rounded-full border border-border bg-accent/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
              Publish consent: Granted
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-amber-600/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-400">
              Publish consent: None (Private)
            </span>
          )}
        </div>

        <time className="font-mono text-xs text-muted">
          {formatTimestamp(submission.createdAt)}
        </time>
      </div>

      {/* Quote / Testimonial */}
      <blockquote className="mt-5 text-base leading-relaxed text-foreground sm:text-[17px] sm:leading-7">
        “{submission.quote}”
      </blockquote>

      {/* Author Profile */}
      <div className="mt-5 flex items-center gap-3.5 rounded-xl border border-border/80 bg-accent/30 p-3.5 sm:p-4">
        <div className="flex size-10 shrink-0 select-none items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
          {getInitials(submission.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {submission.name}
            </p>
            {submission.role || submission.company ? (
              <span className="truncate text-xs text-muted">
                {submission.role}
                {submission.company ? ` · ${submission.company}` : ""}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">
            {submission.email ? submission.email : "No follow-up email provided"}
          </p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          {submission.status === "published"
            ? "Live — displayed in testimonials on the homepage."
            : submission.status === "archived"
              ? "Archived — hidden from the public site."
              : "Pending — review quote before publishing live."}
        </p>
        <FeedbackRowActions submission={submission} />
      </div>
    </article>
  );
}