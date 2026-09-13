import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "dfc-app",
    name: "DFC App",
    kind: "production-app",
    prominence: 1,
    tagline: "Production education app with on-demand Zoom delivery.",
    summary:
      "Production application with 10K+ downloads. I own and maintain the mobile experience, including onboarding modernization and Android delivery architecture.",
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
      "OneSignal",
      "Razorpay",
      "Zoom Meeting SDK",
      "Android App Bundle",
      "ProGuard/R8",
      "Dynamic Feature Modules",
    ],
    highlights: [
      "Replaced ~80% of the legacy onboarding implementation.",
      "Modernized ~85–90% of the onboarding codebase.",
      "Optimized the Android App Bundle from 21.02 MB to 15 MB (6.02 MB / 28.6%).",
      "Moved Zoom Meeting SDK out of base delivery with a Dynamic Feature Module: 161 MB base-delivery reduction, 15.9 MB new-install size, 8 second module download, 90 second improvement versus the previous release.",
    ],
    metricIds: [
      "dfc-downloads",
      "dfc-bundle-optimization",
      "dfc-onboarding-legacy-replaced",
      "dfc-onboarding-modernization",
      "dfc-zoom-delivery",
      "dfc-zoom-new-install-size",
      "dfc-zoom-download-time",
      "dfc-zoom-time-improvement",
    ],
    caseStudyHref: "/work/dfc-app",
    screenshots: ["TODO_DFC_SCREENSHOTS"],
  },
  {
    id: "aptibooster",
    name: "AptiBooster",
    kind: "production-app",
    prominence: 2,
    tagline: "Production aptitude app built substantially from scratch.",
    summary:
      "Production application with 1K+ downloads. Substantial development from scratch, including subscriptions, global search, and release-size work.",
    role: "Software Engineer 1 (Mobile) · substantial development from scratch",
    downloads: "1K+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.aptibooster",
    technologies: [
      "React Native",
      "Razorpay Subscription",
      "Global Search",
      "OneSignal",
      "Firebase Analytics",
      "Crashlytics",
    ],
    highlights: [
      "Built substantially from scratch.",
      "Razorpay Subscription integration.",
      "Global Search.",
      "OneSignal, Firebase Analytics, and Crashlytics.",
      "Release optimization from 23.7 MB to 20.4 MB (3.3 MB / ~13.9%).",
    ],
    metricIds: ["aptibooster-downloads", "aptibooster-bundle-optimization"],
    caseStudyHref: "/work/aptibooster",
    screenshots: ["TODO_APTIBOOSTER_SCREENSHOTS"],
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

export function getProject(id: Project["id"]): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByProminence(): Project[] {
  return [...projects].sort((a, b) => a.prominence - b.prominence);
}
