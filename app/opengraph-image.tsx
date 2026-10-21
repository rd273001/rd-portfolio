import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { createOpenGraphImage, openGraphSize } from "@/lib/og";

export const alt = site.defaultTitle;
export const size = openGraphSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOpenGraphImage({
    kicker: "Software Engineer · Web & Mobile Experiences",
    title: "Interface craft, production reliability, and measurable product outcomes.",
    description: profile.positioning,
  });
}