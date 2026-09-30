"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

import { BrandMark } from "@/components/primitives";
import type { NavigationItem } from "@/content/types";
import { cn } from "@/lib/cn";

type HeaderAction = {
  id: string;
  label: string;
  href: string;
};

type SiteHeaderProps = {
  brand: string;
  navigation: NavigationItem[];
  resume?: HeaderAction | null;
  utilities: HeaderAction[];
};

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function opensInNewTab(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  );
}

function ActionLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const external = opensInNewTab(href);

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function SiteHeader({
  brand,
  navigation,
  resume = null,
  utilities,
}: SiteHeaderProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const showUtilities = Boolean(resume) || utilities.length > 0;

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const onToggle = () => {
      document.body.style.overflow = menu.open ? "hidden" : "";
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    menu.addEventListener("toggle", onToggle);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      menu.removeEventListener("toggle", onToggle);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) {
        closeMenu();
      }
    };

    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="header-glass-fill pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight md:gap-3 md:text-base",
            focusRing,
          )}
          aria-label={brand}
          onClick={closeMenu}
        >
          <BrandMark className="md:size-9" />
          <span>{brand}</span>
        </Link>

        <nav
          className="hidden items-center md:flex"
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-4 lg:gap-5">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-md py-2 text-sm text-muted transition-colors [@media(hover:hover)]:hover:text-foreground",
                  focusRing,
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          {resume ? (
            <ActionLink
              href={resume.href}
              className={cn(
                "ml-4 inline-flex min-h-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-[transform,opacity] duration-150 [@media(hover:hover)]:hover:opacity-90 active:scale-[0.98] active:opacity-90 lg:ml-5",
                focusRing,
              )}
            >
              {resume.label}
            </ActionLink>
          ) : null}
        </nav>

        <details
          ref={menuRef}
          className="group relative md:hidden"
          suppressHydrationWarning
        >
          <summary
            className={cn(
              "inline-flex min-h-11 min-w-19 cursor-pointer touch-manipulation list-none items-center justify-center overflow-hidden rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-[transform,background-color,color,border-color,opacity] duration-150 [@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:group-open:hover:bg-foreground [@media(hover:hover)]:group-open:hover:opacity-90 active:scale-[0.98] active:bg-accent group-open:border-foreground group-open:bg-foreground group-open:text-background group-open:active:bg-foreground group-open:active:opacity-90",
              focusRing,
            )}
          >
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>

          <div className="fixed inset-x-0 top-16 z-40">
            <button
              type="button"
              aria-label="Dismiss navigation"
              className="mobile-menu-overlay fixed inset-0 top-16 z-0"
              onClick={closeMenu}
            />
            <nav
              id="mobile-navigation"
              className="mobile-menu-glass relative z-10 mx-3 mt-3 max-h-[calc(100dvh-5.5rem)] rounded-2xl"
              aria-label="Mobile navigation"
            >
              <div className="overflow-y-auto px-3 pb-6 pt-3">
                <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-1">
                  {navigation.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex min-h-12 w-full touch-manipulation items-center justify-center rounded-lg px-3 py-3.5 text-center text-base font-medium text-foreground transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-foreground/6 active:scale-[0.98] active:bg-foreground/8",
                        focusRing,
                      )}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  ))}
                  {showUtilities ? (
                    <div
                      className="mt-3 border-t border-border pt-3"
                      role="group"
                      aria-label="Professional links"
                    >
                      {resume ? (
                        <ActionLink
                          href={resume.href}
                          onClick={closeMenu}
                          className={cn(
                            "inline-flex min-h-12 w-full cursor-pointer touch-manipulation items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[transform,opacity] duration-150 [@media(hover:hover)]:hover:opacity-90 active:scale-[0.98] active:opacity-90",
                            focusRing,
                          )}
                        >
                          {resume.label}
                        </ActionLink>
                      ) : null}
                      {utilities.length > 0 ? (
                        <div
                          className={cn(
                            "grid gap-2",
                            resume ? "mt-2" : undefined,
                            utilities.length > 1 ? "grid-cols-2" : "grid-cols-1",
                          )}
                        >
                          {utilities.map((item) => (
                            <ActionLink
                              key={item.id}
                              href={item.href}
                              onClick={closeMenu}
                              className={cn(
                                "flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full border border-foreground/20 bg-background/35 px-3 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color,border-color] duration-150 [@media(hover:hover)]:hover:border-foreground/25 [@media(hover:hover)]:hover:bg-background/90 active:scale-[0.98] active:border-foreground/25 active:bg-background/90",
                                focusRing,
                              )}
                            >
                              {item.label}
                            </ActionLink>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
