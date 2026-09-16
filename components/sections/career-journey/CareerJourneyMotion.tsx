"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type CareerJourneyMotionProps = {
  children: ReactNode;
};

export function CareerJourneyMotion({
  children,
}: CareerJourneyMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) {
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

      const media = gsap.matchMedia();

      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          compact: "(max-width: 1023px)",
          desktop: "(min-width: 1024px)",
        },
        (context) => {
          const conditions = context.conditions as {
            reduceMotion?: boolean;
            compact?: boolean;
            desktop?: boolean;
          };

          if (conditions.reduceMotion) {
            gsap.set([progress, ...steps], { clearProps: "all" });
            return;
          }

          gsap.set(progress, {
            scaleY: 0,
            transformOrigin: "top center",
          });

          if (conditions.compact) {
            gsap.to(progress, {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: list,
                start: "top 82%",
                end: "bottom 42%",
                scrub: 0.35,
              },
            });

            steps.forEach((step) => {
              gsap.fromTo(
                step,
                { autoAlpha: 0, y: 24 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.55,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: step,
                    start: "top 88%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });

            return;
          }

          if (conditions.desktop) {
            const headerOffset = 96;
            const bottomGap = () =>
              Number.parseFloat(getComputedStyle(section).paddingBottom) || 80;
            const stickyDistance = () =>
              Math.max(list.offsetHeight - intro.offsetHeight, 0);

            if (stickyDistance() > 0) {
              const work = document.getElementById("work");

              if (work) {
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
              }
            }

            const duration = Math.max(steps.length, 1);
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: list,
                start: "top 72%",
                end: "bottom 48%",
                scrub: 0.5,
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
                { autoAlpha: 0.4, y: 32 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "none",
                },
                index,
              );
            });
          }
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="border-t border-border py-16 sm:py-20"
    >
      {children}
    </section>
  );
}