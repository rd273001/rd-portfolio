import { Suspense } from "react";

import {
  AboutSection,
  CareerJourney,
  ContactCta,
  EducationSection,
  Hero,
  ImpactDashboard,
  PageShell,
  ProjectsSection,
  SkillsSection,
  TestimonialsSection,
} from "@/components/sections";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <ImpactDashboard />
      <ProjectsSection />
      <AboutSection />
      <CareerJourney />
      <SkillsSection />
      <EducationSection />
      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>
      <ContactCta />
    </PageShell>
  );
}