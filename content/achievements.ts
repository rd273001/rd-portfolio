import type { Achievement } from "./types";

export const achievements: Achievement[] = [
  {
    id: "dfc-zoom-ondemand",
    title: "On-demand Zoom delivery",
    description:
      "Moved Zoom Meeting SDK out of DFC base delivery with an Android Dynamic Feature Module, cutting 161 MB from the base download path.",
    metricId: "dfc-zoom-delivery",
    status: "verified",
  },
  {
    id: "dfc-bundle",
    title: "DFC bundle optimization",
    description:
      "Reduced the Android App Bundle from 21.02 MB to 15 MB — 6.02 MB saved, 28.6% smaller.",
    metricId: "dfc-bundle-optimization",
    status: "verified",
  },
  {
    id: "crashlytics-contextual-logger",
    title: "Contextual Crashlytics logging",
    description:
      "Implemented a Firebase Crashlytics logger for fatal and non-fatal exceptions in DFC and AptiBooster, with stack trace, API URL, and component context, plus axios interceptors that log only the errors that should be logged.",
    status: "verified",
  },
  {
    id: "dfc-mobile-revamp",
    title: "DFC mobile revamp",
    description:
      "Led the DFC mobile revamp on the existing Play listing with a new TypeScript and TanStack Query codebase, including the full student onboarding flow built from scratch.",
    status: "verified",
  },
  {
    id: "dfc-multi-role",
    title: "DFC student, teacher, and admin roles",
    description:
      "Implemented using DFC with student, teacher, and admin roles in the same product.",
    status: "verified",
  },
  {
    id: "dfc-startup-load",
    title: "DFC startup, deep links, and offline",
    description:
      "Lazy-loaded navigators and startup-path refactors on the existing Play production app: p90 app start ~894 ms → ~794 ms (~100 ms faster). ~5 MB lower JS heap at Home idle in internal profiling after the same work. Deep links and offline for core flows.",
    metricId: "dfc-app-start-p90",
    status: "verified",
  },
  {
    id: "aptibooster-bundle",
    title: "AptiBooster release optimization",
    description:
      "Reduced release size from 23.7 MB to 20.4 MB — 3.3 MB, about 13.9%.",
    metricId: "aptibooster-bundle-optimization",
    status: "verified",
  },
  {
    id: "aptibooster-test-telemetry",
    title: "AptiBooster test as the data source",
    description:
      "Peer comparison, speed vs accuracy, difficulty sensitivity, consistency, and subject analytics trace back to telemetry from a single timed test attempt—the data foundation for analysis across the app.",
    status: "verified",
  },
  {
    id: "aptibooster-analysis-surfaces",
    title: "AptiBooster analysis and report surfaces",
    description:
      "Shipped mobile flows for full test analysis (insight callouts), Analytics personalized suggestions, and Profile download reports—consuming production APIs that return generated analysis content tied to test telemetry.",
    status: "verified",
  },
  {
    id: "aptibooster-exam-rendering",
    title: "HTML + LaTeX exam rendering",
    description:
      "Detected mixed content (math-tex) and rendered MathJax vs HTML, including tables, match-the-following, and chemical equations, in live test, review, and flashcards.",
    status: "verified",
  },
  {
    id: "aptibooster-chapter-trial",
    title: "Chapter-based AptiBooster trial",
    description:
      "Free users get the first 2 chapters of every subject. Start test, flashcards, and search all respect the same rule, with Razorpay unlocking the rest of the syllabus and full analysis.",
    status: "verified",
  },
];
