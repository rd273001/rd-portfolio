"use client";

import dynamic from "next/dynamic";
import {
  Component,
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
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
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
  const sceneFailCountRef = useRef(0);
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
        const near = entry.isIntersecting;

        if (near) {
          sceneFailCountRef.current = 0;
          setSceneFailed(false);
        }

        setIsNearViewport(near);
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

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

  const activeProject = projects[state.projectIndex] ?? projects[0];
  const activeScreenshot =
    activeProject?.screenshots[state.screenIndex] ??
    activeProject?.screenshots[0];

  if (!activeProject || !activeScreenshot) {
    return null;
  }

  const canRenderScene =
    capabilities.evaluated &&
    capabilities.motionAllowed &&
    capabilities.desktopLayout &&
    capabilities.webglSupported &&
    isNearViewport &&
    !sceneFailed;

  const markSceneFailed = () => {
    sceneFailCountRef.current += 1;
    setSceneFailed(true);

    if (sceneFailCountRef.current < 2) {
      window.setTimeout(() => setSceneFailed(false), 250);
    }
  };

  const selectProject = (projectIndex: number) => {
    sceneFailCountRef.current = 0;
    setSceneFailed(false);
    dispatch({ type: "select-project", projectIndex });
  };

  const selectScreen = (screenIndex: number) => {
    sceneFailCountRef.current = 0;
    setSceneFailed(false);
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
                className="min-h-11 rounded-full border border-background/25 px-4 text-sm font-medium transition-colors hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background aria-pressed:bg-background aria-pressed:text-foreground"
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
                      className="min-h-11 rounded-full border border-background/25 px-3 text-sm transition-colors hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background aria-pressed:bg-background aria-pressed:text-foreground"
                    >
                      {getScreenLabel(screenshot)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                href={activeProject.caseStudyHref}
                className="bg-background text-foreground focus-visible:outline-background"
              >
                Read case study
              </Button>
              {activeProject.storeUrl ? (
                <Button
                  href={activeProject.storeUrl}
                  variant="secondary"
                  className="border-background/30 text-background hover:bg-background/10 focus-visible:outline-background"
                >
                  View on Play Store
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative min-h-144 overflow-hidden border-t border-background/15 bg-[#181818] p-8 lg:min-h-176 lg:border-l lg:border-t-0">
          <div className={canRenderScene ? "invisible" : undefined}>
            <MobileProjectPhone
              project={activeProject}
              screenshotIndex={state.screenIndex}
            />
          </div>

          {canRenderScene ? (
            <>
              <div className="absolute inset-0" aria-hidden="true">
                <SceneErrorBoundary onError={markSceneFailed}>
                  <MobileShowcaseScene
                    screenshot={activeScreenshot}
                    enableDrag
                    onContextLost={markSceneFailed}
                  />
                </SceneErrorBoundary>
              </div>
              <p className="pointer-events-none absolute bottom-5 left-5 right-5 text-center text-xs text-background/55">
                Drag to rotate the Android device.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}