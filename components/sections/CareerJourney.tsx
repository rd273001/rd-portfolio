import { Container } from "@/components/primitives";
import { experience } from "@/content/experience";
import { getMetricsForSurface } from "@/content/metrics";

export function CareerJourney() {
  const timelineMetrics = getMetricsForSurface("timeline");
  const timelineItems = experience.filter(
    (item) => item.company && item.role && item.summary,
  );

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <section id="journey" className="border-t border-border py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Career journey
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              A static path from UI craft to production ownership.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              This structure is ready for richer storytelling later, without
              introducing GSAP or scroll-driven behavior in this PR.
            </p>
          </div>

          <ol className="relative space-y-5 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
            {timelineItems.map((item, index) => {
              const relatedMetrics = timelineMetrics.filter(
                (metric) => metric.project && item.projectIds.includes(metric.project),
              );

              return (
                <li key={item.id} className="relative pl-12">
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-1 grid size-8 place-items-center rounded-full border border-border bg-background font-mono text-xs font-medium"
                  >
                    {index + 1}
                  </div>

                  <article className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
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
      </Container>
    </section>
  );
}