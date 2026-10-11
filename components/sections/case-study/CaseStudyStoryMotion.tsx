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

function clearDesktopStoryPhoneSize(stage: HTMLElement | null | undefined) {
  const visual = stage?.querySelector<HTMLElement>("[data-case-story-visual]");
  if (!visual) {
    return;
  }

  visual.style.removeProperty("width");
  visual.style.removeProperty("height");
  visual.style.removeProperty("max-width");
}

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
  stage?.setAttribute("data-story-ready", "true");
  clearDesktopStoryPhoneSize(stage);
  chaptersEl?.style.removeProperty("box-sizing");
  chaptersEl?.style.removeProperty("max-height");
  chaptersEl?.style.removeProperty("padding-bottom");
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
  const current = steps.findIndex(
    (step) => step.getAttribute("data-active") === "true",
  );
  if (current === index) {
    return;
  }

  steps.forEach((step, stepIndex) => {
    const isActive = stepIndex === index;
    step.setAttribute("data-active", isActive ? "true" : "false");
    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });
}

function activeChapterFromTimes(times: number[], time: number) {
  let index = 0;
  const switchAt = CHAPTER_FADE * 0.5;

  for (let i = 1; i < times.length; i += 1) {
    if (time >= (times[i] ?? 0) + switchAt) {
      index = i;
    }
  }

  return index;
}

/**
 * Extra translate only at the end of an overflowing beat. While scrolling,
 * content uses the full clip down to the bottom edge; this pad appears only
 * once the last line has scrolled into view.
 */
const CHAPTER_OVERFLOW_END_PAD = 12;
const CHAPTER_FADE = 0.28;

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

function marginBoxHeight(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);

  return (
    rect.height +
    (Number.parseFloat(styles.marginTop) || 0) +
    (Number.parseFloat(styles.marginBottom) || 0)
  );
}

type StoryPinMode = "desktop" | "mobile";

function chapterClipHeight(stage: HTMLElement, mode: StoryPinMode = "desktop") {
  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;
  const pinOffset = 12;
  // No permanent bottom floor — overflowing copy scrolls from the viewport
  // edge. End inset is CHAPTER_OVERFLOW_END_PAD on the translate only.

  if (mode === "mobile") {
    const visual = stage.querySelector<HTMLElement>("[data-case-story-visual]");
    const progressTrack = stage.querySelector<HTMLElement>(
      "[data-case-story-progress-track]",
    );
    const skip = stage.querySelector<HTMLElement>("[data-case-story-skip]");
    const layout = stage.querySelector<HTMLElement>("[data-case-story-layout]");
    const phoneHeight = visual?.getBoundingClientRect().height ?? 0;
    const trackBlock = progressTrack ? marginBoxHeight(progressTrack) : 0;
    const skipBlock = skip ? marginBoxHeight(skip) : 0;
    const layoutGap = layout
      ? Number.parseFloat(getComputedStyle(layout).rowGap) || 0
      : 0;
    const bottomSafe = 16;
    const available =
      window.innerHeight -
      headerHeight -
      pinOffset -
      phoneHeight -
      trackBlock -
      skipBlock -
      layoutGap -
      bottomSafe;

    return Math.max(140, Math.round(available));
  }

  const stepsEl = stage.querySelector<HTMLElement>("[data-case-story-steps]");
  const progressTrack = stage.querySelector<HTMLElement>(
    "[data-case-story-progress-track]",
  );
  const stepsHeight = stepsEl ? stepsEl.getBoundingClientRect().height : 0;
  const trackBlock = progressTrack ? marginBoxHeight(progressTrack) : 0;
  const available = window.innerHeight - headerHeight - pinOffset;

  return Math.max(200, Math.round(available - stepsHeight - trackBlock));
}

/** Match `phoneFrontLayout` stack aspect (9 / 19.5). */
const STORY_PHONE_ASPECT = 9 / 19.5;
const DESKTOP_PHONE_BOTTOM_SAFE = 20;
const DESKTOP_PHONE_MIN_WIDTH = 208;
/** Hard cap so ultra-tall / fullscreen desktops do not grow a giant phone. */
const DESKTOP_PHONE_MAX_HEIGHT = 560;
const DESKTOP_PHONE_MAX_WIDTH = Math.round(
  DESKTOP_PHONE_MAX_HEIGHT * STORY_PHONE_ASPECT,
);

/**
 * Size the frame from pin height, with a hard max so tall screens stay product-scale.
 */
