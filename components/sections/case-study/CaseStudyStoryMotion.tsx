"use client";

import { Component, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Case-study ScrollTrigger only. Selectors stay on [data-case-story-*]
 * inside this section. Scroll progress moves the Zoom story: a blank
 * install, then the on-demand screen, then the release figures.
 * Homepage career journey ([data-journey-*]) and the Work WebGL loop are
 * different routes and different scopes — never ScrollTrigger.getAll().
 */
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

const sectionClassName = "scroll-mt-20 border-t border-border py-16 sm:py-20";
const storyTitleId = "case-study-story-title";

type CaseStudyStoryMotionProps = {
  children: ReactNode;
};

function showStaticStory(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>("[data-case-story-stage]");
  const animated = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-chapter], [data-case-story-metric], [data-case-story-visual] img, [data-case-story-progress]",
    root,
  );

  stage?.removeAttribute("data-motion");

  try {
    if (animated.length > 0) {
      gsap.set(animated, {
        clearProps: "opacity,visibility,transform,willChange,pointerEvents",
      });
    }
  } catch {
    stage?.removeAttribute("data-motion");
  }
}

function pinStart() {
  const header = document.querySelector("header");
  const height = header?.getBoundingClientRect().height ?? 64;
  return `top ${Math.round(height + 12)}px`;
}

function revealIndex(chapters: HTMLElement[]) {
  const index = chapters.findIndex((chapter) =>
    chapter.hasAttribute("data-case-story-reveal"),
  );
  return index === -1 ? 1 : index;
}

function setActiveStep(steps: HTMLElement[], index: number) {
  steps.forEach((step, stepIndex) => {
    step.setAttribute("data-active", stepIndex === index ? "true" : "false");
  });
}

function bindStoryRefresh(root: HTMLElement, stage: HTMLElement) {
  const refresh = () => {
    try {
      ScrollTrigger.refresh();
    } catch {
      showStaticStory(root);
    }
  };
  const refreshId = window.requestAnimationFrame(refresh);
  const images = stage.querySelectorAll("img");

  window.addEventListener("load", refresh);
  images.forEach((image) => {
    if (!image.complete) {
      image.addEventListener("load", refresh, { once: true });
    }
  });

  return () => {
    stage.removeAttribute("data-motion");
    window.cancelAnimationFrame(refreshId);
    window.removeEventListener("load", refresh);
    images.forEach((image) => image.removeEventListener("load", refresh));
  };
}

function mountDesktopStory(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>("[data-case-story-stage]");
  const chapters = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-chapter]",
    root,
  );
  const steps = gsap.utils.toArray<HTMLElement>("[data-case-story-step]", root);
  const screen = stage?.querySelector<HTMLElement>("[data-case-story-visual] img");
  const progress = stage?.querySelector<HTMLElement>("[data-case-story-progress]");
  const metrics = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-metric]",
    root,
  );

  if (!stage || chapters.length < 2) {
    return;
  }

  stage.setAttribute("data-motion", "story");

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;
  const available = window.innerHeight - headerHeight - 28;
  const layout = stage.querySelector<HTMLElement>("[data-case-story-layout]");
  const progressTrack = stage.querySelector<HTMLElement>(
    "[data-case-story-progress-track]",
  );
  const stepsHeight =
    steps.reduce(
      (max, step) => Math.max(max, step.getBoundingClientRect().height),
      0,
    ) + 12;
  const trackHeight = progressTrack?.getBoundingClientRect().height ?? 0;
  const pinnedContentHeight =
    (layout?.getBoundingClientRect().height ?? 0) +
    stepsHeight +
    trackHeight +
    24;

  // Measure the pinned column (overlaid chapters), not the full stacked stage.
  if (pinnedContentHeight > available) {
    stage.removeAttribute("data-motion");
    return;
  }

  gsap.set(chapters, {
    opacity: 0,
    visibility: "hidden",
    pointerEvents: "none",
  });
  gsap.set(chapters[0], {
    opacity: 1,
    visibility: "visible",
    pointerEvents: "auto",
  });
  if (screen) {
    gsap.set(screen, { opacity: 0 });
  }
  if (metrics.length > 0) {
    gsap.set(metrics, { opacity: 0, y: 18 });
  }
  if (progress) {
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
  }
  setActiveStep(steps, 0);

  const beat = 1;
  const fade = 0.28;
  const screenBeat = revealIndex(chapters);
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "case-study-story",
      trigger: stage,
      start: pinStart,
      end: () => `+=${Math.round(window.innerHeight * 0.85 * chapters.length)}`,
      pin: true,
      scrub: 0.55,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.min(
          chapters.length - 1,
          Math.floor(self.progress * chapters.length * 0.999),
        );
        setActiveStep(steps, index);
      },
    },
  });

  chapters.forEach((chapter, index) => {
    if (index === 0) {
      timeline.to({}, { duration: beat });
      return;
    }

    timeline.to(chapters[index - 1], {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
      duration: fade,
    });
    timeline.to(
      chapter,
      {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        duration: fade,
      },
      "<",
    );

    if (screen && index === screenBeat) {
      timeline.to(screen, { opacity: 1, duration: 0.45 }, "<");
    }

    if (index === chapters.length - 1 && metrics.length > 0) {
      timeline.to(
        metrics,
        { opacity: 1, y: 0, stagger: 0.16, duration: 0.4 },
        "-=0.05",
      );
    }

    timeline.to({}, { duration: beat });
  });

  if (progress) {
    timeline.fromTo(
      progress,
      { scaleX: 0 },
      { scaleX: 1, duration: timeline.duration(), ease: "none" },
      0,
    );
  }

  return bindStoryRefresh(root, stage);
}

function CaseStudyStoryMotionInner({ children }: CaseStudyStoryMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;

      if (!root || !motionPluginsReady) {
        return;
      }

      const chapters = gsap.utils.toArray<HTMLElement>(
        "[data-case-story-chapter]",
        root,
      );

      if (chapters.length === 0) {
        return;
      }

      try {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: reduce)", () => {
          showStaticStory(root);
        });

        media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
          try {
            return mountDesktopStory(root);
          } catch {
            showStaticStory(root);
          }
        });

        media.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
          showStaticStory(root);
        });

        return () => {
          try {
            media.revert();
          } catch {
            showStaticStory(root);
          }
        };
      } catch {
        showStaticStory(root);
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby={storyTitleId}
      className={sectionClassName}
    >
      {children}
    </section>
  );
}

class StoryMotionBoundary extends Component<
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

export function CaseStudyStoryMotion({ children }: CaseStudyStoryMotionProps) {
  const staticSection = (
    <section aria-labelledby={storyTitleId} className={sectionClassName}>
      {children}
    </section>
  );

  return (
    <StoryMotionBoundary fallback={staticSection}>
      <CaseStudyStoryMotionInner>{children}</CaseStudyStoryMotionInner>
    </StoryMotionBoundary>
  );
}
