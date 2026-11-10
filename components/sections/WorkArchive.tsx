"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  Container,
  ExternalLinkIcon,
  GitHubIcon,
} from "@/components/primitives";
import type { Project, ProjectCategory } from "@/content/types";

type CategoryTab = "all" | ProjectCategory;

const categoryTabLabels: Record<CategoryTab, string> = {
  all: "All",
  production: "Production Apps",
  mobile: "Mobile",
  web: "Web",
  fullstack: "Full-Stack",
  tool: "Tools",
};

export function WorkArchive({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputId = useId();

  const counts = useMemo(() => {
    const map: Record<CategoryTab, number> = {
      all: projects.length,
      production: 0,
      mobile: 0,
      web: 0,
      fullstack: 0,
      tool: 0,
    };
    projects.forEach((p) => {
      if (p.category && p.category in map) {
        map[p.category] += 1;
      }
    });
    return map;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Tab filter
      if (activeTab !== "all" && project.category !== activeTab) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inName = project.name.toLowerCase().includes(q);
      const inSummary = project.summary.toLowerCase().includes(q);
      const inTagline = project.tagline.toLowerCase().includes(q);
      const inTech = project.technologies.some((t) =>
        t.toLowerCase().includes(q),
      );
      const inHighlights = project.highlights.some((h) =>
        h.toLowerCase().includes(q),
      );

      return inName || inSummary || inTagline || inTech || inHighlights;
    });
  }, [projects, activeTab, searchQuery]);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        {/* Back Link */}
        <div>
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground active:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <ArrowLeftIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:-translate-x-1 group-active:!-translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            <span>Back to Selected Work</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mt-8 max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Engineering Archive
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            All Projects & Technical Work
          </h1>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            A comprehensive index of production mobile applications, full-stack builds, and open-source GitHub repositories.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-10 flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Project categories"
            className="flex flex-wrap items-center gap-1.5"
          >
            {(Object.keys(categoryTabLabels) as CategoryTab[]).map((tab) => {
              const count = counts[tab];
              if (count === 0 && tab !== "all") return null;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition duration-150 ease-out active:scale-[0.98] will-change-transform ${isActive
                      ? "bg-foreground text-background active:opacity-90"
                      : "border border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground active:border-foreground/30 active:bg-foreground/[0.06]"
                    }`}
                >
                  <span>{categoryTabLabels[tab]}</span>
                  <span
                    className={`font-mono text-[10px] ${isActive ? "text-background/70" : "text-muted"
                      }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <label htmlFor={searchInputId} className="sr-only">
              Search projects by name, technology, or description
            </label>
            <input
              id={searchInputId}
              type="text"
              inputMode="search"
              role="searchbox"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-surface py-1.5 pl-4 pr-9 text-xs text-foreground placeholder:text-muted/60 focus:border-foreground/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 flex size-4.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted transition duration-150 ease-out hover:border-foreground/40 hover:text-foreground active:scale-90"
                aria-label="Clear search"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-3"
                  aria-hidden="true"
                >
                  <path d="M3 3l10 10M13 3l-10 10" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between gap-4 text-xs text-muted">
          <span className="shrink-0 font-medium">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          {searchQuery && (
            <div className="flex min-w-0 max-w-[60%] items-center justify-end overflow-x-auto whitespace-nowrap font-mono sm:max-w-[70%] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0">Filter: &quot;{searchQuery}&quot;</span>
            </div>
          )}
        </div>

        {/* Project Card List */}
        {filteredProjects.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-base font-medium text-foreground">
              No matching projects found
            </p>
            <p className="mt-1 text-sm text-muted">
              Try adjusting your search query or switching to another category.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 text-xs"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {filteredProjects.map((project) => (
              <ArchiveProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function ArchiveProjectCard({ project }: { project: Project }) {
  const isProduction = project.kind === "production-app";
  const hasLive = Boolean(project.liveUrl);

  return (
    <article
      id={project.id}
      className="relative rounded-2xl border border-border bg-surface p-6 transition-all hover:border-foreground/20 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10">
        {/* Project Meta & Details */}
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {project.year ? (
              <span className="font-mono text-xs text-muted">
                {project.year}
              </span>
            ) : null}

            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase ${isProduction
                  ? "border border-foreground/30 bg-foreground/10 text-foreground"
                  : "border border-border bg-background text-muted"
                }`}
            >
              {project.id === "portfolio"
                ? "Portfolio Website"
                : project.kind === "production-app"
                  ? "Production App"
                  : project.kind === "internship"
                    ? "Full-time Internship"
                    : project.kind === "independent-contribution"
                      ? "Independent Contribution"
                      : project.category === "fullstack"
                        ? "Full-Stack Project"
                        : project.category === "mobile"
                          ? "Mobile App"
                          : project.category === "web"
                            ? "Web Application"
                            : "Open-Source Project"}
            </span>

            {project.downloads ? (
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted">
                {project.downloads} downloads
              </span>
            ) : null}
          </div>

          {/* Title & Tagline */}
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {project.name}
          </h2>

          <p className="mt-1.5 text-base font-medium text-foreground/90">
            {project.tagline}
          </p>

          <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">
            {project.summary}
          </p>

          {/* Highlights */}
          {project.highlights.length > 0 ? (
            <ul className="mt-4 space-y-2 border-t border-border/70 pt-4 text-xs leading-5 text-muted sm:text-sm sm:leading-6">
              {project.highlights.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/60"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Technologies */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/80 bg-background/50 px-2.5 py-0.5 text-xs font-medium text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Column */}
        <div className="flex flex-col gap-2.5 lg:pt-8">
          {project.caseStudyHref ? (
            <Button
              href={project.caseStudyHref}
              variant="primary"
              className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs font-semibold"
            >
              <span>Read case study</span>
              <ArrowRightIcon className="size-3 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            </Button>
          ) : null}

          {project.storeUrl ? (
            <Button
              href={project.storeUrl}
              variant={project.caseStudyHref ? "secondary" : "primary"}
              className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium"
            >
              <span>Google Play</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" />
            </Button>
          ) : null}

          {project.liveUrl ? (
            <Button
              href={project.liveUrl}
              variant="primary"
              className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium"
            >
              <span>Live Website</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" />
            </Button>
          ) : null}

          {project.githubUrl ? (
            <Button
              href={project.githubUrl}
              variant={hasLive || project.caseStudyHref ? "secondary" : "primary"}
              className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium"
            >
              <GitHubIcon className="size-3.5 shrink-0" />
              <span>GitHub Repo</span>
              <ExternalLinkIcon className="size-3.5 shrink-0 opacity-70" />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}