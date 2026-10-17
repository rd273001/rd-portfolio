import Link from "next/link";

import type { CaseStudyNavProject } from "@/content/projects";

type CaseStudyAdjacentNavProps = {
  previous: CaseStudyNavProject | null;
  next: CaseStudyNavProject | null;
};

const linkClassName =
  "group inline-flex w-fit max-w-[calc(50%-0.5rem)] sm:max-w-xs md:max-w-sm touch-manipulation flex-col gap-1 rounded-md outline-none transition-opacity duration-150 ease-out [@media(hover:hover)]:hover:opacity-75 active:opacity-60 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background";

const titleRowClassName =
  "block min-w-0 text-base font-semibold tracking-[-0.03em] text-foreground sm:text-xl break-words";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 8H2.5m0 0 4-4m-4 4 4 4" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 8h11m0 0-4-4m4 4-4 4" />
    </svg>
  );
}

const arrowBaseClassName =
  "relative -top-[1px] inline-block align-middle text-muted transition-[transform,color] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none";

/*
 * Hover and :active both apply while the mouse is down. Equal specificity means
 * CSS order can keep the hover translate — so press must win with ! and a
 * clearly larger offset.
 */
const arrowPreviousClassName = `${arrowBaseClassName} [@media(hover:hover)]:group-hover:-translate-x-1 [@media(hover:hover)]:group-hover:text-foreground group-active:!-translate-x-2 group-active:text-foreground group-active:duration-100`;
const arrowNextClassName = `${arrowBaseClassName} [@media(hover:hover)]:group-hover:translate-x-1 [@media(hover:hover)]:group-hover:text-foreground group-active:!translate-x-2 group-active:text-foreground group-active:duration-100`;

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
      className="mt-10 flex flex-row items-start justify-between gap-4 sm:mt-12 sm:gap-8"
    >
      {previous ? (
        <Link
          href={previous.caseStudyHref}
          className={`${linkClassName} self-start items-start text-left`}
        >
          <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Previous
          </span>
          <span className={titleRowClassName}>
            <span className="inline">
              <span
                aria-hidden="true"
                className={`mr-1.5 ${arrowPreviousClassName}`}
              >
                <ArrowLeftIcon className="block h-[0.82em] w-[0.82em]" />
              </span>
              {previous.name}
            </span>
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.caseStudyHref}
          className={`${linkClassName} ml-auto self-start items-end text-right`}
        >
          <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Next
          </span>
          <span className={titleRowClassName}>
            <span className="inline">
              {next.name}
              <span
                aria-hidden="true"
                className={`ml-1.5 ${arrowNextClassName}`}
              >
                <ArrowRightIcon className="block h-[0.82em] w-[0.82em]" />
              </span>
            </span>
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
