import type { Achievement } from "./types";

export const achievements: Achievement[] = [
  {
    id: "dfc-zoom-ondemand",
    title: "On-demand Zoom delivery",
    description:
      "On-demand Zoom for live lectures—download progress, cancel, restart after install, resume in-meeting—via feature_zoom (161 MB on-demand on Play): 15.9 MB base new-install download vs 177 MB prior production with Zoom in base (161.1 MB Release delivery reduction).",
    metricId: "dfc-zoom-delivery",
    status: "verified",
  },
  {
    id: "dfc-bundle",
    title: "DFC base bundle optimization (production)",
    description:
      "Reduced production base app bundle download size on Google Play from 21.02 MB to 15.9 MB (5.12 MB / 24.36%) on an earlier production release—alongside the on-demand Zoom release that cut new-install delivery from 177 MB to 15.9 MB.",
    metricId: "dfc-bundle-optimization",
    status: "verified",
  },
  {
    id: "dfc-production-stability",
    title: "DFC production stability",
    description:
      "After the TypeScript rebuild and native delivery work, Google Play reports 0.1% user-perceived crash rate on current production—10.36% lower than the pre-revamp baseline when I took over mobile.",
    metricId: "dfc-crash-rate-improvement",
    status: "verified",
  },
  {
    id: "crashlytics-contextual-logger",
    title: "Contextual Crashlytics logging",
    description:
      "Implemented a Firebase Crashlytics logger for fatal and non-fatal exceptions in DFC and AptiBooster, with stack trace, API URL, and component context, plus selective axios interceptors that report actionable failures without flooding Crashlytics.",
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
    title: "DFC multi-role product on one listing",
    description:
      "Students, teachers, and admins use the same Play listing with role-based access—one product architecture instead of separate apps.",
    status: "verified",
  },
  {
    id: "dfc-startup-load",
    title: "DFC startup, deep links, and offline",
    description:
      "Lazy-loaded navigators and startup-path refactors on the existing Play production app: p90 app start ~894 ms → 794 ms (~100 ms / 11.2% faster). ~5 MB lower JS heap at Home idle in internal profiling after the same work. Deep links and offline for core flows.",
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
      "Free users get the first 2 chapters of every subject. Start test, flashcards, and search all respect the same rule; subscriptions unlock the rest of the syllabus and full analysis.",
    status: "verified",
  },
  {
    id: "aptibooster-razorpay-subscriptions",
    title: "AptiBooster Razorpay subscriptions",
    description:
      "In-app subscription payments via Razorpay React Native SDK, tied to chapter trial and premium unlock.",
    status: "verified",
  },
  {
    id: "site-3d-assets",
    title: "Original Android phone 3D showcase",
    description:
      "Procedural GLB for the Work section phone: 5.73 MB (68,056 triangles) plus a 1.44 MB studio HDR — 7.17 MB on the desktop WebGL path. Mobile keeps the 2D frame. Baseline 26 Sep 2026; intended to shrink in the asset perf pass without changing the look.",
    metricId: "site-3d-payload",
    status: "verified",
  },
  {
    id: "site-lighthouse",
    title: "Portfolio PageSpeed scores",
    description:
      "PageSpeed Insights on https://www.ravidubey.in (28 Sep 2026): mobile Performance 94, desktop Performance 95, Accessibility 96. SEO and Best Practices were 100 in the same runs.",
    metricId: "site-lighthouse-mobile-performance",
    status: "verified",
  },
];
