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
    "Building and scaling web and mobile products with end-to-end production ownership — focusing on what matters after release: performance, crash reliability, and real-world delivery.",
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