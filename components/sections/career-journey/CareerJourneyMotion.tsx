"use client";

import { Component, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function isTouchViewport(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

let motionPluginsReady = false;

if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    motionPluginsReady = true;
  } catch {
    motionPluginsReady = false;
  }
}

type CareerJourneyMotionProps = {
  children: ReactNode;
};

function showStaticJourney(
  progress: HTMLElement,
  revealTargets: HTMLElement[],
) {
  try {
    gsap.set(progress, { scaleY: 1, clearProps: "transform" });
    gsap.set(revealTargets, {
      autoAlpha: 1,
      y: 0,
      clearProps: "opacity,visibility,transform,willChange",
    });
    for (const target of revealTargets) {
      if (target.hasAttribute("data-journey-badge")) {
        target.setAttribute("data-active", "true");
      }
    }
  } catch {
    progress.style.transform = "";
    for (const target of revealTargets) {
      target.style.opacity = "";
      target.style.visibility = "";
      target.style.transform = "";
      target.style.willChange = "";
      if (target.hasAttribute("data-journey-badge")) {
        target.setAttribute("data-active", "true");
      }
    }
  }
}

function getRevealTargets(steps: HTMLElement[]): HTMLElement[] {
  const targets: HTMLElement[] = [];

  for (const step of steps) {
    const card = step.querySelector<HTMLElement>("[data-journey-card]");
    const badge = step.querySelector<HTMLElement>("[data-journey-badge]");

    if (card) {
      targets.push(card);
    }
    if (badge) {
      targets.push(badge);
    }
  }

  return targets;
}

function createJourneyTimeline({
  list,
  progress,
  steps,
  listStart,
  listEnd,
  revealStart,
  revealEnd,
  scrub,
  stepY,
  revealFromAlpha = 0.2,
  revealEase = "power1.out",
}: {
  list: HTMLElement;
  progress: HTMLElement;
  steps: HTMLElement[];
  listStart: string;
  listEnd: string;
  revealStart: string;
  revealEnd: string;
  scrub: number;
  stepY: number;
  revealFromAlpha?: number;
  revealEase?: string;
}) {
  const revealTargets = getRevealTargets(steps);

  gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });
  gsap.set(revealTargets, { willChange: "transform, opacity" });

  gsap.to(progress, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: list,
      start: listStart,
      end: listEnd,
      scrub,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onLeave: () => {
        gsap.set(progress, { scaleY: 1 });
      },
      onLeaveBack: () => {
        gsap.set(progress, { scaleY: 0 });
      },
    },
  });

  for (const step of steps) {
    const card = step.querySelector<HTMLElement>("[data-journey-card]");
    const badge = step.querySelector<HTMLElement>("[data-journey-badge]");
    const targets = [card, badge].filter(
      (element): element is HTMLElement => element !== null,
    );

    if (targets.length === 0) {
      continue;
    }

    gsap.fromTo(
      targets,
      { autoAlpha: revealFromAlpha, y: stepY },
      {
        autoAlpha: 1,
        y: 0,
        ease: revealEase,
        immediateRender: false,
        scrollTrigger: {
          trigger: step,
          start: revealStart,
          end: revealEnd,
          scrub,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      },
    );

    if (badge) {
      ScrollTrigger.create({
        trigger: step,
        start: "top 66%",
        onEnter: () => badge.setAttribute("data-active", "true"),
        onLeaveBack: () => badge.removeAttribute("data-active"),
      });
    }
  }
}

function CareerJourneyMotionInner({ children }: CareerJourneyMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || !motionPluginsReady) {
        return;
      }

      const list = section.querySelector<HTMLElement>("[data-journey-list]");
      const progress = section.querySelector<HTMLElement>(
        "[data-journey-progress]",
      );
      const steps = gsap.utils.toArray<HTMLElement>(
        "[data-journey-step]",
        section,
      );

      if (!list || !progress || steps.length === 0) {
        return;
      }

      const cardRevealTargets = getRevealTargets(steps);
      const showStatic = () =>
        showStaticJourney(progress, [...steps, ...cardRevealTargets]);

      try {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: reduce)", () => {
          showStatic();
        });

        media.add(
          "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          () => {
            try {
              createJourneyTimeline({
                list,
                progress,
                steps,
                listStart: "top 88%",
                listEnd: "bottom 45%",
                revealStart: "top 78%",
                revealEnd: "top 54%",
                scrub: 0.4,
                stepY: 28,
                revealFromAlpha: 0.2,
                revealEase: "power1.out",
              });
            } catch {
              showStatic();
            }
          },
        );

        media.add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            try {
              createJourneyTimeline({
                list,
                progress,
                steps,
                listStart: "top 80%",
                listEnd: "bottom 45%",
                revealStart: "top 80%",
                revealEnd: "top 56%",
                scrub: 0.4,
                stepY: 36,
                revealFromAlpha: 0.2,
                revealEase: "power1.out",
              });
            } catch {
              showStatic();
            }
          },
        );

        const refresh = () => {
          try {
            ScrollTrigger.refresh();
          } catch {
            showStatic();
          }
        };

        const refreshId = window.requestAnimationFrame(() => {
          window.requestAnimationFrame(refresh);
        });
        window.addEventListener("load", refresh);

        let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let resizeTimer: number | undefined;
        const onResize = () => {
          const width = window.innerWidth;
          // Ignore height-only resizes on touch viewports (e.g. mobile Chrome URL bar auto-hide/show)
          if (isTouchViewport() && width === lastWidth) {
            return;
          }
          lastWidth = width;

          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(refresh, 150);
        };
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
        window.addEventListener("hashchange", refresh);

        document.fonts?.ready
          .then(() => {
            refresh();
          })
          .catch(() => {});

        return () => {
          window.clearTimeout(resizeTimer);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("orientationchange", onResize);
          window.removeEventListener("hashchange", refresh);
          window.cancelAnimationFrame(refreshId);
          window.removeEventListener("load", refresh);
          try {
            media.revert();
          } catch {
            showStatic();
          }
        };
      } catch {
        showStatic();
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="scroll-mt-20 border-t border-border py-16 sm:py-20"
    >
      {children}
    </section>
  );
}

class JourneyMotionBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function CareerJourneyMotion({ children }: CareerJourneyMotionProps) {
  const staticSection = (
    <section
      id="experience"
      className="scroll-mt-20 border-t border-border py-16 sm:py-20"
    >
      {children}
    </section>
  );

  return (
    <JourneyMotionBoundary fallback={staticSection}>
      <CareerJourneyMotionInner>{children}</CareerJourneyMotionInner>
    </JourneyMotionBoundary>
  );
}