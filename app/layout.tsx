import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SkipToContent } from "@/components/primitives";
import { SiteHeader } from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { socials } from "@/content/socials";
import { getPersonJsonLd, getWebSiteJsonLd } from "@/lib/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.canonicalUrl }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.canonicalUrl,
    siteName: site.name,
    title: site.defaultTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const contact = socials.find(
    (social) => social.id === site.contact.primarySocialId,
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <JsonLd data={getPersonJsonLd()} />
        <JsonLd data={getWebSiteJsonLd()} />
        <SkipToContent />
        <SiteHeader
          brand={site.name}
          navigation={site.navigation}
          contact={contact}
        />
        {children}
      </body>
    </html>
  );
}