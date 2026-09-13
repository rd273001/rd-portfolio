import type { Site } from "./types";

export const site: Site = {
  name: "Ravi Dubey",
  domain: "ravidubey.in",
  canonicalUrl: "https://ravidubey.in",
  titleTemplate: "%s · Ravi Dubey",
  defaultTitle: "Ravi Dubey · Software Engineer",
  description:
    "Software Engineer specializing in web and mobile experiences. Production React and React Native work, including the DFC App and AptiBooster.",
  locale: "en_IN",
  navigation: [
    {
      id: "about",
      label: "About",
      href: "#about",
    },
    {
      id: "contact",
      label: "Contact",
      href: "#contact",
    },
  ],
  contact: {
    title: "Let’s build something useful.",
    description:
      "I’m open to conversations about software engineering roles and thoughtful product work.",
    primarySocialId: "email",
    secondarySocialId: "linkedin",
  },
};
