"use client";

import { useEffect, useState } from "react";

import { CheckIcon, CopyIcon, MailIcon } from "@/components/primitives";
import { cn } from "@/lib/cn";

type DirectEmailCopyProps = {
  email: string;
  className?: string;
};

export function DirectEmailCopy({ email, className }: DirectEmailCopyProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        return;
      }
    } catch {
      // Fallback
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    } catch {
      // If clipboard is completely blocked, do nothing
    }
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-xl border border-background/20 bg-background/10 p-1 text-sm text-background transition-colors hover:border-background/30",
        className,
      )}
    >
      <a
        href={`mailto:${email}`}
        aria-label={`Send email to ${email} (opens email client)`}
        className="group/mail inline-flex min-w-0 touch-manipulation items-center gap-2 rounded-lg px-2.5 py-1.5 text-background/85 transition-colors duration-150 hover:text-background active:bg-background/15 active:text-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background"
        title="Open in email client"
      >
        <MailIcon className="size-4 shrink-0 text-background/60 transition-colors group-hover/mail:text-background group-active/mail:text-background" />
        <span className="truncate font-mono text-xs sm:text-sm tracking-tight">
          {email}
        </span>
      </a>

      <div
        className="mx-1 h-4 w-px shrink-0 bg-background/20"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={handleCopy}
        aria-label={
          copied
            ? "Email copied to clipboard"
            : `Copy ${email} to clipboard`
        }
        title={copied ? "Copied!" : "Copy email address"}
        className={cn(
          "inline-flex shrink-0 cursor-pointer select-none touch-manipulation items-center justify-center rounded-lg p-1.5 transition-[color,background-color] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background",
          copied
            ? "bg-emerald-500/20 text-emerald-300"
            : "text-background/70 hover:bg-background/10 hover:text-background active:bg-background/20",
        )}
      >
        {copied ? (
          <CheckIcon className="size-4 shrink-0 text-emerald-400" />
        ) : (
          <CopyIcon className="size-4 shrink-0 text-background/60" />
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard." : ""}
      </span>
    </div>
  );
}

