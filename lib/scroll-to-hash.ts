/** Scroll to a homepage section id. Respects prefers-reduced-motion. */
export function scrollToHashId(
  id: string,
  behavior: ScrollBehavior = "smooth",
): boolean {
  if (!id || typeof document === "undefined") {
    return false;
  }

  const element = document.getElementById(id);
  if (!element) {
    return false;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  element.scrollIntoView({
    behavior: reduceMotion ? "auto" : behavior,
    block: "start",
  });

  return true;
}
