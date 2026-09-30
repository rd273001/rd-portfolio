"use client";

import { PageShell, RouteError } from "@/components/sections";

export default function ProjectError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageShell>
      <RouteError
        reset={reset}
        title="Case study unavailable."
        description="Try again, or browse other selected work on the home page."
        secondaryHref="/#work"
        secondaryLabel="Selected work"
      />
    </PageShell>
  );
}