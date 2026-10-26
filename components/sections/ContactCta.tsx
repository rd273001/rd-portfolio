import Link from "next/link";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { ArrowRightIcon, Container } from "@/components/primitives";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

export function ContactCta() {
  const primaryCta = socials.find(
    (social) => social.id === site.contact.primarySocialId,
  );
  const visibleSocials = socials.filter(
    (social) => social.status === "verified",
  );
  const emailHref = primaryCta?.href.startsWith("mailto:")
    ? primaryCta.href
    : (socials.find((social) => social.id === "email")?.href ?? null);

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border py-16 sm:py-20"
    >
      <Container className="max-w-6xl">
        <div className="rounded-3xl bg-foreground px-6 py-10 text-background sm:px-10 sm:py-14 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12 xl:gap-16">
            <div className="flex min-w-0 flex-col justify-between">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-background/60">
                  {profile.name}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
                  {site.contact.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-background/70 sm:text-lg sm:leading-8">
                  {site.contact.description}
                </p>

                {visibleSocials.length > 0 ? (
                  <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
                    {visibleSocials.map((social) => {
                      const isWebUrl = social.href.startsWith("http");

                      return (
                        <li key={social.id}>
                          <a
                            href={social.href}
                            target={isWebUrl ? "_blank" : undefined}
                            rel={isWebUrl ? "noopener noreferrer" : undefined}
                            className="rounded-md text-sm text-background/70 underline decoration-background/30 underline-offset-4 transition-colors [@media(hover:hover)]:hover:text-background active:text-background focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-foreground"
                          >
                            {social.label}
                            {isWebUrl ? (
                              <span className="sr-only"> (opens in a new tab)</span>
                            ) : null}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>

              <p className="hidden mt-8 border-t border-background/15 pt-5 text-xs text-background/60 lg:block">
                Have feedback or thoughts?{" "}
                <Link
                  href="/feedback"
                  className="group inline-flex touch-manipulation items-center gap-1.5 text-background underline decoration-background/30 underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-background hover:decoration-background active:text-background active:decoration-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                >
                  <span>Share feedback or a testimonial</span>
                  <ArrowRightIcon className="size-3 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
                </Link>
              </p>
            </div>

            <div
              className="flex min-w-0 flex-col lg:min-h-0 lg:h-full"
              aria-labelledby="contact-inquiry-title"
            >
              <InquiryForm
                title={site.contact.inquiry.title}
                description={site.contact.inquiry.description}
                submitLabel={site.contact.inquiry.submitLabel}
                reasons={site.contact.inquiry.reasons}
                emailHref={emailHref}
                titleId="contact-inquiry-title"
                tone="on-dark"
              />
            </div>
          </div>

          <p className="mt-8 border-t border-background/15 pt-5 text-xs text-background/60 lg:hidden">
            Have feedback or thoughts?{" "}
            <Link
              href="/feedback"
              className="group inline-flex touch-manipulation items-center gap-1.5 text-background underline decoration-background/30 underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-background hover:decoration-background active:text-background active:decoration-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
            >
              <span>Share feedback or a testimonial</span>
              <ArrowRightIcon className="size-3 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}