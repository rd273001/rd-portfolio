import { profile } from "@/content/profile";
import { getCaseStudyProjects } from "@/content/projects";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${site.canonicalUrl}/`).toString();
}

export function getVerifiedWebProfiles(): string[] {
  return socials
    .filter(
      (social) =>
        social.status === "verified" && social.href.startsWith("http"),
    )
    .map((social) => social.href);
}

export function getPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: site.canonicalUrl,
    jobTitle: profile.identity,
    description: site.description,
    worksFor: {
      "@type": "Organization",
      name: profile.employer,
      url: profile.employerUrl,
    },
    sameAs: getVerifiedWebProfiles(),
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.canonicalUrl,
    description: site.description,
    inLanguage: "en",
  };
}

export function getCaseStudySitemapEntries() {
  return getCaseStudyProjects().map((project) => ({
    path: project.caseStudyHref,
    title: project.name,
  }));
}