import type { Metadata } from "next";

import { Button } from "@/components/primitives";
import { PageShell, SparsePageContent } from "@/components/sections";

export const metadata: Metadata = {
  title: "Case study not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CaseStudyNotFound() {
  return (
    <PageShell>
      <SparsePageContent
        kind="not-found"
        title="Case study not found."
        description="The requested project case study does not exist or may have been renamed."
        actions={
          <>
            <Button
              className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
              href="/#work"
            >
              Selected work
            </Button>
            <Button
              className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
              href="/"
              variant="secondary"
            >
              Back home
            </Button>
          </>
        }
      />
    </PageShell>
  );
}
