"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { BrandMark } from "@/components/primitives";
import type { NavigationItem, Social } from "@/content/types";

type SiteHeaderProps = {
  brand: string;
  navigation: NavigationItem[];
  contact?: Social;
};

export function SiteHeader({
  brand,
  navigation,
  contact,
}: SiteHeaderProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);

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
      <div className="relative mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background md:gap-3 md:text-base"
          aria-label={brand}
          onClick={closeMenu}
        >
          <BrandMark className="md:size-9" />
          <span>{brand}</span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="rounded-md py-2 text-sm text-muted transition-colors [@media(hover:hover)]:hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </a>
          ))}
          {contact ? (
            <a
              href={contact.href}
              className="inline-flex min-h-11 min-w-36 cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[transform,opacity] duration-150 [@media(hover:hover)]:hover:opacity-90 active:scale-[0.98] active:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {contact.label}
            </a>
          ) : null}
        </nav>

        <details
          ref={menuRef}
          className="group relative md:hidden"
          suppressHydrationWarning
        >
          <summary className="inline-flex min-h-11 min-w-19 cursor-pointer touch-manipulation list-none items-center justify-center overflow-hidden rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-[transform,background-color,color,border-color,opacity] duration-150 [@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:group-open:hover:bg-foreground [@media(hover:hover)]:group-open:hover:opacity-90 active:scale-[0.98] active:bg-accent group-open:border-foreground group-open:bg-foreground group-open:text-background group-open:active:bg-foreground group-open:active:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background">
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
                    className="flex min-h-12 w-full touch-manipulation items-center justify-center rounded-lg px-3 py-3.5 text-center text-base font-medium text-foreground transition-[transform,background-color] duration-150 [@media(hover:hover)]:hover:bg-foreground/6 active:scale-[0.98] active:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                ))}
                {contact ? (
                  <a
                    href={contact.href}
                    className="mt-3 inline-flex min-h-12 cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[transform,opacity] duration-150 [@media(hover:hover)]:hover:opacity-90 active:scale-[0.98] active:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={closeMenu}
                  >
                    {contact.label}
                  </a>
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