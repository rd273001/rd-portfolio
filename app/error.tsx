"use client";

import { RouteError, SiteFooter } from "@/components/sections";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <main id="content" tabIndex={-1} className="scroll-mt-20 outline-none">
        <RouteError reset={reset} />
      </main>
      <SiteFooter />
    </>
  );
}