function sizeDesktopStoryPhone(stage: HTMLElement, availableForChapters: number) {
  const visual = stage.querySelector<HTMLElement>("[data-case-story-visual]");
  const layout = stage.querySelector<HTMLElement>("[data-case-story-layout]");
  if (!visual) {
    return;
  }

  const targetHeight = Math.min(
    DESKTOP_PHONE_MAX_HEIGHT,
    Math.max(220, availableForChapters - DESKTOP_PHONE_BOTTOM_SAFE),
  );
  const layoutWidth = layout?.getBoundingClientRect().width || window.innerWidth;
  const maxFromLayout = layoutWidth * 0.3;
  const width = Math.round(
    Math.min(
      DESKTOP_PHONE_MAX_WIDTH,
      maxFromLayout,
      Math.max(DESKTOP_PHONE_MIN_WIDTH, targetHeight * STORY_PHONE_ASPECT),
    ),
  );
  const height = Math.round(width / STORY_PHONE_ASPECT);

  visual.style.width = `${width}px`;
  visual.style.height = `${height}px`;
  visual.style.maxWidth = "100%";
}

function overflowForChapter(chapter: HTMLElement, clipHeight: number) {
  const height = Math.max(
    chapter.getBoundingClientRect().height,
    chapter.scrollHeight,
  );
  const scrollPast = height - clipHeight;
  if (scrollPast <= 0) {
    return 0;
  }

  return scrollPast + CHAPTER_OVERFLOW_END_PAD;
}

/**
 * Metrics fully inside the pin clip at y=0 fade in with the beat.
 * Metrics that start below (or clipped by) the floor stay hidden until
 * the overflow scroll reveals them — so they do not sit solid under the cut.
 */
function partitionChapterMetrics(
  chapter: HTMLElement,
  metrics: HTMLElement[],
  clipHeight: number,
) {
  const chapterTop = chapter.getBoundingClientRect().top;
  const visible: HTMLElement[] = [];
  const deferred: HTMLElement[] = [];

  for (const metric of metrics) {
    const bottom = metric.getBoundingClientRect().bottom - chapterTop;
    if (bottom <= clipHeight + 2) {
      visible.push(metric);
    } else {
      deferred.push(metric);
    }
  }

  return { visible, deferred };
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
  unbindSkip?: () => void;
  unbindSteps?: () => void;
  overflowTotal: number;
};

