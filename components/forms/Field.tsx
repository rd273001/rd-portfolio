import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
};

export function Field({ id, label, hint, optional, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted">(optional)</span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm leading-6 text-muted">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export const controlClassName = cn(
  "min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-base text-foreground",
  "outline-none transition-[border-color,box-shadow] duration-150",
  "placeholder:text-muted/80",
  "focus-visible:border-foreground/35 focus-visible:ring-2 focus-visible:ring-foreground/15",
);

export const honeypotClassName =
  "absolute left-[-10000px] top-auto h-px w-px overflow-hidden";
