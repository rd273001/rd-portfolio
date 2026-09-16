"use client";

import { Button, Container } from "@/components/primitives";

type RouteErrorProps = {
  reset: () => void;
  title?: string;
  description?: string;
};

export function RouteError({
  reset,
  title = "Something went wrong.",
  description = "The page failed to load. You can try again or return to the home page.",
}: RouteErrorProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Error
        </p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button href="/" variant="secondary">
            Back home
          </Button>
        </div>
      </Container>
    </section>
  );
}