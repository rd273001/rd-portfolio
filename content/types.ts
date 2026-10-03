export type VerificationStatus = "verified" | "placeholder";

export type MetricSurface =
  | "hero"
  | "impact"
  | "work"
  | "project"
  | "timeline"
  | "achievement"
  | "site";

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

/** Editorial headshot. Hidden until a real file is verified. */
export type ProfilePhoto = {
  /** File in /public, for example "/profile/ravi.webp". */
  src: string;
  alt: string;
  status: VerificationStatus;
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
  /** Omit until a real professional photo is in the repo. */
  photo?: ProfilePhoto;
};

/** Shown in the header, hero, and mobile menu only when verified. */
export type Resume = {
  label: string;
  /** Public path or absolute URL. Omit until the file exists. */
  url?: string;
  status: VerificationStatus;
};

/** Readable setup in normal document flow. Not pinned. */
export type CaseStudyNarrativeBlock = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
};

export type CaseStudyStoryScreenshot = {
  src: string;
  alt: string;
};

/** One beat of a pinned scroll story. Values come from `metricIds`. */
export type CaseStudyStoryChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Ids in `content/metrics.ts`. Empty when the beat has no callouts. */
  metricIds: string[];
  /**
   * Screens for the pinned phone on this beat. Multiple srcs crossfade
   * during the beat (download → restart → join). Omit to keep the last
   * screen, or leave the phone blank on the opening beat.
   */
  screenshots?: CaseStudyStoryScreenshot[];
};

/**
 * Optional flagship scroll story on a case-study page.
 * Projects without `story` keep the standard layout.
 */
export type CaseStudyStory = {
  eyebrow: string;
  title: string;
  lead: string;
  narrative: CaseStudyNarrativeBlock[];
  chapters: CaseStudyStoryChapter[];
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
  /** Internship / experience certificate (PDF or Drive link). */
  credentialUrl?: string;
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
  /** Shown on home project cards (trimmed in UI) and on the case study page. */
  highlights: string[];
  /** Extra bullets for `/work/[id]` only — not on the home page. */
  caseStudyHighlights?: string[];
  metricIds: string[];
  /** Omitted when the project has no `/work/[id]` case study (e.g. IKIOR internship). */
  caseStudyHref?: string;
  /**
   * Scroll story for this case study. Metric numbers stay in `content/metrics.ts`.
   * Omit until that project has structured story content.
   */
  story?: CaseStudyStory;
  /** Full gallery on `/work/[id]` and anywhere that needs every capture. */
  screenshots: string[];
  /**
   * Home Work 3D panel only. Omit to use all `screenshots`. Keep length
   * aligned across flagship apps so tab switch does not resize the stage.
   */
  workShowcaseScreenshots?: string[];
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
  credentialUrl?: string;
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

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
};

export type Site = {
  name: string;
  domain: string;
  canonicalUrl: string;
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  locale: string;
  navigation: NavigationItem[];
  /** GitHub, LinkedIn, and similar links in the mobile menu utility row. */
  headerUtilitySocialIds: string[];
  contact: {
    title: string;
    description: string;
    primarySocialId: string;
    secondarySocialId: string;
  };
  features: {
    /**
     * Experimental: attempt the WebGL phone on capable mobile devices.
     * AndroidPhoneFrame remains the fallback when this is off or ineligible.
     */
    mobile3DShowcase: boolean;
  };
};