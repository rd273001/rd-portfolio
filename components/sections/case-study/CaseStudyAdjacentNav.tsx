import Link from "next/link";

import type { CaseStudyNavProject } from "@/content/projects";

type CaseStudyAdjacentNavProps = {
  previous: CaseStudyNavProject | null;
  next: CaseStudyNavProject | null;
};

const linkClassName =
  "group flex min-w-0 max-w-sm touch-manipulation flex-col gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background";

const titleRowClassName =
  "inline-flex w-fit max-w-full items-baseline gap-2 text-lg font-semibold tracking-[-0.03em] text-foreground sm:text-xl";

const arrowBaseClassName =
  "inline-block text-muted transition-transform duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none";

/*
 * Hover and :active both apply while the mouse is down. Equal specificity means
 * CSS order can keep the hover translate — so press must win with ! and a
 * clearly larger offset.
 */
const arrowPreviousClassName = `${arrowBaseClassName} [@media(hover:hover)]:group-hover:-translate-x-1 group-active:!-translate-x-2 group-active:duration-100`;
const arrowNextClassName = `${arrowBaseClassName} [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100`;

export function CaseStudyAdjacentNav({
  previous,
  next,
}: CaseStudyAdjacentNavProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Other case studies"
      className="mt-10 flex flex-col gap-5 sm:mt-12 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
    >
      {previous ? (
        <Link href={previous.caseStudyHref} className={linkClassName}>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Previous
          </span>
          <span className={titleRowClassName}>
            <span aria-hidden="true" className={arrowPreviousClassName}>
              ←
            </span>
            {previous.name}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.caseStudyHref}
          className={`${linkClassName} sm:items-end sm:text-right`}
        >
          <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Next
          </span>
          <span className={titleRowClassName}>
            {next.name}
            <span aria-hidden="true" className={arrowNextClassName}>
              →
            </span>
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
