# Migration Phase — Architecture Plan
## IRON ELITE FITNESS CLUB → Next.js / TypeScript / Tailwind / Framer Motion

This document is the architecture for migrating the static HTML/CSS/JS site (built in the prior planning phases) into a production Next.js application. **No implementation code yet** — this is the blueprint the build phase will follow.

---

## 1. Next.js Project Folder Structure

```
iron-elite-fitness-club/
│
├── app/
│   ├── layout.tsx                  # Root layout: <html>/<body>, fonts, Navbar, Footer
│   ├── page.tsx                    # Home ( / )
│   ├── template.tsx                # Per-navigation mount animation (page transitions)
│   ├── loading.tsx                 # Route-level suspense fallback / preloader
│   ├── not-found.tsx               # 404
│   ├── globals.css                 # Tailwind directives + base layer + @font-face fallback
│   │
│   ├── about/
│   │   └── page.tsx                # ( /about )
│   ├── membership/
│   │   └── page.tsx                # ( /membership )
│   ├── trainers/
│   │   └── page.tsx                # ( /trainers )
│   ├── classes/
│   │   └── page.tsx                # ( /classes )
│   ├── gallery/
│   │   └── page.tsx                # ( /gallery )
│   ├── blog/
│   │   ├── page.tsx                # Blog archive ( /blog )
│   │   └── [slug]/
│   │       └── page.tsx            # Blog single ( /blog/[slug] )
│   └── contact/
│       └── page.tsx                # ( /contact )
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   └── BackToTop.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Accordion.tsx
│   │   ├── Tabs.tsx
│   │   └── Divider.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── AboutIntro.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── MembershipPreview.tsx
│   │   ├── FeaturedClasses.tsx
│   │   ├── TrainersPreview.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── Testimonials.tsx
│   │   ├── BmiCalculator.tsx
│   │   ├── Faq.tsx
│   │   └── CtaBanner.tsx
│   └── cards/
│       ├── ProgramCard.tsx
│       ├── TrainerCard.tsx
│       ├── PricingCard.tsx
│       ├── BlogCard.tsx
│       └── TestimonialCard.tsx
│
├── public/
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── trainers/
│   │   ├── programs/
│   │   ├── gallery/
│   │   ├── facilities/
│   │   ├── testimonials/
│   │   ├── blog/
│   │   └── og/
│   ├── icons/                      # only if the SVG-sprite approach is kept — see Section 6
│   └── favicon.ico
│
├── lib/
│   ├── utils.ts                    # cn() class-merge helper, formatters, BMI calculation
│   └── validators.ts               # form validation schemas (contact form, newsletter)
│
├── hooks/
│   ├── useScrollPosition.ts         # sticky-navbar scroll state
│   ├── useMediaQuery.ts             # breakpoint-aware conditionals
│   ├── useCountUp.ts                # animated stat counters
│   ├── useReducedMotionSafe.ts      # wraps Framer's useReducedMotion with site defaults
│   └── useFormValidation.ts
│
├── types/
│   ├── trainer.ts
│   ├── program.ts
│   ├── membership.ts
│   ├── blog.ts
│   ├── testimonial.ts
│   └── index.ts                    # barrel export
│
├── constants/
│   ├── navigation.ts                # nav link list (single source for Navbar + Footer + MobileNav)
│   ├── site.ts                      # site metadata, brand copy, social links
│   ├── trainers.ts                  # trainer roster data (until a CMS/API exists)
│   ├── programs.ts
│   ├── membership-plans.ts
│   ├── testimonials.ts
│   └── faq.ts
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

**Rationale for each top-level folder:**

| Folder | Purpose |
|---|---|
| `app/` | Routes only — one `page.tsx` per URL, plus layout/loading/error boundaries. No business logic lives here beyond composing components. |
| `components/` | Split by role — `layout` (chrome around every page), `ui` (generic, content-agnostic primitives), `sections` (page-section-sized compositions), `cards` (the card family, since it's large enough to warrant its own folder). |
| `public/` | Static assets served as-is — mirrors the existing `assets/images/` categorization. |
| `lib/` | Framework-agnostic helper functions — no React, no JSX. |
| `hooks/` | Reusable stateful logic extracted out of components. |
| `types/` | Shared TypeScript types/interfaces, imported by both components and constants. |
| `constants/` | Static content data (trainer roster, plans, FAQ) — kept separate from components so content edits never touch component code, and so this data can later be swapped for a CMS/API fetch with no component changes. |

---

## 2. Page Conversion Plan (App Router)

| Old file | New route | File | Key sections composed |
|---|---|---|---|
| `index.html` | `/` | `app/page.tsx` | Hero, StatsCounter, AboutIntro, WhyChooseUs, FeaturedClasses, TrainersPreview, MembershipPreview, Testimonials, GalleryPreview, CtaBanner |
| `about.html` | `/about` | `app/about/page.tsx` | PageHeader, Timeline, ValuesGrid, FounderMessage, AwardsStrip, CtaBanner |
| `membership.html` | `/membership` | `app/membership/page.tsx` | PageHeader, PricingCard ×3, ComparisonTable, WhyMembersStay, Faq, CtaBanner |
| `trainers.html` | `/trainers` | `app/trainers/page.tsx` | PageHeader, Tabs (specialty filter), TrainerCard grid, Modal (bio), CtaBanner |
| `classes.html` | `/classes` | `app/classes/page.tsx` | PageHeader, Tabs (discipline filter), ProgramCard grid, Modal (class detail), ScheduleTable, CtaBanner |
| `gallery.html` | `/gallery` | `app/gallery/page.tsx` | PageHeader, Tabs (category filter), MasonryGrid, Lightbox (Modal variant) |
| `blog.html` + `blog-single.html` | `/blog` + `/blog/[slug]` | `app/blog/page.tsx` + `app/blog/[slug]/page.tsx` | FeaturedPost, BlogCard grid, Sidebar, Pagination / ArticleBody, AuthorBio, RelatedArticles |
| `contact.html` | `/contact` | `app/contact/page.tsx` | PageHeader, Tabs (inquiry type), ContactForm, VisitInfo, Map, Faq |
| *(not yet built)* | `/facilities` | `app/facilities/page.tsx` | Carried over as a known gap from the static build — same plan as Phase 2's Facilities blueprint |

Every page is a **Server Component by default** — data (trainer list, plans, FAQ content) is imported from `constants/` at build/request time with no client-side fetch waterfall. `"use client"` is only added to the specific interactive leaf components (see Section 3), not to entire pages.

Metadata (title, description, Open Graph, canonical) moves from manual `<meta>` tags in each HTML `<head>` to Next.js's typed `Metadata` API, exported per page — same content, now type-checked.

---

## 3. Component Architecture

### Layout components (`components/layout/`)

| Component | Replaces | Notes |
|---|---|---|
| `Navbar` | `.navbar` + `navbar.js` | Server Component shell with a small `"use client"` child for scroll-state; reads links from `constants/navigation.ts` |
| `MobileNav` | `.mobile-nav` + `mobile-menu.js` | Client Component (needs state); receives `isOpen`/`onClose` |
| `Footer` | `.site-footer` | Mostly static Server Component; newsletter form is an isolated Client Component |
| `BackToTop` | `back-to-top.js` | Client Component; `useScrollPosition` hook drives visibility |

### UI primitives (`components/ui/`)

| Component | Replaces | Key props (described, not typed yet) |
|---|---|---|
| `Button` | `.btn` variants | `variant` (primary / outline / ghost), `size` (sm / md / lg), `as` (button or link), `href` |
| `SectionHeading` | `.eyebrow` + `.section-heading` | `eyebrow`, `title`, `align` |
| `Card` | `.card` base | `children`, `className` — the base every card family member composes |
| `Badge` | `.pricing-card__badge` | `label`, `tone` |
| `Modal` | `modal.css` + inline JS | `isOpen`, `onClose`, `children` — Client Component, houses focus trap + `AnimatePresence` |
| `Accordion` | `accordion.js` | `items` (question/answer pairs), multi-open per the earlier approved decision |
| `Tabs` | `tabs.css` + filter logic | `options`, `activeValue`, `onChange` |
| `Divider` | ornamental gold line | `orientation` |

### Section components (`components/sections/`)

One per Home-page/interior-page section (Hero, AboutIntro, WhyChooseUs, StatsCounter, MembershipPreview, FeaturedClasses, TrainersPreview, GalleryPreview, Testimonials, BmiCalculator, Faq, CtaBanner) — each composes UI primitives and cards, and is reused across pages where the same section type appears (e.g., `CtaBanner` is used on 6+ pages with different copy passed as props).

### Card family (`components/cards/`)

`ProgramCard`, `TrainerCard`, `PricingCard`, `BlogCard`, `TestimonialCard` — each wraps the base `Card` primitive and defines its own content layout, matching the BEM variants from the static build (`.class-card`, `.trainer-card`, `.pricing-card`, `.blog-card`, `.testimonial`).

### Server vs. Client boundary

Marked `"use client"` **only** where the component needs interactivity, state, refs, or browser APIs:

- `MobileNav`, `BackToTop`, `Navbar`'s scroll-state child
- `Modal`, `Tabs`, `Accordion` (state-driven)
- `Testimonials` slider, `BmiCalculator` form, `ContactForm`, newsletter form
- Any component using `framer-motion`'s `motion.*`, `whileInView`, or hooks

Everything else (page headers, static grids, cards with no internal state, footer link lists) stays a Server Component — smaller client bundle, faster first paint.

---

## 4. Tailwind CSS Design System

Extends `tailwind.config.ts` `theme.extend` — same tokens as the CSS custom properties already established, now as Tailwind theme values instead of `:root` variables.

**Colors:**

| Token | Hex | Tailwind key |
|---|---|---|
| Primary (gold) | `#C9A227` | `primary.DEFAULT` |
| Primary light | `#E8CD73` | `primary.light` |
| Primary dark | `#9C7A1E` | `primary.dark` |
| Secondary (charcoal) | `#161616` | `secondary.DEFAULT` |
| Secondary light | `#222222` | `secondary.light` |
| Background (black) | `#0A0A0A` | `background.DEFAULT` |
| Background ivory | `#F7F3EA` | `background.ivory` |
| Text (white) | `#FFFFFF` | `text.DEFAULT` |
| Text grey | `#A6A39C` | `text.muted` |
| Text grey-dark | `#5E5B54` | `text.subtle` |
| Border | `#2A2A28` | `border.DEFAULT` |
| Success | `#5C8A5C` | `success.DEFAULT` |
| Error | `#A64B4B` | `error.DEFAULT` |

