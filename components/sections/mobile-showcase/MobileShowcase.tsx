import { getWorkShowcaseMetrics } from "@/content/metrics";
import { getProjectsByProminence } from "@/content/projects";
import type { Metric } from "@/content/types";
import { MobileShowcaseEnhancement } from "./MobileShowcaseEnhancement";
import { MobileShowcasePresentation } from "./MobileShowcasePresentation";
import type { MobileShowcaseProject } from "./types";

const requiredProjectCount = 2;

/** Work panel: show ms/value where Impact already uses the same metric as a %. */
function workShowcaseMetricValue(metric: Metric): string {
  if (metric.id === "dfc-app-start-p90") {
    return metric.value;
  }

  return metric.percentage ?? metric.value;
}

/** Work panel: format metric label cleanly without project name redundancy. */
function workShowcaseMetricLabel(metric: Metric): string {
  if (metric.id.endsWith("-downloads")) {
    return "Downloads";
  }

  if (metric.id.endsWith("-bundle-optimization")) {
    return "Release size reduction";
  }

  return metric.label;
}

const SHOWCASE_TAGLINES: Partial<Record<string, string>> = {
  "dfc-app":
    "Coaching institute mobile platform delivering live interactive lectures, batch announcements, and structured study material to 10K+ students.",
  "aptibooster":
    "AI-powered exam prep platform featuring timed live test sessions, AI-driven performance insights, and detailed question analytics.",
};

export function MobileShowcase() {
  const projects = getProjectsByProminence()
    .filter((project) => project.kind === "production-app")
    .slice(0, requiredProjectCount)
    .map<MobileShowcaseProject>((project) => {
      const projectMetrics = getWorkShowcaseMetrics(project.id).map((metric) => ({
        id: metric.id,
        label: workShowcaseMetricLabel(metric),
        value: workShowcaseMetricValue(metric),
        previous: metric.previous,
        current: metric.current,
        percentage: metric.percentage,
      }));

      return {
        id: project.id,
        name: project.name,
        tagline: SHOWCASE_TAGLINES[project.id] ?? project.tagline,
        role: project.role,
        caseStudyHref: project.caseStudyHref!,
        storeUrl: project.storeUrl,
        screenshots: (
          project.workShowcaseScreenshots ?? project.screenshots
        ).filter(
          (screenshot) =>
            screenshot.startsWith("/") && !screenshot.startsWith("//"),
        ),
        metrics: projectMetrics,
      };
    });

  if (projects.length !== requiredProjectCount) {
    return null;
  }

  const hasCompleteScreenshotSet = projects.every(
    (project) => project.screenshots.length > 0,
  );

  return (
    <div className="mt-10">
      {hasCompleteScreenshotSet ? (
        <MobileShowcaseEnhancement projects={projects} />
      ) : (
        <MobileShowcasePresentation projects={projects} />
      )}
    </div>
  );
}