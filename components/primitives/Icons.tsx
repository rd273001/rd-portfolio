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

export function ArrowUpRightIcon({
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
      <path d="M4 12 12 4m0 0H6.5m5.5 0V9.5" />
    </svg>
  );
}

export function ExternalLinkIcon({
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
      <path d="M12 9v4.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5H7M9.5 2H14v4.5M6.5 9.5 14 2" />
    </svg>
  );
}

export function BulletDotIcon({
  className = "size-1.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="8" cy="8" r="6" />
    </svg>
  );
}

export function GitHubIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 1A10.89 10.89 0 0 0 1 11.77 10.79 10.79 0 0 0 8.52 22c.55.1.75-.23.75-.52v-1.83c-3.06.65-3.71-1.44-3.71-1.44a2.86 2.86 0 0 0-1.22-1.58c-1-.66.08-.65.08-.65a2.31 2.31 0 0 1 1.68 1.11 2.37 2.37 0 0 0 3.2.89 2.33 2.33 0 0 1 .7-1.44c-2.44-.27-5-1.19-5-5.32a4.15 4.15 0 0 1 1.11-2.91 3.78 3.78 0 0 1 .11-2.84s.93-.29 3 1.1a10.68 10.68 0 0 1 5.5 0c2.1-1.39 3-1.1 3-1.1a3.78 3.78 0 0 1 .11 2.84A4.15 4.15 0 0 1 19 11.2c0 4.14-2.58 5.05-5 5.32a2.5 2.5 0 0 1 .75 2v2.95c0 .35.2.63.75.52A10.8 10.8 0 0 0 23 11.77 10.89 10.89 0 0 0 12 1" />
    </svg>
  );
}

export function LinkedInIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function MailIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function MediumIcon({
  className = "size-3.5",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 5.5C24 2.46 21.54 0 18.5 0H5.5C2.46 0 0 2.46 0 5.5v13C0 21.54 2.46 24 5.5 24h13c3.04 0 5.5-2.46 5.5-5.5V5.5zm-15.76.07l.29.02.14.14 3.19 7.67.33.61.1-.02.16-.35 3.31-7.95.1-.1.58-.04h2.14l1.11.1-.05.1-.55.19-.21.22-.2.46v10.99l.16.35.25.25.55.2.05.14-4.81.05-.06-.09.14-.14.55-.19.21-.26.16-.47V7.46l-.22.29-3.15 7.64-.59 1.17-.62 1.6-.25.4-.26-.09-2.33-5.61-1.06-2.3-1.03-2.5-.21-.33-.06 9.69.27.62.41.29.35.08.02.1-.1.09h-2.53l-.14-.09.02-.1.63-.23.25-.26.16-.39V6.62l-.2-.46-.21-.22-.59-.19-.06-.1 3.84-.06zm15.2 3.16H24v.54l-.7.14-.64.6-.35.67-.32 1.55.22.22H24v.49h-1.95l-.06.96.32 1.01.46.74.53.53.7.41v2.26l-.51.02-.89-.16-.82-.35-.39-.27-.64-.65-.47-.7-.47-1.2-.15-.86.03-1.99.28-1.09.47-.97.95-1.08.51-.35.62-.31.54-.15.36 0z"
      />
    </svg>
  );
}