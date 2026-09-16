import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the workspace root here. A package-lock.json in the user home
  // directory otherwise makes Turbopack resolve outside this repo.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [75, 95],
  },
  agentRules: false,
};

export default nextConfig;
