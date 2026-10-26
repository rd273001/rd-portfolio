import type { Metadata } from "next";
import Link from "next/link";

import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { ArrowLeftIcon, Container } from "@/components/primitives";
import { PageShell } from "@/components/sections";
import { site } from "@/content/site";
import { socials } from "@/content/socials";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Share feedback",
  description:
    "Share feedback, testimonials, or notes on Ravi Dubey's engineering work.",
  alternates: {
    canonical: absoluteUrl("/feedback"),
  },
};

export default function FeedbackPage() {
  const emailHref = socials.find((social) => social.id === "email")?.href ?? null;

  return (
    <PageShell hideFeedbackLink>
      <div className="w-full pt-6 pb-16 sm:pt-10 sm:pb-20 md:pt-12 md:pb-24">
        <Container className="max-w-2xl">
          <Link
            href="/"
            className="group inline-flex touch-manipulation items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-muted underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-foreground hover:decoration-foreground active:text-foreground active:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <ArrowLeftIcon className="size-3.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:-translate-x-1 group-active:!-translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            <span>Back to home</span>
          </Link>

          <div className="mt-5 sm:mt-8">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {site.contact.feedback.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-balance sm:mt-3 sm:text-4xl">
              {site.contact.feedback.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:mt-3 sm:text-base sm:leading-7">
              {site.contact.feedback.intro}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.5)] sm:mt-8 sm:rounded-3xl sm:p-9">
            <FeedbackForm
              description={site.contact.feedback.description}
              submitLabel={site.contact.feedback.submitLabel}
              emailHref={emailHref}
              successTitleId="feedback-page-status"
              unstyledShell
            />
          </div>
        </Container>
      </div>
    </PageShell>
  );
}