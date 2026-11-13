"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { ArrowRightIcon } from "@/components/primitives";
import type { Testimonial } from "@/content/types";
import { cn } from "@/lib/cn";

import { getInitials } from "./getInitials";
import { TestimonialModal } from "./TestimonialModal";

/** Auto-scroll speed in px per second. */
const SPEED = 36;
/** Idle time after manual interaction before auto-scroll resumes. */
const RESUME_DELAY_MS = 2500;
/** Pointer travel (px) before a press counts as a drag, not a click. */
const DRAG_THRESHOLD = 6;
/** Card + gap width used to decide how many copies fill wide screens. */
const APPROX_CARD_WIDTH = 480;

type TestimonialsMarqueeProps = {
  items: Testimonial[];
};

type CardProps = {
  item: Testimonial;
  decorative: boolean;
  onOpen: (item: Testimonial) => void;
  shouldSuppressClick: () => boolean;
};

const TestimonialCard = memo(function TestimonialCard({
  item,
  decorative,
  onOpen,
  shouldSuppressClick,
}: CardProps) {
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const node = quoteRef.current;
    if (!node) return;

    const measure = () =>
      setTruncated(node.scrollHeight > node.clientHeight + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, [item.quote]);

  const handleOpen = () => {
    if (shouldSuppressClick()) {
      setIsPressed(false);
      return;
    }
    // Brief visual press response so touch/mobile gets immediate tactile feedback
    setIsPressed(true);
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      setIsPressed(false);
      onOpen(item);
    }, 90);
  };

  return (
    <div
      aria-hidden={decorative || undefined}
      className="group relative flex w-[330px] shrink-0 sm:w-[420px] md:w-[460px]"
    >
      {/* Card-wide hit area. Only pressing the card itself (this overlay) triggers the card's
          active state; the inner "Read full feedback" button sits above it, so pressing that
          activates only the button. Hover is read from the wrapper (`group`), so the card stays
          highlighted while the cursor is anywhere inside it, including over that button. */}
      <button
        type="button"
        tabIndex={decorative ? -1 : 0}
        aria-haspopup="dialog"
        aria-label={`Read feedback from ${item.name}`}
        onClick={handleOpen}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => {
          if (!pressTimerRef.current) setIsPressed(false);
        }}
        onPointerCancel={() => setIsPressed(false)}
        className="peer absolute inset-0 z-0 cursor-grab active:cursor-grabbing rounded-2xl touch-manipulation"
      />
      <div
        className={cn(
          "pointer-events-none relative flex w-full select-none flex-col justify-between rounded-2xl border bg-surface p-4 shadow-xs transition-all duration-150 sm:p-5",
          "group-hover:border-foreground/25 group-hover:shadow-md",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground",
          isPressed
            ? "scale-[0.985] border-foreground/45 bg-accent/60 shadow-inner"
            : "border-border peer-active:scale-[0.985] peer-active:border-foreground/45 peer-active:bg-accent/60",
        )}
      >
        <div>
          <svg
            className="mb-1.5 size-3.5 text-muted/30 sm:size-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
          <p
            ref={quoteRef}
            className="line-clamp-4 text-sm leading-6 text-foreground/90 sm:text-[15px] sm:leading-6"
          >
            {item.quote}
          </p>
          <button
            type="button"
            tabIndex={decorative || !truncated ? -1 : 0}
            aria-haspopup="dialog"
            aria-label={`Read full feedback from ${item.name}`}
            onClick={handleOpen}
            className={`group/read pointer-events-auto relative -ml-1 mt-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-muted transition-colors hover:text-foreground active:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground ${truncated ? "" : "invisible"
              }`}
          >
            Read full feedback
            <ArrowRightIcon className="size-3 transition-transform duration-150 group-hover/read:translate-x-0.5 group-active/read:translate-x-1.5" />
          </button>
        </div>

        <div className="mt-2.5 flex items-center gap-3 border-t border-border/60 pt-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-accent text-[11px] font-semibold text-foreground">
            {getInitials(item.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">
              {item.name}
            </p>
            {item.title || item.company ? (
              <p className="flex items-center truncate text-xs text-muted">
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
      </div>
    </div>
  );
});

export function TestimonialsMarquee({ items }: TestimonialsMarqueeProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Testimonial | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Marquee only when the real cards overflow the viewport. Otherwise a
  // static centered row, so a card never appears twice on screen.
  const [overflows, setOverflows] = useState(items.length >= 4);
  useLayoutEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const cardWidth = w >= 768 ? 460 : w >= 640 ? 420 : 330;
      // Static row lives inside the page container (max-w-5xl + padding).
      const padding = w >= 1024 ? 64 : w >= 640 ? 48 : 32;
      const available = Math.min(w, 1024) - padding;
      const needed = items.length * cardWidth + (items.length - 1) * 16;
      setOverflows(needed > available);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [items.length]);
  const looping = items.length >= 2 && overflows;
  const copies = looping
    ? Math.max(3, Math.ceil(2400 / (items.length * APPROX_CARD_WIDTH)) + 2)
    : 1;

  const modalOpenRef = useRef(false);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const inViewRef = useRef(true);
  const pausedUntilRef = useRef(0);
  const groupWidthRef = useRef(0);
  const posRef = useRef(0);
  const lastSetRef = useRef(0);
  const dragRef = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });
  const suppressClickRef = useRef(false);

  const open = useCallback((item: Testimonial) => {
    modalOpenRef.current = true;
    setActive(item);
  }, []);

  const close = useCallback(() => {
    modalOpenRef.current = false;
    focusRef.current = false;
    hoverRef.current = false;
    pausedUntilRef.current = performance.now() + RESUME_DELAY_MS;
    setActive(null);
  }, []);

  const shouldSuppressClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return true;
    }
    return false;
  }, []);

  const pause = useCallback(() => {
    pausedUntilRef.current = performance.now() + RESUME_DELAY_MS;
  }, []);

  const isBetweenCardLines = useCallback((clientY: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return false;
    const card = scroller.querySelector(".group");
    if (!card) return false;
    const rect = card.getBoundingClientRect();
    // Strictly between the top border and bottom border of the cards (including gaps between cards)
    return clientY >= rect.top - 2 && clientY <= rect.bottom + 2;
  }, []);

  const updateActiveDot = useCallback(
    (left: number) => {
      const g = groupWidthRef.current;
      if (g <= 0 || items.length === 0) return;
      const scroller = scrollerRef.current;
      const viewportOffset = scroller ? scroller.clientWidth * 0.25 : 100;
      const cardPitch = g / items.length;
      const normalized = (((left + viewportOffset) % g) + g) % g;
      const index = Math.floor(normalized / cardPitch) % items.length;
      setActiveIndex((prev) => (prev !== index ? index : prev));
    },
    [items.length],
  );

  const scrollToItem = useCallback(
    (targetIndex: number) => {
      const scroller = scrollerRef.current;
      const g = groupWidthRef.current;
      if (!scroller || items.length === 0) return;

      pause();

      if (!looping || g <= 0) {
        const children = scroller.firstElementChild?.children;
        const targetEl = children?.[targetIndex] as HTMLElement | undefined;
        if (targetEl) {
          const targetLeft =
            targetEl.offsetLeft -
            (scroller.clientWidth - targetEl.clientWidth) / 2;
          scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
        }
        setActiveIndex(targetIndex);
        return;
      }

      const cardPitch = g / items.length;
      const currentLeft = scroller.scrollLeft;
      const currentBase = Math.floor(currentLeft / g) * g;
      let target = currentBase + targetIndex * cardPitch;

      if (target - currentLeft > g / 2) {
        target -= g;
      } else if (currentLeft - target > g / 2) {
        target += g;
      }

      scroller.scrollTo({ left: target, behavior: "smooth" });
      posRef.current = target;
      lastSetRef.current = target;
      setActiveIndex(targetIndex);
    },
    [items.length, looping, pause],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    const group = groupRef.current;
    if (!looping || !scroller || !group) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function measure() {
      const rect = group!.getBoundingClientRect();
      const width = rect.width;
      if (width <= 0) return;
      const prevWidth = groupWidthRef.current;
      groupWidthRef.current = width;

      if (prevWidth === 0) {
        scroller!.scrollLeft = width;
        posRef.current = width;
        lastSetRef.current = width;
        updateActiveDot(width);
      } else if (Math.abs(prevWidth - width) > 1) {
        const ratio = width / prevWidth;
        const newLeft = width + ((scroller!.scrollLeft % prevWidth) * ratio);
        scroller!.scrollLeft = newLeft;
        posRef.current = newLeft;
        lastSetRef.current = newLeft;
        updateActiveDot(newLeft);
      }
    }

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(group);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    intersection.observe(scroller);

    function onScroll() {
      if (Math.abs(scroller!.scrollLeft - lastSetRef.current) > 1.5) {
        pausedUntilRef.current = performance.now() + RESUME_DELAY_MS;
        posRef.current = scroller!.scrollLeft;
        lastSetRef.current = scroller!.scrollLeft;
      }

      const g = groupWidthRef.current;
      if (g > 0) {
        let left = scroller!.scrollLeft;
        if (left >= g * 2) {
          left -= g;
          scroller!.scrollLeft = left;
          posRef.current = left;
          lastSetRef.current = left;
        } else if (left < g) {
          left += g;
          scroller!.scrollLeft = left;
          posRef.current = left;
          lastSetRef.current = left;
        }
      }

      updateActiveDot(scroller!.scrollLeft);
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });

    let frame = 0;
    let last = performance.now();
    let tickCount = 0;

    function tick(now: number) {
      const delta = Math.min(now - last, 64);
      last = now;

      const isKeyboardFocused =
        focusRef.current &&
        Boolean(document.activeElement?.matches(":focus-visible"));

      const blocked =
        reducedMotion.matches ||
        document.hidden ||
        !inViewRef.current ||
        modalOpenRef.current ||
        hoverRef.current ||
        isKeyboardFocused ||
        dragRef.current.down ||
        now < pausedUntilRef.current;

      if (blocked) {
        posRef.current = scroller!.scrollLeft;
      } else {
        const g = groupWidthRef.current;
        posRef.current += (SPEED * delta) / 1000;

        // Wrap in memory before assigning to DOM to guarantee seamless infinite continuity
        if (g > 0) {
          if (posRef.current >= g * 2) {
            posRef.current -= g;
          } else if (posRef.current < g) {
            posRef.current += g;
          }
        }

        lastSetRef.current = posRef.current;
        scroller!.scrollLeft = posRef.current;

        // Update dot periodically during RAF to keep it in sync with smooth auto-scroll
        tickCount++;
        if (tickCount % 6 === 0) {
          updateActiveDot(posRef.current);
        }
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [looping, items.length, updateActiveDot]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    // Only drag when clicked between the top and bottom lines of the cards row
    if (!isBetweenCardLines(event.clientY)) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragRef.current = {
      down: true,
      moved: false,
      startX: event.clientX,
      startLeft: scroller.scrollLeft,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    // Pause hover when cursor is strictly in the horizontal band between the card top/bottom lines (cards + gaps)
    if (event.pointerType === "mouse") {
      const isInsideBand = isBetweenCardLines(event.clientY);
      if (isInsideBand !== hoverRef.current) {
        hoverRef.current = isInsideBand;
        if (!isInsideBand) {
          pause();
        }
      }
    }

    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag.down || !scroller) return;

    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      drag.moved = true;
      scroller.setPointerCapture(event.pointerId);
    }
    if (drag.moved) {
      scroller.scrollLeft = drag.startLeft - dx;
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag.down) return;
    if (drag.moved) {
      suppressClickRef.current = true;
      // Clear the flag if no click follows (release outside a card).
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      scrollerRef.current?.releasePointerCapture?.(event.pointerId);
    }
    dragRef.current = { ...drag, down: false, moved: false };
    pause();
  }

  // If there are more than 6 items, render a smart windowed slice of 5 dots so it never clutters
  const visibleDotIndices = useMemo(() => {
    const count = items.length;
    if (count <= 6) return Array.from({ length: count }, (_, i) => i);
    // Center a window of 5 dots around the activeIndex
    const start = (activeIndex - 2 + count) % count;
    return [0, 1, 2, 3, 4].map((offset) => (start + offset) % count);
  }, [items.length, activeIndex]);

  return (
    <>
      <div className="relative mt-8">
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Feedback from collaborators"
          onPointerDown={looping ? onPointerDown : undefined}
          onPointerMove={looping ? onPointerMove : undefined}
          onPointerUp={looping ? endDrag : undefined}
          onPointerCancel={looping ? endDrag : undefined}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              hoverRef.current = isBetweenCardLines(event.clientY);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") {
              hoverRef.current = false;
              if (!document.activeElement?.matches(":focus-visible")) {
                focusRef.current = false;
              }
              pause();
            }
          }}
          onFocusCapture={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.matches(":focus-visible")
            ) {
              focusRef.current = true;
            }
          }}
          onBlurCapture={() => {
            focusRef.current = false;
            pause();
          }}
          onWheel={pause}
          onTouchStart={() => {
            pausedUntilRef.current = Number.POSITIVE_INFINITY;
          }}
          onTouchEnd={pause}
          onTouchCancel={pause}
          className={`flex overflow-x-auto overscroll-x-contain py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${looping ? "" : "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8"
            }`}
        >
          {looping ? (
            Array.from({ length: copies }, (_, groupIndex) => (
              <div
                key={groupIndex}
                ref={groupIndex === 0 ? groupRef : undefined}
                className="flex shrink-0 gap-4 pr-4"
              >
                {items.map((item) => (
                  <TestimonialCard
                    key={`g${groupIndex}-${item.id}`}
                    item={item}
                    decorative={groupIndex !== 1}
                    onOpen={open}
                    shouldSuppressClick={shouldSuppressClick}
                  />
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-wrap justify-start gap-4">
              {items.map((item) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  decorative={false}
                  onOpen={open}
                  shouldSuppressClick={shouldSuppressClick}
                />
              ))}
            </div>
          )}
        </div>

        {looping ? (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent sm:w-24"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent sm:w-24"
            />
          </>
        ) : null}
      </div>

      {/* Carousel dots pagination & contextual hint */}
      <div className="mt-5 flex flex-col items-center gap-3">
        {looping ? (
          <div
            className="flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Feedback navigation"
          >
            {visibleDotIndices.map((i) => {
              const item = items[i];
              if (!item) return null;
              const isSelected = activeIndex === i;
              return (
                <button
                  key={`${item.id}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Go to feedback from ${item.name} (${i + 1} of ${items.length})`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToItem(i);
                  }}
                  className={`cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${isSelected
                      ? "h-1.5 w-5 bg-foreground/75"
                      : "size-1.5 bg-border hover:bg-muted/50"
                    }`}
                />
              );
            })}
          </div>
        ) : null}

        {looping ? (
          <p className="text-center text-xs text-muted">
            Hover to pause · drag or swipe to browse · click a card to read it in full
          </p>
        ) : null}
      </div>

      {active ? <TestimonialModal item={active} onClose={close} /> : null}
    </>
  );
}
