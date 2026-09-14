import { Button, Container } from "@/components/primitives";
import { getMetricsByIds } from "@/content/metrics";
import { getCaseStudyProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { MobileShowcase } from "./mobile-showcase/MobileShowcase";

const projectKindLabels: Record<Project["kind"], string> = {
  "production-app": "Production app",
  "independent-contribution": "Independent contribution",
  internship: "Internship",
  "personal-project": "Personal / learning project",
};

export function ProjectsSection() {
  const projects = getCaseStudyProjects();

  if (projects.length === 0) {
    return null;
  }

  const [featuredProject, ...supportingProjects] = projects;

  return (
    <section id="work" className="border-t border-border py-16 sm:py-20">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Selected work
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Project stories grounded in shipped product work.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            A focused set of case studies covering production mobile ownership,
            app delivery improvements, and one personal full-stack build.
          </p>
        </div>

        <MobileShowcase />

        <div className="mt-12 grid gap-5">
          {featuredProject ? (
            <ProjectCard project={featuredProject} isFeatured />
          ) : null}

          {supportingProjects.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {supportingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({
  project,
  isFeatured = false,
}: {
  project: Project;
  isFeatured?: boolean;
}) {
  const metrics = getMetricsByIds(project.metricIds).filter(
    (metric) => metric.status === "verified",
  );

  return (
    <article className="rounded-3xl border border-border bg-surface p-5 shadow-[0_16px_40px_-34px_rgba(17,17,17,0.45)] sm:p-6 lg:p-8">
      <div
        className={
          isFeatured
            ? "grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start"
            : "grid gap-6"
        }
      >
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {projectKindLabels[project.kind]}
          </p>
          <h3
            className={
              isFeatured
                ? "mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
                : "mt-4 text-2xl font-semibold tracking-[-0.04em] text-balance"
            }
          >
            {project.name}
          </h3>
          <p className="mt-3 text-base font-medium tracking-tight">
            {project.tagline}
          </p>
          <p className="mt-4 text-base leading-7 text-muted">
            {project.summary}
          </p>

          {project.highlights.length > 0 ? (
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-foreground sm:grid-cols-2">
              {project.highlights.slice(0, isFeatured ? 4 : 3).map((highlight) => (
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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={project.caseStudyHref}>Read case study</Button>
            {project.storeUrl ? (
              <Button href={project.storeUrl} variant="secondary">
                View on Play Store
              </Button>
            ) : null}
            {project.liveUrl ? (
              <Button href={project.liveUrl} variant="secondary">
                View live
              </Button>
            ) : null}
          </div>
        </div>

        {metrics.length > 0 || project.technologies.length > 0 ? (
          <aside className="rounded-3xl border border-border bg-background p-5">
            {metrics.length > 0 ? (
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {metrics.slice(0, isFeatured ? 4 : 2).map((metric) => (
                  <div key={metric.id}>
                    <dt className="text-xs leading-5 text-muted">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                      {metric.value}
                    </dd>
                    {metric.previous && metric.current ? (
                      <p className="mt-1 text-xs leading-5 text-muted">
                        {metric.previous} to {metric.current}
                        {metric.percentage ? ` (${metric.percentage})` : ""}
                      </p>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}

            {project.technologies.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                {project.technologies.slice(0, isFeatured ? 9 : 6).map((technology) => (
                  <li
                    key={technology}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        ) : null}
      </div>
    </article>
  );
}