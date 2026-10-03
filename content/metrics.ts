import type { Metric, ProjectId } from "./types";

/**
 * DFC production figures (canonical math — keep `metrics` entries in sync):
 * - Base bundle (earlier production base → current): 21.02 − 15.9 = 5.12 MB (24.36%)
 * - feature_zoom on Play: 161 MB on-demand (not in 15.9 MB base install)
 * - Prior prod Zoom-in-base new install: 177 MB → 15.9 MB base (177 − 15.9 = 161.1 MB Release delivery)
 * - New-install download time: 9 s; vs prior prod: 94 s faster
 * - Crash rate: 10.36% lower vs pre-revamp baseline; 0.1% current
 * - App start p90: ~894 ms → 794 ms (~100 ms / 11.2%)
 */
/**
 * Surface roles:
 * - hero: three identity/scale metrics only
 * - impact: production DFC and AptiBooster results that are not already in the hero
 *   (not personal projects, not internship stats)
 * - work: 1–2 project-specific metrics in the mobile showcase
 * - project: optional single ProjectCard metric (omit when hero/impact already cover it)
 * - timeline / achievement: narrative surfaces, not extra dashboards
 * - site: this portfolio (3D GLB/HDR, Lighthouse). Never mix into impact/hero.
 *
 * Case-study pages read `project.metricIds`, not surfaces, so they can stay complete.
 * Story chapters reference those same ids for callouts.
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
    label: "DFC base app bundle (production)",
    value: "5.12 MB",
    previous: "21.02 MB",
    current: "15.9 MB",
    reduction: "5.12 MB",
    percentage: "24.36%",
    status: "verified",
    project: "dfc-app",
    note: "R8, ProGuard, and App Bundle work on the same Play listing. Separate from on-demand Zoom.",
    surfaces: ["impact", "achievement"],
  },
  {
    id: "dfc-crash-rate-improvement",
    label: "User-perceived crash rate improvement",
    value: "10.36% lower",
    status: "verified",
    project: "dfc-app",
    note: "Current production: 0.1% user-perceived crash rate. 10.36% lower than the pre-revamp baseline.",
    surfaces: ["impact", "achievement"],
  },
  {
    id: "dfc-app-start-p90",
    label: "DFC app start improvement (p90)",
    value: "794 ms",
    previous: "~894 ms",
    current: "794 ms",
    reduction: "~100 ms",
    percentage: "11.2%",
    status: "verified",
    project: "dfc-app",
    note: "Firebase Performance p90 on production Android after lazy-loaded navigators and startup-path refactors.",
    surfaces: ["impact", "achievement"],
  },
  {
    id: "dfc-js-heap-home-idle",
    label: "JS heap at Home idle",
    value: "~5 MB lower",
    status: "verified",
    project: "dfc-app",
    note: "Internal profiling after lazy-loaded navigators. Not live production heap telemetry.",
    surfaces: [],
  },
  {
    id: "dfc-zoom-delivery",
    label: "Base delivery reduction",
    value: "161 MB",
    previous: "177 MB",
    current: "15.9 MB",
    status: "verified",
    project: "dfc-app",
    note: "On-demand Zoom module on Play (161 MB), not in the 15.9 MB base install. 177 MB → 15.9 MB is 161.1 MB less on the base path—not compression.",
    surfaces: ["hero", "achievement"],
  },
  {
    id: "dfc-zoom-new-install-size",
    label: "New-install download size",
    value: "15.9 MB",
    status: "verified",
    project: "dfc-app",
    note: "Play base module for a new install after Zoom left the first download.",
    surfaces: ["work"],
  },
  {
    id: "dfc-zoom-download-time",
    label: "New-install download time",
    value: "9 seconds",
    status: "verified",
    project: "dfc-app",
    note: "Play modeled new-install download time, not on-device Zoom module Wi‑Fi.",
    surfaces: [],
  },
  {
    id: "dfc-zoom-time-improvement",
    label: "Download time vs previous production release",
    value: "94 seconds faster",
    status: "verified",
    project: "dfc-app",
    note: "Play Time to download vs the prior production release.",
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
    id: "certificate-generator-requests",
    label: "Pending certificate requests",
    value: "400+",
    status: "verified",
    project: "certificate-generator",
    surfaces: [],
  },
  {
    id: "certificate-generator-issued",
    label: "Certificates generated",
    value: "466+",
    status: "verified",
    project: "certificate-generator",
    surfaces: [],
  },
  {
    id: "site-3d-payload",
    label: "Desktop 3D download",
    value: "7.17 MB",
    current: "7.17 MB",
    status: "verified",
    note: "GLB 5.73 MB + HDR 1.44 MB. Desktop Work WebGL only — mobile keeps the 2D frame.",
    surfaces: ["site", "achievement"],
  },
  {
    id: "site-phone-glb",
    label: "Phone model (GLB)",
    value: "5.73 MB",
    current: "5.73 MB",
    status: "verified",
    note: "Original procedural model, 68,056 triangles. Primary target for the asset pass.",
    surfaces: ["site", "achievement"],
  },
  {
    id: "site-studio-hdr",
    label: "Studio HDR environment",
    value: "1.44 MB",
    current: "1.44 MB",
    status: "verified",
    note: "Studio environment map for the 3D phone. Kept in content for the before / after fill.",
    surfaces: [],
  },
  {
    id: "site-lighthouse-mobile-performance",
    label: "Mobile performance",
    value: "94",
    status: "verified",
    note: "PageSpeed Insights homepage, mobile profile — 28 Sep 2026. https://www.ravidubey.in",
    surfaces: ["site", "achievement"],
  },
  {
    id: "site-lighthouse-desktop-performance",
    label: "Desktop performance",
    value: "95",
    status: "verified",
    note: "PageSpeed Insights homepage, desktop profile — 28 Sep 2026. Desktop lab load includes Work WebGL assets.",
    surfaces: ["site", "achievement"],
  },
  {
    id: "site-lighthouse-accessibility",
    label: "Accessibility",
    value: "96",
    status: "verified",
    note: "PageSpeed Insights — mobile and desktop, 28 Sep 2026.",
    surfaces: ["site", "achievement"],
  },
  {
    id: "site-lighthouse-seo",
    label: "Lighthouse SEO",
    value: "100",
    status: "verified",
    note: "PageSpeed Insights homepage, 28 Sep 2026. Shown in section copy, not as a card.",
    surfaces: [],
  },
  {
    id: "site-lighthouse-best-practices",
    label: "Lighthouse Best Practices",
    value: "100",
    status: "verified",
    note: "PageSpeed Insights homepage, 28 Sep 2026. Shown in section copy, not as a card.",
    surfaces: [],
  },
];

export function getMetric(id: string): Metric | undefined {
  return metrics.find((metric) => metric.id === id);
}

export function formatMetricRange(metric: Metric): string | undefined {
  if (!metric.previous || !metric.current) {
    return undefined;
  }

  return metric.percentage
    ? `${metric.previous} → ${metric.current} (${metric.percentage})`
    : `${metric.previous} → ${metric.current}`;
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