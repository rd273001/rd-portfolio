import type { FeedbackFields } from "@/lib/contact/validate";

import { getSupabaseAdmin, isFeedbackStoreConfigured } from "./client";
import { mapFeedbackRow, toTestimonial } from "./map";
import type { FeedbackListFilter, FeedbackStatus, FeedbackSubmission } from "./types";
import { FEEDBACK_STATUSES } from "./types";

const TABLE = "feedback_submissions";

const SELECT_COLUMNS =
  "id, name, role, company, email, quote, permission_to_publish, status, created_at, published_at, archived_at";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isFeedbackId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export { isFeedbackStoreConfigured };

function requireStore() {
  const client = getSupabaseAdmin();

  if (!client) {
    throw new Error("Feedback store is not configured.");
  }

  return client;
}

export async function insertPendingFeedback(
  fields: FeedbackFields,
): Promise<{ ok: true } | { ok: false; code: "not_configured" | "insert_failed" }> {
  const client = getSupabaseAdmin();

  if (!client) {
    return { ok: false, code: "not_configured" };
  }

  const { error } = await client.from(TABLE).insert({
    name: fields.name,
    role: fields.role,
    company: fields.company,
    email: fields.email,
    quote: fields.message,
    permission_to_publish: fields.permissionToPublish,
    status: "pending",
  });

  if (error) {
    return { ok: false, code: "insert_failed" };
  }

  return { ok: true };
}

export async function listFeedback(
  filter: FeedbackListFilter,
): Promise<FeedbackSubmission[]> {
  const client = requireStore();
  let query = client
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Could not load feedback.");
  }

  return (data ?? [])
    .map((row) => mapFeedbackRow(row))
    .filter((row): row is FeedbackSubmission => row !== null);
}

export async function countFeedbackByStatus(): Promise<
  Record<FeedbackStatus, number>
> {
  const client = requireStore();
  const counts: Record<FeedbackStatus, number> = {
    pending: 0,
    published: 0,
    archived: 0,
  };

  const results = await Promise.all(
    FEEDBACK_STATUSES.map(async (status) => {
      const { count, error } = await client
        .from(TABLE)
        .select("id", { count: "exact", head: true })
        .eq("status", status);

      if (error) {
        throw new Error("Could not load feedback counts.");
      }

      return [status, count ?? 0] as const;
    }),
  );

  for (const [status, count] of results) {
    counts[status] = count;
  }

  return counts;
}

export async function listPublishedTestimonials() {
  const client = getSupabaseAdmin();

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error("Could not load published testimonials.");
  }

  return (data ?? [])
    .map((row) => mapFeedbackRow(row))
    .filter((row): row is FeedbackSubmission => row !== null)
    .map(toTestimonial);
}

export async function setFeedbackStatus(id: string, status: FeedbackStatus) {
  const client = requireStore();
  const now = new Date().toISOString();
  const patch: Record<string, string | null> = { status };

  if (status === "published") {
    patch.published_at = now;
    patch.archived_at = null;
  } else if (status === "archived") {
    patch.archived_at = now;
  } else {
    patch.published_at = null;
    patch.archived_at = null;
  }

  const { error } = await client.from(TABLE).update(patch).eq("id", id);

  if (error) {
    throw new Error("Could not update feedback.");
  }
}

export async function deleteFeedback(id: string) {
  const client = requireStore();
  const { error } = await client.from(TABLE).delete().eq("id", id);

  if (error) {
    throw new Error("Could not delete feedback.");
  }
}