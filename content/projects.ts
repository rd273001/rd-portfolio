import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "dfc-app",
    name: "DFC",
    kind: "production-app",
    prominence: 1,
    tagline: "Production education app with on-demand Zoom delivery.",
    summary:
      "Production application with 10K+ downloads, listed on Google Play as Dnyandeep Foundation Centre. I own the revamp on the existing listing — a new mobile codebase with onboarding, role-based access, and Android delivery architecture.",
    role: "Software Engineer 1 (Mobile) · production ownership",
    downloads: "10K+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.qkclass.dfc",
    technologies: [
      "React Native",
      "TypeScript",
      "TanStack Query",
      "Firebase Crashlytics",
      "Firebase Analytics",
      "Firebase Performance Monitoring",
      "Axios",
      "OneSignal",
      "Razorpay",
      "Zoom Meeting SDK",
      "Android App Bundle",
      "ProGuard/R8",
      "Dynamic Feature Modules",
    ],
    highlights: [
      "Shipped a new DFC codebase on the existing Play listing, replacing the legacy JavaScript app with TypeScript, TanStack Query, and modern API and auth patterns.",
      "Designed and implemented the full student onboarding flow in the new app — not a refactor of the old onboarding code.",
      "Shipped a Firebase Crashlytics logger for fatal and non-fatal exceptions, with stack trace, API URL, and component context, plus axios interceptors that log only the errors that should be logged.",
      "Shipped student, teacher, and admin roles in the same product.",
      "Improved initial load with lazy loading and startup-path refactors.",
      "Optimized the Android App Bundle from 21.02 MB to 15 MB (6.02 MB / 28.6%).",
      "Moved Zoom Meeting SDK out of base delivery with a Dynamic Feature Module: 161 MB base-delivery reduction, 15.9 MB new-install size, 8 second module download, 90 second improvement versus the previous release.",
    ],
    metricIds: [
      "dfc-downloads",
      "dfc-bundle-optimization",
      "dfc-zoom-delivery",
      "dfc-zoom-new-install-size",
      "dfc-zoom-download-time",
      "dfc-zoom-time-improvement",
    ],
    caseStudyHref: "/work/dfc-app",
    screenshots: [
      "/screenshots/dfc-app/student-onboarding.webp",
      "/screenshots/dfc-app/zoom-on-demand.webp",
      "/screenshots/dfc-app/student-batches.webp",
    ],
  },
  {
    id: "aptibooster",
    name: "AptiBooster",
    kind: "production-app",
    prominence: 2,
    tagline:
      "Every insight traces back to telemetry captured during a single timed test attempt.",
    summary:
      "Production aptitude app with 1K+ downloads, built substantially from scratch. Scoring, peer comparison, and analysis are derived from one live test client rather than a separate analytics product.",
    role: "Software Engineer 1 (Mobile) · substantial development from scratch",
    downloads: "1K+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.aptibooster",
    technologies: [
      "React Native",
      "Razorpay Subscription",
      "MathJax",
      "Global Search",
      "OneSignal",
      "Firebase Analytics",
      "Crashlytics",
    ],
    highlights: [
      "Every insight in the app is built from one timed test attempt’s telemetry, not from a separate analytics product.",
      "Built the live test client so revisits, option changes, and countdown time stay consistent enough to power scoring, peer comparison, and full analysis.",
      "Enforced a chapter-based trial (first 2 chapters per subject) across tests, flashcards, and search, with Razorpay unlocking the rest of the syllabus and full analysis.",
      "Rendered exam content with HTML + LaTeX (MathJax when math-tex is present) so tables, formulae, and explanations stay readable in live test, review, and flashcards.",
      "Release optimization from 23.7 MB to 20.4 MB (3.3 MB / ~13.9%).",
    ],
    metricIds: ["aptibooster-downloads", "aptibooster-bundle-optimization"],
    caseStudyHref: "/work/aptibooster",
    screenshots: [
      "/screenshots/aptibooster/test-session.webp",
      "/screenshots/aptibooster/test-overview.webp",
      "/screenshots/aptibooster/test-analysis.webp",
      "/screenshots/aptibooster/question-review.webp",
    ],
  },
  {
    id: "inkyst",
    name: "Inkyst",
    kind: "independent-contribution",
    prominence: 3,
    tagline: "Independent frontend contribution to selected production pages.",
    summary:
      "Voluntary frontend contribution: selected web pages implemented from Figma as responsive React/TypeScript UI. Do not claim product ownership. The website may currently be unavailable.",
    role: "Independent Frontend Contribution",
    liveUrl: "https://inkyst.com",
    websiteMayBeUnavailable: true,
    technologies: ["React", "TypeScript", "Figma"],
    highlights: [
      "Voluntary / unpaid contribution.",
      "Selected web page implementations.",
      "Figma to responsive React/TypeScript UI.",
      "Production website contribution.",
    ],
    metricIds: [],
    caseStudyHref: "/work/inkyst",
    screenshots: [],
  },
  {
    id: "ikior",
    name: "IKIOR",
    kind: "internship",
    prominence: 4,
    tagline: "Internship UI work — concise, not a flagship product.",
    summary:
      "Software Engineer Intern, May 2023 – Nov 2023. Responsive, pixel-perfect UI from Figma. Do not overstate the product’s later state.",
    role: "Software Engineer Intern",
    technologies: [
      "React Native",
      "React",
      "Redux Toolkit",
      "Context API",
      "JavaScript",
      "Figma",
    ],
    highlights: [
      "Responsive, pixel-perfect UI.",
      "20–25% performance improvement.",
    ],
    metricIds: ["ikior-performance"],
    caseStudyHref: "/work/ikior",
    screenshots: [],
  },
  {
    id: "certificate-generator",
    name: "Certificate Generator",
    kind: "personal-project",
    prominence: 5,
    tagline: "Personal MERN project for certificate requests and PDF delivery.",
    summary:
      "Personal learning / full-stack project. Not employment. Users request certificates, which can be approved and generated as PDFs stored on Google Drive.",
    role: "Personal full-stack project",
    liveUrl: "https://certificate-generator1.netlify.app/",
    githubUrl: "https://github.com/rd273001/Certificate_Generator",
    technologies: [
      "MongoDB",
      "Express.js",
      "React",
      "Node.js",
      "REST APIs",
      "pdf-lib",
      "Google Drive API",
      "Redux Toolkit",
      "Tailwind CSS",
      "JavaScript",
    ],
    highlights: [
      "CRUD and REST APIs for certificate requests.",
      "PDF generation with pdf-lib.",
      "Google Drive storage for issued certificates.",
      "350+ requests and 260+ generated certificates.",
    ],
    metricIds: [
      "certificate-generator-requests",
      "certificate-generator-issued",
    ],
    caseStudyHref: "/work/certificate-generator",
    screenshots: [],
  },
];

const caseStudyProjectIds = new Set<Project["id"]>([
  "dfc-app",
  "aptibooster",
  "certificate-generator",
]);

export function getProject(id: Project["id"]): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByProminence(): Project[] {
  return [...projects].sort((a, b) => a.prominence - b.prominence);
}

export function getCaseStudyProjects(): Project[] {
  return getProjectsByProminence().filter((project) =>
    caseStudyProjectIds.has(project.id),
  );
}

export function getCaseStudyProject(id: string): Project | undefined {
  const project = projects.find((item) => item.id === id);

  if (!project || !caseStudyProjectIds.has(project.id)) {
    return undefined;
  }

  return project;
}