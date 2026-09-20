import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    id: "dfc-software-engineer",
    company: "Dnyandeep Foundation Centre",
    companyUrl: "https://dfc.org.in/",
    role: "Software Engineer 1 (Mobile)",
    start: "TODO_CURRENT_ROLE_START",
    end: "Present",
    startStatus: "placeholder",
    endStatus: "verified",
    kind: "production-app",
    prominence: 1,
    summary:
      "Production ownership of DFC and AptiBooster, from feature work through Play Store release and maintenance.",
    highlights: [
      "Own and maintain two production Android apps: DFC and AptiBooster.",
      "Shipped a new DFC codebase on the existing Play listing and built the full onboarding flow with TypeScript, TanStack Query, authentication/API integration, and stronger error handling.",
      "Shipped a Firebase Crashlytics logger for fatal and non-fatal exceptions, with stack trace, API URL, and component context, plus axios interceptors that log only the errors that should be logged.",
      "Moved Zoom Meeting SDK out of DFC base delivery with an Android Dynamic Feature Module.",
      "Built AptiBooster so scoring, peer comparison, and analysis all derive from one timed test attempt.",
    ],
    technologies: [
      "React Native",
      "TypeScript",
      "TanStack Query",
      "Firebase",
      "OneSignal",
      "Razorpay",
      "Zoom Meeting SDK",
    ],
    metricIds: [],
    projectIds: ["dfc-app", "aptibooster"],
  },
  {
    id: "ikior-intern",
    company: "IKIOR",
    role: "Software Engineer Intern",
    start: "May 2023",
    end: "Nov 2023",
    startStatus: "verified",
    endStatus: "verified",
    kind: "internship",
    prominence: 4,
    summary:
      "Internship focused on React Native and React UI. Keep this section concise and do not present IKIOR as a flagship product.",
    highlights: [
      "Built responsive, pixel-perfect UI from Figma.",
      "Worked with React Native, React, Redux Toolkit, Context API, and JavaScript.",
      "Contributed to a 20–25% performance improvement.",
    ],
    technologies: [
      "React Native",
      "React",
      "Redux Toolkit",
      "Context API",
      "JavaScript",
      "Figma",
    ],
    metricIds: [],
    projectIds: ["ikior"],
  },
];