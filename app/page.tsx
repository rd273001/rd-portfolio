import { ContactCta, Hero, SiteHeader } from "@/components/sections";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

export default function Home() {
  const contact = socials.find(
    (social) => social.id === site.contact.primarySocialId,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader
        brand={site.name}
        navigation={site.navigation}
        contact={contact}
      />
      <main id="top">
        <Hero />
        <ContactCta />
      </main>
      <footer className="border-t border-border py-6">
        <p className="mx-auto w-full max-w-5xl px-4 text-sm text-muted sm:px-6 lg:px-8">
          {site.name} · {site.domain}
        </p>
      </footer>
    </div>
  );
}
