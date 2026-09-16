import {
  CareerJourney,
  ContactCta,
  EducationSection,
  ExperienceSection,
  Hero,
  ImpactDashboard,
  ProjectsSection,
  SkillsSection,
} from "@/components/sections";
import { site } from "@/content/site";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main id="top">
        <Hero />
        <ImpactDashboard />
        <ExperienceSection />
        <CareerJourney />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactCta />
      </main>
      <footer className="border-t border-border py-6">
        <p className="mx-auto w-full max-w-5xl px-4 text-sm text-muted sm:px-6 lg:px-8">
          {site.name} · {site.domain}
        </p>
      </footer>
    </div>
  );
}