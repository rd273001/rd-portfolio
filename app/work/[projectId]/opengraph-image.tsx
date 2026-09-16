import { getCaseStudyProject, getCaseStudyProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { createOpenGraphImage, openGraphSize } from "@/lib/og";

export const alt = "Project case study";
export const size = openGraphSize;
export const contentType = "image/png";
export const dynamicParams = false;

type OpenGraphImageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export function generateStaticParams() {
  return getCaseStudyProjects().map((project) => ({
    projectId: project.id,
  }));
}

export default async function ProjectOpenGraphImage({
  params,
}: OpenGraphImageProps) {
  const { projectId } = await params;
  const project = getCaseStudyProject(projectId);

  return createOpenGraphImage({
    kicker: project?.name ?? profile.name,
    title: project ? `${project.name} case study` : site.defaultTitle,
    description: project?.tagline ?? profile.positioning,
  });
}