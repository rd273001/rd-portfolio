import type { MetadataRoute } from "next";

import { absoluteUrl, getCaseStudySitemapEntries } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...getCaseStudySitemapEntries().map((entry) => ({
      url: absoluteUrl(entry.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}