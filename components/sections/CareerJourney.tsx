import { Container } from "@/components/primitives";
import { experience } from "@/content/experience";
import { getMetricsByIds } from "@/content/metrics";
import type { Experience } from "@/content/types";
import { HOME_EXPERIENCE_TECH_VISIBLE } from "@/lib/home-card-limits";
import { CareerJourneyMotion } from "./career-journey/CareerJourneyMotion";

function getExperienceCertificateUrl(credentialUrl?: string) {
  if (!credentialUrl || credentialUrl.startsWith("TODO_")) {
    return undefined;
  }

  return credentialUrl;
}

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
                const dateRange = getVisibleDateRange(item);
                const certificateUrl = getExperienceCertificateUrl(item.credentialUrl);
                const visibleTechnologies = item.technologies.slice(
                  0,
                  HOME_EXPERIENCE_TECH_VISIBLE,
                );

                return (
                  <li
                    key={item.id}
                    data-journey-step
                    className="relative pl-12"
                  >
                    <div
                      aria-hidden="true"
                      data-journey-badge
                      className="absolute left-0 top-1 grid size-8 place-items-center rounded-full border border-border bg-background font-mono text-xs font-medium text-muted transition-all duration-300 data-[active=true]:border-foreground data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:ring-4 data-[active=true]:ring-foreground/5"
                    >
                      {index + 1}
                    </div>

                    <article
                      data-journey-card
                      className="rounded-3xl border border-border bg-surface p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          {item.companyUrl ? (
                            <a
                              href={item.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex text-sm font-medium text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              {item.company}
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-muted">
                              {item.company}
                            </p>
                          )}
                          <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                            {item.role}
                          </h3>
                        </div>

                        {dateRange ? (
                          <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted">
                            {dateRange}
                          </p>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-muted">
                        {item.summary}
                      </p>

                      {certificateUrl ? (
                        <a
                          href={certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-xs text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          View internship certificate
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : null}

                      {item.highlights.length > 0 ? (
                        <ul className="mt-4 grid gap-2 text-xs leading-5 text-foreground sm:grid-cols-2">
                          {item.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-2">
                              <span
                                aria-hidden="true"
                                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground"
                              />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

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

                      {visibleTechnologies.length > 0 ? (
                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {visibleTechnologies.map((technology) => (
                            <li
                              key={technology}
                              className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted"
                            >
                              {technology}
                            </li>
                          ))}
                        </ul>
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