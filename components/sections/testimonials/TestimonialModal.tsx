"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Testimonial } from "@/content/types";

import { getInitials } from "./getInitials";

const EXIT_MS = 180;

type TestimonialModalProps = {
  item: Testimonial;
  onClose: () => void;
};

export function TestimonialModal({ item, onClose }: TestimonialModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, [href], [tabindex]:not([tabindex='-1'])",
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [requestClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm ${closing
            ? "animate-[testimonial-backdrop-out_180ms_ease-in_forwards]"
            : "animate-[testimonial-backdrop-in_220ms_ease-out_both]"
          }`}
        onClick={requestClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Feedback from ${item.name}`}
        className={`relative flex max-h-[85vh] max-h-[85dvh] w-full max-w-xl flex-col rounded-2xl border border-border bg-surface shadow-xl ${closing
            ? "animate-[testimonial-dialog-out_180ms_ease-in_forwards]"
            : "animate-[testimonial-dialog-in_260ms_cubic-bezier(0.16,1,0.3,1)_both]"
          }`}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 select-none items-center justify-center rounded-full border border-border bg-accent text-xs font-semibold text-foreground">
              {getInitials(item.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-foreground">
                {item.name}
              </p>
              {item.title || item.company ? (
                <p className="flex items-center truncate text-sm text-muted">
                  {item.title ? <span className="truncate">{item.title}</span> : null}
                  {item.title && item.company ? (
                    <span
                      className="mx-1.5 size-1 shrink-0 rounded-full bg-muted/70"
                      aria-hidden="true"
                    />
                  ) : null}
                  {item.company ? (
                    <span className="shrink-0 font-medium text-foreground/85">
                      {item.company}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Close feedback"
            className="-mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
          <blockquote className="whitespace-pre-line text-[15px] leading-7 text-foreground/90 sm:text-base sm:leading-8">
            “{item.quote}”
          </blockquote>
        </div>
      </div>
    </div>
  );
}
