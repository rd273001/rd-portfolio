import Image from "next/image";

import { Container } from "@/components/primitives";
import { about } from "@/content/about";
import { getVerifiedProfilePhoto, profile } from "@/content/profile";

export function AboutSection() {
  const photo = getVerifiedProfilePhoto();

  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border py-16 sm:py-20"
      aria-labelledby="about-title"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {about.eyebrow}
            </p>
            <h2
              id="about-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl"
            >
              {about.headline}
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 tracking-tight text-foreground sm:text-xl sm:leading-9">
              {about.lead}
            </p>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {about.pillars.length > 0 ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {about.pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 sm:p-6"
                  >
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      {pillar.title}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {pillar.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-border/80 bg-background/50 px-2.5 py-1 text-xs font-medium text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="self-start rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(17,17,17,0.45)] w-full max-w-sm lg:max-w-none">
            {photo ? (
              <div className="relative mb-5 aspect-4/5 w-full overflow-hidden rounded-xl bg-accent">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 20rem, (min-width: 768px) 18rem, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ) : null}
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {profile.name}
                </p>
                <p className="text-sm text-muted">
                  {profile.currentTitle}
                </p>
              </div>

              <div className="border-t border-border pt-3">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Current role
                </p>
                <a
                  href={profile.employerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex text-sm text-foreground underline decoration-border underline-offset-4 transition-colors [@media(hover:hover)]:hover:decoration-foreground active:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  {profile.employer}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>

              <div className="border-t border-border pt-3">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Location
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {profile.location}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
