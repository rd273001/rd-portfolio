import { getVerifiedTestimonials } from "@/content/testimonials";
import type { Testimonial } from "@/content/types";

import { listPublishedTestimonials } from "./queries";

export async function getHomepageTestimonials(): Promise<Testimonial[]> {
  const seed = getVerifiedTestimonials();

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Testimonials fetch timeout")), 2000),
    );
    const published = await Promise.race([
      listPublishedTestimonials(),
      timeoutPromise,
    ]);
    const seen = new Set(published.map((item) => item.id));

    return [...published, ...seed.filter((item) => !seen.has(item.id))];
  } catch {
    return seed;
  }
}