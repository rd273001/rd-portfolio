import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Phone testing on the LAN (http://192.168.x.x:3000) is blocked by default
  // in Next 16 unless the Host is allowlisted. Restart `npm run dev` after
  // changing this list if the Wi-Fi IP changes.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "192.168.29.129",
    "192.168.137.1",
  ],
  // Keep the workspace root here. A package-lock.json in the user home
  // directory otherwise makes Turbopack resolve outside this repo.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [75, 95],
  },
  poweredByHeader: false,
  agentRules: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;