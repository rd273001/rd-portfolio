import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button, Container } from "@/components/primitives";
import { PageShell } from "@/components/sections";
import { AndroidPhoneFrame } from "@/components/sections/mobile-showcase/AndroidPhoneFrame";
import { getMetricsByIds } from "@/content/metrics";
import {
  getCaseStudyProject,
  getCaseStudyProjects,
} from "@/content/projects";
import { site } from "@/content/site";
import type { Project } from "@/content/types";
import { absoluteUrl } from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const projectKindLabels: Record<Project["kind"], string> = {
  "production-app": "Production app",
  "independent-contribution": "Independent contribution",
  internship: "Internship",
  "personal-project": "Personal / learning project",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudyProjects().map((project) => ({
    projectId: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = getCaseStudyProject(projectId);

  if (!project) {
    return {};
  }

  const title = `${project.name} case study`;
  const description = project.summary;
  const url = absoluteUrl(project.caseStudyHref);

  return {
    title,
    description,
    alternates: {
      canonical: project.caseStudyHref,
    },
    openGraph: {
      type: "article",
      locale: site.locale,
      url,
      siteName: site.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params;
  const project = getCaseStudyProject(projectId);

  if (!project) {
    notFound();
  }

  const metrics = getMetricsByIds(project.metricIds).filter(
    (metric) => metric.status === "verified",
  );
  const visibleScreenshots = project.screenshots.filter(
    (screenshot) => !screenshot.startsWith("TODO_"),
  );

  return (
    <PageShell>
      <section className="py-14 sm:py-20">
        <Container>
          <Link
            href="/#work"
            className="inline-flex rounded-md text-sm font-medium text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Back to selected work
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-16">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                {projectKindLabels[project.kind]}
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl">
                {project.name}
              </h1>
              <p className="mt-5 max-w-2xl text-xl leading-8 tracking-tight text-foreground sm:text-2xl sm:leading-9">
                {project.tagline}
              </p>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {project.storeUrl ? (
                  <Button href={project.storeUrl}>View on Play Store</Button>
                ) : null}
                {project.liveUrl ? (
                  <Button href={project.liveUrl}>View live project</Button>
                ) : null}
                {project.githubUrl ? (
                  <Button href={project.githubUrl} variant="secondary">
                    View GitHub
                  </Button>
                ) : null}
              </div>
            </div>

            <aside className="rounded-3xl border border-border bg-surface p-6 shadow-[0_16px_40px_-34px_rgba(17,17,17,0.45)]">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Role
              </p>
              <p className="mt-4 text-lg font-medium tracking-tight">
                {project.role}
              </p>
              {project.downloads ? (
                <dl className="mt-8 border-t border-border pt-5">
                  <div>
                    <dt className="text-sm leading-5 text-muted">Downloads</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                      {project.downloads}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>

      {metrics.length > 0 ? (
        <section className="border-t border-border py-16 sm:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Verified metrics
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                Results recorded in the project content source.
              </h2>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-3xl border border-border bg-surface p-5"
                >
                  <dt className="text-sm leading-5 text-muted">{metric.label}</dt>
                  <dd className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                    {metric.value}
                  </dd>
                  {metric.previous && metric.current ? (
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {metric.previous} to {metric.current}
                      {metric.percentage ? ` (${metric.percentage})` : ""}
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
      ) : null}

      <section className="border-t border-border py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Scope
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                What the work covered.
              </h2>
            </div>

            <div className="grid gap-5">
              {project.highlights.length > 0 ? (
                <article className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-[-0.03em]">
                    Highlights
                  </h3>
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-foreground sm:grid-cols-2">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {project.technologies.length > 0 ? (
                <article className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-[-0.03em]">
                    Technologies
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {visibleScreenshots.length > 0 ? (
                <article className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-[-0.03em]">
                    Screenshots
                  </h3>
                  <ul className="mt-6 grid justify-items-center gap-6 sm:grid-cols-2">
                    {visibleScreenshots.map((screenshot, index) => (
                      <li key={screenshot} className="w-full max-w-68">
                        <AndroidPhoneFrame
                          screenshot={screenshot}
                          alt={`${project.name} production screen ${index + 1}`}
                          size="stack"
                          sizes="(min-width: 1024px) 272px, (min-width: 640px) 40vw, 80vw"
                          priority={index === 0}
                        />
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}