import Link from "next/link";
import { ArrowRightIcon } from "@/components/primitives";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type SiteFooterProps = {
  hideFeedbackLink?: boolean;
};

export function SiteFooter({ hideFeedbackLink = false }: SiteFooterProps = {}) {
  return (
    <footer className="border-t border-border py-6">
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 text-xs text-muted sm:px-6 lg:px-8",
          hideFeedbackLink
            ? "justify-center text-center"
            : "justify-between sm:flex-row",
        )}
      >
        <p>
          {site.name} · {site.domain}
        </p>
        {!hideFeedbackLink ? (
          <p>
            Have thoughts?{" "}
            <Link
              href="/feedback"
              className="group inline-flex touch-manipulation items-center gap-1 underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-foreground hover:decoration-foreground active:text-foreground active:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <span>Leave feedback</span>
              <ArrowRightIcon className="size-2.5 shrink-0 transition-transform duration-150 ease-out [@media(hover:hover)]:group-hover:translate-x-1 group-active:!translate-x-2 group-active:duration-100 motion-reduce:transform-none" />
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}