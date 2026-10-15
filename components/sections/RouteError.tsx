"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/primitives";

import { SparsePageContent } from "./SparsePageContent";

const actionClassName =
  "w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36";

type RouteErrorProps = {
  reset: () => void;
  title?: string;
  description?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  extraActions?: ReactNode;
};

export function RouteError({
  reset,
  title = "Something went wrong.",
  description = "Try again, or return to the home page.",
  secondaryHref = "/",
  secondaryLabel = "Back home",
  extraActions,
}: RouteErrorProps) {
  return (
    <SparsePageContent
      kind="error"
      title={title}
      description={description}
      actions={
        <>
          <Button
            className={actionClassName}
            type="button"
            onClick={reset}
          >
            Try again
          </Button>
          <Button
            className={actionClassName}
            href={secondaryHref}
            variant="secondary"
          >
            {secondaryLabel}
          </Button>
          {extraActions}
        </>
      }
    />
  );
}