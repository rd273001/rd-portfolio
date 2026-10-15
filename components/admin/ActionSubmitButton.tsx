"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

import { Button } from "@/components/primitives";

type ActionSubmitButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  busyLabel?: string;
  className?: string;
};

export function ActionSubmitButton({
  children,
  variant = "secondary",
  busyLabel = "Saving…",
  className,
}: ActionSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      aria-busy={pending}
      className={className}
    >
      {pending ? busyLabel : children}
    </Button>
  );
}