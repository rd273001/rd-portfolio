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
          <div
            style={{
              display: "flex",
              height: 56,
              width: 56,
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              backgroundColor: colors.surface,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            RD
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "0.16em",
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
          color: colors.background,
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: "-0.06em",
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