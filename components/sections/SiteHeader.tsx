"use client";

import Link from "next/link";
import { useState } from "react";

import type { NavigationItem, Social } from "@/content/types";

type SiteHeaderProps = {
  brand: string;
  navigation: NavigationItem[];
  contact?: Social;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SiteHeader({
  brand,
  navigation,
  contact,
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initials = getInitials(brand);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-3 rounded-md text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={brand}
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg border border-border bg-surface font-mono text-xs font-medium"
          >
            {initials}
          </span>
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
              className="rounded-md py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </a>
          ))}
          {contact ? (
            <a
              href={contact.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {contact.label}
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-surface text-sm font-medium md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true">{isMenuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-border bg-surface px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            {contact ? (
              <a
                href={contact.href}
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={closeMenu}
              >
                {contact.label}
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}