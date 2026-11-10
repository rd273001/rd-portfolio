import Link from "next/link";
import {
  ArrowRightIcon,
  Button,
  Container,
  ExternalLinkIcon,
  GitHubIcon,
} from "@/components/primitives";
import {
  getAllProjects,
  getFeaturedPersonalProjects,
} from "@/content/projects";
import type { Project } from "@/content/types";
import { MobileShowcase } from "./mobile-showcase/MobileShowcase";

const categoryLabels: Record<NonNullable<Project["category"]>, string> = {
  production: "Production app",
  mobile: "Mobile app",
  web: "Web application",
  fullstack: "Full-stack project",
  tool: "Developer tool",
};

export function ProjectsSection() {
  const featuredPersonal = getFeaturedPersonalProjects();
  const allProjects = getAllProjects();

  return (
    <section id="work" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        {/* Flagship Production Mobile Showcase */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Selected work
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
            Production apps with measurable engineering impact.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Mobile experiences with verified production metrics on Google Play,
            featuring on-demand module delivery, performance profiling, and offline caching.
          </p>
        </div>

        <MobileShowcase />

        {/* Curated Technical & Open-Source Builds */}
        <div className="mt-16 sm:mt-24 border-t border-border/80 pt-14 sm:pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Featured projects
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Full-stack & open-source projects.
              </h3>
              <p className="mt-2 text-sm text-muted sm:text-base">
                Focused full-stack, web, and mobile applications built to explore modern architectures, component systems, and API integrations.
              </p>
            </div>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              <span>Explore all projects ({allProjects.length})</span>
              <ArrowRightIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {featuredPersonal.map((project) => (
              <ProjectPreviewCard key={project.id} project={project} />
            ))}
          </div>

          {/* Archive Banner CTA */}
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:p-8">
            <div>
              <p className="text-base font-semibold text-foreground">
                Looking for more projects and source code?
              </p>
              <p className="mt-1 text-sm text-muted">
                Explore the complete engineering archive with category filters, technology stacks, and direct repository links.
              </p>
            </div>
            <Button
              href="/work"
              variant="secondary"
              className="shrink-0 items-center gap-2 whitespace-nowrap px-6"
            >
              <span>View All Projects ({allProjects.length})</span>
              <ArrowRightIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProjectPreviewCard({ project }: { project: Project }) {
  const visibleTech = project.technologies.slice(0, 4);
  const hasLive = Boolean(project.liveUrl);

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/20 sm:p-7">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {project.id === "portfolio"
              ? "Portfolio website"
              : project.category
                ? categoryLabels[project.category]
                : "Full-stack project"}
          </span>
          {project.year ? (
            <span className="font-mono text-xs text-muted">{project.year}</span>
          ) : null}
        </div>

        <h4 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {project.name}
        </h4>

        <p className="mt-2 text-sm font-medium text-foreground/90">
          {project.tagline}
        </p>

        <p className="mt-3 text-sm leading-6 text-muted">
          {project.summary}
        </p>

        {project.highlights.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-border/70 pt-4 text-xs leading-5 text-muted">
            {project.highlights.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/60"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-6 space-y-4 border-t border-border/70 pt-4">
        {visibleTech.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border/80 bg-background/50 px-2.5 py-0.5 text-[11px] font-medium text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {project.liveUrl ? (
            <Button
              href={project.liveUrl}
              variant="primary"
              className="inline-flex min-h-9 items-center gap-1.5 px-3.5 py-1 text-xs"
            >
              <span>Live Demo</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" />
            </Button>
          ) : null}

          {project.githubUrl ? (
            <Button
              href={project.githubUrl}
              variant={hasLive ? "secondary" : "primary"}
              className="inline-flex min-h-9 items-center gap-1.5 px-3.5 py-1 text-xs"
            >
              <GitHubIcon className="size-3.5 shrink-0" />
              <span>GitHub</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}