import { site } from "@/content/site";
import { createOpenGraphImage, openGraphSize } from "@/lib/og";

export const alt = "Share feedback & testimonials · Ravi Dubey";
export const size = openGraphSize;
export const contentType = "image/png";

export default function FeedbackOpenGraphImage() {
  return createOpenGraphImage({
    kicker: site.contact.feedback.eyebrow,
    title: site.contact.feedback.title,
    description: site.contact.feedback.intro,
  });
}

