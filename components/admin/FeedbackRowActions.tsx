import type { FeedbackSubmission } from "@/lib/feedback/types";

import {
  archiveFeedbackAction,
  publishFeedbackAction,
  unpublishFeedbackAction,
} from "@/app/admin/feedback/actions";

import { ActionSubmitButton } from "./ActionSubmitButton";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";

type FeedbackRowActionsProps = {
  submission: FeedbackSubmission;
};

export function FeedbackRowActions({ submission }: FeedbackRowActionsProps) {
  const { id, status } = submission;

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {status !== "published" ? (
        <form action={publishFeedbackAction}>
          <input type="hidden" name="id" value={id} />
          <ActionSubmitButton variant="primary" busyLabel="Publishing…">
            Publish
          </ActionSubmitButton>
        </form>
      ) : (
        <form action={unpublishFeedbackAction}>
          <input type="hidden" name="id" value={id} />
          <ActionSubmitButton busyLabel="Updating…">Unpublish</ActionSubmitButton>
        </form>
      )}

      {status !== "archived" ? (
        <form action={archiveFeedbackAction}>
          <input type="hidden" name="id" value={id} />
          <ActionSubmitButton busyLabel="Archiving…">Archive</ActionSubmitButton>
        </form>
      ) : null}

      <ConfirmDeleteButton id={id} name={submission.name} />
    </div>
  );
}