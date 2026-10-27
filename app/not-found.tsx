import type { Metadata } from "next";

import { Button } from "@/components/primitives";
import { PageShell, SparsePageContent } from "@/components/sections";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <PageShell>
      <SparsePageContent
        kind="not-found"
        title="Page not found."
        description="The page you are looking for doesn't exist, has been moved, or the link may be outdated."
        actions={
          <>
            <Button
              className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
              href="/"
            >
              Back home
            </Button>
            <Button
              className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
              href="/#work"
              variant="secondary"
            >
              Selected work
            </Button>
          </>
        }
      />
    </PageShell>
  );
}