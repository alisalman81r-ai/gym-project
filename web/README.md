# Iron Elite Fitness Club — Next.js

The Next.js/TypeScript/Tailwind/Framer Motion rebuild of the Iron Elite Fitness Club site. See [../docs/migration-phase-plan.md](../docs/migration-phase-plan.md) for the full architecture this project follows.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4** — CSS-first theme via `@theme` in [app/globals.css](app/globals.css) (no `tailwind.config.ts`; every custom property there generates matching utility classes)
- **Framer Motion** — page/section reveals, hover states, the mobile drawer, the testimonial slider, the accordion
- **lucide-react** — icon system (brand/logo icons are hand-drawn separately; see `components/ui/SocialIcons.tsx`)
- **better-sqlite3** — local SQLite database backing the Contact form and Supplement orders (see [lib/db.ts](lib/db.ts))
- **ESLint** (`eslint-config-next`, core-web-vitals + typescript)

## Folder Structure

| Folder | Purpose |
|---|---|
| `app/` | Routes only — one `page.tsx` per URL, plus the root `layout.tsx`, `globals.css`, and file-convention overrides (`loading.tsx`, `not-found.tsx`). |
| `app/api/` | Route handlers — `contact/` and `supplement-orders/`, both writing to SQLite via `lib/db.ts`. |
| `app/admin/` | Password-protected internal dashboard (`/admin`) for viewing/managing submitted contact messages and orders, plus `/admin/login`. Not linked in navigation; blocked in `robots.ts`. See [lib/auth.ts](lib/auth.ts). |
| `components/layout/` | Chrome around every page — Navbar (with a fully wired mobile drawer), Footer, Container. |
| `components/ui/` | Generic, content-agnostic primitives — Button, Card, Badge, SectionTitle, Accordion, CtaBanner, SocialIcons. |
| `components/sections/` | Page-section-sized compositions — Hero, AboutPreview, Features, Stats, Pricing, Classes, Trainers, Gallery, Testimonials, BmiCalculator, Faq, ContactCta. |
| `components/cards/` | The card family — PricingCard, TrainerCard, FeatureCard, ClassCard, TestimonialCard. |
| `public/images/` | Static image assets — see [public/images/README.md](public/images/README.md) for the full manifest of what's required and where to place real photography. |
| `public/icons/` | Reserved for icon assets outside the `lucide-react` package (currently unused). |
| `lib/` | Framework-agnostic helpers — no React, no JSX (`utils.ts` holds `cn()`; `db.ts` holds the SQLite connection + schema). |
| `data/` | Holds the local SQLite file (`app.db`, gitignored — recreated automatically on first run). |
| `hooks/` | Reusable stateful logic — `useCountUp` (Framer Motion-driven animated counters). |
| `types/` | Shared TypeScript types/interfaces. |
| `constants/` | Static content data (site metadata, trainer roster, plans, classes, testimonials, FAQ) — kept separate from components so content edits never touch component code. `gymData.ts` re-exports everything from one place for convenience; the individual files (`trainers.ts`, `pricing.ts`, etc.) remain the actual source of truth. |

## Development

```bash
npm install
cp .env.example .env.local   # then edit ADMIN_USERNAME/ADMIN_PASSWORD/ADMIN_SESSION_SECRET
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Admin dashboard

`/admin` (login at `/admin/login`) lists every contact form submission and supplement order stored in SQLite, with buttons to toggle each row between `new`/`handled` and to delete it. Auth is a single hardcoded credential pair from `.env.local` (see `.env.example`) plus a signed, HttpOnly session cookie — see [lib/auth.ts](lib/auth.ts), [proxy.ts](proxy.ts) (route gate), and [app/admin/actions.ts](app/admin/actions.ts) (the Server Actions doing the mutations). Not linked in navigation; blocked in `robots.ts`.

## Status

**Production-ready.** All 12 routes are built (Home, About, Membership, Trainers, Classes, Supplements, Gallery, Blog index + 4 dynamic posts, Contact, Privacy, Terms), plus custom `not-found.tsx`/`error.tsx` screens. All imagery is real, licensed photography (see [public/images/README.md](public/images/README.md) for the full manifest and credits). SEO metadata, JSON-LD structured data, `sitemap.ts`/`robots.ts`, WCAG AA contrast, and focus-visible states are all in place. `npm run build` produces zero errors and zero TypeScript errors.

The Contact form and Supplement ordering flow are backed by a real local SQLite database (see [lib/db.ts](lib/db.ts) and `app/api/`) — submissions persist and are viewable/manageable at `/admin` behind login.

Known non-blocking gaps: the Supplements page is a showcase with an order form rather than a cart/checkout, and photography is stock rather than the actual business.
