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
import { site } from "@/content/site";
import {
  MobileProjectPhone,
  MobileShowcaseHeader,
  ProductPhonePlaceholder,
} from "./MobileShowcasePresentation";
import type { MobileShowcaseProject } from "./types";
import {
  runInBackground,
  yieldToMain,
  yieldUntilQuiet,
} from "./sceneScheduler";

const MobileShowcaseScene = dynamic(
  () =>
    import("./MobileShowcaseScene").then((module) => module.MobileShowcaseScene),
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
  desktopLayout: boolean;
  webglSupported: boolean;
  dataSaver: boolean;
  lowMemory: boolean;
};

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
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
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function getNavigatorHints() {
  const nav = navigator as NavigatorHints;

  return {
    dataSaver: Boolean(nav.connection?.saveData),
    lowMemory:
      typeof nav.deviceMemory === "number" && nav.deviceMemory > 0
        ? nav.deviceMemory < 4
        : false,
  };
}

/**
 * Download and parse Three.js / GLB / HDR in the background after first paint.
 * Do not wait for the Work section or a scroll pause — that just delayed the hitch.
 */
function useBackgroundSceneAssets(
  enabled: boolean,
  onUnsupported: (failed: boolean) => void,
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) {
      return;
    }

    let cancelled = false;

    const glb = document.createElement("link");
    glb.rel = "prefetch";
    glb.as = "fetch";
    glb.href = "/models/android-phone.glb?v=aspect-9-19.5";
    glb.crossOrigin = "anonymous";
    document.head.appendChild(glb);

    const hdri = document.createElement("link");
    hdri.rel = "prefetch";
    hdri.as = "fetch";
    hdri.href = "/hdri/studio_small_08_1k.hdr";
    hdri.crossOrigin = "anonymous";
    document.head.appendChild(hdri);

    runInBackground(() => {
      if (cancelled) {
        return;
      }

      if (!detectWebGLSupport()) {
        onUnsupported(true);
        return;
      }

      void import("./MobileShowcaseScene")
        .then(async (module) => {
          await yieldToMain();
          if (cancelled) {
            return;
          }

          module.preloadShowcaseAssets();
          setReady(true);
        })
        .catch(() => {
          if (!cancelled) {
            onUnsupported(true);
          }
        });
    });

    return () => {
      cancelled = true;
      glb.remove();
      hdri.remove();
    };
  }, [enabled, onUnsupported, ready]);

  return ready;
}

