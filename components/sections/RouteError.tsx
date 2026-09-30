"use client";

import { Button } from "@/components/primitives";

import { SparsePageContent } from "./SparsePageContent";

type RouteErrorProps = {
  reset: () => void;
  title?: string;
  description?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function RouteError({
  reset,
  title = "Something went wrong.",
  description = "Try again, or return to the home page.",
  secondaryHref = "/",
  secondaryLabel = "Back home",
}: RouteErrorProps) {
  return (
    <SparsePageContent
      kind="error"
      title={title}
      description={description}
      actions={
        <>
          <Button
            className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
            type="button"
            onClick={reset}
          >
            Try again
          </Button>
          <Button
            className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
            href={secondaryHref}
            variant="secondary"
          >
            {secondaryLabel}
          </Button>
        </>
      }
    />
  );
}