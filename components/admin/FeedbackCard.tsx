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

function statusLabel(status: FeedbackSubmission["status"]) {
  if (status === "published") {
    return "Published";
  }

  if (status === "archived") {
    return "Archived";
  }

  return "Pending";
}

export function FeedbackCard({ submission }: FeedbackCardProps) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          {statusLabel(submission.status)}
        </p>
        <p className="text-sm text-muted">
          {formatTimestamp(submission.createdAt)}
        </p>
      </div>

      <blockquote className="mt-3 text-base leading-7 text-foreground">
        {submission.quote}
      </blockquote>

      <p className="mt-4 text-sm font-medium text-foreground">{submission.name}</p>
      <p className="mt-1 text-sm text-muted">
        {submission.role}
        {submission.company ? ` · ${submission.company}` : ""}
      </p>
      {submission.email ? (
        <p className="mt-1 text-sm text-muted">{submission.email}</p>
      ) : (
        <p className="mt-1 text-sm text-muted">No follow-up email</p>
      )}

      <p className="mt-4 text-sm text-muted">
        {submission.permissionToPublish
          ? "Checked publish intent — still review before publishing."
          : "Did not check publish intent. Follow up before publishing."}
      </p>

      <FeedbackRowActions submission={submission} />
    </article>
  );
}