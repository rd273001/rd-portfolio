import { Container } from "@/components/primitives";
import { skills } from "@/content/skills";

export function SkillsSection() {
  const visibleSkillGroups = skills.filter((group) => group.items.length > 0);

  if (visibleSkillGroups.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-start lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Skills
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl">
              Focused on React, React Native, and TypeScript product work.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {visibleSkillGroups.map((group) => (
              <article
                key={group.id}
                className="rounded-3xl border border-border bg-surface p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold tracking-tight">
                  {group.label}
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}