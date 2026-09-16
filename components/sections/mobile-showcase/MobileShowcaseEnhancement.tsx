"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/primitives";
import {
  MobileProjectPhone,
  MobileShowcaseHeader,
  ProductPhonePlaceholder,
} from "./MobileShowcasePresentation";
import type { MobileShowcaseProject } from "./types";

const MobileShowcaseScene = dynamic(
  () =>
    import("./MobileShowcaseScene").then(
      (module) => module.MobileShowcaseScene,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

type ShowcaseState = {
  projectIndex: number;
  screenIndex: number;
};

type ShowcaseAction =
  | { type: "select-project"; projectIndex: number }
  | { type: "select-screen"; screenIndex: number };

type SceneCapabilities = {
  evaluated: boolean;
  motionAllowed: boolean;
  pointerFine: boolean;
  desktopLayout: boolean;
  webglSupported: boolean;
};

type SceneErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type SceneErrorBoundaryState = {
  failed: boolean;
};

function showcaseReducer(
  state: ShowcaseState,
  action: ShowcaseAction,
): ShowcaseState {
  switch (action.type) {
    case "select-project":
      return { projectIndex: action.projectIndex, screenIndex: 0 };
    case "select-screen":
      return { ...state, screenIndex: action.screenIndex };
  }
}

class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function detectWebGLSupport() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

    if (!gl) {
      return false;
    }

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

const SCROLL_QUIET_MS = 280;
const MOUNT_QUIET_MS = 220;

function useScrollQuiet() {
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    let timerId: number | undefined;

    const bump = () => {
      setQuiet(false);
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
      timerId = window.setTimeout(() => {
        setQuiet(true);
      }, SCROLL_QUIET_MS);
    };

    bump();
    window.addEventListener("scroll", bump, { passive: true });
    window.addEventListener("wheel", bump, { passive: true });

    return () => {
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
      window.removeEventListener("scroll", bump);
      window.removeEventListener("wheel", bump);
    };
  }, []);

  return quiet;
}

function useQuietIdle(enabled: boolean) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!enabled || isIdle) {
      return;
    }

    let cancelled = false;
    let quietTimerId: number | undefined;
    let idleId: number | undefined;
    let fallbackId: number | undefined;

    const clearScheduledMount = () => {
      if (quietTimerId !== undefined) {
        window.clearTimeout(quietTimerId);
        quietTimerId = undefined;
      }
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
        idleId = undefined;
      }
      if (fallbackId !== undefined) {
        window.clearTimeout(fallbackId);
        fallbackId = undefined;
      }
    };

    const mount = () => {
      if (!cancelled) {
        setIsIdle(true);
      }
    };

    const scheduleMountAfterQuietScroll = () => {
      clearScheduledMount();
      quietTimerId = window.setTimeout(() => {
        quietTimerId = undefined;
        if (cancelled) {
          return;
        }

        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(mount, { timeout: 1500 });
          return;
        }

        fallbackId = window.setTimeout(mount, 240);
      }, MOUNT_QUIET_MS);
    };

    const onScroll = () => {
      scheduleMountAfterQuietScroll();
    };

    scheduleMountAfterQuietScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });

    return () => {
      cancelled = true;
      clearScheduledMount();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
    };
  }, [enabled, isIdle]);

  return isIdle;
}

