import type { Achievement } from "./types";

export const achievements: Achievement[] = [
  {
    id: "dfc-zoom-ondemand",
    title: "On-demand Zoom delivery",
    description:
      "Moved Zoom Meeting SDK out of DFC App base delivery with an Android Dynamic Feature Module, cutting 161 MB from the base download path.",
    metricId: "dfc-zoom-delivery",
    status: "verified",
  },
  {
    id: "dfc-bundle",
    title: "DFC App bundle optimization",
    description:
      "Reduced the Android App Bundle from 21.02 MB to 15 MB — 6.02 MB saved, 28.6% smaller.",
    metricId: "dfc-bundle-optimization",
    status: "verified",
  },
  {
    id: "aptibooster-bundle",
    title: "AptiBooster release optimization",
    description:
      "Reduced release size from 23.7 MB to 20.4 MB — 3.3 MB, about 13.9%.",
    metricId: "aptibooster-bundle-optimization",
    status: "verified",
  },
];
