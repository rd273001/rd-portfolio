import type { Social } from "./types";

export const socials: Social[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/rd273001",
    status: "verified",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ravi-dubey-948130174",
    status: "verified",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:ravidubey.personal@gmail.com",
    status: "verified",
  },
  {
    id: "medium",
    label: "Medium",
    href: "https://medium.com/@rd273001",
    status: "verified",
  },
  {
    id: "devto",
    label: "DEV",
    href: "https://dev.to/@rd273001",
    status: "placeholder",
  },
];

export function getInboxEmail(): string | null {
  const email = socials.find(
    (item) => item.id === "email" && item.status === "verified",
  );

  if (!email?.href.startsWith("mailto:")) {
    return null;
  }

  const address = email.href.slice("mailto:".length).split("?")[0]?.trim();
  return address || null;
}

export function getVerifiedSocialsByIds(ids: readonly string[]): Social[] {
  return ids.flatMap((id) => {
    const social = socials.find(
      (item) => item.id === id && item.status === "verified",
    );

    return social ? [social] : [];
  });
}