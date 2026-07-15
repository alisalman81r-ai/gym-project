# Iron Elite Fitness Club — Next.js

The Next.js/TypeScript/Tailwind/Framer Motion rebuild of the Iron Elite Fitness Club site. See [../docs/migration-phase-plan.md](../docs/migration-phase-plan.md) for the full architecture this project follows.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4** — CSS-first theme via `@theme` in [app/globals.css](app/globals.css) (no `tailwind.config.ts`; every custom property there generates matching utility classes)
- **Framer Motion** — page/section reveals, hover states, the mobile drawer, the testimonial slider, the accordion
- **lucide-react** — icon system (brand/logo icons are hand-drawn separately; see `components/ui/SocialIcons.tsx`)
- **ESLint** (`eslint-config-next`, core-web-vitals + typescript)

## Folder Structure

| Folder | Purpose |
|---|---|
| `app/` | Routes only — one `page.tsx` per URL, plus the root `layout.tsx`, `globals.css`, and file-convention overrides (`loading.tsx`, `not-found.tsx`). |
| `components/layout/` | Chrome around every page — Navbar (with a fully wired mobile drawer), Footer, Container. |
| `components/ui/` | Generic, content-agnostic primitives — Button, Card, Badge, SectionTitle, Accordion, CtaBanner, SocialIcons. |
| `components/sections/` | Page-section-sized compositions — Hero, AboutPreview, Features, Stats, Pricing, Classes, Trainers, Gallery, Testimonials, BmiCalculator, Faq, ContactCta. |
| `components/cards/` | The card family — PricingCard, TrainerCard, FeatureCard, ClassCard, TestimonialCard. |
| `public/images/` | Static image assets — see [public/images/README.md](public/images/README.md) for the full manifest of what's required and where to place real photography. |
| `public/icons/` | Reserved for icon assets outside the `lucide-react` package (currently unused). |
| `lib/` | Framework-agnostic helpers — no React, no JSX (`utils.ts` holds `cn()`). |
| `hooks/` | Reusable stateful logic — `useCountUp` (Framer Motion-driven animated counters). |
| `types/` | Shared TypeScript types/interfaces. |
| `constants/` | Static content data (site metadata, trainer roster, plans, classes, testimonials, FAQ) — kept separate from components so content edits never touch component code. `gymData.ts` re-exports everything from one place for convenience; the individual files (`trainers.ts`, `pricing.ts`, etc.) remain the actual source of truth. |

## Development

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Status

The Home page (`app/page.tsx`) is fully assembled from the component library. Interior pages (About, Classes, Trainers, Membership, Gallery, Blog, Contact) haven't been built yet — see the migration plan for the phase sequence.

All imagery is currently a placeholder (hand-drawn SVG gradients, not real photography) — see [public/images/README.md](public/images/README.md) for exactly what's needed to replace it.
