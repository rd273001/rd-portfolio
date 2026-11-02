"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { scrollToHashId } from "@/lib/scroll-to-hash";

/**
 * Handles smooth scrolling to homepage hash sections:
 * 1. On full page load or direct URL access with hash (e.g. `/#work`).
 * 2. On browser `hashchange` events.
 * 3. On route transitions from another route to homepage with hash (e.g. from `/work/*` to `/#work`).
 * 4. On user click of in-page hash links (e.g. Hero "View my work", "Let's talk"),
 *    ensuring clicking the link scrolls to the target section even if the URL
 *    hash already matches the target.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelTimer: (() => void) | undefined;

    const scrollFromHash = (behavior: ScrollBehavior = "smooth") => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) {
        return;
      }

      let attempts = 0;
      const tryScroll = () => {
        const scrolled = scrollToHashId(id, behavior);
        if (!scrolled && attempts < 10) {
          attempts += 1;
          window.requestAnimationFrame(tryScroll);
        }
      };

      // Next.js App Router resets scroll to (0,0) after route navigation.
      // Small delay ensures route DOM transition and scroll reset have finished.
      const timer = window.setTimeout(() => {
        window.requestAnimationFrame(tryScroll);
      }, 60);

      cancelTimer = () => window.clearTimeout(timer);
    };

    scrollFromHash(pathname === "/" ? "smooth" : "auto");

    const onHashChange = () => scrollFromHash("smooth");
    window.addEventListener("hashchange", onHashChange);

    const handleDocumentClick = (event: MouseEvent) => {
      // Ignore modified clicks (Cmd+click, Ctrl+click, etc.) or non-primary buttons
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) {
        return;
      }

      // Header navigation links are managed by SiteHeader's own stateful click handlers
      if (anchor.closest("header")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      // Handle in-page hash links on the homepage
      if (window.location.pathname === "/") {
        const match = href.match(/^(?:\/#|#)([a-zA-Z0-9_-]+)$/);
        if (match) {
          const id = match[1];
          const element = document.getElementById(id);
          if (element) {
            event.preventDefault();
            const targetHash = `#${id}`;
            if (window.location.hash !== targetHash) {
              window.history.pushState(null, "", `/#${id}`);
            }
            scrollToHashId(id, "smooth");
          }
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      cancelTimer?.();
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
    };
  }, [pathname]);

  return null;
}
