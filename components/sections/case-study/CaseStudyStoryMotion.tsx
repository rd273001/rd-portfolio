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
const CASE_STUDY_STORY_SCROLL_ID = "case-study-story";

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
  const chaptersEl = stage?.querySelector<HTMLElement>(
    "[data-case-story-chapters]",
  );
  const animated = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-chapter], [data-case-story-metric], [data-case-story-screen], [data-case-story-progress]",
    root,
  );

  killCaseStudyStoryScroll();
  stage?.removeAttribute("data-motion");
  chaptersEl?.style.removeProperty("max-height");
  chaptersEl?.style.removeProperty("overflow");

  try {
    if (animated.length > 0) {
      gsap.set(animated, {
        clearProps: "opacity,visibility,transform,willChange,pointerEvents",
      });
    }
    setStaticScreens(root);
  } catch {
    stage?.removeAttribute("data-motion");
  }
}

function killCaseStudyStoryScroll() {
  try {
    ScrollTrigger.getById(CASE_STUDY_STORY_SCROLL_ID)?.kill();
  } catch {
    // ScrollTrigger may be unavailable after teardown.
  }
}

function pinStart() {
  const header = document.querySelector("header");
  const height = header?.getBoundingClientRect().height ?? 64;
  return `top ${Math.round(height + 12)}px`;
}

function parseScreenIndexes(chapter: HTMLElement) {
  const raw = chapter.getAttribute("data-case-story-screens");
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((index) => Number.isFinite(index) && index >= 0);
}

function setStaticScreens(root: HTMLElement) {
  const screens = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-screen]",
    root,
  );

  screens.forEach((screen, index) => {
    screen.setAttribute(
      "data-active",
      index === screens.length - 1 ? "true" : "false",
    );
  });
}

function setActiveStep(steps: HTMLElement[], index: number) {
  steps.forEach((step, stepIndex) => {
    step.setAttribute("data-active", stepIndex === index ? "true" : "false");
  });
}

function activeChapterIndex(chapters: HTMLElement[]) {
  let index = 0;
  let bestOpacity = -1;

  chapters.forEach((chapter, chapterIndex) => {
    const opacity = Number(gsap.getProperty(chapter, "opacity")) || 0;
    if (opacity > bestOpacity) {
      bestOpacity = opacity;
      index = chapterIndex;
    }
  });

  return index;
}

function overflowDurationForBeat(
  overflow: number,
  availableForChapters: number,
  beat: number,
) {
  if (overflow <= 0) {
    return 0;
  }

  return Math.max(
    beat * 0.85,
    (overflow / availableForChapters) * beat * 1.35,
  );
}

function sumOverflow(chapterOverflows: number[]) {
  return chapterOverflows.reduce((sum, value) => sum + value, 0);
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
    window.cancelAnimationFrame(refreshId);
    window.removeEventListener("load", refresh);
    images.forEach((image) => image.removeEventListener("load", refresh));
  };
}

type DesktopStoryInstance = {
  timeline: gsap.core.Timeline;
  unbindRefresh: () => void;
  overflowTotal: number;
};

