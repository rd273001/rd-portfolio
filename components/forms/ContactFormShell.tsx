import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import {
  type ContactFormTone,
  contactFormShellClassName as shellClassNameForTone,
} from "./contactFormTone";

type ContactFormSuccessProps = {
  title: string;
  titleId?: string;
  message: string;
  resetLabel: string;
  onReset: () => void;
  className?: string;
  tone?: ContactFormTone;
};

export function ContactFormSuccess({
  title,
  titleId,
  message,
  resetLabel,
  onReset,
  className,
  tone = "light",
}: ContactFormSuccessProps) {
  const onDark = tone === "on-dark";

  return (
    <div className={cn(shellClassNameForTone(tone), className)}>
      <div>
        <h3
          id={titleId}
          className={cn(
            "text-lg font-semibold tracking-[-0.03em]",
            onDark ? "text-background" : "text-foreground",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 text-base leading-7",
            onDark ? "text-background/75" : "text-muted",
          )}
          role="status"
        >
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className={cn(
          "mt-6 inline-flex w-auto max-w-full cursor-pointer self-start text-sm font-medium underline underline-offset-4",
          "-mx-1 rounded-md px-2 py-1.5 transition-[color,background-color,text-decoration-color] duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          onDark
            ? "text-background/85 decoration-background/45 focus-visible:outline-background active:bg-background/15 active:text-background [@media(hover:hover)]:hover:bg-background/10 [@media(hover:hover)]:hover:text-background [@media(hover:hover)]:hover:decoration-background"
            : "text-foreground/85 decoration-foreground/35 focus-visible:outline-foreground active:bg-foreground/12 active:text-foreground [@media(hover:hover)]:hover:bg-foreground/8 [@media(hover:hover)]:hover:text-foreground [@media(hover:hover)]:hover:decoration-foreground/70",
        )}
      >
        {resetLabel}
      </button>
    </div>
  );
}

type ContactFormShellProps = {
  children: ReactNode;
  className?: string;
  tone?: ContactFormTone;
};

export function ContactFormShell({
  children,
  className,
  tone = "light",
}: ContactFormShellProps) {
  return (
    <div className={cn(shellClassNameForTone(tone), className)}>{children}</div>
  );
}