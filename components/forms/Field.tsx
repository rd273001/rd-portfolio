import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import type { ContactFormTone } from "./contactFormTone";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  tone?: ContactFormTone;
  children: ReactNode;
};

export function fieldDescribedBy(
  id: string,
  hint?: string,
  error?: string,
): string | undefined {
  const ids = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean);

  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function Field({
  id,
  label,
  hint,
  optional,
  error,
  tone = "light",
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const onDark = tone === "on-dark";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          onDark ? "text-background" : "text-foreground",
        )}
      >
        {label}
        {optional ? (
          <span
            className={cn(
              "ml-1 font-normal",
              onDark ? "text-background/55" : "text-muted",
            )}
          >
            (optional)
          </span>
        ) : null}
      </label>
      {hint ? (
        <p
          id={hintId}
          className={cn(
            "text-sm leading-6",
            onDark ? "text-background/65" : "text-muted",
          )}
        >
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p
          id={errorId}
          className={cn(
            "text-sm leading-6",
            onDark ? "text-background" : "text-foreground",
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function controlClassName(
  invalid?: boolean,
  tone: ContactFormTone = "light",
) {
  const onDark = tone === "on-dark";

  return cn(
    "min-h-11 w-full appearance-none rounded-xl border px-3.5 text-base",
    "outline-none transition-[border-color,background-color] duration-150",
    "focus:outline-none",
    onDark
      ? cn(
          "border-background/25 bg-background/10 text-background",
          "placeholder:text-background/45",
          "hover:border-background/40",
          "focus:border-background focus:bg-background/15",
          invalid && "border-background/60",
        )
      : cn(
          "border-border bg-background/50 text-foreground",
          "placeholder:text-muted/70",
          "hover:border-foreground/25",
          "focus:border-foreground focus:bg-surface",
          invalid && "border-foreground/60",
        ),
  );
}

export const honeypotClassName =
  "absolute left-[-10000px] top-auto h-px w-px overflow-hidden";

/** Inquiry + feedback message fields: min ~5 lines, cap vertical resize, scroll inside. */
export const messageTextareaClassName =
  "min-h-32 max-h-64 resize-y overflow-y-auto py-3";