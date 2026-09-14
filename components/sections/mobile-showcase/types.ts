import type { ProjectId } from "@/content/types";

export type MobileShowcaseMetric = {
  id: string;
  label: string;
  value: string;
  previous?: string;
  current?: string;
  percentage?: string;
};

export type MobileShowcaseProject = {
  id: ProjectId;
  name: string;
  tagline: string;
  role: string;
  caseStudyHref: string;
  storeUrl?: string;
  screenshots: string[];
  metrics: MobileShowcaseMetric[];
};