function useYieldingCanvasMount(enabled: boolean) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!enabled || allowed) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await yieldUntilQuiet();
      if (!cancelled) {
        setAllowed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [allowed, enabled]);

  return allowed;
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
  const [sceneReady, setSceneReady] = useState(false);
  const [capabilities, setCapabilities] = useState<SceneCapabilities>({
    evaluated: false,
    motionAllowed: false,
    desktopLayout: false,
    webglSupported: false,
    dataSaver: false,
    lowMemory: false,
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
      { rootMargin: "480px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const updateCapabilities = () => {
      const hints = getNavigatorHints();

      setCapabilities({
        evaluated: true,
        motionAllowed: !motionQuery.matches,
        desktopLayout: desktopQuery.matches,
        webglSupported: detectWebGLSupport(),
        dataSaver: hints.dataSaver,
        lowMemory: hints.lowMemory,
      });
    };

    updateCapabilities();
    motionQuery.addEventListener("change", updateCapabilities);
    desktopQuery.addEventListener("change", updateCapabilities);

    return () => {
      motionQuery.removeEventListener("change", updateCapabilities);
      desktopQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  const mobile3DRequested = site.features.mobile3DShowcase;
  const mobileCapable =
    capabilities.webglSupported &&
    capabilities.motionAllowed &&
    !capabilities.dataSaver &&
    !capabilities.lowMemory;
  const mobile3DEligible =
    capabilities.evaluated &&
    mobile3DRequested &&
    !capabilities.desktopLayout &&
    mobileCapable &&
    !sceneFailed;
  const canWarmDesktop =
    capabilities.evaluated &&
    capabilities.desktopLayout &&
    capabilities.motionAllowed &&
    capabilities.webglSupported &&
    !sceneFailed;
  const canWarmMobile = mobile3DEligible && isNearViewport;
  const canWarmAssets = canWarmDesktop || canWarmMobile;
  const assetsReady = useBackgroundSceneAssets(canWarmAssets, setSceneFailed);
  const canEvaluateScene = canWarmAssets && isNearViewport && assetsReady;
  const sceneMountAllowed = useYieldingCanvasMount(canEvaluateScene);

  const handleSceneReady = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSceneReady(true);
      });
    });
  }, []);

  const handleContextLost = useCallback(() => {
    setSceneReady(false);
    setSceneFailed(true);
  }, []);

  const activeProject = projects[state.projectIndex] ?? projects[0];
  const activeScreenshot =
    activeProject?.screenshots[state.screenIndex] ??
    activeProject?.screenshots[0];

  if (!activeProject || !activeScreenshot) {
    return null;
  }

  const canRenderScene = canEvaluateScene && sceneMountAllowed;

  const markSceneFailed = () => {
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
                onPointerUp={(event) => {
                  if (event.pointerType === "touch") {
                    selectProject(index);
                  }
                }}
                onClick={() => selectProject(index)}
                className="inline-flex min-h-11 min-w-36 cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-full border border-background/45 px-6 text-center text-sm font-medium transition-[transform,color,background-color] duration-150 [@media(hover:hover)]:hover:bg-background/10 active:scale-[0.98] active:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background aria-pressed:bg-background aria-pressed:text-foreground [@media(hover:hover)]:aria-pressed:hover:bg-background"
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
                      onPointerUp={(event) => {
                        if (event.pointerType === "touch") {
                          selectScreen(index);
                        }
                      }}
                      onClick={() => selectScreen(index)}
                      className="inline-flex min-h-11 cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-full border border-background/45 px-3 text-center text-sm font-medium transition-[transform,color,background-color] duration-150 [@media(hover:hover)]:hover:bg-background/10 active:scale-[0.98] active:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background aria-pressed:bg-background aria-pressed:text-foreground [@media(hover:hover)]:aria-pressed:hover:bg-background"
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
                className="w-full bg-background text-foreground active:opacity-90 focus-visible:outline-background sm:w-auto lg:w-full xl:w-auto"
              >
                Read case study
              </Button>
              {activeProject.storeUrl ? (
                <Button
                  href={activeProject.storeUrl}
                  variant="secondary"
                  className="w-full border-background/45 text-background [@media(hover:hover)]:hover:border-background/55 [@media(hover:hover)]:hover:bg-background/10 active:scale-[0.98] active:border-background/55 active:bg-background/10 focus-visible:outline-background sm:w-auto lg:w-full xl:w-auto"
                >
                  View on Play Store
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative min-h-144 overflow-hidden border-t border-background/15 bg-[#050505] p-8 lg:min-h-176 lg:border-l lg:border-t-0">
          <div className={mobile3DEligible ? "hidden" : "lg:hidden"}>
            <MobileProjectPhone
              project={activeProject}
              screenshotIndex={state.screenIndex}
            />
          </div>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-10 items-center justify-center transition-opacity duration-500 ${
              mobile3DEligible ? "flex" : "hidden lg:flex"
            } ${sceneReady ? "opacity-0" : "opacity-100"}`}
          >
            {mobile3DEligible ? (
              <MobileProjectPhone
                project={activeProject}
                screenshotIndex={state.screenIndex}
              />
            ) : (
              <ProductPhonePlaceholder
                project={activeProject}
                screenshotIndex={state.screenIndex}
              />
            )}
          </div>

          {canRenderScene ? (
            <>
              <div
                className={`absolute inset-0 contain-[layout_paint] transition-opacity duration-500 ${
                  mobile3DEligible ? "block" : "hidden lg:block"
                } ${
                  sceneReady
                    ? capabilities.desktopLayout
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!sceneReady}
              >
                <SceneErrorBoundary onError={markSceneFailed}>
                  <MobileShowcaseScene
                    screenshot={activeScreenshot}
                    enableDrag={capabilities.desktopLayout}
                    idleMotion={!capabilities.desktopLayout}
                    playIntro={sceneReady}
                    onContextLost={handleContextLost}
                    onReady={handleSceneReady}
                  />
                </SceneErrorBoundary>
              </div>
              {sceneReady && capabilities.desktopLayout ? (
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