import type { ReactNode } from "react";

import { Container } from "@/components/primitives";

type SparsePageSectionProps = {
  children: ReactNode;
};

/** Short pages (404, errors): centered copy, footer stays at bottom via PageShell. */
export function SparsePageSection({ children }: SparsePageSectionProps) {
  return (
    <section className="flex flex-1 flex-col justify-center py-16 sm:py-20">
      <Container className="flex max-w-xl flex-col items-center text-center">
        {children}
      </Container>
    </section>
  );
}
