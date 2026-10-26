import type { SVGProps } from "react";

export function ArrowLeftIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M13.5 8H2.5m0 0 4-4m-4 4 4 4" />
    </svg>
  );
}

export function ArrowRightIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M2.5 8h11m0 0-4-4m4 4-4 4" />
    </svg>
  );
}

export function ArrowDownIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M8 2.5v11m0 0-4-4m4 4 4-4" />
    </svg>
  );
}