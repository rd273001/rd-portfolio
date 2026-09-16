import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-foreground text-background hover:opacity-90 focus-visible:outline-foreground",
  secondary:
    "border border-border bg-transparent text-foreground hover:bg-accent focus-visible:outline-foreground",
} as const;

type ButtonVariant = keyof typeof variants;

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButton = SharedProps & {
  href?: undefined;
  type?: "button" | "submit";
};

type ButtonAsLink = SharedProps & {
  href: string;
  type?: never;
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full px-5 text-center text-sm font-medium transition-opacity",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const isExternal = props.href.startsWith("http") || props.href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a href={props.href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes}>
      {children}
    </button>
  );
}