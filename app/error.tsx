"use client";

import { PageShell, RouteError } from "@/components/sections";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageShell>
      <RouteError reset={reset} />
    </PageShell>
  );
}