function mountDesktopStory(
  root: HTMLElement,
  mode: StoryPinMode = "desktop",
): DesktopStoryInstance | null {
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
  stage.removeAttribute("data-story-ready");
  stage.setAttribute("data-motion", mode === "mobile" ? "story-pin" : "story");

  const availableForChapters = chapterClipHeight(stage, mode);
  const chaptersEl = stage.querySelector<HTMLElement>(
    "[data-case-story-chapters]",
  );
  const chapterOverflows = chapters.map((chapter) =>
    overflowForChapter(chapter, availableForChapters),
  );
  const beat = 1;
  const firstBeat = 0.48;
  const screenFade = 0.32;
  const screenHold = 0.58;
  const fade = CHAPTER_FADE;
  const overflowDurations = chapterOverflows.map((overflow) =>
    overflowDurationForBeat(overflow, availableForChapters, beat),
  );
  const scrollPerTimelineUnit = window.innerHeight * 0.85;

  if (chaptersEl) {
    chaptersEl.style.maxHeight = `${availableForChapters}px`;
    chaptersEl.style.overflow = "hidden";
  }

  if (mode === "desktop") {
    sizeDesktopStoryPhone(stage, availableForChapters);
  } else {
    clearDesktopStoryPhoneSize(stage);
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
    gsap.set(
      screens,
      mode === "mobile" ? { opacity: 0, yPercent: 100 } : { opacity: 0 },
    );
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

  const addOverflowBeat = (
    chapter: HTMLElement,
    index: number,
    deferredMetrics: HTMLElement[] = [],
  ) => {
    const overflow = chapterOverflows[index] ?? 0;
    const overflowDuration = overflowDurations[index] ?? 0;
    if (overflow <= 0 || overflowDuration <= 0) {
      return;
    }

    const overflowAt = timeline.duration();
    timeline.to(
      chapter,
      { y: -overflow, duration: overflowDuration, ease: "none" },
      ">",
    );

    if (deferredMetrics.length === 0) {
      return;
    }

    const chapterTop = chapter.getBoundingClientRect().top;
    deferredMetrics.forEach((metric, metricIndex) => {
      const relativeTop = metric.getBoundingClientRect().top - chapterTop;
      // When the card's top crosses into the clip during the translate.
      const startProgress = Math.max(
        0,
        Math.min(1, (relativeTop - availableForChapters) / overflow),
      );
      const fadeDuration = Math.min(0.4, Math.max(0.22, overflowDuration * 0.35));
      const fadeAt = overflowAt + overflowDuration * startProgress;

      timeline.to(
        metric,
        {
          opacity: 1,
          y: 0,
          duration: fadeDuration,
          delay: metricIndex * 0.06,
        },
        fadeAt,
      );
    });
  };

  let visibleScreen = -1;
  const crossfadeTo = (index: number, position: string) => {
    if (index < 0 || index >= screens.length || index === visibleScreen) {
      return;
    }

    if (mode === "mobile") {
      const leaving = visibleScreen;
      screens.forEach((screen, screenIndex) => {
        if (screenIndex === index) {
          timeline.fromTo(
            screen,
            { yPercent: 100, opacity: 1 },
            {
              yPercent: 0,
              opacity: 1,
              duration: screenFade,
              immediateRender: false,
            },
            position,
          );
          return;
        }

        if (screenIndex === leaving) {
          timeline.to(
            screen,
            { yPercent: -100, opacity: 1, duration: screenFade },
            position,
          );
          return;
        }

        timeline.set(screen, { yPercent: 100, opacity: 0 }, position);
      });
      visibleScreen = index;
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

  const chapterStartTimes: number[] = [];
  const chapterLandingTimes: number[] = [];

  chapters.forEach((chapter, index) => {
    const screenIndexesForChapter = parseScreenIndexes(chapter);

    if (index === 0) {
      chapterStartTimes[0] = 0;
      chapterLandingTimes[0] = 0;
      timeline.to({}, { duration: firstBeat });
      addOverflowBeat(chapter, index);
      return;
    }

    chapterStartTimes[index] = timeline.duration();

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

    const laterScreens: number[] = [];
    screenIndexesForChapter.forEach((screenIndex, screenOrder) => {
      if (screenIndex === visibleScreen) {
        return;
      }

      if (screenOrder === 0) {
        crossfadeTo(screenIndex, "<");
        return;
      }

      laterScreens.push(screenIndex);
    });

    const chapterMetrics = gsap.utils.toArray<HTMLElement>(
      "[data-case-story-metric]",
      chapter,
    );
    const { visible: enterMetrics, deferred: deferredMetrics } =
      partitionChapterMetrics(chapter, chapterMetrics, availableForChapters);

    if (enterMetrics.length > 0) {
      timeline.to(
        enterMetrics,
        { opacity: 1, y: 0, stagger: 0.16, duration: 0.4 },
        "<",
      );
    }

    // After copy, first screen, and metric cards are fully in — not mid-fade.
    chapterLandingTimes[index] = timeline.duration();

    laterScreens.forEach((screenIndex) => {
      timeline.to({}, { duration: screenHold });
      crossfadeTo(screenIndex, ">");
    });

    addOverflowBeat(chapter, index, deferredMetrics);
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
    // Mobile stays locked to scroll. A delayed scrub left the playhead mid-story,
    // so a tiny scroll back after the pin reopened on an earlier beat.
    scrub: mode === "mobile" ? true : 0.55,
    fastScrollEnd: mode === "mobile" ? true : undefined,
    invalidateOnRefresh: true,
    onLeave: () => {
      if (mode === "mobile") {
        timeline.progress(1);
      }
    },
    onLeaveBack: () => {
      if (mode === "mobile") {
        timeline.progress(0);
      }
    },
    onUpdate: () => {
      setActiveStep(steps, activeChapterFromTimes(chapterStartTimes, timeline.time()));
    },
  });

  const unbindSkip = bindStorySkip(stage, timeline);
  const unbindSteps =
    mode === "desktop"
      ? bindStoryChapterSteps(stage, timeline, chapterLandingTimes)
      : undefined;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh();
        stage.setAttribute("data-story-ready", "true");
      } catch {
        showStaticStory(root);
      }
    });
  });

  return {
    timeline,
    unbindRefresh: bindStoryRefresh(root, stage),
    unbindSkip,
    unbindSteps,
    overflowTotal: sumOverflow(chapterOverflows),
  };
}

function storyPinScrollTop(timeline: gsap.core.Timeline, time: number) {
  const trigger = ScrollTrigger.getById(CASE_STUDY_STORY_SCROLL_ID);
  if (!trigger) {
    return null;
  }

  const duration = timeline.totalDuration() || 1;
  const progress = Math.min(1, Math.max(0, time / duration));
  const range = Math.max(1, trigger.end - trigger.start);
  const target = trigger.start + progress * range;

  // Stay inside the pin. start-1 / end+1 releases it and the bar shifts.
  return Math.min(trigger.end - 2, Math.max(trigger.start + 1, target));
}

function finishStoryScrub() {
  const trigger = ScrollTrigger.getById(CASE_STUDY_STORY_SCROLL_ID);
  try {
    trigger?.getTween?.()?.progress(1);
  } catch {
    // Scrub tween may not exist yet.
  }
}

