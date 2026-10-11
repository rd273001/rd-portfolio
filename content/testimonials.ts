import type { Testimonial } from "./types";

export const testimonials: Testimonial[] = [];

export function getVerifiedTestimonials(): Testimonial[] {
  return testimonials.filter(
    (item) =>
      item.status === "verified" &&
      item.quote.trim().length > 0 &&
      item.name.trim().length > 0,
  );
}