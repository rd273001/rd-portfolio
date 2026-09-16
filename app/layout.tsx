import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/sections";
import { site } from "@/content/site";
import { socials } from "@/content/socials";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.description,
  alternates: {
    canonical: "/",
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