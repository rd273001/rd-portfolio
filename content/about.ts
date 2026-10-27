import type { AboutContent } from "./types";

export const about: AboutContent = {
  eyebrow: "About me",
  headline: 'I care about what happens after "it works".',
  lead: "How it feels. How it performs. How it holds up in the hands of real people.",
  paragraphs: [
    "I'm a software engineer working across modern web and mobile experiences. Having shipped and maintained production mobile apps at scale with React Native and TypeScript, I bring that same engineering rigor, state-management discipline, and interface craft to building modern web applications with React, Next.js, and TypeScript.",
    "I enjoy turning complex product requirements into clean, dependable interfaces — and taking end-to-end engineering ownership of what ships.",
  ],
  location: "Gorakhpur, Uttar Pradesh, India",
  pillars: [
    {
      title: "Mobile experiences",
      items: ["React Native", "TypeScript", "Android", "On-demand delivery"],
    },
    {
      title: "Web engineering",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "APIs"],
    },
    {
      title: "Foundation & craft",
      items: [
        "PG Diploma in Advanced Computing",
        "C-DAC",
        "Performance & UI craft",
      ],
    },
  ],
};
