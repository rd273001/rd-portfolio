"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import {
  deleteFeedback,
  isFeedbackId,
  setFeedbackStatus,
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

export async function deleteFeedbackAction(formData: FormData) {
  await requireAdmin();
  await deleteFeedback(readId(formData));
  revalidatePath("/admin/feedback");
  revalidatePath("/");
}