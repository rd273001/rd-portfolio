import type { Metric } from "./types";

export const metrics: Metric[] = [
  {
    id: "dfc-downloads",
    label: "DFC App downloads",
    value: "10K+",
    status: "verified",
    project: "dfc-app",
    surfaces: ["hero", "impact", "project"],
  },
  {
    id: "dfc-bundle-optimization",
    label: "DFC App bundle reduction",
    value: "6.02 MB",
    previous: "21.02 MB",
    current: "15 MB",
    reduction: "6.02 MB",
    percentage: "28.6%",
    status: "verified",
    project: "dfc-app",
    surfaces: ["impact", "project", "achievement"],
  },
  {
    id: "dfc-onboarding-legacy-replaced",
    label: "DFC onboarding legacy replaced",
    value: "~80%",
    status: "verified",
    project: "dfc-app",
    surfaces: ["project", "timeline"],
  },
  {
    id: "dfc-onboarding-modernization",
    label: "DFC onboarding modernization",
    value: "~85–90%",
    status: "verified",
    project: "dfc-app",
    note: "Onboarding codebase modernization and improvement.",
    surfaces: ["project", "timeline"],
  },
  {
    id: "dfc-zoom-delivery",
    label: "Base delivery reduction",
    value: "161 MB",
    status: "verified",
    project: "dfc-app",
    note: "Zoom Meeting SDK moved out of the base download with an Android Dynamic Feature Module / on-demand delivery. This is not simple compression of the app binary.",
    surfaces: ["hero", "impact", "project", "achievement"],
  },
  {
    id: "dfc-zoom-new-install-size",
    label: "New-install download size",
    value: "15.9 MB",
    status: "verified",
    project: "dfc-app",
    surfaces: ["impact", "project"],
  },
  {
    id: "dfc-zoom-download-time",
    label: "On-demand module download time",
    value: "8 seconds",
    status: "verified",
    project: "dfc-app",
    surfaces: ["project"],
  },
  {
    id: "dfc-zoom-time-improvement",
    label: "Install-time improvement vs previous release",
    value: "90 seconds",
    status: "verified",
    project: "dfc-app",
    surfaces: ["impact", "project", "achievement"],
  },
  {
    id: "aptibooster-downloads",
    label: "AptiBooster downloads",
    value: "1K+",
    status: "verified",
    project: "aptibooster",
    surfaces: ["hero", "impact", "project"],
  },
  {
    id: "aptibooster-bundle-optimization",
    label: "AptiBooster release size reduction",
    value: "3.3 MB",
    previous: "23.7 MB",
    current: "20.4 MB",
    reduction: "3.3 MB",
    percentage: "13.9%",
    status: "verified",
    project: "aptibooster",
    surfaces: ["impact", "project", "achievement"],
  },
  {
    id: "ikior-performance",
    label: "IKIOR UI performance improvement",
    value: "20–25%",
    status: "verified",
    project: "ikior",
    surfaces: ["timeline", "project"],
  },
  {
    id: "certificate-generator-requests",
    label: "Certificate requests",
    value: "350+",
    status: "verified",
    project: "certificate-generator",
    surfaces: ["project"],
  },
  {
    id: "certificate-generator-issued",
    label: "Certificates generated",
    value: "260+",
    status: "verified",
    project: "certificate-generator",
    surfaces: ["project"],
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
