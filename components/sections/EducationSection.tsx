import { Container } from "@/components/primitives";
import { education } from "@/content/education";

export function EducationSection() {
  const verifiedEducation = education.filter(
    (item) =>
      item.status === "verified" &&
      item.institution &&
      item.credential &&
      item.start &&
      item.end,
  );

  if (verifiedEducation.length === 0) {
    return null;
  }

  return (
    <section id="education" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Education
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Academic background.
          </h2>
        </div>

        <div className="mt-10 grid gap-4">
          {verifiedEducation.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-border bg-surface p-5 sm:p-6"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {item.credential}
              </h3>
              <p className="mt-2 text-base text-muted">{item.institution}</p>
              <p className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted">
                {item.start} - {item.end}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}