import type { Metadata } from "next";

import { Button, Container } from "@/components/primitives";
import { PageShell } from "@/components/sections";

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
      <section className="py-16 sm:py-20">
        <Container>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            404
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
            This page is not available.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            The link may be out of date, or the case study does not exist.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
          </div>
        </Container>
      </section>
    </PageShell>
  );
}