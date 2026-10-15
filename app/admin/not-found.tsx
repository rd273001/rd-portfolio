import type { Metadata } from "next";

import { Button } from "@/components/primitives";
import { SparsePageContent } from "@/components/sections";

export const metadata: Metadata = {
  title: "Admin page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNotFound() {
  return (
    <SparsePageContent
      kind="not-found"
      title="Admin page not found."
      description="That admin URL does not exist. Return to feedback, or go back to the public site."
      actions={
        <>
          <Button
            className="w-full whitespace-nowrap px-6 sm:w-auto sm:min-w-36"
            href="/admin/feedback"
          >
            Feedback
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
  );
}