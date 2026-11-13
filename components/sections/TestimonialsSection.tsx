import { Container } from "@/components/primitives";
import { getHomepageTestimonials } from "@/lib/feedback/testimonials";

import { TestimonialsMarquee } from "./testimonials/TestimonialsMarquee";

export async function TestimonialsSection() {
  const quotes = await getHomepageTestimonials();

  if (quotes.length === 0) {
    return null;
  }

  return (
    <section id="collaborators" className="scroll-mt-20 overflow-hidden border-t border-border py-14 sm:py-16">
      <Container>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Feedback & Endorsements
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          What people are saying
        </h2>
      </Container>
      <TestimonialsMarquee items={quotes} />
    </section>
  );
}
