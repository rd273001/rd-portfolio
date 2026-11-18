"use client";

import { useId, useState } from "react";
import { ArrowDownIcon, BulletDotIcon } from "@/components/primitives";
import { cn } from "@/lib/cn";

type CareerJourneyHighlightsProps = {
  highlights: string[];
  initialVisibleCount?: number;
};

async function refreshScrollTrigger() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    ScrollTrigger.refresh();
  } catch {
    window.dispatchEvent(new Event("resize"));
  }
}

export function CareerJourneyHighlights({
  highlights,
  initialVisibleCount = 2,
}: CareerJourneyHighlightsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();

  if (highlights.length === 0) {
    return null;
  }

  const initialHighlights = highlights.slice(0, initialVisibleCount);
  const extraHighlights = highlights.slice(initialVisibleCount);
  const hasMore = extraHighlights.length > 0;

  return (
    <div className="mt-4">
      <ul className="grid gap-2 text-xs leading-5 text-foreground sm:grid-cols-2">
        {initialHighlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <BulletDotIcon className="mt-1.5 size-1.5 shrink-0 text-foreground" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <>
          <div
            id={panelId}
            aria-hidden={!isExpanded}
            className={cn(
              "grid transition-[grid-template-rows,opacity,visibility] duration-250 ease-in-out motion-reduce:transition-none",
              isExpanded
                ? "visible grid-rows-[1fr] opacity-100"
                : "invisible grid-rows-[0fr] opacity-0",
            )}
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.propertyName === "grid-template-rows"
              ) {
                void refreshScrollTrigger();
              }
            }}
          >
            <div className="min-h-0 overflow-hidden">
              <ul className="mt-2 grid gap-2 text-xs leading-5 text-foreground sm:grid-cols-2">
                {extraHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <BulletDotIcon className="mt-1.5 size-1.5 shrink-0 text-foreground" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsExpanded((prev) => !prev);
              if (
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ) {
                requestAnimationFrame(() => {
                  void refreshScrollTrigger();
                });
              }
            }}
            className="group mt-3.5 inline-flex cursor-pointer touch-manipulation items-center gap-1.5 text-xs font-medium text-muted underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-foreground hover:decoration-foreground active:text-foreground active:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            aria-expanded={isExpanded}
            aria-controls={panelId}
          >
            <span>
              {isExpanded
                ? "Show fewer details"
                : `More engineering details (+${extraHighlights.length})`}
            </span>
            <ArrowDownIcon
              className={cn(
                "size-3 shrink-0 text-foreground transition-transform duration-250 ease-in-out [@media(hover:hover)]:group-hover:translate-y-0.5 group-active:!translate-y-1 motion-reduce:transform-none",
                isExpanded &&
                  "rotate-180 [@media(hover:hover)]:group-hover:-translate-y-0.5 group-active:!-translate-y-1",
              )}
            />
          </button>
        </>
      ) : null}
    </div>
  );
}
