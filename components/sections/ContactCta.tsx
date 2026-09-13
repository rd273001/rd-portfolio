import { Button, Container } from "@/components/primitives";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

export function ContactCta() {
  const primaryCta = socials.find(
    (social) => social.id === site.contact.primarySocialId,
  );
  const secondaryCta = socials.find(
    (social) => social.id === site.contact.secondarySocialId,
  );
  const visibleSocials = socials.filter(
    (social) => social.status === "verified",
  );

  return (
    <section id="contact" className="border-t border-border py-16 sm:py-20">
      <Container>
        <div className="rounded-3xl bg-foreground px-6 py-10 text-background sm:px-10 sm:py-14 lg:px-14">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-background/60">
              {profile.name}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              {site.contact.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-background/70 sm:text-lg sm:leading-8">
              {site.contact.description}
            </p>
          </div>

          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? (
                <Button
                  href={primaryCta.href}
                  className="bg-background text-foreground hover:opacity-90 focus-visible:outline-background"
                >
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button
                  href={secondaryCta.href}
                  variant="secondary"
                  className="border-background/25 bg-transparent text-background hover:bg-background/10 focus-visible:outline-background"
                >
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}

          {visibleSocials.length > 0 ? (
            <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-t border-background/15 pt-6">
              {visibleSocials.map((social) => {
                const isWebUrl = social.href.startsWith("http");

                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target={isWebUrl ? "_blank" : undefined}
                      rel={isWebUrl ? "noreferrer" : undefined}
                      className="rounded-md text-sm text-background/70 underline decoration-background/30 underline-offset-4 transition-colors hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
                    >
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}