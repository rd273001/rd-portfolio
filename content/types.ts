export type VerificationStatus = "verified" | "placeholder";

export type MetricSurface =
  | "hero"
  | "impact"
  | "project"
  | "timeline"
  | "achievement";

export type ProjectId =
  | "dfc-app"
  | "aptibooster"
  | "inkyst"
  | "ikior"
  | "certificate-generator";

export type ProjectPriority = 1 | 2 | 3 | 4 | 5 | 6;

export type ProjectKind =
  | "production-app"
  | "independent-contribution"
  | "internship"
  | "personal-project";

export type Metric = {
  id: string;
  label: string;
  value: string;
  status: VerificationStatus;
  project?: ProjectId;
  previous?: string;
  current?: string;
  reduction?: string;
  percentage?: string;
  note?: string;
  surfaces: MetricSurface[];
};

export type Profile = {
  name: string;
  firstName: string;
  currentTitle: string;
  identity: string;
  positioning: string;
  employer: string;
  employerShort: string;
  employerUrl: string;
  location: string;
  locationStatus: VerificationStatus;
  headline: string;
  summary: string;
  currentRoleStarted: string;
  currentRoleStartedStatus: VerificationStatus;
};

export type Experience = {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  start: string;
  end: string;
  startStatus: VerificationStatus;
  endStatus: VerificationStatus;
  kind: ProjectKind;
  prominence: ProjectPriority;
  summary: string;
  highlights: string[];
  technologies: string[];
  metricIds: string[];
  projectIds: ProjectId[];
};

export type Project = {
  id: ProjectId;
  name: string;
  kind: ProjectKind;
  prominence: ProjectPriority;
  tagline: string;
  summary: string;
  role: string;
  downloads?: string;
  liveUrl?: string;
  githubUrl?: string;
  storeUrl?: string;
  websiteMayBeUnavailable?: boolean;
  technologies: string[];
  highlights: string[];
  metricIds: string[];
  caseStudyHref: string;
  screenshots: string[];
};

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type Education = {
  id: string;
  institution: string;
  credential: string;
  start: string;
  end: string;
  status: VerificationStatus;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
  status: VerificationStatus;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  metricId?: string;
  status: VerificationStatus;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  status: VerificationStatus;
};

export type Social = {
  id: string;
  label: string;
  href: string;
  status: VerificationStatus;
};

export type Site = {
  name: string;
  domain: string;
  canonicalUrl: string;
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  locale: string;
};
