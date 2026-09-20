import { Container } from "@/components/primitives";
import { getMetricsForSurface } from "@/content/metrics";

export function ImpactDashboard() {
  const impactMetrics = getMetricsForSurface("impact");

  if (impactMetrics.length === 0) {
    return null;
  }

  return (
    <section id="impact" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Engineering impact
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Measurable improvements across shipped mobile products.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Verified production results from DFC and AptiBooster — release
            optimization and measured delivery improvements.
          </p>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {impactMetrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-3xl border border-border bg-surface p-5 shadow-[0_16px_40px_-34px_rgba(17,17,17,0.45)]"
            >
              <dt className="text-sm leading-5 text-muted">{metric.label}</dt>
              <dd className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                {metric.percentage ?? metric.value}
              </dd>

              {metric.previous && metric.current ? (
                <p className="mt-3 text-sm leading-6 text-muted">
                  {metric.previous} to {metric.current}
                </p>
              ) : null}

              {metric.note ? (
                <p className="mt-3 text-sm leading-6 text-muted">
                  {metric.note}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}