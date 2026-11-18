import {
  ArrowRightIcon,
  Button,
  Container,
} from "@/components/primitives";
import { getAllProjects } from "@/content/projects";
import { MobileShowcase } from "./mobile-showcase/MobileShowcase";

export function ProjectsSection() {
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

        {/* Engineering Archive CTA */}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-foreground/25 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.07)] sm:mt-12 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
              Engineering Directory
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Looking for web applications & independent builds?
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              Beyond production mobile systems, explore full-stack web apps, technical experiments, and open-source developer tools in the complete project archive.
            </p>
          </div>
          <Button
            href="/work"
            variant="secondary"
            className="group shrink-0 items-center gap-2 whitespace-nowrap px-6 transition duration-150 ease-out active:scale-[0.98]"
          >
            <span>Explore All Projects ({allProjects.length})</span>
            <ArrowRightIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
