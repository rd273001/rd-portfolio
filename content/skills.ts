import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    id: "primary",
    label: "Primary",
    items: ["React", "React Native", "TypeScript", "JavaScript", "Next.js"],
  },
  {
    id: "additional",
    label: "Additional",
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "MySQL",
      "TanStack Query",
      "Axios",
      "Redux Toolkit",
      "Tailwind CSS",
      "Java",
      "Spring Boot",
      "Hibernate",
      "REST APIs",
    ],
  },
  {
    id: "tooling",
    label: "Tooling",
    items: [
      "Git",
      "GitHub",
      "Android Studio",
      "Figma",
      "Firebase",
      "Cursor",
    ],
  },
];
