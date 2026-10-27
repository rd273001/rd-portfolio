import Link from "next/link";

import { ArrowDownIcon, Button, Container } from "@/components/primitives";
import { getMetricsForSurface } from "@/content/metrics";
import { profile } from "@/content/profile";
import { getPublicResume } from "@/content/resume";

export function Hero() {
  const heroMetrics = getMetricsForSurface("hero");
  const resume = getPublicResume();

  return (
    <section id="hero" className="scroll-mt-20 overflow-hidden py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {profile.identity}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-5 text-xl leading-8 tracking-tight text-foreground sm:text-2xl sm:leading-9">
            {profile.headline}
          </p>
          <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {profile.summary}
          </p>

          <div className="mt-8">
            <div className="flex flex-row items-center gap-3">
              <Button
                href="/#work"
                className="flex-1 whitespace-nowrap px-5 sm:w-auto sm:flex-initial sm:min-w-40"
              >
                View my work
              </Button>
              {resume ? (
                <Button
                  href={resume.href}
                  variant="secondary"
                  className="flex-1 whitespace-nowrap px-5 sm:w-auto sm:flex-initial sm:min-w-32"
                >
                  Resume
                </Button>
              ) : null}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              Have a role or a problem in mind?{" "}
              <Link
                href="/#contact"
                className="group inline-flex touch-manipulation items-center gap-1.5 font-medium text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-foreground active:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                <span>Let’s talk</span>
                <ArrowDownIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-y-0.5 group-active:!translate-y-1 group-active:duration-100 motion-reduce:transform-none" />
              </Link>
            </p>
          </div>

          {heroMetrics.length > 0 ? (
            <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.id} className="bg-surface px-5 py-5">
                  <dd className="text-2xl font-semibold tracking-tight">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 text-sm leading-5 text-muted">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Container>
    </section>
  );
}