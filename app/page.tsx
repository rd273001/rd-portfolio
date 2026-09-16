import {
  CareerJourney,
  ContactCta,
  EducationSection,
  ExperienceSection,
  Hero,
  ImpactDashboard,
  PageShell,
  ProjectsSection,
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
      <ContactCta />
    </PageShell>
  );
}