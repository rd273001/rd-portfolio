import { Container } from "@/components/primitives";
import { experience } from "@/content/experience";
import type { Experience } from "@/content/types";

function getVisibleDateRange(item: Experience) {
  const start =
    item.startStatus === "verified" && item.start.trim().length > 0
      ? item.start
      : undefined;
  const end =
    item.endStatus === "verified" && item.end.trim().length > 0
      ? item.end
      : undefined;

  if (start && end) {
    return `${start} - ${end}`;
  }

  if (end === "Present") {
    return "Current role";
  }

  return end ?? start;
}

export function ExperienceSection() {
  const visibleExperience = experience.filter(
    (item) => item.company && item.role && item.summary,
  );

  if (visibleExperience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Experience
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Production ownership with a strong web and mobile foundation.
          </h2>
        </div>

        <div className="mt-10 space-y-5">
          {visibleExperience.map((item) => {
            const dateRange = getVisibleDateRange(item);

            return (
              <article
                key={item.id}
                className="rounded-3xl border border-border bg-surface p-6 shadow-[0_16px_40px_-34px_rgba(17,17,17,0.45)] sm:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">
                      {item.role}
                    </h3>
                    {item.companyUrl ? (
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex rounded-md text-base text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                      >
                        {item.company}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <p className="mt-2 text-base text-muted">
                        {item.company}
                      </p>
                    )}
                  </div>

                  {dateRange ? (
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted">
                      {dateRange}
                    </p>
                  ) : null}
                </div>

                <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
                  {item.summary}
                </p>

                {item.highlights.length > 0 ? (
                  <ul className="mt-6 grid gap-3 text-sm leading-6 text-foreground sm:grid-cols-2">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.technologies.length > 0 ? (
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {item.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}