import type { Metadata } from "next";
import { PageShell } from "@/components/sections";
import { WorkArchive } from "@/components/sections/WorkArchive";
import { getAllProjects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `All Projects & Engineering Archive · ${site.name}`,
  description:
    "Complete directory of production mobile apps, full-stack builds, and open-source GitHub repositories by Ravi Dubey.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: `All Projects & Engineering Archive · ${site.name}`,
    description:
      "Complete directory of production mobile apps, full-stack builds, and open-source GitHub repositories by Ravi Dubey.",
    url: "/work",
  },
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <PageShell>
      <WorkArchive projects={projects} />
    </PageShell>
  );
}
