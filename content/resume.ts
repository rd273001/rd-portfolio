import type { Resume } from "./types";

/**
 * Prefer a file in /public (for example "/resume/ravi-dubey.pdf") on
 * ravidubey.in for faster opens and stable caching. External URLs are supported.
 * Links open in the browser; they do not force a download.
 */
export const resume: Resume = {
  label: "Resume",
  url: "/resume/ravi-dubey-resume.pdf",
  status: "verified",
};

export function getPublicResume(): {
  id: string;
  href: string;
  label: string;
} | null {
  const url = resume.url?.trim();

  if (resume.status !== "verified" || !url) {
    return null;
  }

  return {
    id: "resume",
    href: url,
    label: resume.label,
  };
}