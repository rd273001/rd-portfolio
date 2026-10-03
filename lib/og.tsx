import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const openGraphSize = {
  width: 1200,
  height: 630,
} as const;

export const appleIconSize = {
  width: 180,
  height: 180,
} as const;

const colors = {
  background: "#fafafa",
  foreground: "#111111",
  muted: "#5c5c5c",
  border: "#e6e6e6",
  surface: "#ffffff",
};

/** Matches `public/brand-mark.svg` / header `BrandMark` (32×32, rx 8). */
const brandMarkSize = 56;
const brandMarkRadius = (8 / 32) * brandMarkSize;

function OgBrandMark() {
  return (
    <div
      style={{
        display: "flex",
        height: brandMarkSize,
        width: brandMarkSize,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: brandMarkRadius,
        backgroundColor: colors.foreground,
        color: colors.background,
        fontSize: 24,
        fontFamily: "Georgia, serif",
        letterSpacing: "-0.02em",
      }}
    >
      RD
    </div>
  );
}

export function createOpenGraphImage({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: colors.background,
          color: colors.foreground,
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OgBrandMark />
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 500,
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: colors.muted,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 58,
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 28,
              lineHeight: 1.4,
              color: colors.muted,
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: colors.muted }}>
          {site.domain}
        </div>
      </div>
    ),
    {
      ...openGraphSize,
    },
  );
}

export function createAppleIcon() {
  const size = appleIconSize.width;
  const radius = (8 / 32) * size;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.foreground,
          borderRadius: radius,
          color: colors.background,
          fontSize: 78,
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.02em",
        }}
      >
        RD
      </div>
    ),
    {
      ...appleIconSize,
    },
  );
}