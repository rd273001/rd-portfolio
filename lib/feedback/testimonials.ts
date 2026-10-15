import { getVerifiedTestimonials } from "@/content/testimonials";
import type { Testimonial } from "@/content/types";

import { listPublishedTestimonials } from "./queries";

export async function getHomepageTestimonials(): Promise<Testimonial[]> {
  const seed = getVerifiedTestimonials();

  try {
    const published = await listPublishedTestimonials();
    const seen = new Set(published.map((item) => item.id));

    return [...published, ...seed.filter((item) => !seen.has(item.id))];
  } catch {
    return seed;
  }
}