function getScreenLabel(screenshot: string) {
  const filename = screenshot.split("/").at(-1)?.replace(/\.[^.]+$/, "");

  if (!filename) {
    return "Screen";
  }

  return filename
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function MobileShowcaseEnhancement({
  projects,
}: {
  projects: MobileShowcaseProject[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(showcaseReducer, {
    projectIndex: 0,
    screenIndex: 0,
  });
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [sceneWarmed, setSceneWarmed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [capabilities, setCapabilities] = useState<SceneCapabilities>({
    evaluated: false,
    motionAllowed: false,
    pointerFine: false,
    desktopLayout: false,
    webglSupported: false,
  });

  useEffect(() => {
    const root = rootRef.current;

    if (!root || typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsNearViewport(true);
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport) {
      return;
    }

    void import("./MobileShowcaseScene");

    const glb = document.createElement("link");
    glb.rel = "prefetch";
    glb.as = "fetch";
    glb.href = "/models/android-phone.glb?v=back-metal-lip";
    glb.crossOrigin = "anonymous";
    document.head.appendChild(glb);

    const hdri = document.createElement("link");
    hdri.rel = "prefetch";
    hdri.as = "fetch";
    hdri.href = "/hdri/studio_small_08_1k.hdr";
    hdri.crossOrigin = "anonymous";
    document.head.appendChild(hdri);

    return () => {
      glb.remove();
      hdri.remove();
    };
  }, [isNearViewport]);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const webglSupported = detectWebGLSupport();

    const updateCapabilities = () => {
      setCapabilities({
        evaluated: true,
        motionAllowed: !motionQuery.matches,
        pointerFine: pointerQuery.matches,
        desktopLayout: desktopQuery.matches,
        webglSupported,
      });
    };

    updateCapabilities();
    motionQuery.addEventListener("change", updateCapabilities);
    pointerQuery.addEventListener("change", updateCapabilities);
    desktopQuery.addEventListener("change", updateCapabilities);

    return () => {
      motionQuery.removeEventListener("change", updateCapabilities);
      pointerQuery.removeEventListener("change", updateCapabilities);
      desktopQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  const canEvaluateScene =
    capabilities.evaluated &&
    capabilities.motionAllowed &&
    capabilities.desktopLayout &&
    capabilities.webglSupported &&
    isNearViewport &&
    !sceneFailed;
  const sceneMountAllowed = useQuietIdle(canEvaluateScene);
  const scrollQuiet = useScrollQuiet();

  const handleSceneReady = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSceneWarmed(true);
      });
    });
  }, []);

  const handleContextLost = useCallback(() => {
    setSceneWarmed(false);
    setSceneReady(false);
  }, []);

  if (sceneWarmed && scrollQuiet && !sceneReady) {
    setSceneReady(true);
  }

  const activeProject = projects[state.projectIndex] ?? projects[0];
  const activeScreenshot =
    activeProject?.screenshots[state.screenIndex] ??
    activeProject?.screenshots[0];

  if (!activeProject || !activeScreenshot) {
    return null;
  }

  const canRenderScene = canEvaluateScene && sceneMountAllowed;

  const markSceneFailed = () => {
    setSceneWarmed(false);
    setSceneReady(false);
    setSceneFailed(true);
  };

  const selectProject = (projectIndex: number) => {
    dispatch({ type: "select-project", projectIndex });
  };

  const selectScreen = (screenIndex: number) => {
    dispatch({ type: "select-screen", screenIndex });
  };

  return (
    <div
      ref={rootRef}
      data-showcase-mode={canRenderScene ? "webgl" : "static"}
      className="overflow-hidden rounded-4xl border border-foreground bg-foreground text-background"
    >
      <MobileShowcaseHeader />

      <div className="grid border-t border-background/15 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(22rem,1.2fr)]">
        <div className="p-6 sm:p-8 lg:p-10">
          <div
            role="group"
            aria-label="Production mobile project"
            className="flex flex-wrap gap-2"
          >
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                aria-pressed={index === state.projectIndex}
                onClick={() => selectProject(index)}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-background/25 px-4 text-center text-sm font-medium transition-colors hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background aria-pressed:bg-background aria-pressed:text-foreground"
              >
                {project.name}
              </button>
            ))}
          </div>

          <div
            id="mobile-showcase-project"
            aria-live="polite"
            className="mt-8"
          >
            <p className="text-sm font-medium text-background/65">
              {activeProject.role}
            </p>
            <h4 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              {activeProject.name}
            </h4>
            <p className="mt-4 text-base leading-7 text-background/70">
              {activeProject.tagline}
            </p>

            {activeProject.metrics.length > 0 ? (
              <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {activeProject.metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-2xl border border-background/20 p-4"
                  >
                    <dt className="text-xs leading-5 text-background/65">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {activeProject.screenshots.length > 1 ? (
              <div
                className="mt-7"
                role="group"
                aria-label={`${activeProject.name} app screens`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-background/65">
                  Screen
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeProject.screenshots.map((screenshot, index) => (
                    <button
                      key={screenshot}
                      type="button"
                      aria-pressed={index === state.screenIndex}
                      onClick={() => selectScreen(index)}
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-background/25 px-3 text-center text-sm font-medium transition-colors hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background aria-pressed:bg-background aria-pressed:text-foreground"
                    >
                      {getScreenLabel(screenshot)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col xl:flex-row xl:items-center">
              <Button
                href={activeProject.caseStudyHref}
                className="w-full bg-background text-foreground focus-visible:outline-background sm:w-auto lg:w-full xl:w-auto"
              >
                Read case study
              </Button>
              {activeProject.storeUrl ? (
                <Button
                  href={activeProject.storeUrl}
                  variant="secondary"
                  className="w-full border-background/30 text-background hover:bg-background/10 focus-visible:outline-background sm:w-auto lg:w-full xl:w-auto"
                >
                  View on Play Store
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative min-h-144 overflow-hidden border-t border-background/15 bg-[#050505] p-8 lg:min-h-176 lg:border-l lg:border-t-0">
          <div className="lg:hidden">
            <MobileProjectPhone
              project={activeProject}
              screenshotIndex={state.screenIndex}
            />
          </div>

          <div
            className={`pointer-events-none absolute inset-0 z-10 hidden items-center justify-center transition-opacity duration-500 lg:flex ${sceneReady ? "opacity-0" : "opacity-100"}`}
          >
            <ProductPhonePlaceholder
              project={activeProject}
              screenshotIndex={state.screenIndex}
            />
          </div>

          {canRenderScene ? (
            <>
              <div
                className={`absolute inset-0 hidden lg:block contain-[layout_paint] transition-opacity duration-500 ${sceneReady ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                aria-hidden={!sceneReady}
              >
                <SceneErrorBoundary onError={markSceneFailed}>
                  <MobileShowcaseScene
                    screenshot={activeScreenshot}
                    enableDrag
                    playIntro={sceneReady}
                    onContextLost={handleContextLost}
                    onReady={handleSceneReady}
                  />
                </SceneErrorBoundary>
              </div>
              {sceneReady ? (
                <p className="pointer-events-none absolute bottom-5 left-5 right-5 hidden text-center text-xs text-background/55 lg:block">
                  Drag to rotate the Android device.
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}