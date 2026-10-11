export type ContactFormTone = "light" | "on-dark";

export function contactFormShellClassName(tone: ContactFormTone = "light") {
  if (tone === "on-dark") {
    return [
      "flex flex-col rounded-2xl px-5 py-6 sm:px-6",
      "border border-background/20 bg-background/10",
      "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
      "backdrop-blur-md backdrop-saturate-150",
    ].join(" ");
  }

  return "flex flex-col rounded-2xl border border-border bg-surface px-5 py-6 sm:px-6";
}