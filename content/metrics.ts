import type { Metric, ProjectId } from "./types";

/**
 * Surface roles:
 * - hero: three identity/scale metrics only
 * - impact: production DFC and AptiBooster results that are not already in the hero
 *   (not personal projects, not internship stats)
 * - work: 1–2 project-specific metrics in the mobile showcase
 * - project: optional single ProjectCard metric (omit when hero/impact already cover it)
 * - timeline / achievement: narrative surfaces, not extra dashboards
 *
 * Case-study pages read `project.metricIds`, not surfaces, so they can stay complete.
 */
export const metrics: Metric[] = [
  {
    id: "dfc-downloads",
    label: "DFC downloads",
    value: "10K+",
    status: "verified",
    project: "dfc-app",
    surfaces: ["hero", "work"],
  },
  {
    id: "dfc-bundle-optimization",
    label: "DFC previous release optimization",
    value: "6.02 MB",
    previous: "21.02 MB",
    current: "15 MB",
    reduction: "6.02 MB",
    percentage: "28.6%",
    status: "verified",
    project: "dfc-app",
    surfaces: ["impact", "achievement", "work"],
  },
  {
    id: "dfc-app-start-p90",
    label: "DFC app start improvement (p90)",
    value: "794 ms",
    previous: "~894 ms",
    current: "794 ms",
    reduction: "~100 ms",
    percentage: "~11%",
    status: "verified",
    project: "dfc-app",
    surfaces: ["impact", "achievement", "timeline"],
  },
  {
    id: "dfc-js-heap-home-idle",
    label: "JS heap at Home idle",
    value: "~5 MB lower",
    status: "verified",
    project: "dfc-app",
    note: "Internal profiling after lazy-loaded navigators (same lazy-load work as the production startup win). Not live production heap telemetry.",
    surfaces: [],
  },
  {
    id: "dfc-zoom-delivery",
    label: "Base delivery reduction",
    value: "161 MB",
    status: "verified",
    project: "dfc-app",
    note: "Zoom Meeting SDK moved out of the base download with an Android Dynamic Feature Module / on-demand delivery. This is not simple compression of the app binary.",
    surfaces: ["hero", "achievement"],
  },
  {
    id: "dfc-zoom-new-install-size",
    label: "New-install download size",
    value: "15.9 MB",
    status: "verified",
    project: "dfc-app",
    surfaces: [],
  },
  {
    id: "dfc-zoom-download-time",
    label: "On-demand module download time",
    value: "8 seconds",
    status: "verified",
    project: "dfc-app",
    surfaces: [],
  },
  {
    id: "dfc-zoom-time-improvement",
    label: "Install-time improvement vs previous release",
    value: "90 seconds",
    status: "verified",
    project: "dfc-app",
    surfaces: [],
  },
  {
    id: "aptibooster-downloads",
    label: "AptiBooster downloads",
    value: "1K+",
    status: "verified",
    project: "aptibooster",
    surfaces: ["hero", "work"],
  },
  {
    id: "aptibooster-bundle-optimization",
    label: "AptiBooster release optimization",
    value: "3.3 MB",
    previous: "23.7 MB",
    current: "20.4 MB",
    reduction: "3.3 MB",
    percentage: "13.9%",
    status: "verified",
    project: "aptibooster",
    surfaces: ["impact", "work", "achievement"],
  },
  {
    id: "ikior-performance",
    label: "IKIOR UI performance improvement",
    value: "20–25%",
    status: "verified",
    project: "ikior",
    surfaces: ["timeline"],
  },
  {
    id: "certificate-generator-requests",
    label: "Certificate Generator requests",
    value: "350+",
    status: "verified",
    project: "certificate-generator",
    surfaces: [],
  },
  {
    id: "certificate-generator-issued",
    label: "Certificates generated",
    value: "260+",
    status: "verified",
    project: "certificate-generator",
    surfaces: [],
  },
];

export function getMetric(id: string): Metric | undefined {
  return metrics.find((metric) => metric.id === id);
}

export function getMetricsByIds(ids: string[]): Metric[] {
  return ids
    .map((id) => getMetric(id))
    .filter((metric): metric is Metric => metric !== undefined);
}

export function getMetricsForSurface(surface: Metric["surfaces"][number]): Metric[] {
  return metrics.filter(
    (metric) => metric.status === "verified" && metric.surfaces.includes(surface),
  );
}

/** Optional single ProjectCard metric. Case studies still use `project.metricIds`. */
export function getProjectCardMetric(projectId: ProjectId): Metric | undefined {
  return getMetricsForSurface("project").find(
    (metric) => metric.project === projectId,
  );
}

export function getWorkShowcaseMetrics(projectId: ProjectId): Metric[] {
  return getMetricsForSurface("work")
    .filter((metric) => metric.project === projectId)
    .slice(0, 2);
}
