# Product polish pass — full specification

Master prompt for the post-PR-6 polish phase (PR A–H). **Repository wins:** content/*, AGENTS.md, and .cursor/rules/portfolio-agent.mdc override this document when facts or PR order differ.

---

You are continuing work on my EXISTING production portfolio:

Repository:
rd273001/rd-portfolio

Live:
https://ravidubey.in

IMPORTANT:
This is NOT a new portfolio build.

PR1–PR6 are already implemented.
The repository already has:
- Next.js App Router
- TypeScript
- Tailwind CSS
- centralized typed content
- responsive/mobile-first UI
- Hero
- Impact
- Experience
- Career Journey
- Selected Work
- Skills
- Education
- Certifications
- Site Metrics
- Contact CTA
- GSAP / ScrollTrigger Career Journey
- React Three Fiber / Three.js phone showcase
- DFC + AptiBooster screenshots
- AndroidPhoneFrame fallback
- SEO / metadata / sitemap / robots / JSON-LD
- loading/error/not-found states
- performance and reduced-motion safeguards
- metric de-duplication work
- experimental mobile 3D capability flag

Read the current repository first.

Do NOT rebuild the site.
Do NOT replace the current visual language.
Do NOT discard the existing Career Journey or 3D phone showcase.
Do NOT create a generic developer portfolio.
Do NOT add effects merely because they look impressive.

The purpose of this pass is to make the existing portfolio feel more like
a cohesive PRODUCT and less like a sequence of independently designed
portfolio sections.

The main direction is:

REAL ENGINEERING
+
STORY
+
EVIDENCE
+
PURPOSEFUL INTERACTION

==================================================
1. FIRST — AUDIT CURRENT STATE
==================================================

Inspect the current implementation and identify what is already present
before changing anything.

Read only the relevant files.

Pay particular attention to:
- app/page.tsx
- SiteHeader
- Hero
- ImpactDashboard
- ExperienceSection
- CareerJourney
- ProjectsSection
- SkillsSection
- EducationSection
- SiteMetrics
- ContactCta
- mobile showcase components
- /work/[projectId]
- content/types.ts
- content/profile.ts
- content/projects.ts
- content/metrics.ts
- content/achievements.ts
- content/testimonials.ts
- content/site.ts
- content/socials.ts

Do not repeat or recreate functionality already implemented.

==================================================
2. MAIN DESIGN OBJECTIVE
==================================================

The portfolio already has creativity.

Now make the creativity communicate something.

Avoid the pattern:

section
→ animation
→ section
→ animation
→ card
→ animation

Prefer:

question
→ evidence
→ interaction
→ understanding
→ deeper story

The visitor should gradually discover:

Who Ravi is
→ what he works on
→ what he changed
→ how he solved problems
→ what the result was
→ where they can inspect the work

The portfolio should feel intentional rather than "animated".

==================================================
3. THE SIGNATURE IDEA:
   EVIDENCE-DRIVEN STORYTELLING
==================================================

The strongest differentiator should NOT be another decorative effect.

The portfolio should make real engineering evidence interactive.

Think:

CLAIM
→ EVIDENCE
→ TECHNICAL DECISION
→ RESULT

Examples:

161 MB base-delivery reduction
→ Zoom SDK was moved out of base delivery
→ Android Dynamic Feature Module
→ on-demand installation
→ measured result

DFC startup improvement
→ lazy-loaded navigators / startup-path refactor
→ p90 app start
→ measured result

AptiBooster analysis
→ timed test telemetry
→ scoring / comparison
→ API-backed analysis
→ suggestions / reports

The visitor should be able to naturally move from the high-level result
to the explanation.

Do not turn every metric into an interactive link.

Use this only where it genuinely improves understanding.

==================================================
4. HERO — REFINE, DO NOT REDESIGN
==================================================

Keep the existing Hero structure.

Improve the Hero so the first screen communicates:

Software Engineer
Web + Mobile
Production ownership
Measured impact

Do NOT lead primarily with:
"Software Engineer 1 (Mobile)"

The exact employment title can still appear in the role/company card
and experience context.

Keep:
"Software Engineer specializing in Web & Mobile Experiences"

or the current repository's equivalent if already better.

--------------------------------------------------
Hero right-side identity card
--------------------------------------------------

Support adding a real professional profile photo.

Requirements:
- use a real photo only if one exists in the project/content/assets
- do not invent one
- do not generate one
- design the card so it still works if no photo exists
- photo should feel professional and editorial rather than like a generic
  circular avatar

Possible composition:

photo
identity
current role
company
optional location

Do not make the photo larger than the role information needs.

--------------------------------------------------
Hero CTAs
--------------------------------------------------

Current Email / LinkedIn actions can remain.

Add a Resume CTA once a real resume URL/file is available.

Resume must be:
- content-driven
- optional
- hidden when missing
- visually secondary to the main contact action, unless hierarchy clearly
  benefits from making Resume the primary utility CTA

Do not hardcode a fake resume URL.

--------------------------------------------------
Hero metric cards
--------------------------------------------------

Keep the current three high-level identity metrics.

Do not add additional metrics.

A subtle one-time reveal is acceptable:
opacity + small translate + stagger.

Do not use:
- count-up animation
- GSAP solely for the metric cards
- perpetual motion

The metrics are evidence, not decoration.

==================================================
5. HEADER / DESKTOP NAVIGATION
==================================================

Improve the existing header rather than replacing it.

Desktop should have:

Brand

About
Impact
Experience
Work
Skills
Contact

plus a distinct Resume CTA when available.

Do not create a huge navigation.

Do not add every page/section just because it exists.

Resume should visually read as a useful hiring action rather than another
ordinary text link.

Keep the existing glass header direction.

Avoid dramatic header animation.

Optional improvement:
a very subtle active-section state/indicator is acceptable if it improves
navigation clarity.

Do not add it if it requires complicated scroll tracking with little value.

==================================================
6. MOBILE HEADER / MENU
==================================================

Keep the current mobile menu architecture.

Improve the mobile menu so it has clear hierarchy.

Structure:

navigation links

----------------
utility actions
----------------

Resume
GitHub
LinkedIn

The separator should visually distinguish:
"site navigation"
from
"professional actions"

Use large touch targets.

Do not make GitHub/LinkedIn look equally important to Resume.

If Resume does not exist yet, hide it and preserve a clean two-action layout.

The menu must:
- close after navigation
- close on Escape
- lock body scrolling while open
- remain keyboard accessible
- work without hover

Do not replace the existing accessible menu implementation with a custom
animation-heavy menu.

==================================================
7. SKILLS SECTION
==================================================

Current heading/copy is too close to a technology list.

Do NOT repeat the technology keywords in the descriptive caption when
the chips already communicate them.

Preferred caption:

"A practical engineering stack shaped by production web, mobile, and
full-stack work."

Use this or a very close improvement if the current content has not
already been improved.

Keep:
Primary
Additional
Tooling

Do not infer skills from package.json.

Do not add technologies merely because they appear somewhere in the repo.

--------------------------------------------------
Skills animation
--------------------------------------------------

A restrained reveal is acceptable:

section enters
→ skill group cards appear
→ chips settle into place

Only once.

Do not animate individual chips forever.
Do not make chips float.
Do not create a skill "cloud".

The interaction should improve scanning.

==================================================
8. IMPACT DASHBOARD
==================================================

Keep the existing metric de-duplication strategy.

Do not repeat Hero metrics unnecessarily.

Impact should answer:

"What measurable engineering improvements have I delivered?"

Use the existing content source.

The current production metrics are the important material.

Do not invent:
- debugging percentages
- performance improvements
- business metrics
- user percentages

A subtle viewport reveal is enough.

Do not create number counters.

Do not turn Impact into a dashboard with animated charts.

==================================================
9. EXPERIENCE SECTION
==================================================

Experience should communicate ownership and progression rather than repeat
the Impact section.

DFC should receive the most detail.

IKIOR should remain concise.

Inkyst should remain correctly framed as an independent contribution.

Do not create another statistics grid.

Improve the visual relationship between:
role
→ ownership
→ notable work
→ technology

Potential interaction:
light sequential reveal of each experience item.

Do not duplicate the stronger Career Journey animation here.

==================================================
10. CAREER JOURNEY
==================================================

KEEP the existing GSAP / ScrollTrigger Career Journey.

It is already one of the meaningful creative interactions.

Do not add another competing timeline.

Do not replace it.

Only improve it where useful for:
- hierarchy
- readability
- responsive behavior
- narrative continuity
- accessibility

The animation should continue to communicate career progression.

==================================================
11. PROJECTS / WORK
==================================================

The Work section should feel like the strongest engineering section.

Current hierarchy should remain approximately:

DFC
AptiBooster
Certificate Generator / other high-signal projects

Do not give every project equal visual weight.

The 3D mobile showcase remains one of the portfolio's main visual
differentiators.

The important improvement is connecting the showcase to the story.

Project selection should naturally update:

project
→ description
→ metric
→ screenshot
→ case study

Keep state transitions subtle and fast.

Do not add card tilt everywhere.

Do not make the entire page react to mouse movement.

==================================================
12. 3D MOBILE SHOWCASE
==================================================

Preserve the existing implementation.

Desktop:
3D WebGL phone where eligible.

Mobile:
2D frame by default, with the existing experimental 3D capability.

The 2D AndroidPhoneFrame is the canonical fallback and must remain.

Do not introduce video.

Do not introduce image sequences.

Do not remove current WebGL safeguards.

Do not enable mobile 3D automatically just because it exists.

Only test it where the feature flag and capability checks allow it.

If it is not smooth on real mobile devices, keep the 2D fallback.

Do not sacrifice page quality just to demonstrate Three.js.

==================================================
13. THE "WOW" EXPERIENCE
==================================================

The portfolio already has a visual wow element:
the interactive production-app phone showcase.

Do not replace this.

The next level of the wow experience should come from the relationship
between interaction and engineering explanation.

Examples:

DFC:

161 MB
↓
What caused it?
↓
Zoom SDK
↓
Why was it a problem?
↓
Dynamic Feature Module
↓
On-demand delivery
↓
result

AptiBooster:

Timed test
↓
telemetry
↓
scoring / comparison
↓
analysis
↓
suggestions / reports

These can be represented through tasteful scroll-driven diagrams or
progressive visual state changes.

The animation should explain the engineering.

==================================================
14. CASE STUDIES — MAJOR PRIORITY
==================================================

The current case-study pages are too much:

hero
→ metrics
→ highlights
→ screenshots
→ technologies

Turn them into real case studies.

Do NOT simply add more text.

Create a reusable storytelling model in content/types.ts and the project
content layer.

Support sections such as:

Context
Problem
Why it mattered
My role
Constraints
Approach
Technical decisions
Challenges
Implementation
Result
Trade-offs
Learning
Evidence

Not every project needs all of these.

The renderer should only display sections that exist.

--------------------------------------------------
DFC case study
--------------------------------------------------

DFC is the flagship case study.

The primary story should be the Zoom delivery architecture.

Narrative:

Problem:
Zoom Meeting SDK created a large base-delivery footprint.

Constraint:
Users should not need to carry the full Zoom delivery path in the base
download before they need lecture functionality.

Approach:
Move Zoom into an Android Dynamic Feature Module and deliver it on demand.

Technical complexity:
- native Android/Kotlin work
- Zoom SDK dependency/in-repo adjustments where necessary
- installation lifecycle
- progress
- cancellation
- restart
- resume when meeting state requires it

Result:
- 161 MB base-delivery reduction
- 15.9 MB new-install download size
- 8 second module download
- 90 second improvement versus previous release

Also preserve the other verified DFC evidence:
- p90 app start ~894 ms → ~794 ms
- ~100 ms faster
- ~11%
- 21.02 MB → 15 MB
- 6.02 MB saved
- 28.6%

Do not say:
"compressed the app by 161 MB"

--------------------------------------------------
DFC case-study interaction
--------------------------------------------------

Build an optional scroll-driven technical story.

Example:

Previous release
        ↓
Zoom SDK in base
        ↓
Large base delivery
        ↓
Dynamic Feature Module
        ↓
On-demand install
        ↓
Smaller initial delivery

This is a HIGH-VALUE animation.

It is not decorative.

It teaches the visitor what was actually engineered.

--------------------------------------------------
AptiBooster case study
--------------------------------------------------

Use the product/data relationship as the story.

Timed test
→ telemetry
→ scoring
→ peer comparison
→ analysis
→ suggestions
→ reports

Clarify that the backend generates the analysis content.

Do NOT claim:
Gemini implementation
AI backend ownership
backend AI pipeline ownership

The mobile responsibility is:
- test client
- telemetry consistency
- API integration
- analysis UX
- suggestions UX
- downloadable report flow

--------------------------------------------------
Certificate Generator
--------------------------------------------------

Keep it clearly:

Personal / learning / full-stack project

Story:

Request
→ approval
→ PDF generation
→ Google Drive storage

Use the actual verified:
400+ pending requests
466+ generated certificates

Do not present it as employment.

==================================================
15. CASE-STUDY READING EXPERIENCE
==================================================

Long case studies should be easier to navigate.

Consider:
- small chapter navigation
- sticky chapter index on desktop
- reading progress
- section anchors
- previous/next project navigation

Do not overdo it.

A recruiter should be able to scan the result quickly and then go deeper.

The opening of every case study should communicate the result quickly.

Do not force a visitor to read the entire story before learning the outcome.

==================================================
16. ALL PROJECTS PAGE
==================================================

Keep the homepage curated.

Create a separate all-projects/archive experience if it does not already
exist.

Possible route:
 /work
or
 /projects

Use the existing content system.

Allow useful filtering:
- production
- independent contribution
- internship
- personal/learning
- technology

Where data exists, year can also be supported.

Do not invent missing years.

Do not expose every project with equal prominence.

The page should feel like an engineering archive, not a portfolio dump.

==================================================
17. ACHIEVEMENTS
==================================================

There is already an achievements content layer.

Do not create a generic achievement card grid simply because the data exists.

First determine the best place for achievement information.

Prefer integrating achievements into:
- case studies
- experience
- evidence/storytelling

rather than duplicating facts.

Only create a dedicated achievement section if it provides information that
is not already communicated elsewhere.

==================================================
18. RESUME SUPPORT
==================================================

Add a proper content-driven Resume configuration.

Possible model:

resumeUrl
resumeLabel
resumeStatus

or a similarly clean typed approach.

Resume should appear in:

Desktop header
Hero if appropriate
Mobile utility actions

Only when the actual resume exists.

Do not invent a path.

Use appropriate external-link/download semantics.

Do not automatically force a browser download if the user would reasonably
expect the PDF to open.

==================================================
19. CONTACT EXPERIENCE
==================================================

The current Contact CTA is useful, but it should become a real contact
experience.

Add a contact form with:

Name
Email
Message

Optional:
Subject / reason

Requirements:
- server-side submission
- no credentials in client code
- validation
- loading state
- success state
- error state
- spam protection / honeypot
- accessible labels
- keyboard support

A provider such as Resend may be used if appropriate.

Before implementation, verify the current API/documentation rather than
assuming provider behavior.

Keep direct Email as a fallback.

The contact section should still feel visually minimal and premium.

Do not turn it into a giant application form.

==================================================
20. FEEDBACK / TESTIMONIAL EXPERIENCE
==================================================

The repository already has:
content/testimonials.ts

There must be NO fake testimonials.

Implement two distinct concepts:

PUBLIC:
"What collaborators say"

This appears only when verified testimonials exist.

PRIVATE:
"Leave feedback"

This can be linked from the portfolio and can collect:

Name
Role
Company
Feedback
Permission to publish

The first implementation can send the submission privately to Ravi.

Do not require a database unless necessary.

The public section must remain hidden when no approved testimonials exist.

This is important:
An empty testimonial grid is worse than no testimonial section.

==================================================
21. PROFILE PHOTO / HUMAN ELEMENT
==================================================

The portfolio currently communicates engineering very strongly.

Improve the human element without turning it into a personal-blog layout.

If a real professional headshot is supplied:
- integrate it into the Hero identity card
- use subtle framing
- maintain the technical/premium aesthetic
- use responsive sizing

Do not add:
- giant portrait hero
- circular social-media avatar everywhere
- decorative image carousel

The person should support the engineering story, not compete with it.

==================================================
22. ANIMATION STRATEGY
==================================================

Yes, add more animation — but only where it helps communication.

Good candidates:

Hero:
subtle one-time reveal

Hero metrics:
small staggered reveal

Impact:
subtle viewport reveal

Experience:
subtle sequential reveal

Career Journey:
existing GSAP storytelling

Skills:
subtle group reveal

Work:
project/screen transitions

Case studies:
technical architecture/result storytelling

Contact:
subtle final CTA entrance

Do NOT animate every section.

Do NOT use:
- infinite floating elements
- particle backgrounds
- huge parallax
- cursor-following decoration
- fake number counters
- excessive blur transitions
- scroll-jacking

Prefer:
transform
opacity
small scale where appropriate

Honor prefers-reduced-motion everywhere.

==================================================
23. IMPORTANT — CASE STUDY ANIMATION OWNERSHIP
==================================================

GSAP/ScrollTrigger may control large scroll storytelling.

CSS may control:
- hover
- press
- small state transitions

React state may control:
- selected project
- selected screen
- form state

R3F may control:
- device motion
- 3D interaction

Do not allow multiple systems to fight over the same transform/opacity
property.

Clean up ScrollTriggers.

Keep client boundaries small.

==================================================
24. CONTENT ARCHITECTURE
==================================================

Keep all professional content data-driven.

Do not put case-study prose directly inside JSX.

Extend the existing content model instead.

Potential shape:

type CaseStudySection = {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
  bullets?: string[];
  metricIds?: string[];
  screenshots?: string[];
  visual?: ...;
};

Use a clean type appropriate for the existing codebase.

Avoid over-engineering.

Different projects should be allowed to tell different stories.

==================================================
25. REMOVE DATA / UI INCONSISTENCIES
==================================================

While implementing the above, fix only relevant inconsistencies.

Pay particular attention to:

- project case-study eligibility being defined separately from
  caseStudyHref
- content that exists but cannot currently be reached
- achievements data existing without a meaningful consumer
- testimonials data existing without a UI
- current role start information duplicated in multiple places
- project download values overlapping metric data
- unused ProjectCard metric logic if still unused
- outdated motion-library documentation if it no longer matches the
  actual dependencies

Do not perform a giant unrelated refactor.

Fix the minimum necessary to make the architecture coherent.

==================================================
26. METRIC PRESENTATION
==================================================

Use the current metric surfaces intentionally.

Keep the current philosophy:

Hero:
identity / scale

Impact:
new production outcomes

Work:
small project-specific evidence

Case Study:
complete technical evidence

Site Metrics:
portfolio engineering evidence

Do not put every number everywhere.

The visitor should not feel like the same number is following them
through the whole page.

==================================================
27. IMPORTANT VERIFIED FACTS
==================================================

Use the repository as the source of truth.

Current verified DFC examples:

10K+ downloads

161 MB base-delivery reduction

21.02 MB → 15 MB
6.02 MB
28.6%

~894 ms → ~794 ms
~100 ms
~11%

15.9 MB new-install download
8 second module download
90 second improvement versus previous release

Current verified AptiBooster examples:

1K+ downloads

23.7 MB → 20.4 MB
3.3 MB
~13.9%

Certificate Generator:

400+ pending requests
466+ generated certificates

Current portfolio/site metrics can be used only where already present in
content/metrics.ts.

Do not invent new values.

==================================================
28. SITE METRICS
==================================================

Keep the "This website" section.

The concept is useful because the portfolio itself is an engineering
artifact.

However, present it as:

"How I engineered this site"

rather than a random Lighthouse dashboard.

PageSpeed numbers should remain evidence, not decoration.

==================================================
29. MOBILE-FIRST QUALITY
==================================================

Preserve mobile-first design.

Explicitly test:
320
360
375
390
414
768
1024
1280
1440
1920

Also test intermediate widths.

Do not shrink desktop layouts down to mobile.

Mobile menu, contact form, case-study navigation and interactive project
controls must all be easy to use with touch.

==================================================
30. PERFORMANCE
==================================================

Do not trade performance for animation.

The 3D phone is already the main expensive visual.

Do not make:
- hero
- header
- case-study storytelling
- metrics
- skills

depend on large JavaScript bundles.

Use CSS for simple transitions where GSAP is unnecessary.

Use GSAP only where scroll sequencing genuinely needs it.

Do not delay initial content just to wait for an animation.

==================================================
31. FINAL EXPERIENCE TEST
==================================================

After implementation, evaluate the portfolio as a recruiter/engineering
manager rather than only as a developer.

The first screen should quickly answer:
Who is Ravi?

Within the next sections:
What does he build?

Then:
What did he personally change?

Then:
What measurable result did it create?

Then:
Can I inspect the technical story?

Then:
Can I contact him / view resume / LinkedIn / GitHub?

The creative features should strengthen those answers.

==================================================
32. DEFINITION OF "WOW"
==================================================

Do NOT define "wow" as:
more animation
more 3D
more gradients
more effects
more motion

The desired wow is:

"I clicked / scrolled through something and understood an actual
engineering decision."

Examples:

161 MB
→ Dynamic Feature Module
→ on-demand Zoom
→ result

Timed test
→ telemetry
→ analysis
→ reports

That is the signature.

The existing 3D phone is the visual hook.
The engineering storytelling should become the intellectual hook.

==================================================
33. DO NOT BREAK EXISTING STRENGTHS
==================================================

Preserve unless there is a real reason to change:

- existing visual language
- 3D phone model
- AndroidPhoneFrame
- static fallback
- Career Journey
- metric architecture
- responsive architecture
- SEO
- accessibility foundations
- reduced-motion support
- WebGL capability checks
- current production app screenshots
- verified content

Do not rewrite working systems just to make the code look different.

==================================================
34. IMPLEMENTATION STRATEGY
==================================================

This is a polish phase.

Break the implementation into separate logical PRs.

Recommended:

PR A:
Header + Resume + Hero photo + Skills copy

PR B:
Real case-study content architecture + DFC case-study storytelling

PR C:
AptiBooster / Certificate Generator storytelling + case-study navigation

PR D:
Contact form + feedback collection (Resend email; no database)

PR E:
Admin feedback dashboard + dynamic testimonials (Auth.js Google allowlist, DB, publish/archive/delete; separate PR after D)

PR F:
All Projects/archive + achievement/content integration

PR G:
Purposeful animation polish + evidence-driven interactions

PR H:
Final responsive / accessibility / performance QA

Do not mix unrelated PRs.

**Canonical PR order:** `AGENTS.md` **Product polish phase (PR A–H)**. This file’s §20 describes static testimonials until PR E adds the admin publish flow.

==================================================
35. VALIDATION
==================================================

Before completing each PR:

- typecheck
- lint
- production build
- affected route checks
- responsive checks
- keyboard checks
- reduced-motion checks
- link checks
- image checks
- console-error checks

For forms:
- success
- failure
- validation
- spam/honeypot

For case studies:
- direct URL
- navigation
- missing optional sections
- previous/next navigation
- mobile reading flow

For animation:
- normal motion
- reduced motion
- refresh/re-entry
- no stale ScrollTriggers

For 3D:
- existing desktop behavior
- fallback behavior
- mobile flag off
- mobile flag on
- unsupported WebGL
- context-loss/failure fallback

Do not claim a performance improvement unless measured.

==================================================
36. FINAL QUALITY BAR
==================================================

Do not ask:
"How can we add more effects?"

Ask:

"Where can interaction help the visitor understand Ravi's engineering
work better?"

The final portfolio should feel:

premium
technical
human
interactive
story-driven
evidence-driven
memorable

without becoming noisy or gimmicky.

When finished, report:

1. What changed
2. What was already present and intentionally preserved
3. New interactions added and why each exists
4. Case-study storytelling added
5. Resume / photo / header changes
6. Contact / feedback changes
7. Validation performed
8. Remaining TODOs
9. Recommended next PR
10. Recommended Cursor model for that PR
