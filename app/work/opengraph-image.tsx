import { createOpenGraphImage, openGraphSize } from "@/lib/og";

export const alt = "All Projects & Engineering Archive · Ravi Dubey";
export const size = openGraphSize;
export const contentType = "image/png";

export default function WorkOpenGraphImage() {
  return createOpenGraphImage({
    kicker: "Engineering Archive",
    title: "All Projects & Production Work",
    description:
      "Directory of production mobile applications, web experiences, and engineering case studies.",
  });
}

