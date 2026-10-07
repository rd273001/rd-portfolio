# Ravi Dubey Portfolio

Production portfolio for [ravidubey.in](https://ravidubey.in) — Software Engineer specializing in web and mobile experiences.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. Professional copy and metrics live in `content/`; UI reads from that module instead of hardcoding facts in components.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4
- GSAP + ScrollTrigger for the career journey and the DFC case-study delivery story
- React Three Fiber + Drei for the screenshot-gated mobile showcase

The work section lazy-loads the WebGL phone when DFC App and AptiBooster
have real screenshot files, the viewport is desktop-width, WebGL is
available, and reduced motion is off. Otherwise the same screenshots
render as a static product presentation.

SEO, robots, sitemap, and generated Open Graph images live in `app/`.
Canonical domain is `https://ravidubey.in`.

## Local development

```bash
npm install
npm run dev
```

`npm install` runs `husky` via `prepare` and enables pre-commit checks (TypeScript + ESLint on staged files).

Open [http://localhost:3000](http://localhost:3000).

### Windows note

If `npm install` skips Tailwind native bindings, run:

```bash
npm install --os win32 --cpu x64
```

Production builds use Webpack (`npm run build`) on this setup. See `AGENTS.md` for details.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run build:phone-model` | Rebuild `public/models/android-phone.glb` |

## Repository layout

```text
app/                 Routes, layout, global styles
components/          UI primitives and page sections
content/             Typed profile, projects, metrics, etc.
lib/                 Shared helpers
.cursor/rules/       Cursor Agent rules for this repo
AGENTS.md            Architecture, PR plan, agent prompts
```

## Content

Edit verified facts in `content/*.ts`. Search `TODO_` for placeholders that still need real data (education, dates, testimonials). Do not invent metrics or employers in components.

## Roadmap (initial build)

1. **Foundation** — Next.js, theme, content module, primitives
2. **Core portfolio** — hero, navigation, CTA
3. **Professional story** — experience, impact, skills, education
4. **Projects** — selected work and case studies
5. **Creative interaction** — GSAP storytelling and 3D mobile showcase
6. **Production polish** — SEO, accessibility, performance, QA
7. **Case-study storytelling** — DFC on-demand Zoom delivery *(merged)*
8. **Product polish A–G** — see `AGENTS.md`. PR C waits on AptiBooster production metrics. **PR D** is contact + feedback.

## Contact form (Resend)

Submissions go through `POST /api/contact` and email Ravi. There is no database.

1. Create a Resend account and API key.
2. Verify `ravidubey.in` at [resend.com/domains](https://resend.com/domains).
3. Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` plus `CONTACT_FROM_EMAIL` (must be on the verified domain).
4. On Vercel (or your host), add the same server env vars. Never prefix them with `NEXT_PUBLIC_`.

Until those vars exist, the form returns an error and the Email CTA remains the fallback.

Public “What collaborators say” only appears when `content/testimonials.ts` has verified entries.

Full agent workflow, model usage, and copy-paste prompts: **`AGENTS.md`**.

## Author

**Ravi Dubey** — [GitHub](https://github.com/rd273001) · [LinkedIn](https://www.linkedin.com/in/ravi-dubey-948130174)
