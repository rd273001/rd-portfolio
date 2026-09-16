"use client";

import { RouteError, SiteFooter } from "@/components/sections";

export default function ProjectError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <main id="content" tabIndex={-1} className="scroll-mt-20 outline-none">
        <RouteError
          reset={reset}
          title="This case study failed to load."
          description="You can try again or return to selected work on the home page."
        />
      </main>
      <SiteFooter />
    </>
  );
}