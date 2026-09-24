import { Container } from "@/components/primitives";
import { experience } from "@/content/experience";
import { getMetricsByIds } from "@/content/metrics";
import { CareerJourneyMotion } from "./career-journey/CareerJourneyMotion";

export function CareerJourney() {
  const timelineItems = experience.filter(
    (item) => item.company && item.role && item.summary,
  );

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <CareerJourneyMotion>
      <Container>
        <div
          data-journey-layout
          className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-stretch lg:gap-16"
        >
          <div className="min-w-0">
            <div data-journey-intro className="lg:sticky lg:top-20">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Career journey
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              From interface craft to production ownership.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Follow the roles and measurable results that shaped how I build,
              ship, and maintain product experiences.
            </p>
            </div>
          </div>

          <div data-journey-list className="relative">
            <span
              aria-hidden="true"
              className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-border"
            />
            <span
              aria-hidden="true"
              data-journey-progress
              className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px origin-top bg-foreground"
            />

            <ol className="space-y-5">
              {timelineItems.map((item, index) => {
                const relatedMetrics = getMetricsByIds(item.metricIds);

                return (
                  <li
                    key={item.id}
                    data-journey-step
                    className="relative pl-12"
                  >
                    <div
                      aria-hidden="true"
                      data-journey-badge
                      className="absolute left-0 top-1 grid size-8 place-items-center rounded-full border border-border bg-background font-mono text-xs font-medium"
                    >
                      {index + 1}
                    </div>

                    <article
                      data-journey-card
                      className="rounded-3xl border border-border bg-surface p-5 sm:p-6"
                    >
                      <p className="text-sm font-medium text-muted">
                        {item.company}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                        {item.role}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted">
                        {item.summary}
                      </p>

                      {relatedMetrics.length > 0 ? (
                        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                          {relatedMetrics.map((metric) => (
                            <div
                              key={metric.id}
                              className="rounded-2xl border border-border p-4"
                            >
                              <dt className="text-xs leading-5 text-muted">
                                {metric.label}
                              </dt>
                              <dd className="mt-1 text-lg font-semibold tracking-tight">
                                {metric.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Container>
    </CareerJourneyMotion>
  );
}