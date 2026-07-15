# Iron Elite Fitness Club — Next.js

The Next.js/TypeScript/Tailwind/Framer Motion rebuild of the Iron Elite Fitness Club site. See [../docs/migration-phase-plan.md](../docs/migration-phase-plan.md) for the full architecture this project follows.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4** — CSS-first theme via `@theme` in [app/globals.css](app/globals.css) (no `tailwind.config.ts`; every custom property there generates matching utility classes)
- **Framer Motion** (added when animated components are built)
- **ESLint** (`eslint-config-next`, core-web-vitals + typescript)

## Folder Structure

| Folder | Purpose |
|---|---|
| `app/` | Routes only — one `page.tsx` per URL, plus the root `layout.tsx`, `globals.css`, and file-convention overrides (`loading.tsx`, `not-found.tsx`). |
| `components/layout/` | Chrome around every page — Navbar, MobileNav, Footer, BackToTop. |
| `components/ui/` | Generic, content-agnostic primitives — Button, Card, SectionHeading, Modal, Accordion, Tabs. |
| `components/sections/` | Page-section-sized compositions (Hero, Testimonials, Faq, CtaBanner, ...). |
| `components/cards/` | The card family — ProgramCard, TrainerCard, PricingCard, BlogCard, TestimonialCard. |
| `public/images/` | Static image assets, categorized the same way as the static site (`logo/`, `hero/`, `trainers/`, `programs/`, `gallery/`, `facilities/`, `testimonials/`, `blog/`, `og/`). |
| `public/icons/` | Icon assets, if any are needed outside the `lucide-react` package. |
| `lib/` | Framework-agnostic helpers — no React, no JSX (`utils.ts` holds `cn()`). |
| `hooks/` | Reusable stateful logic extracted out of components. |
| `types/` | Shared TypeScript types/interfaces. |
| `constants/` | Static content data (site metadata, trainer roster, plans, FAQ) — kept separate from components so content edits never touch component code. |

## Development

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run lint      # ESLint
```

## Status

Foundation only — design tokens, fonts, and folder structure are in place. No section/page components have been built yet (see the migration plan for the phase sequence).
