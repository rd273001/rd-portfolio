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
      "Production ownership of the DFC App and AptiBooster, from feature work through Play Store release and maintenance.",
    highlights: [
      "Own and maintain two production Android apps: DFC App and AptiBooster.",
      "Modernized DFC onboarding with TypeScript, TanStack Query, authentication/API integration, and stronger error handling.",
      "Moved Zoom Meeting SDK out of base delivery with an Android Dynamic Feature Module.",
      "Integrated Firebase Crashlytics, Analytics, Performance Monitoring, OneSignal, and Razorpay.",
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
    metricIds: [
      "dfc-downloads",
      "dfc-bundle-optimization",
      "dfc-zoom-delivery",
      "aptibooster-downloads",
      "aptibooster-bundle-optimization",
    ],
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
    metricIds: ["ikior-performance"],
    projectIds: ["ikior"],
  },
];