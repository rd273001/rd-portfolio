import { Button } from "@/components/primitives";
import { AndroidPhoneFrame } from "./AndroidPhoneFrame";
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
              <h4 className="text-2xl font-semibold tracking-[-0.03em]">
                {project.name}
              </h4>
              <p className="mt-3 text-sm leading-6 text-background/70">
                {project.tagline}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href={project.caseStudyHref}
                  className="w-full whitespace-nowrap bg-background px-6 text-foreground active:opacity-90 focus-visible:outline-background sm:w-auto sm:min-w-36"
                >
                  Read case study
                </Button>
                {project.storeUrl ? (
                  <Button
                    href={project.storeUrl}
                    variant="secondary"
                    className="w-full whitespace-nowrap border-background/45 px-6 text-background sm:w-auto sm:min-w-36 [@media(hover:hover)]:hover:border-background/55 [@media(hover:hover)]:hover:bg-background/15 active:scale-[0.98] active:border-background/55 active:bg-background/15 focus-visible:outline-background"
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

/**
 * Luminous warm limelight floor wash for the showcase phone on dark backgrounds (#050505).
 * Downward-led with tight side spread so the phone feels elevated from the surface.
 */
export const SHOWCASE_PHONE_LIGHT_SHADOW =
  "0 16px 38px -10px rgba(255, 241, 216, 0.20), 0 8px 18px -4px rgba(255, 255, 255, 0.14), 0 0 16px -2px rgba(255, 241, 216, 0.08), 0 16px 32px -10px rgba(0, 0, 0, 0.9)";

/** Desktop Work slot — matches 3D front without 2D glow while the scene loads. */
export function ProductPhonePlaceholder({
  project,
  screenshotIndex = 0,
  frameShadow,
}: {
  project: MobileShowcaseProject;
  screenshotIndex?: number;
  frameShadow?: string;
}) {
  return (
    <AndroidPhoneFrame
      screens={project.screenshots}
      activeScreenIndex={screenshotIndex}
      alt={`${project.name} app screen`}
      size="panel"
      sizes="40vw"
      frameShadow={frameShadow}
    />
  );
}

/** Mobile / compact Work slot — same frame, width-led. */
export function MobileProjectPhone({
  project,
  screenshotIndex = 0,
  frameShadow = SHOWCASE_PHONE_LIGHT_SHADOW,
}: {
  project: MobileShowcaseProject;
  screenshotIndex?: number;
  frameShadow?: string;
}) {
  return (
    <AndroidPhoneFrame
      screens={project.screenshots}
      activeScreenIndex={screenshotIndex}
      alt={`${project.name} production app screen`}
      size="stack"
      sizes="(min-width: 1024px) 272px, (min-width: 640px) 40vw, 80vw"
      frameShadow={frameShadow}
    />
  );
}