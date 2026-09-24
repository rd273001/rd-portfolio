"use client";

import { Component, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  cards: HTMLElement[] = [],
) {
  try {
    gsap.set(progress, { clearProps: "transform" });
    gsap.set(revealTargets, { clearProps: "opacity,visibility,transform" });
    if (cards.length > 0) {
      gsap.set(cards, {
        "--journey-fade-stop": 100,
        "--journey-fade-end": 1,
        clearProps: "--journey-fade-stop,--journey-fade-end",
      });
    }
  } catch {
    progress.style.transform = "";
    for (const target of revealTargets) {
      target.style.opacity = "";
      target.style.visibility = "";
      target.style.transform = "";
    }
    for (const card of cards) {
      card.style.removeProperty("--journey-fade-stop");
      card.style.removeProperty("--journey-fade-end");
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
  revealOnStep = false,
  revealFromAlpha = 0.18,
  revealEase = "none",
  progressiveMask = false,
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
  revealOnStep?: boolean;
  revealFromAlpha?: number;
  revealEase?: string;
  progressiveMask?: boolean;
}) {
  const revealTargets = revealOnStep ? steps : getRevealTargets(steps);

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
      invalidateOnRefresh: true,
    },
  });

  for (const step of steps) {
    if (revealOnStep) {
      const timeline = gsap.timeline({
        defaults: { ease: revealEase, immediateRender: false },
        scrollTrigger: {
          trigger: step,
          start: revealStart,
          end: revealEnd,
          scrub,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        step,
        { autoAlpha: revealFromAlpha, y: stepY },
        { autoAlpha: 1, y: 0 },
        0,
      );

      if (progressiveMask) {
        const card = step.querySelector<HTMLElement>("[data-journey-card]");

        if (card) {
          timeline.fromTo(
            card,
            { "--journey-fade-stop": 42, "--journey-fade-end": 0.38 },
            {
              "--journey-fade-stop": 100,
              "--journey-fade-end": 1,
              autoRound: false,
            },
            0,
          );
        }
      }

      continue;
    }

    const card = step.querySelector<HTMLElement>("[data-journey-card]");
    const badge = step.querySelector<HTMLElement>("[data-journey-badge]");
    const trigger = card ?? step;
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
          trigger,
          start: revealStart,
          end: revealEnd,
          scrub,
          invalidateOnRefresh: true,
        },
      },
    );
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
      const cards = steps
        .map((step) => step.querySelector<HTMLElement>("[data-journey-card]"))
        .filter((card): card is HTMLElement => card !== null);
      const showStatic = () =>
        showStaticJourney(progress, [...steps, ...cardRevealTargets], cards);

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
                listEnd: "bottom 50%",
                revealStart: "top bottom",
                revealEnd: "center 54%",
                scrub: 0.5,
                stepY: 44,
                revealOnStep: true,
                revealFromAlpha: 0.18,
                revealEase: "power2.in",
                progressiveMask: true,
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
                listStart: "top 78%",
                listEnd: "bottom 42%",
                revealStart: "top 82%",
                revealEnd: "top 44%",
                scrub: 0.5,
                stepY: 72,
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
        const refreshId = window.requestAnimationFrame(refresh);
        window.addEventListener("load", refresh);

        return () => {
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
      id="journey"
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
      id="journey"
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