function bindStoryChapterSteps(
  stage: HTMLElement,
  timeline: gsap.core.Timeline,
  chapterLandingTimes: number[],
) {
  const steps = gsap.utils.toArray<HTMLButtonElement>(
    "[data-case-story-step]",
    stage,
  );
  const proxy = { y: window.scrollY };
  let tween: gsap.core.Tween | undefined;

  const onMouseDown = (event: Event) => {
    if (event instanceof MouseEvent && event.button === 0) {
      event.preventDefault();
    }
  };

  const onClick = (event: Event) => {
    const step = event.currentTarget;
    if (!(step instanceof HTMLButtonElement)) {
      return;
    }

    const index = Number(step.getAttribute("data-case-story-step-index"));
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= chapterLandingTimes.length
    ) {
      return;
    }

    const alignedTime = chapterLandingTimes[index] ?? 0;
    const top = storyPinScrollTop(timeline, alignedTime);
    if (top === null) {
      return;
    }

    tween?.kill();
    proxy.y = window.scrollY;
    const distance = Math.abs(top - proxy.y);
    if (distance < 2) {
      window.scrollTo(0, top);
      finishStoryScrub();
      setActiveStep(steps, index);
      return;
    }

    tween = gsap.to(proxy, {
      y: top,
      duration: gsap.utils.clamp(0.42, 0.85, distance / 2400),
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => {
        window.scrollTo(0, proxy.y);
      },
      onComplete: () => {
        window.scrollTo(0, top);
        finishStoryScrub();
        setActiveStep(steps, index);
      },
    });
  };

  steps.forEach((step) => {
    step.addEventListener("mousedown", onMouseDown);
    step.addEventListener("click", onClick);
  });

  return () => {
    tween?.kill();
    steps.forEach((step) => {
      step.removeEventListener("mousedown", onMouseDown);
      step.removeEventListener("click", onClick);
    });
  };
}

function bindStorySkip(stage: HTMLElement, timeline: gsap.core.Timeline) {
  const buttons = gsap.utils.toArray<HTMLButtonElement>(
    "[data-case-story-skip-dir]",
    stage,
  );
  const onClick = (event: Event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const trigger = ScrollTrigger.getById(CASE_STUDY_STORY_SCROLL_ID);
    if (!trigger) {
      return;
    }

    const dir = Number(button.getAttribute("data-case-story-skip-dir"));
    // Stay inside the pin. start-1 / end+1 releases it and the bar shifts
    // up against the header or down into the page.
    if (dir > 0) {
      timeline.progress(1);
      window.scrollTo({ top: Math.max(trigger.start, trigger.end - 2), behavior: "auto" });
      return;
    }

    timeline.progress(0);
    window.scrollTo({ top: trigger.start + 1, behavior: "auto" });
  };

  buttons.forEach((button) => button.addEventListener("click", onClick));

  return () => {
    buttons.forEach((button) => button.removeEventListener("click", onClick));
  };
}

function teardownDesktopStory(
  root: HTMLElement,
  instance: DesktopStoryInstance | null,
) {
  killCaseStudyStoryScroll();
  instance?.timeline.kill();
  instance?.unbindRefresh();
  instance?.unbindSkip?.();
  instance?.unbindSteps?.();
  showStaticStory(root);
}

function measureOverflowTotal(
  root: HTMLElement,
  mode: StoryPinMode = "desktop",
) {
  const stage = root.querySelector<HTMLElement>("[data-case-story-stage]");
  const chapters = gsap.utils.toArray<HTMLElement>(
    "[data-case-story-chapter]",
    root,
  );
  if (!stage || chapters.length < 2) {
    return 0;
  }

  stage.setAttribute("data-motion", mode === "mobile" ? "story-pin" : "story");
  const availableForChapters = chapterClipHeight(stage, mode);

  return sumOverflow(
    chapters.map((chapter) => overflowForChapter(chapter, availableForChapters)),
  );
}

function mountDesktopStoryWithRemount(
  root: HTMLElement,
  mode: StoryPinMode = "desktop",
) {
  let instance: DesktopStoryInstance | null = null;
  let disposed = false;
  let resizeTimer: number | undefined;
  let layoutFrame = 0;

  const remountIfNeeded = (force = false) => {
    if (disposed) {
      return;
    }

    const nextOverflow = measureOverflowTotal(root, mode);
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
      instance = mountDesktopStory(root, mode);
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

      if (!root) {
        return;
      }

      if (!motionPluginsReady) {
        root
          .querySelector<HTMLElement>("[data-case-story-stage]")
          ?.setAttribute("data-story-ready", "true");
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
          try {
            return mountDesktopStoryWithRemount(root, "mobile");
          } catch {
            showStaticStory(root);
            return () => {
              showStaticStory(root);
            };
          }
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
