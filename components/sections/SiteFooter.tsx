import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-6">
      <p className="mx-auto w-full max-w-5xl px-4 text-sm text-muted sm:px-6 lg:px-8">
        {site.name} · {site.domain}
      </p>
    </footer>
  );
}