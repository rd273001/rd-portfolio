import Image from "next/image";

import { Button } from "@/components/primitives";
import type { MobileShowcaseProject } from "./types";

type MobileShowcasePresentationProps = {
  projects: MobileShowcaseProject[];
};

export function MobileShowcasePresentation({
  projects,
}: MobileShowcasePresentationProps) {
  return (
    <div className="overflow-hidden rounded-4xl border border-foreground bg-foreground text-background">
      <MobileShowcaseHeader />

      <div className="grid gap-8 border-t border-background/15 p-5 sm:p-7 lg:grid-cols-2 lg:p-9">
        {projects.map((project) => (
          <article key={project.id} className="flex min-w-0 flex-col">
            <MobileProjectPhone project={project} />

            <div className="mt-6">
              <p className="text-sm font-medium text-background/65">
                {project.role}
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                {project.name}
              </h4>
              <p className="mt-3 text-sm leading-6 text-background/70">
                {project.tagline}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={project.caseStudyHref}
                  className="bg-background text-foreground focus-visible:outline-background"
                >
                  Read case study
                </Button>
                {project.storeUrl ? (
                  <Button
                    href={project.storeUrl}
                    variant="secondary"
                    className="border-background/30 text-background hover:bg-background/10 focus-visible:outline-background"
                  >
                    View on Play Store
                  </Button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MobileShowcaseHeader() {
  return (
    <div className="max-w-3xl p-6 sm:p-8 lg:p-10">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-background/65">
        Production mobile systems
      </p>
      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
        Shipped apps, framed by engineering outcomes.
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-7 text-background/70">
        A product-focused view of the mobile experiences I own, improve, and
        support in production.
      </p>
    </div>
  );
}

export function MobileProjectPhone({
  project,
  screenshotIndex = 0,
}: {
  project: MobileShowcaseProject;
  screenshotIndex?: number;
}) {
  const screenshot = project.screenshots[screenshotIndex];

  return (
    <div className="mx-auto w-full max-w-68 rounded-[2.75rem] border border-background/20 bg-background/10 p-2 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.25rem] bg-background text-foreground">
        {screenshot ? (
          <Image
            src={screenshot}
            alt={`${project.name} production app screen`}
            fill
            sizes="(min-width: 1024px) 272px, (min-width: 640px) 40vw, 80vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full flex-col p-6 pt-12">
            <p className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted">
              Engineering view
            </p>
            <p className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
              {project.name}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {project.tagline}
            </p>

            {project.metrics.length > 0 ? (
              <dl className="mt-auto grid gap-3">
                {project.metrics.slice(0, 2).map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-2xl border border-border p-4"
                  >
                    <dt className="text-xs leading-5 text-muted">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tracking-tight">
                      {metric.value}
                    </dd>
                    {metric.previous && metric.current ? (
                      <p className="mt-1 text-[0.7rem] leading-5 text-muted">
                        {metric.previous} to {metric.current}
                        {metric.percentage ? ` (${metric.percentage})` : ""}
                      </p>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}