**Font system:** `next/font/google` for both families (self-hosted automatically by Next.js, zero manual `@font-face` or CDN request) —
- `Playfair Display` → `font-display`, weights 500 (italic), 600, 700
- `Inter` → `font-body`, weights 400, 500, 600, 700
- Exposed as CSS variables (`--font-display`, `--font-body`) via `next/font`'s `variable` option, then mapped into `theme.extend.fontFamily`.

**Spacing system:** the existing `xs/sm/md/lg/xl/2xl` scale becomes named Tailwind spacing keys (`p-section-xl`, `gap-card-md`, etc.) rather than relying on default numeric spacing alone — keeps section rhythm consistent and matches the original design intent more explicitly than bare Tailwind numbers would.

**Border radius system:** `sm` (6px), `md` (14px), `lg` (24px), `pill` (9999px) — mapped into `theme.extend.borderRadius`, replacing `--radius-*` custom properties.

**Shadows:** `shadow-md`, `shadow-gold` (the gold-tinted elevation used on pricing/testimonial cards) added to `theme.extend.boxShadow`.

**Breakpoints:** Tailwind's default `sm/md/lg/xl/2xl` map directly onto the existing 480/768/1024/1280/1536 scale already used across the static site — no custom breakpoint config needed.

---

## 5. Framer Motion Animation Strategy

