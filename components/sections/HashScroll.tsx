"use client";

import { useEffect } from "react";

import { scrollToHashId } from "@/lib/scroll-to-hash";

/**
 * After a full navigation to `/#section` (e.g. from a case study), scroll once
 * the homepage sections are in the DOM.
 */
export function HashScroll() {
  useEffect(() => {
    const scrollFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) {
        return;
      }

      // Wait a frame so section layout (and sticky header offset) is ready.
      window.requestAnimationFrame(() => {
        scrollToHashId(id, "auto");
      });
    };

    scrollFromHash();
    window.addEventListener("hashchange", scrollFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollFromHash);
    };
  }, []);

  return null;
}
