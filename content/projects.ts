import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "dfc-app",
    name: "DFC",
    kind: "production-app",
    prominence: 1,
    tagline: "Production education app with on-demand Zoom delivery.",
    summary:
      "Production application with 10K+ downloads, listed on Google Play as Dnyandeep Foundation Centre. I own the revamp on the existing listing — a new TypeScript codebase with onboarding, deep links, offline usage, role-based access, Kotlin/Android native modules where needed, and Android delivery architecture.",
    role: "Software Engineer 1 (Mobile) · production ownership",
    downloads: "10K+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.qkclass.dfc",
    technologies: [
      "React Native",
      "TypeScript",
      "Firebase",
      "OneSignal",
      "TanStack Query",
      "Kotlin",
      "Android (native)",
      "Zoom Meeting SDK",
      "Google Play In-App Updates",
      "Axios",
      "Context API",
    ],
    highlights: [
      "Led the DFC mobile revamp on the existing Play listing: new TypeScript and TanStack Query codebase with auth/API integration and the full student onboarding flow built from scratch.",
      "Shipped a Firebase Crashlytics logger for fatal and non-fatal exceptions, with stack trace, API URL, and component context, plus selective axios interceptors that report actionable failures without flooding Crashlytics.",
      "One Play listing for students, teachers, and admins—role-based access in the same product, not separate apps.",
      "Shipped lazy-loaded navigators and startup-path refactors: p90 app start ~894 ms → 794 ms on production Android (~100 ms / 11.2% faster). Internal profiling showed ~5 MB less JS heap at Home idle after the same work. Deep-link navigation and offline usage for core flows.",
      "Optimized the production Android App Bundle on Google Play from 21.02 MB on an earlier production release to 15.9 MB new-install size today (5.12 MB / 24.36%) on the same listing.",
      "Built live lecture join with on-demand Zoom SDK download—progress, cancel, post-install restart, and resume when a meeting is already running—instead of shipping the full SDK with every install.",
      "Delivered Zoom via an Android Dynamic Feature Module (feature_zoom, 161 MB on-demand on Play) with Kotlin and in-repo SDK patches: 15.9 MB base new-install download vs 177 MB prior production with Zoom in base (161.1 MB Release delivery reduction; 177 − 15.9), 9 s download time, 94 s faster than the prior production release.",
      "Production stability: 0.1% user-perceived crash rate on current production (Google Play)—10.36% lower than the pre-revamp baseline when I took over mobile.",
    ],
    caseStudyHighlights: [
      "Integrated OneSignal for push notifications and in-app messaging on the production app.",
      "Shipped Google Play in-app updates so users can install new releases from inside the app.",
      "Upgraded React Native from 0.76.5 to 0.81.0—updated dependencies for the new RN version, applied Android changes required by the upgrade (including edge-to-edge layout and safe-area handling), and validated behavior across supported OS versions.",
    ],
    metricIds: [
      "dfc-bundle-optimization",
      "dfc-zoom-delivery",
      "dfc-zoom-new-install-size",
      "dfc-zoom-download-time",
      "dfc-zoom-time-improvement",
      "dfc-crash-rate-improvement",
      "dfc-app-start-p90",
      "dfc-js-heap-home-idle",
    ],
    story: {
      eyebrow: "On-demand Zoom delivery",
      title: "The meeting SDK left the base download.",
      lead: "Live lectures still use the Zoom Meeting SDK. On Google Play it ships in an on-demand module so the first install stays small; meeting tools download when a student joins a live lecture.",
      narrative: [],
      chapters: [
        {
          id: "dfc-zoom-before",
          eyebrow: "Before",
          title: "Every install carried the meeting SDK",
          body: "Live lectures use the Zoom Meeting SDK. On the prior production release with Zoom in the base download, a new install was 177 MB before a student joined any class.",
          metricIds: [],
        },
        {
          id: "dfc-zoom-architecture",
          eyebrow: "Architecture",
          title: "On-demand meeting tools",
          body: "On Google Play, the Meeting SDK ships as an on-demand module. The first install stays small; meeting tools download when a student joins a live lecture.",
          metricIds: [],
          screenshots: [
            {
              src: "/screenshots/dfc-app/zoom-on-demand.webp",
              alt: "DFC live lectures with on-demand Zoom module download in progress",
            },
          ],
        },
        {
          id: "dfc-zoom-flow",
          eyebrow: "Product flow",
          title: "Download, restart, join",
          body: "First join shows in-app download progress and cancel, then a restart so native code loads cleanly. The app remembers the lecture and continues after permissions. If a meeting is already running, the same card returns to it.",
          metricIds: [],
          screenshots: [
            {
              src: "/screenshots/dfc-app/zoom-on-demand.webp",
              alt: "DFC live lectures with on-demand Zoom module download in progress",
            },
            {
              src: "/screenshots/dfc-app/zoom-restart-after-download.webp",
              alt: "DFC prompt to restart after meeting tools are downloaded",
            },
            {
              src: "/screenshots/dfc-app/zoom-join-preview.webp",
              alt: "DFC Zoom join preview before entering a live lecture",
            },
          ],
        },
        {
          id: "dfc-zoom-engineering",
          eyebrow: "Under the hood",
          title: "Delivery, not just a smaller number",
          body: "Moving the SDK out of the base install required Play on-demand delivery, native split loading, fixes on older Android versions, and SDK patches so host and student meeting flows worked from the module—not only a better store figure.",
          metricIds: [],
        },
        {
          id: "dfc-zoom-result",
          eyebrow: "Verified result",
          title: "What Google Play recorded",
          body: "Play lists a 15.9 MB base install and a 161 MB on-demand Zoom module. Prior production with Zoom in the base download was 177 MB → 15.9 MB now (161.1 MB less on that path), 9 seconds to download, and 94 seconds faster than the prior release.",
          metricIds: [
            "dfc-zoom-delivery",
            "dfc-zoom-new-install-size",
            "dfc-zoom-download-time",
            "dfc-zoom-time-improvement",
          ],
        },
        {
          id: "dfc-stability",
          eyebrow: "Production stability",
          title: "Lower crash rate after the rebuild",
          body: "On current production, Play reports a 0.1% user-perceived crash rate—10.36% lower than the pre-revamp baseline from when I took over mobile, before the TypeScript rebuild and delivery work.",
          metricIds: ["dfc-crash-rate-improvement"],
        },
      ],
    },
    caseStudyHref: "/work/dfc-app",
    workShowcaseScreenshots: [
      "/screenshots/dfc-app/student-onboarding.webp",
      "/screenshots/dfc-app/zoom-on-demand.webp",
      "/screenshots/dfc-app/zoom-restart-after-download.webp",
      "/screenshots/dfc-app/zoom-join-preview.webp",
    ],
    screenshots: [
      "/screenshots/dfc-app/student-onboarding.webp",
      "/screenshots/dfc-app/zoom-on-demand.webp",
      "/screenshots/dfc-app/zoom-cancel-download.webp",
      "/screenshots/dfc-app/zoom-dfm-preparing.webp",
      "/screenshots/dfc-app/zoom-restart-after-download.webp",
      "/screenshots/dfc-app/zoom-returning-to-lecture.webp",
      "/screenshots/dfc-app/zoom-starting-lecture.webp",
      "/screenshots/dfc-app/zoom-join-preview.webp",
      "/screenshots/dfc-app/student-batches.webp",
    ],
  },
  {
    id: "aptibooster",
    name: "AptiBooster",
    kind: "production-app",
    prominence: 2,
    tagline:
      "Live test telemetry is the source of truth; the mobile app integrates APIs for analysis and AI-backed insights.",
    summary:
      "Production aptitude app with 1K+ downloads, built substantially from scratch. Scoring, peer comparison, and structured analysis data come from one live test client; the mobile app surfaces API-backed insights (including backend-generated analysis and reports).",
    role: "Software Engineer 1 (Mobile) · substantial development from scratch",
    downloads: "1K+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.aptibooster",
    technologies: [
      "React Native",
      "TypeScript",
      "Firebase",
      "Razorpay React Native SDK",
      "Gifted Charts",
      "TanStack Query",
      "MathJax",
      "Microsoft Clarity",
      "Google Play In-App Updates",
      "Context API",
      "Axios",
    ],
    highlights: [
      "Built the live test client so revisits, option changes, and countdown time stay consistent enough to power scoring, peer comparison, and structured analysis data.",
      "In-app subscription payments via Razorpay.",
      "Integrated API-backed analysis UX: insight callouts on full test analysis, personalized suggestions on Analytics, and downloadable performance reports from Profile—the backend produces the content; the app renders and ships the flows.",
      "Enforced a chapter-based trial (first 2 chapters per subject) across tests, flashcards, and search; subscriptions unlock the rest of the syllabus and full analysis.",
      "Rendered exam content with HTML + LaTeX (MathJax when math-tex is present) so tables, formulae, and explanations stay readable in live test, review, and flashcards.",
      "Release optimization from 23.7 MB to 20.4 MB (3.3 MB / ~13.9%).",
    ],
    caseStudyHighlights: [
      "Shipped Google Play in-app updates so users can install new releases from inside the app.",
    ],
    metricIds: ["aptibooster-downloads", "aptibooster-bundle-optimization"],
    caseStudyHref: "/work/aptibooster",
    screenshots: [
      "/screenshots/aptibooster/test-session.webp",
      "/screenshots/aptibooster/test-overview.webp",
      "/screenshots/aptibooster/test-analysis-charts.webp",
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
    tagline: "Wellness mobile internship—period tracking as the hero feature.",
    summary:
      "Software Engineer Intern, May 2023 – Nov 2023. Mobile-only work on a life-and-wellness app: period tracking was the hero feature at the time, with UI inspired by established period and health apps on the Play Store. IKIOR has since shipped a major revamp—today’s app focuses on diet, health, sleep, and care with new UI; most period-tracking and related flows from this era were removed.",
    role: "Software Engineer Intern",
    liveUrl: "https://www.ikior.com/",
    technologies: [
      "React Native",
      "JavaScript",
      "Redux Toolkit",
      "Context API",
      "React Native Video",
      "Figma",
    ],
    highlights: [
      "Period-tracking hero feature: cycle calendar with marked dates and per-day UI built to show insights as analysis and calculations were planned.",
      "Instagram Reels–inspired experience using react-native-video.",
      "Multi-step form flow for period-tracking reports—collecting inputs and presenting a results experience (content was envisioned with clinical input; that scope was not shipped).",
      "Health, Care, and Sleep wellness section UI from Figma—largely removed or redesigned in later revamps.",
    ],
    metricIds: [],
    screenshots: [],
  },
  {
    id: "certificate-generator",
    name: "Certificate Generator",
    kind: "personal-project",
    prominence: 5,
    tagline: "Personal MERN stack project for certificate requests and PDF delivery.",
    summary:
      "Personal learning / full-stack MERN project. Users request certificates, which can be approved, generated as PDFs, and stored on Google Drive via the Google APIs client and Google Drive API.",
    role: "Personal full-stack project",
    liveUrl: "https://certificate-generator1.netlify.app/",
    githubUrl: "https://github.com/rd273001/Certificate_Generator",
    technologies: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Google APIs",
      "Google Drive API",
      "Redux Toolkit",
      "pdf-lib",
      "Axios"
    ],
    highlights: [
      "CRUD and REST APIs for certificate requests (Express, MongoDB, Mongoose).",
      "PDF generation with pdf-lib.",
      "Google APIs client and Google Drive API to upload and manage issued certificates in Drive.",
      "400+ pending requests and 466+ generated certificates.",
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

export function getCaseStudyHighlights(project: Project): string[] {
  return [...project.highlights, ...(project.caseStudyHighlights ?? [])];
}