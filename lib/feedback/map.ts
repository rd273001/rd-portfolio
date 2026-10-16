import type { Testimonial } from "@/content/types";

import type { FeedbackStatus, FeedbackSubmission } from "./types";
import { FEEDBACK_STATUSES } from "./types";

type FeedbackRow = {
  id: string;
  name: string;
  role: string;
  company: string | null;
  email: string | null;
  quote: string;
  permission_to_publish: boolean;
  status: string;
  created_at: string;
  published_at: string | null;
  archived_at: string | null;
};

function isFeedbackStatus(value: string): value is FeedbackStatus {
  return FEEDBACK_STATUSES.includes(value as FeedbackStatus);
}

export function mapFeedbackRow(row: FeedbackRow): FeedbackSubmission | null {
  if (!isFeedbackStatus(row.status)) {
    return null;
  }

  const name = row.name.trim();
  const quote = row.quote.trim();

  if (!name || !quote) {
    return null;
  }

  return {
    id: row.id,
    name,
    role: row.role.trim(),
    company: (row.company ?? "").trim(),
    email: (row.email ?? "").trim(),
    quote,
    permissionToPublish: row.permission_to_publish,
    status: row.status,
    createdAt: row.created_at,
    publishedAt: row.published_at,
    archivedAt: row.archived_at,
  };
}

export function toTestimonial(row: FeedbackSubmission): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    title: row.role,
    company: row.company,
    status: "verified",
  };
}