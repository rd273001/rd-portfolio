import Link from "next/link";
import {
  ArrowRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MediumIcon,
} from "@/components/primitives";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

type SiteFooterProps = {
  hideFeedbackLink?: boolean;
};

const SOCIAL_ICONS: Record<string, typeof GitHubIcon> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
  medium: MediumIcon,
};

export function SiteFooter({ hideFeedbackLink = false }: SiteFooterProps = {}) {
  const currentYear = new Date().getFullYear();
  const visibleSocials = socials.filter(
    (social) => social.status === "verified" && SOCIAL_ICONS[social.id],
  );

  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
        <p className="order-3 text-center sm:order-1 sm:flex-1 sm:basis-0 sm:text-left">
          © {currentYear} {site.name} · {site.domain}
        </p>

        {visibleSocials.length > 0 ? (
          <div className="order-2 shrink-0 sm:order-2">
            <ul
              className="flex items-center gap-2 sm:gap-1.5"
              aria-label="Social profiles and contact channels"
            >
              {visibleSocials.map((social) => {
                const Icon = SOCIAL_ICONS[social.id];
                if (!Icon) return null;
                const isMail = social.href.startsWith("mailto:");

                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      title={social.label}
                      {...(isMail
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-[color,background-color] duration-150 hover:bg-accent hover:text-foreground active:bg-accent/80 active:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:size-8"
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="sr-only">{social.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {!hideFeedbackLink ? (
          <p className="order-1 text-center sm:order-3 sm:flex-1 sm:basis-0 sm:text-right">
            Have thoughts?{" "}
            <Link
              href="/feedback"
              className="group inline-flex touch-manipulation items-center gap-1 underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-foreground hover:decoration-foreground active:text-foreground active:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <span>Leave feedback</span>
              <ArrowRightIcon className="size-2.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            </Link>
          </p>
        ) : (
          <div
            className="hidden sm:block sm:flex-1 sm:basis-0"
            aria-hidden="true"
          />
        )}
      </div>
    </footer>
  );
}