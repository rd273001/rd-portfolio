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

function showStaticJourney(progress: HTMLElement, steps: HTMLElement[]) {
  try {
    gsap.set(progress, { clearProps: "transform" });
    gsap.set(steps, { clearProps: "opacity,visibility,transform" });
  } catch {
    progress.style.transform = "";
    for (const step of steps) {
      step.style.opacity = "";
      step.style.visibility = "";
      step.style.transform = "";
    }
  }
}

function createJourneyTimeline({
  list,
  progress,
  steps,
  start,
  end,
  scrub,
  stepY,
}: {
  list: HTMLElement;
  progress: HTMLElement;
  steps: HTMLElement[];
  start: string;
  end: string;
  scrub: number;
  stepY: number;
}) {
  gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });

  const duration = Math.max(steps.length, 1);
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: list,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
    },
  });

  timeline.to(
    progress,
    {
      scaleY: 1,
      duration,
      ease: "none",
    },
    0,
  );

  steps.forEach((step, index) => {
    timeline.fromTo(
      step,
      { autoAlpha: 0.4, y: stepY },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "none",
      },
      index,
    );
  });

  return timeline;
}

function CareerJourneyMotionInner({ children }: CareerJourneyMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || !motionPluginsReady) {
        return;
      }

      const intro = section.querySelector<HTMLElement>("[data-journey-intro]");
      const list = section.querySelector<HTMLElement>("[data-journey-list]");
      const progress = section.querySelector<HTMLElement>(
        "[data-journey-progress]",
      );
      const steps = gsap.utils.toArray<HTMLElement>(
        "[data-journey-step]",
        section,
      );

      if (!intro || !list || !progress || steps.length === 0) {
        return;
      }

      const showStatic = () => showStaticJourney(progress, steps);

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
                start: "top 82%",
                end: "bottom 22%",
                scrub: 0.35,
                stepY: 16,
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
              const headerOffset = 96;
              const bottomGap = () =>
                Number.parseFloat(getComputedStyle(section).paddingBottom) ||
                80;
              const stickyDistance = () =>
                Math.max(list.offsetHeight - intro.offsetHeight, 0);

              if (stickyDistance() > 0) {
                const work = document.getElementById("work");

                if (work) {
                  try {
                    ScrollTrigger.create({
                      id: "career-journey-pin",
                      trigger: intro,
                      start: `top top+=${headerOffset}`,
                      endTrigger: work,
                      end: () =>
                        `top top+=${headerOffset + intro.offsetHeight + bottomGap()}`,
                      pin: true,
                      pinSpacing: false,
                      anticipatePin: 1,
                      invalidateOnRefresh: true,
                    });
                  } catch {
                    // Pin is optional; keep the scroll timeline.
                  }
                }
              }

              createJourneyTimeline({
                list,
                progress,
                steps,
                start: "top 72%",
                end: "bottom 48%",
                scrub: 0.5,
                stepY: 32,
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