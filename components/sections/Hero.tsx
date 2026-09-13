import { Button, Container } from "@/components/primitives";
import { getMetricsForSurface } from "@/content/metrics";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

export function Hero() {
  const heroMetrics = getMetricsForSurface("hero");
  const primaryCta = socials.find(
    (social) => social.id === site.contact.primarySocialId,
  );
  const secondaryCta = socials.find(
    (social) => social.id === site.contact.secondarySocialId,
  );
  const canShowLocation = profile.locationStatus === "verified";
  const canShowStartDate = profile.currentRoleStartedStatus === "verified";

  return (
    <section id="about" className="overflow-hidden py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {profile.currentTitle}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 tracking-tight text-foreground sm:text-2xl sm:leading-9">
              {profile.headline}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {profile.summary}
            </p>

            {primaryCta || secondaryCta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primaryCta ? (
                  <Button href={primaryCta.href}>{primaryCta.label}</Button>
                ) : null}
                {secondaryCta ? (
                  <Button href={secondaryCta.href} variant="secondary">
                    {secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            ) : null}

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

          <aside className="rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(17,17,17,0.45)]">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {profile.identity}
            </p>
            <p className="mt-5 text-lg font-medium tracking-tight">
              {profile.currentTitle}
            </p>
            <a
              href={profile.employerUrl}
              className="mt-2 inline-flex rounded-md text-base text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              {profile.employer}
            </a>
            {canShowLocation || canShowStartDate ? (
              <dl className="mt-8 space-y-4 border-t border-border pt-5 text-sm text-muted">
                {canShowLocation ? (
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd>{profile.location}</dd>
                  </div>
                ) : null}
                {canShowStartDate ? (
                  <div>
                    <dt className="sr-only">Current role start date</dt>
                    <dd>{profile.currentRoleStarted}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </aside>
        </div>
      </Container>
    </section>
  );
}