import { getWorkShowcaseMetrics } from "@/content/metrics";
import { getProjectsByProminence } from "@/content/projects";
import { MobileShowcaseEnhancement } from "./MobileShowcaseEnhancement";
import { MobileShowcasePresentation } from "./MobileShowcasePresentation";
import type { MobileShowcaseProject } from "./types";

const requiredProjectCount = 2;

export function MobileShowcase() {
  const projects = getProjectsByProminence()
    .filter((project) => project.kind === "production-app")
    .slice(0, requiredProjectCount)
    .map<MobileShowcaseProject>((project) => {
      const projectMetrics = getWorkShowcaseMetrics(project.id).map((metric) => ({
        id: metric.id,
        label: metric.label,
        value: metric.percentage ?? metric.value,
        previous: metric.previous,
        current: metric.current,
        percentage: metric.percentage,
      }));

      return {
        id: project.id,
        name: project.name,
        tagline: project.tagline,
        role: project.role,
        caseStudyHref: project.caseStudyHref,
        storeUrl: project.storeUrl,
        screenshots: project.screenshots.filter(
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