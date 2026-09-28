import { Container } from "@/components/primitives";
import { getMetricsForSurface } from "@/content/metrics";
import type { Metric } from "@/content/types";

function isAssetMetric(metric: Metric) {
  return metric.id.startsWith("site-3d-") || metric.id.startsWith("site-phone-");
}

function isLabMetric(metric: Metric) {
  return metric.id.startsWith("site-lighthouse-");
}

function SiteMetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[0_16px_40px_-34px_rgba(17,17,17,0.45)]">
      <dt className="text-sm leading-5 text-muted">{metric.label}</dt>
      <dd className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
        {metric.value}
        {metric.note ? (
          <span className="mt-3 block text-sm font-normal leading-6 tracking-normal text-muted">
            {metric.note}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function SiteMetricGroup({
  title,
  metrics,
  className,
}: {
  title: string;
  metrics: Metric[];
  className: string;
}) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {title}
      </p>
      <dl className={className}>
        {metrics.map((metric) => (
          <SiteMetricCard key={metric.id} metric={metric} />
        ))}
      </dl>
    </div>
  );
}

export function SiteMetrics() {
  const siteMetrics = getMetricsForSurface("site");
  const assetMetrics = siteMetrics.filter(isAssetMetric);
  const labMetrics = siteMetrics.filter(isLabMetric);

  if (siteMetrics.length === 0) {
    return null;
  }

  return (
    <section id="site-metrics" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            This website
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Engineering baseline for this site.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            The Work section’s original 3D phone and measured asset sizes below.
            PageSpeed score cards are filled from{" "}
            <a
              href="https://pagespeed.web.dev/analysis?url=https://www.ravidubey.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              PageSpeed Insights
            </a>{" "}
            on the live homepage (28 Sep 2026) — not localhost lab runs. SEO and
            Best Practices were 100 in the same PageSpeed runs.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          <SiteMetricGroup
            title="3D assets"
            metrics={assetMetrics}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          />
          <SiteMetricGroup
            title="PageSpeed (live)"
            metrics={labMetrics}
            className="mt-4 grid gap-4 sm:grid-cols-3"
          />
        </div>
      </Container>
    </section>
  );
}
