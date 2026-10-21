import type { Site } from "./types";

export const site: Site = {
  name: "Ravi Dubey",
  domain: "ravidubey.in",
  canonicalUrl: "https://ravidubey.in",
  titleTemplate: "%s · Ravi Dubey",
  defaultTitle: "Ravi Dubey · Software Engineer",
  description:
    "Specializing in Web & Mobile Experiences. Focused on interface craft, production reliability, and measurable product outcomes.",
  locale: "en_IN",
  navigation: [
    {
      id: "about",
      label: "About",
      href: "/#about",
    },
    {
      id: "impact",
      label: "Impact",
      href: "/#impact",
    },
    {
      id: "experience",
      label: "Experience",
      href: "/#experience",
    },
    {
      id: "work",
      label: "Work",
      href: "/#work",
    },
    {
      id: "skills",
      label: "Skills",
      href: "/#skills",
    },
    {
      id: "contact",
      label: "Contact",
      href: "/#contact",
    },
  ],
  headerUtilitySocialIds: ["github", "linkedin"],
  contact: {
    title: "Let’s build something useful.",
    description:
      "I’m open to conversations about software engineering roles and thoughtful product work.",
    primarySocialId: "email",
    secondarySocialId: "linkedin",
    inquiry: {
      eyebrow: "Contact",
      title: "Send a message",
      description:
        "Use the form for roles, product work, or a short question. Email still works if you prefer.",
      submitLabel: "Send message",
      reasons: [
        { id: "role", label: "Software engineering role" },
        { id: "product", label: "Product or collaboration" },
        { id: "other", label: "Something else" },
      ],
    },
    feedback: {
      eyebrow: "Feedback",
      intro:
        "For collaborators only — not for job applications. Your note stays private unless we agree to publish it later.",
      title: "Leave feedback",
      description: "",
      submitLabel: "Send feedback",
    },
  },
  features: {
    mobile3DShowcase: false,
  },
};