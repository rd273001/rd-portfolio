"use client";

import { useState } from "react";

import { Button } from "@/components/primitives";

import { deleteFeedbackAction } from "@/app/admin/feedback/actions";

import { ActionSubmitButton } from "./ActionSubmitButton";

type ConfirmDeleteButtonProps = {
  id: string;
  name: string;
};

export function ConfirmDeleteButton({ id, name }: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button type="button" variant="secondary" onClick={() => setConfirming(true)}>
        Delete
      </Button>
    );
  }

  return (
    <form action={deleteFeedbackAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <p className="text-sm text-muted">Delete {name}’s note permanently?</p>
      <ActionSubmitButton busyLabel="Deleting…" className="border-foreground/30">
        Delete permanently
      </ActionSubmitButton>
      <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </form>
  );
}