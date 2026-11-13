"use client";

import {
  archiveFeedbackAction,
  publishFeedbackAction,
  unpublishFeedbackAction,
} from "@/app/admin/feedback/actions";
import { Button } from "@/components/primitives";
import type { FeedbackSubmission } from "@/lib/feedback/types";

import { ActionSubmitButton } from "./ActionSubmitButton";

type FeedbackRowActionsProps = {
  submission: FeedbackSubmission;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function FeedbackRowActions({
  submission,
  onEdit,
  onDelete,
}: FeedbackRowActionsProps) {
  const { id, status } = submission;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {status !== "published" ? (
        <form action={publishFeedbackAction}>
          <input type="hidden" name="id" value={id} />
          <ActionSubmitButton variant="primary" busyLabel="Publishing…">
            Publish to site
          </ActionSubmitButton>
        </form>
      ) : (
        <form action={unpublishFeedbackAction}>
          <input type="hidden" name="id" value={id} />
          <ActionSubmitButton busyLabel="Updating…">Unpublish</ActionSubmitButton>
        </form>
      )}

      {onEdit ? (
        <Button type="button" variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      ) : null}

      {status !== "archived" ? (
        <form action={archiveFeedbackAction}>
          <input type="hidden" name="id" value={id} />
          <ActionSubmitButton busyLabel="Archiving…">Archive</ActionSubmitButton>
        </form>
      ) : null}

      {onDelete ? (
        <Button type="button" variant="secondary" onClick={onDelete}>
          Delete
        </Button>
      ) : null}
    </div>
  );
}
