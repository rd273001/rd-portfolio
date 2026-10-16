export const FEEDBACK_STATUSES = [
  "pending",
  "published",
  "archived",
] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export type FeedbackSubmission = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  quote: string;
  permissionToPublish: boolean;
  status: FeedbackStatus;
  createdAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
};

export type FeedbackListFilter = FeedbackStatus | "all";

export function parseFeedbackFilter(value: unknown): FeedbackListFilter {
  if (
    value === "pending" ||
    value === "published" ||
    value === "archived" ||
    value === "all"
  ) {
    return value;
  }

  return "pending";
}