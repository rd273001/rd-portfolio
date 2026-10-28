import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ravi Dubey",
  firstName: "Ravi",
  currentTitle: "Software Engineer 1 (Mobile)",
  identity: "Software Engineer",
  positioning: "Specializing in Web & Mobile Experiences.",
  employer: "Dnyandeep Foundation Centre",
  employerShort: "DFC",
  employerUrl: "https://dfc.org.in/",
  location: "Gorakhpur, Uttar Pradesh, India",
  locationStatus: "verified",
  headline: "Specializing in Web & Mobile Experiences.",
  summary:
    "Software engineer with 2+ years of experience building and scaling web and mobile applications. At Dnyandeep Foundation Centre, I owned development, native builds, and Play Store releases for DFC (10K+ downloads; 3,554 enrolled students) and AptiBooster (1K+ downloads) — executing the full TypeScript revamp, in-app payments, and Android delivery with verified Play Console results.",
  currentRoleStarted: "Apr 2025",
  currentRoleStartedStatus: "verified",
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