| Static-site behavior | Framer Motion equivalent |
|---|---|
| Preloader (`preloader.js`) | Mount animation in `app/template.tsx` or a client-only `<Preloader>` gating first paint, `sessionStorage`-gated exactly as before |
| Page transitions (none previously — multi-page site) | `AnimatePresence` + `app/template.tsx` fade/slide on route change, now that navigation is client-side |
| Scroll reveal (`scroll-reveal.js`, IntersectionObserver) | `whileInView` + `viewport={{ once: true, amount: 0.15 }}` on each section wrapper |
| Staggered card grids | Parent `motion.div` with `variants` + `staggerChildren`; each card is a `motion.div` child with a `fadeUp` variant |
| Button/card hover (`:hover` CSS) | Kept as Tailwind `hover:` classes for simple cases; `whileHover`/`whileTap` used where a spring-based, more tactile response adds value (pricing card selection, CTA buttons) |
| Hero Ken Burns zoom (CSS `@keyframes`) | `motion.img` with `animate={{ scale: [1, 1.08] }}`, `transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }}` |
| Stat counter (`count-up.js`) | `useCountUp` hook built on Framer's `useMotionValue` + `animate()`, triggered by `useInView` |
| Testimonial slider (`testimonial-slider.js`) | `AnimatePresence mode="wait"` crossfading the active testimonial; autoplay via `useEffect` interval, paused on hover/focus exactly as before |
| FAQ accordion height animation (`accordion.js` + WAAPI) | `motion.div` with `initial={{ height: 0 }}` / `animate={{ height: 'auto' }}` inside `AnimatePresence` |
| Mobile drawer slide-in (WAAPI) | `motion.nav` with `initial`/`animate`/`exit` variants inside `AnimatePresence` |

