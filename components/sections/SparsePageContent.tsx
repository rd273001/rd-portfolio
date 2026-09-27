import type { ReactNode } from "react";

import { SparsePageMark } from "./SparsePageMark";
import { SparsePageSection } from "./SparsePageSection";

type SparsePageContentProps = {
  kind: "not-found" | "error";
  title: string;
  description: string;
  actions: ReactNode;
};

export function SparsePageContent({
  kind,
  title,
  description,
  actions,
}: SparsePageContentProps) {
  return (
    <SparsePageSection>
      <SparsePageMark kind={kind} />
      <h1 className="text-3xl font-semibold tracking-[-0.045em] text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {description}
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        {actions}
      </div>
    </SparsePageSection>
  );
}
