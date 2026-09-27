import {
  CareerJourney,
  ContactCta,
  EducationSection,
  ExperienceSection,
  Hero,
  ImpactDashboard,
  PageShell,
  ProjectsSection,
  SiteMetrics,
  SkillsSection,
} from "@/components/sections";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <ImpactDashboard />
      <ExperienceSection />
      <CareerJourney />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <SiteMetrics />
      <ContactCta />
    </PageShell>
  );
}