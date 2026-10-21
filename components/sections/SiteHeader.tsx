"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { BrandMark } from "@/components/primitives";
import type { NavigationItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { scrollToHashId } from "@/lib/scroll-to-hash";

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
  const [activeSection, setActiveSection] = useState<string>("");
  const isNavigatingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showUtilities = Boolean(resume) || utilities.length > 0;

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  /** Home section links (`/#work`) must land on the section, not only `/`. */
  const onHomeSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) {
      closeMenu();
      return;
    }

    const id = href.slice(2);
    closeMenu();
    setActiveSection(id);
    isNavigatingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // Lock scroll-spy updates during the programmatic smooth scroll so intermediate sections
    // (e.g. Work when traveling to Skills) never cause jump/flicker. Unlocks automatically on scrollend.
    scrollTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 2500);

    if (window.location.pathname === "/") {
      event.preventDefault();
      window.history.pushState(null, "", href);
      scrollToHashId(id);
      return;
    }

    // Full navigation so the hash is applied after the homepage mounts.
    event.preventDefault();
    window.location.assign(href);
  };

  // Passive scroll spy for highlighting the active section anchor on the homepage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateActiveSection = () => {
      if (isNavigatingRef.current) {
        return;
      }

      if (window.location.pathname !== "/") {
        setActiveSection("");
        return;
      }

      const sectionIds = navigation.map((item) => item.id);
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom-of-page check: highlight last section when near footer
      if (scrollY + windowHeight >= documentHeight - 60) {
        const lastId = sectionIds[sectionIds.length - 1];
        if (lastId) {
          setActiveSection(lastId);
          return;
        }
      }

      // If at the very top of page
      if (scrollY < 120 && sectionIds.length > 0) {
        setActiveSection(sectionIds[0]);
        return;
      }

      // Cumulative reading threshold from top:
      // The active section is the furthest section whose top has scrolled past the header (~180px)
      const triggerY = 180;
      let currentActive = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) {
          currentActive = id;
        }
      }

      if (currentActive) {
        setActiveSection(currentActive);
      }
    };

    const unlockNavigation = () => {
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        updateActiveSection();
      }
    };

    // On initial mount, respect hash if present
    if (window.location.hash) {
      const hashId = window.location.hash.slice(1);
      if (navigation.some((item) => item.id === hashId)) {
        setActiveSection(hashId);
      } else {
        updateActiveSection();
      }
    } else {
      updateActiveSection();
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });
    window.addEventListener("scrollend", unlockNavigation);
    window.addEventListener("wheel", unlockNavigation, { passive: true });
    window.addEventListener("touchmove", unlockNavigation, { passive: true });
    window.addEventListener("pointerdown", unlockNavigation, { passive: true });

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("scrollend", unlockNavigation);
      window.removeEventListener("wheel", unlockNavigation);
      window.removeEventListener("touchmove", unlockNavigation);
      window.removeEventListener("pointerdown", unlockNavigation);
    };
  }, [navigation]);

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
            "inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-md tracking-tight md:gap-3",
            focusRing,
          )}
          aria-label={`${brand} — Software Engineer`}
          onClick={closeMenu}
        >
          <BrandMark className="md:size-9" />
          <div className="flex flex-col justify-center gap-0.5 text-left">
            <span className="text-[15px] font-semibold leading-tight tracking-tight text-foreground md:text-[17px]">
              {brand}
            </span>
            <span className="text-[11px] font-normal leading-tight tracking-[0.03em] text-muted">
              Software Engineer
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center md:flex"
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-4 lg:gap-5">
            {navigation.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(event) => onHomeSectionClick(event, item.href)}
                  className={cn(
                    "relative py-1.5 text-sm transition-colors duration-150",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted [@media(hover:hover)]:hover:text-foreground",
                    focusRing,
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span
                      className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground"
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              );
            })}
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
              "inline-flex size-11 cursor-pointer touch-manipulation list-none items-center justify-center rounded-lg text-foreground transition-opacity duration-150 [@media(hover:hover)]:hover:opacity-75 active:scale-95 [&::-webkit-details-marker]:hidden",
              focusRing,
            )}
            aria-label="Toggle navigation menu"
          >
            <div
              className="relative flex size-5 items-center justify-center"
              aria-hidden="true"
            >
              <span className="absolute h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-out -translate-y-1.5 group-open:translate-y-0 group-open:rotate-45" />
              <span className="absolute h-0.5 w-5 rounded-full bg-current transition-all duration-150 ease-out translate-y-0 group-open:scale-x-0 group-open:opacity-0" />
              <span className="absolute h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-out translate-y-1.5 group-open:translate-y-0 group-open:-rotate-45" />
            </div>
            <span className="sr-only">
              <span className="group-open:hidden">Open navigation menu</span>
              <span className="hidden group-open:inline">Close navigation menu</span>
            </span>
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
                  {navigation.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        className={cn(
                          "flex min-h-12 w-full touch-manipulation items-center justify-between rounded-xl px-4 py-3 text-base transition-[transform,background-color] duration-150 active:scale-[0.99]",
                          isActive
                            ? "bg-foreground/10 font-semibold text-foreground"
                            : "font-medium text-foreground [@media(hover:hover)]:hover:bg-foreground/6 active:bg-foreground/8",
                          focusRing,
                        )}
                        onClick={(event) => onHomeSectionClick(event, item.href)}
                        aria-current={isActive ? "location" : undefined}
                      >
                        <span>{item.label}</span>
                        {isActive ? (
                          <span
                            className="size-1.5 rounded-full bg-foreground"
                            aria-hidden="true"
                          />
                        ) : null}
                      </a>
                    );
                  })}
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