"use client";

import { Button } from "@/components/primitives";
import { RouteError } from "@/components/sections";

type AdminRouteErrorProps = {
  reset: () => void;
};

export function AdminRouteError({ reset }: AdminRouteErrorProps) {
  return (
    <RouteError
      reset={reset}
      title="Admin could not load."
      description="Try again, or sign in once more. If this keeps happening, wait a minute and refresh."
      secondaryHref="/admin/login"
      secondaryLabel="Sign in"
      extraActions={
        <Button
          className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
          href="/"
          variant="secondary"
        >
          Back home
        </Button>
      }
    />
  );
}