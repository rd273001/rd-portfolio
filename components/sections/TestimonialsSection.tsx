import { Container } from "@/components/primitives";
import { getVerifiedTestimonials } from "@/content/testimonials";

export function TestimonialsSection() {
  const quotes = getVerifiedTestimonials();

  if (quotes.length === 0) {
    return null;
  }

  return (
    <section id="collaborators" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Collaborators
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
          What collaborators say
        </h2>
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {quotes.map((item) => (
            <li
              key={item.id}
              className="rounded-3xl border border-border bg-surface px-6 py-7 sm:px-8"
            >
              <blockquote className="text-base leading-7 text-foreground sm:text-lg sm:leading-8">
                {item.quote}
              </blockquote>
              <p className="mt-5 text-sm font-medium text-foreground">
                {item.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                {item.title}
                {item.company ? ` · ${item.company}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
