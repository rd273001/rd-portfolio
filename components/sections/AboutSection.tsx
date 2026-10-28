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
        <div className="grid gap-10 md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)] md:items-start lg:gap-14">
          <aside className="self-start rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-[0_16px_40px_-28px_rgba(17,17,17,0.45)] w-full max-w-sm mx-auto md:max-w-none">
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
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Status
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-xs font-medium text-foreground">
                    Open to opportunities & collaboration
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Location
                </p>
                <p className="mt-1 text-xs text-foreground">
                  {profile.location}
                </p>
              </div>
            </div>
          </aside>

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
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
        </div>
      </Container>
    </section>
  );
}