**Global rule:** every animated component reads `useReducedMotion()` (wrapped by the project's `useReducedMotionSafe` hook) and swaps to instant/no-op variants when the user has reduced motion enabled — carrying forward the accessibility commitment from the static build's `prefers-reduced-motion` handling.

---

## 6. Image & Asset Management Strategy

- **Storage:** `public/images/<category>/` mirrors the existing `assets/images/` structure exactly (logo, hero, trainers, programs, gallery, facilities, testimonials, blog, og) — no reorganization needed when real photography is sourced.
- **`next/image` usage:** every `<img>` becomes `<Image>` —
  - Hero background: `fill` + `sizes="100vw"` + `priority` (it's the LCP element).
  - Cards/grids: fixed `width`/`height` (or `fill` inside an aspect-ratio container) + `loading="lazy"` (Next's default for non-priority images).
  - `placeholder="blur"` with a generated `blurDataURL` for a smoother perceived load, replacing the plain lazy-load-with-no-placeholder approach from the static build.
- **Optimization approach:** Next.js's built-in image optimizer serves AVIF/WebP automatically per-browser with no manual `<picture>`/`<source>` markup (a simplification over the static site's hand-written WebP+JPEG fallback) and generates responsive `srcset`s from the `sizes` prop automatically.
- **Icons:** recommend replacing the hand-rolled `assets/icons/sprite.svg` with the `lucide-react` package (matches the icon library already chosen in Phase 2) — each icon becomes a tree-shakeable React component instead of a manually maintained sprite, with zero extra HTTP requests. Flagged as a decision below since it's a dependency choice, not a forced default.
- **OG images:** `public/images/og/*`, wired through each page's `generateMetadata()` → `openGraph.images`.

---

## 7. Development Workflow

```
Project Setup
  → create-next-app (TypeScript + Tailwind + App Router + ESLint)
  → install framer-motion, configure next/font, set up tsconfig path aliases (@/components, @/lib, @/hooks, @/types, @/constants)
  → scaffold the folder structure from Section 1
  → define tailwind.config.ts theme tokens from Section 4
↓
Component Creation
  → build ui/ primitives first (Button, Card, SectionHeading, Badge) in isolation
  → build cards/ (compose ui/ primitives)
  → build sections/ (compose cards/ + ui/)
  → build layout/ (Navbar, Footer, MobileNav, BackToTop)
↓
Page Development
  → assemble each app/**/page.tsx from sections/, per the Section 2 mapping
  → wire per-page Metadata
  → populate constants/ with the real content from the static site
↓
Styling
  → apply Tailwind utility classes against the Section 4 design tokens
  → responsive classes at sm/md/lg/xl/2xl matching the existing breakpoint scale
  → visual QA against the Phase 2 wireframes for parity
↓
Animations
  → layer in Framer Motion per the Section 5 strategy, component by component
  → verify prefers-reduced-motion behavior on every animated component
↓
Optimization
  → next/image audit (priority flags, sizes, blur placeholders)
  → font-loading audit (next/font, no layout shift)
  → dynamic imports for heavy client components (Modal, Lightbox)
  → Lighthouse pass, bundle analysis (@next/bundle-analyzer)
↓
Deployment
  → Vercel (native Next.js hosting) or chosen alternative
  → environment variables, preview deployments per branch/PR
  → custom domain + SSL, sitemap.xml / robots.txt via Next's Metadata routes
```

---

## 8. Professional Coding Standards

**Naming conventions**
- Components: `PascalCase.tsx` (`TrainerCard.tsx`)
- Hooks: `camelCase.ts`, always prefixed `use` (`useCountUp.ts`)
- Utilities/constants: `kebab-case.ts` (`membership-plans.ts`) or `camelCase.ts` for pure functions (`utils.ts`)
- Route segments: lowercase, hyphenated if multi-word (App Router convention)
- Constants/enums: `SCREAMING_SNAKE_CASE` for true constants; `PascalCase` for TypeScript `enum`/union type names

**File organization rules**
- One component per file; a component's tightly-coupled sub-parts may live in the same file only if trivial (e.g., a small internal `TabButton` used solely by `Tabs`)
- Barrel `index.ts` per component folder for cleaner imports (`import { Button } from '@/components/ui'`)
- Absolute imports via the `@/` alias everywhere — no `../../../` chains
- Co-locate a component's types in the same file unless shared across multiple components, in which case they move to `types/`

**Component rules**
- Functional components only, no class components
- Server Components by default; `"use client"` added only when the component genuinely needs it (state, effects, browser APIs, event handlers, Framer Motion)
- Named exports for all reusable components; default exports reserved for `page.tsx` / `layout.tsx` (a Next.js requirement)
- Props typed via an explicit `interface ComponentNameProps`, never inline anonymous object types for anything reused more than once
- Keep components single-responsibility — if a component's JSX exceeds roughly 100–150 lines, extract a subcomponent

**TypeScript practices**
- `strict` mode on in `tsconfig.json`; no implicit `any`
- Explicit return types on exported functions and hooks
- `interface` for extendable/object-shaped props; `type` for unions, intersections, and utility-type compositions
- Discriminated unions for variant-style props (e.g., `Button`'s `variant: 'primary' | 'outline' | 'ghost'`)
- Runtime validation (contact form, newsletter) via a schema library (e.g., `zod`) so form data is validated at the boundary and inferred types stay in sync with validation rules — no duplicate manual type + validator maintenance

---

## Open Decisions — Resolved

1. **Repo structure:** the Next.js app will live in a new `web/` subfolder alongside the existing static site, which stays at the repo root untouched for reference.
2. **Icon strategy:** `lucide-react` — replaces the hand-maintained SVG sprite with tree-shakeable React icon components.
3. **Deployment target:** Vercel.

The folder tree in Section 1 is rooted at `web/` accordingly (i.e. `web/app/`, `web/components/`, `web/public/`, etc.), sitting next to `index.html`, `about.html`, `assets/`, and `docs/` at the repo root.

Next phase is scaffolding the actual `create-next-app` project per Section 1 — still no page/component code until that's explicitly requested.
