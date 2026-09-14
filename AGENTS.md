# Ravi Dubey Portfolio

Personal Software Engineer portfolio for [ravidubey.in](https://ravidubey.in).

This is a hiring product for recruiters, HR, engineering managers, founders, and references. It must show engineering capability, production ownership, and measurable impact — not a generic developer template.

## Knowledge layers

Do not dump a giant portfolio brief into chat. Read only what the current task needs.

| Layer | Path | Role |
| --- | --- | --- |
| Agent operating system | `.cursor/rules/portfolio-agent.mdc` | Always-on workflow, model use, verified facts, constraints |
| Project specification | `AGENTS.md` | Architecture, PR plan, prompts, current status |
| Professional data | `content/*` | Typed source of truth for UI |
| Implementation | `app/`, `components/`, `lib/` | Next.js code that consumes content |

If a fact is missing, use an explicit `TODO_*` placeholder or `status: "placeholder"`. Never invent metrics, companies, dates, testimonials, or results.

## How to use Cursor on this repo

### Conversations

One focused Agent conversation per PR (or per major feature). Do not grow one chat across the whole site.

At the start of a new chat, the Agent should:

1. Read this file and the always-applied rule.
2. Read only the relevant `content/*` files.
3. Inspect only the relevant existing implementation.
4. State understanding briefly, then implement.

### Models

Use the cheapest model that can finish the task reliably.

| Model class | Use for |
| --- | --- |
| Fast / low-cost | Content edits, metrics, copy, small CSS, renames, formatting, cleanup |
| Standard strong coding model (default) | Sections, layouts, case studies, SEO, a11y, normal refactors |
| Frontier / highest capability | First architecture, RSC/client boundaries, GSAP + ScrollTrigger, R3F, hydration, hard performance, large refactors |

Do not open a frontier model for a metric tweak.

### Prompt style

Keep prompts small. Example:

```text
Read AGENTS.md and content/projects.ts + content/metrics.ts.
Implement the DFC case-study page.
Focus on the Zoom Dynamic Feature Module story and verified Play Console metrics.
Do not describe 161 MB as simple compression.
Keep the change scoped to the DFC case study.
```

### Modes

- **Learning mode** (user asks to learn): explain architecture, trade-offs, and Next.js / GSAP / R3F concepts. Do not only dump code.
- **Production mode** (user asks for quick / one-shot / urgent): implement first, then briefly explain important decisions.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Server Components by default; Client Components only for browser APIs, state, animation, WebGL
- Framer Motion: micro-interactions
- GSAP + ScrollTrigger: career journey and pinned storytelling (PR 5)
- React Three Fiber + Drei: 3D mobile showcase (PR 5)
- Content lives in `/content`, never hardcoded in components

## Directory map

```text
.cursor/rules/portfolio-agent.mdc
AGENTS.md
content/                 Professional data + types
app/                     Routes, layout, globals
components/primitives/   Reusable UI used across sections
components/sections/     Page sections (added per PR)
lib/                     Shared helpers, cn(), metadata helpers
public/                  Images, screenshots, favicon
```

## Content contract

UI reads from `content/`. Metrics are defined once in `content/metrics.ts` and referenced by `id` from hero, impact, projects, and achievements.

Priority / visual weight:

1. DFC App
2. AptiBooster
3. Inkyst (independent contribution — do not claim ownership)
4. IKIOR internship (concise, not flagship)
5. Certificate Generator (personal/learning, not employment)

Identity: Software Engineer specializing in Web & Mobile Experiences. Do not reduce this to “React Native Developer”.

DFC 161 MB: that figure is Zoom Meeting SDK moved out of base delivery via Android Dynamic Feature Module / on-demand delivery. Never say the app was “compressed by 161 MB”.

## Design

- Mobile-first. Base styles are the phone layout; enhance upward.
- Target feel: ~70% Vercel + Stripe, ~20% storytelling, ~10% Apple product presentation.
- Premium, clean, technical. No neon, particles, random 3D, or animation for its own sake.
- Test widths: 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920, plus in-between.

## PR plan

Each PR is its own conversation. Do not combine unrelated features.

### PR 1 — Foundation (this conversation)

Next.js, TypeScript, Tailwind, fonts, theme tokens, base architecture, content module, primitive UI.

**Model:** standard strong coding model. Frontier only if the App Router / content boundary design is still open.

**Starter prompt (later chats should not rebuild this):**

```text
Read AGENTS.md.
Continue only if foundation files are missing.
Do not start hero, experience, or projects.
```

### PR 2 — Core portfolio

Navigation, hero, profile, CTA, mobile nav, responsive foundation.

**Model:** standard.

```text
Read AGENTS.md, content/profile.ts, content/site.ts, content/socials.ts, content/metrics.ts.
Implement hero + navigation + mobile nav + CTA.
Consume content only. Mobile-first. No GSAP or R3F.
```

### PR 3 — Professional story

Experience, impact dashboard, career journey structure (static is fine), metrics, skills, education.

**Model:** standard. Frontier only if the journey layout has real architectural risk.

```text
Read AGENTS.md, content/experience.ts, content/metrics.ts, content/skills.ts, content/education.ts.
Implement experience + impact + skills + education.
Hide empty placeholder sections. No invented metrics.
```

### PR 4 — Projects + case studies

DFC, AptiBooster, Certificate Generator, project architecture, case-study routes.

**Model:** standard.

```text
Read AGENTS.md and only the project + metrics content you need.
Implement the case-study system and the requested project page.
Keep visual prominence aligned with project priority.
```

### PR 5 — Creative interaction

GSAP + ScrollTrigger storytelling, 3D mobile showcase with real DFC / AptiBooster screenshots.

**Model:** frontier / highest capability.

```text
Read AGENTS.md and the existing journey + project sections.
Plan GSAP/ScrollTrigger and R3F boundaries first.
Lazy-load 3D. Static + reduced-motion fallbacks required.
Do not animate properties already owned by another system.
```

### PR 6 — Production polish

SEO, accessibility, performance, loading/error states, testing, responsive QA.

**Model:** standard. Frontier only for a real performance or hydration incident.

```text
Read AGENTS.md and the current app routes.
Implement Metadata, sitemap, robots, OG, a11y, and measured performance work.
Canonical domain is https://ravidubey.in.
```

## GitHub discipline

- About 5–6 meaningful PRs for the initial build.
- No filler commits, fake issues, or activity for contribution graphs.
- Stay under ~20 portfolio GitHub events in a day when practical.
- Do not push unless the user reviews the branch / message / commands and approves.

### Branches

Use short, kebab-case names with a [Conventional Commits](https://www.conventionalcommits.org/) type prefix:

| PR | Suggested branch |
| --- | --- |
| 1 Foundation | `chore/foundation` |
| 2 Core UI | `feat/hero-and-navigation` |
| 3 Story | `feat/experience-and-impact` |
| 4 Projects | `feat/projects-and-case-studies` |
| 5 Interaction | `feat/gsap-and-3d-showcase` |
| 6 Polish | `chore/production-polish` |

Do not push feature work directly to `main`; open a PR from the feature branch.

### When the user says "merged"

A merged PR means **sync local git and open the next PR branch** — not only a text handoff.

The Agent must run: `git fetch origin` → `git checkout main` → `git pull origin main` → `git checkout -B <next-branch> main` (next branch from the table above). Then reply with **four numbered handoffs** (what to do next; commit/push readiness; full next-chat prompt including the same four-question closing; model for next PR). See `.cursor/rules/post-merge-workflow.mdc`.

Feature PR chats should end the starter prompt with: *When you finish, tell me: (1) what to do next, (2) commit/push ready, (3) next new-chat prompt, (4) model.*

### Commits inside a PR

Split a PR into multiple commits when it helps review (logical layers, not arbitrary chunks). Use Conventional Commits, imperative mood, ~72 char subject when practical.

Example for PR 1 (`chore/foundation`):

1. `docs: add AGENTS.md, README, and cursor portfolio rules`
2. `feat(content): add typed portfolio content module`
3. `feat(app): scaffold Next.js foundation with theme and primitives`
4. `chore: add husky pre-commit hooks with lint-staged`

Keep `README.md` updated when setup, scripts, structure, or roadmap change.

Remote for this repo: `https://github.com/rd273001/rd-portfolio.git` (empty origin; first push from `chore/foundation`).

## Validation

Before finishing a substantial task: TypeScript, lint, relevant tests, production build when applicable, affected routes, links, images, animation cleanup, console errors.

## Formatting

For `.md`, `.mdc`, and similar docs: do not add an extra blank line at EOF (no empty line after the last content line).

For `.ts`, `.tsx`, `.js`, `.jsx`, and `.css`: use normal endings — one newline after the last line is fine; do not add a second blank line at EOF.

## Current status

- [x] Cursor rule: `.cursor/rules/portfolio-agent.mdc`
- [x] `AGENTS.md`
- [x] Typed `content/` with verified facts and explicit placeholders
- [x] PR 1 foundation app (Next.js, theme, primitives, content module)
- [x] PR 2 hero + navigation
- [x] PR 3 professional story
- [x] PR 4 projects + case studies
- [x] PR 5 GSAP + 3D
- [ ] PR 6 production polish

### Local Windows note

This machine’s npm config currently reports `os=linux`, so optional Tailwind / Lightning CSS Windows bindings are skipped unless you install with:

```bash
npm install --os win32 --cpu x64
```

Production build uses Webpack (`next build --webpack`) because Turbopack still fails to load the Lightning CSS native binding on this setup.

`next.config.ts` sets `agentRules: false` so `next dev` does not rewrite this file.

PR 5 keeps the R3F scene behind complete DFC App and AptiBooster screenshot
sets. Both apps now have real `/screenshots/...` WebP paths, so the work
section can request the lazy Three.js chunk (with static / reduced-motion /
WebGL fallbacks still in place).

## Placeholders that still need Ravi

Search `TODO_` in `content/`. Do not fill these from conversation memory. Examples:

- Current-role start date
- Education rows
- Certification rows
- Testimonials
- Headshot / OG image
- Preferred public email if `ravidubey.personal@gmail.com` should not be the canonical contact