function mountDesktopStory(root: HTMLElement): DesktopStoryInstance | null {
  const stage = root.querySelector<HTMLElement>("[data-case-story-stage]");
  const chapters = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-chapter]",
    root,
  );
  const steps = gsap.utils.toArray<HTMLElement>("[data-case-story-step]", root);
  const screens = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-screen]",
    root,
  );
  const progress = stage?.querySelector<HTMLElement>("[data-case-story-progress]");
  if (!stage || chapters.length < 2) {
    return null;
  }

  killCaseStudyStoryScroll();
  stage.setAttribute("data-motion", "story");

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;
  const available = window.innerHeight - headerHeight - 28;
  const progressTrack = stage.querySelector<HTMLElement>(
    "[data-case-story-progress-track]",
  );
  const stepsHeight =
    steps.reduce(
      (max, step) => Math.max(max, step.getBoundingClientRect().height),
      0,
    ) + 12;
  const trackHeight = progressTrack?.getBoundingClientRect().height ?? 0;
  const stagePadding = 24;
  const availableForChapters = Math.max(
    200,
    available - stepsHeight - trackHeight - stagePadding,
  );
  const chaptersEl = stage.querySelector<HTMLElement>(
    "[data-case-story-chapters]",
  );
  const chapterOverflows = chapters.map((chapter) =>
    Math.max(0, chapter.getBoundingClientRect().height - availableForChapters),
  );
  const beat = 1;
  const firstBeat = 0.48;
  const screenFade = 0.32;
  const screenHold = 0.58;
  const fade = 0.28;
  const overflowDurations = chapterOverflows.map((overflow) =>
    overflowDurationForBeat(overflow, availableForChapters, beat),
  );
  const scrollPerTimelineUnit = window.innerHeight * 0.85;

  if (chaptersEl) {
    chaptersEl.style.maxHeight = `${Math.round(availableForChapters)}px`;
    chaptersEl.style.overflow = "hidden";
  }

  gsap.set(chapters, {
    opacity: 0,
    visibility: "hidden",
    pointerEvents: "none",
    y: 0,
  });
  gsap.set(chapters[0], {
    opacity: 1,
    visibility: "visible",
    pointerEvents: "auto",
  });
  if (screens.length > 0) {
    gsap.set(screens, { opacity: 0 });
    screens.forEach((screen) => {
      screen.setAttribute("data-active", "false");
    });
  }
  chapters.forEach((chapter) => {
    const chapterMetrics = gsap.utils.toArray<HTMLElement>(
      "[data-case-story-metric]",
      chapter,
    );
    if (chapterMetrics.length > 0) {
      gsap.set(chapterMetrics, { opacity: 0, y: 18 });
    }
  });
  if (progress) {
    gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
  }
  setActiveStep(steps, 0);

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    paused: true,
  });

  const addOverflowBeat = (chapter: HTMLElement, index: number) => {
    const overflow = chapterOverflows[index] ?? 0;
    const overflowDuration = overflowDurations[index] ?? 0;
    if (overflow > 0 && overflowDuration > 0) {
      timeline.to(
        chapter,
        { y: -overflow, duration: overflowDuration, ease: "none" },
        ">",
      );
    }
  };

  let visibleScreen = -1;
  const crossfadeTo = (index: number, position: string) => {
    if (index < 0 || index >= screens.length || index === visibleScreen) {
      return;
    }

    screens.forEach((screen, screenIndex) => {
      timeline.to(
        screen,
        { opacity: screenIndex === index ? 1 : 0, duration: screenFade },
        position,
      );
    });
    visibleScreen = index;
  };

  chapters.forEach((chapter, index) => {
    const screenIndexesForChapter = parseScreenIndexes(chapter);

    if (index === 0) {
      timeline.to({}, { duration: firstBeat });
      addOverflowBeat(chapter, index);
      return;
    }

    timeline.to(chapters[index - 1], {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
      y: 0,
      duration: fade,
    });
    timeline.to(
      chapter,
      {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        y: 0,
        duration: fade,
      },
      "<",
    );

    screenIndexesForChapter.forEach((screenIndex, screenOrder) => {
      if (screenIndex === visibleScreen) {
        return;
      }

      if (screenOrder === 0) {
        crossfadeTo(screenIndex, "<");
        return;
      }

      timeline.to({}, { duration: screenHold });
      crossfadeTo(screenIndex, ">");
    });

    const chapterMetrics = gsap.utils.toArray<HTMLElement>(
      "[data-case-story-metric]",
      chapter,
    );
    if (chapterMetrics.length > 0) {
      timeline.to(
        chapterMetrics,
        { opacity: 1, y: 0, stagger: 0.16, duration: 0.4 },
        "<",
      );
    }

    addOverflowBeat(chapter, index);
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

  ScrollTrigger.create({
    id: CASE_STUDY_STORY_SCROLL_ID,
    trigger: stage,
    animation: timeline,
    start: pinStart,
    end: () =>
      `+=${Math.max(1, Math.round(scrollPerTimelineUnit * timeline.duration()))}`,
    pin: true,
    scrub: 0.55,
    invalidateOnRefresh: true,
    onUpdate: () => {
      setActiveStep(steps, activeChapterIndex(chapters));
    },
  });

  return {
    timeline,
    unbindRefresh: bindStoryRefresh(root, stage),
    overflowTotal: sumOverflow(chapterOverflows),
  };
}

function teardownDesktopStory(
  root: HTMLElement,
  instance: DesktopStoryInstance | null,
) {
  killCaseStudyStoryScroll();
  instance?.timeline.kill();
  instance?.unbindRefresh();
  showStaticStory(root);
}

function measureOverflowTotal(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>("[data-case-story-stage]");
  const chapters = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-chapter]",
    root,
  );
  if (!stage || chapters.length < 2) {
    return 0;
  }

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;
  const available = window.innerHeight - headerHeight - 28;
  const progressTrack = stage.querySelector<HTMLElement>(
    "[data-case-story-progress-track]",
  );
  const steps = gsap.utils.toArray<HTMLElement>("[data-case-story-step]", root);
  const stepsHeight =
    steps.reduce(
      (max, step) => Math.max(max, step.getBoundingClientRect().height),
      0,
    ) + 12;
  const trackHeight = progressTrack?.getBoundingClientRect().height ?? 0;
  const availableForChapters = Math.max(
    200,
    available - stepsHeight - trackHeight - 24,
  );

  return sumOverflow(
    chapters.map((chapter) =>
      Math.max(0, chapter.getBoundingClientRect().height - availableForChapters),
    ),
  );
}

function mountDesktopStoryWithRemount(root: HTMLElement) {
  let instance: DesktopStoryInstance | null = null;
  let disposed = false;
  let resizeTimer: number | undefined;
  let layoutFrame = 0;

  const remountIfNeeded = (force = false) => {
    if (disposed) {
      return;
    }

    const nextOverflow = measureOverflowTotal(root);
    const shouldRebuild =
      force ||
      !instance ||
      Math.abs(nextOverflow - (instance.overflowTotal ?? 0)) > 6;

    if (!shouldRebuild) {
      try {
        ScrollTrigger.refresh();
      } catch {
        showStaticStory(root);
      }
      return;
    }

    teardownDesktopStory(root, instance);
    try {
      instance = mountDesktopStory(root);
    } catch {
      instance = null;
      showStaticStory(root);
    }
  };

  remountIfNeeded(true);

  layoutFrame = window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      remountIfNeeded();
    });
  });

  document.fonts?.ready
    .then(() => {
      remountIfNeeded();
    })
    .catch(() => {
      // Font loading is optional; ignore failures.
    });

  const onResize = () => {
    if (disposed) {
      return;
    }
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      remountIfNeeded(true);
    }, 200);
  };

  window.addEventListener("resize", onResize);

  return () => {
    disposed = true;
    window.clearTimeout(resizeTimer);
    window.cancelAnimationFrame(layoutFrame);
    window.removeEventListener("resize", onResize);
    teardownDesktopStory(root, instance);
    instance = null;
  };
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
          return () => {
            showStaticStory(root);
          };
        });

        media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
          try {
            return mountDesktopStoryWithRemount(root);
          } catch {
            showStaticStory(root);
            return () => {
              showStaticStory(root);
            };
          }
        });

        media.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
          showStaticStory(root);
          return () => {
            showStaticStory(root);
          };
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
