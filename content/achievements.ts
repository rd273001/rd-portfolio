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
      "Shipped a new DFC codebase on the existing Play listing, replacing the legacy JavaScript app. Designed and implemented the full onboarding flow with TypeScript, TanStack Query, and modern API and auth patterns.",
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
    title: "DFC initial-load work",
    description:
      "Improved DFC initial load with lazy loading and startup-path refactors. No measured time delta is recorded yet.",
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
      "Every insight in AptiBooster — peer comparison, speed vs accuracy, difficulty sensitivity, consistency, and subject analytics — traces back to telemetry captured during a single timed test attempt.",
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
