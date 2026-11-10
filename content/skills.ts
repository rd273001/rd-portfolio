import type { SkillGroup } from "./types";

export const skillsIntro = {
  eyebrow: "Skills",
  title:
    "A practical engineering stack shaped by production web, mobile, and full-stack work.",
} as const;

export const skills: SkillGroup[] = [
  {
    id: "frontend-mobile",
    label: "Frontend & Mobile",
    featured: true,
    items: [
      "React",
      "React Native",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Redux Toolkit",
      "TanStack Query",
      "GSAP",
      "Firebase",
    ],
  },
  {
    id: "backend-data",
    label: "Backend & Data",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Supabase",
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Resend",
    ],
  },
  {
    id: "tooling",
    label: "Tooling",
    items: [
      "Git",
      "GitHub",
      "Android Studio",
      "Postman",
      "Figma",
    ],
  },
  {
    id: "ai-ides",
    label: "AI IDEs",
    items: ["Cursor", "Antigravity"],
  },
  {
    id: "working-knowledge",
    label: "Working knowledge",
    items: ["Java", "Spring Boot", "Hibernate"],
  },
];
