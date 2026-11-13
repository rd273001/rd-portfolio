"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { FIELD_LIMITS } from "@/lib/contact/limits";
import {
  deleteFeedback,
  isFeedbackId,
  setFeedbackStatus,
  updateFeedback,
} from "@/lib/feedback/queries";
import type { FeedbackStatus } from "@/lib/feedback/types";

function readId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!isFeedbackId(id)) {
    throw new Error("Invalid feedback id.");
  }

  return id;
}

async function mutateStatus(formData: FormData, status: FeedbackStatus) {
  await requireAdmin();
  await setFeedbackStatus(readId(formData), status);
  revalidatePath("/admin/feedback");
  revalidatePath("/");
}

export async function publishFeedbackAction(formData: FormData) {
  await mutateStatus(formData, "published");
}

export async function archiveFeedbackAction(formData: FormData) {
  await mutateStatus(formData, "archived");
}

export async function unpublishFeedbackAction(formData: FormData) {
  await mutateStatus(formData, "pending");
}

export type UpdateFeedbackState = {
  ok: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    role?: string;
    company?: string;
    quote?: string;
  };
};

export async function updateFeedbackAction(
  first: FormData | UpdateFeedbackState | null,
  second?: FormData,
): Promise<UpdateFeedbackState> {
  await requireAdmin();

  const formData = first instanceof FormData ? first : second;
  if (!formData) {
    return { ok: false, error: "Missing form data." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!isFeedbackId(id)) {
    return { ok: false, error: "Invalid feedback id." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();

  const fieldErrors: {
    name?: string;
    role?: string;
    company?: string;
    quote?: string;
  } = {};

  if (name.length < 2) {
    fieldErrors.name = "Please enter a name (at least 2 characters).";
  } else if (name.length > FIELD_LIMITS.name) {
    fieldErrors.name = `Name must be ${FIELD_LIMITS.name} characters or fewer.`;
  }

  if (role.length < 2) {
    fieldErrors.role = "Please add a role (at least 2 characters).";
  } else if (role.length > FIELD_LIMITS.role) {
    fieldErrors.role = `Role must be ${FIELD_LIMITS.role} characters or fewer.`;
  }

  if (company.length > FIELD_LIMITS.company) {
    fieldErrors.company = `Company must be ${FIELD_LIMITS.company} characters or fewer.`;
  }

  if (quote.length < 12) {
    fieldErrors.quote = "Please write a quote (at least 12 characters).";
  } else if (quote.length > FIELD_LIMITS.message) {
    fieldErrors.quote = `Quote must be ${FIELD_LIMITS.message} characters or fewer.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    const firstError =
      fieldErrors.name ??
      fieldErrors.role ??
      fieldErrors.company ??
      fieldErrors.quote ??
      "Validation failed.";

    return {
      ok: false,
      error: firstError,
      fieldErrors,
    };
  }

  try {
    await updateFeedback(id, { name, role, company, quote });
    revalidatePath("/admin/feedback");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not update feedback.",
    };
  }
}

export async function deleteFeedbackAction(formData: FormData) {
  await requireAdmin();
  await deleteFeedback(readId(formData));
  revalidatePath("/admin/feedback");
  revalidatePath("/");
}