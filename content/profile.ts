import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ravi Dubey",
  firstName: "Ravi",
  currentTitle: "Software Engineer 1 (Mobile)",
  identity: "Software Engineer",
  positioning: "Software Engineer specializing in Web & Mobile Experiences",
  employer: "Dnyandeep Foundation Centre",
  employerShort: "DFC",
  employerUrl: "https://dfc.org.in/",
  location: "Remote",
  locationStatus: "verified",
  headline: "Software Engineer specializing in Web & Mobile Experiences",
  summary:
    "I build and own production web and mobile experiences. At Dnyandeep Foundation Centre I maintain DFC and AptiBooster — including the DFC mobile revamp, payments, notifications, and Android delivery work with verified Play Console results.",
  currentRoleStarted: "Apr 2025",
  currentRoleStartedStatus: "placeholder",
  photo: {
    src: "/profile/ravi-dubey.jpg",
    alt: "Ravi Dubey",
    status: "verified",
  },
};

export function getVerifiedProfilePhoto(): { src: string; alt: string } | null {
  const photo = profile.photo;
  const src = photo?.src.trim();

  if (!photo || photo.status !== "verified" || !src) {
    return null;
  }

  return { src, alt: photo.alt };
}