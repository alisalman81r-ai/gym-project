# Phase 1 — Planning & Architecture
## IRON ELITE FITNESS CLUB — "Train Beyond Limits."

Architectural blueprint for the luxury rebuild, agreed before any HTML/CSS was written.

---

## 1. Project Folder Structure

```
iron-elite-fitness-club/
│
├── index.html
├── about.html
├── programs.html
├── trainers.html
├── membership.html
├── facilities.html
├── gallery.html
├── blog.html
├── blog-single.html
├── contact.html
├── 404.html
│
├── assets/
│   ├── css/
│   │   ├── base/
│   │   │   ├── reset.css              # normalize/reset browser defaults
│   │   │   ├── variables.css          # colors, spacing, typography tokens
│   │   │   ├── typography.css         # heading/body/utility text styles
│   │   │   └── utilities.css          # spacing, flex/grid, visibility helpers
│   │   ├── components/
│   │   │   ├── navbar.css
│   │   │   ├── mobile-menu.css
│   │   │   ├── footer.css
│   │   │   ├── buttons.css
│   │   │   ├── hero.css
│   │   │   ├── section-heading.css
│   │   │   ├── cards.css              # program/trainer/blog/facility cards
│   │   │   ├── testimonials.css
│   │   │   ├── pricing-table.css
│   │   │   ├── forms.css
│   │   │   ├── modal.css
│   │   │   ├── accordion.css
│   │   │   ├── tabs.css
│   │   │   ├── cta-banner.css
│   │   │   ├── stats-counter.css
│   │   │   └── back-to-top.css
│   │   ├── pages/
│   │   │   ├── home.css
│   │   │   ├── about.css
│   │   │   ├── programs.css
│   │   │   ├── trainers.css
│   │   │   ├── membership.css
│   │   │   ├── facilities.css
│   │   │   ├── gallery.css
│   │   │   ├── blog.css
│   │   │   └── contact.css
│   │   ├── animations.css
│   │   └── main.css                   # manifest / load-order reference, not a bundle entry
│   │
│   ├── js/
│   │   ├── modules/
│   │   │   ├── navbar.js
│   │   │   ├── mobile-menu.js
│   │   │   ├── scroll-reveal.js
│   │   │   ├── count-up.js
│   │   │   ├── slider.js
│   │   │   ├── lightbox.js
│   │   │   ├── modal.js
│   │   │   ├── tabs.js
│   │   │   ├── accordion.js
│   │   │   ├── form-validation.js
│   │   │   ├── back-to-top.js
│   │   │   ├── preloader.js
│   │   │   └── lazy-load.js
│   │   ├── utils/
│   │   │   ├── dom-utils.js
│   │   │   └── helpers.js
│   │   └── main.js                    # entry point, feature-detects & initializes per page
│   │
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── trainers/
│   │   ├── facilities/
│   │   ├── programs/
│   │   ├── gallery/
│   │   ├── testimonials/
│   │   ├── blog/
│   │   ├── backgrounds/
│   │   └── og/
│   │
│   ├── fonts/
│   │   ├── playfair-display/
│   │   └── inter/
│   │
│   └── icons/
│       ├── sprite.svg                 # single inline SVG icon sprite
│       └── favicon/
│
├── archive/
│   └── ironpulse-mvp/                 # retired MVP, kept for reference only
│
├── docs/
│   └── phase-1-planning.md
│
├── README.md
├── package.json
└── .gitignore
```

**Key decision:** CSS partials are loaded as plain linked `<link>` tags in a deliberate order — not `@import`, which serializes downloads and hurts performance. `main.css` is a documented load-order manifest, not a bundler entry point.

---

## 2. Website Pages

| Page | Purpose |
|---|---|
| Home | Flagship brand experience, full narrative funnel |
| About | Brand story, philosophy, founder, awards |
| Programs | Training disciplines (Strength, Boxing, Yoga, HIIT, Recovery) |
| Trainers | Coaching roster with specialties & credentials |
| Membership | Tiered pricing, benefits, comparison, tour booking |
| Facilities | Amenities showcase (studio, spa, pool, lounge, locker rooms) |
| Gallery | Visual proof — facility, events, members, classes |
| Blog | Editorial content — training, wellness, lifestyle |
| Blog Single | Individual article template |
| Contact | Location, hours, contact form, map, tour request |
| 404 | On-brand error page |

*Deferred to a later phase:* Careers, standalone Class Schedule page (may live inside Programs), Press/Media page.

---

## 3. Features Per Page

- **Home** — full-bleed video/image hero with animated headline, brand statement strip, stats counter, featured programs preview, trainer spotlight strip, membership tier preview, testimonial carousel, gallery teaser, full-width CTA banner.
- **About** — origin story timeline, mission/values grid, founder message, certifications/awards strip, facility teaser video, tour CTA.
- **Programs** — category tabs (Strength/Boxing/Yoga/HIIT/Recovery), program cards → detail modals, weekly timetable, filter by goal.
- **Trainers** — filterable grid by specialty, bio modal per trainer (certifications, philosophy, social link), "Book a Session" CTA.
- **Membership** — 3-tier pricing cards, feature comparison table, FAQ accordion, application/tour-request form.
- **Facilities** — alternating image/text feature blocks per amenity, icon strip, lightbox gallery.
- **Gallery** — filterable masonry grid (Facility/Events/Classes/Members), keyboard-navigable lightbox.
- **Blog** — featured article hero, category-tagged card grid, sidebar (recent posts, categories, newsletter), pagination.
- **Blog Single** — article body with drop-cap styling, author bio, related articles, social share row.
- **Contact** — validated contact form, lazy-loaded map embed, hours/location card, tour-request variant, FAQ shortlist.
- **404** — on-brand message/illustration, CTA back to Home/Membership.

---

## 4. Reusable Components

Navbar (transparent→solid on scroll) · Mobile drawer menu · Footer · Button variants (primary gold-fill, outline-gold, ghost-text) · Hero template (configurable per page) · Section heading (eyebrow + title + gold divider) · Card system (one base `.card` + modifiers for program/trainer/blog/facility) · Stats counter block · Testimonial carousel · Pricing table · CTA banner · Modal/lightbox · Accordion · Tabs · Form field set (floating labels) · Breadcrumb · Back-to-top button · Preloader · Newsletter signup block · Social icon row · Badge/label · Ornamental gold divider.

---

## 5. Color Palette

| Token | Hex | Use |
|---|---|---|
| `--color-black` | `#0A0A0A` | Primary background |
| `--color-charcoal` | `#161616` | Elevated surfaces, cards |
| `--color-charcoal-light` | `#222222` | Borders, hover surfaces |
| `--color-gold` | `#C9A227` | Primary accent — CTAs, icons, dividers |
| `--color-gold-light` | `#E8CD73` | Hover states, highlights |
| `--color-gold-dark` | `#9C7A1E` | Pressed states, shadows on gold |
| `--color-white` | `#FFFFFF` | Headings on dark |
| `--color-ivory` | `#F7F3EA` | Light-section backgrounds |
| `--color-grey` | `#A6A39C` | Secondary/body text on dark |
| `--color-grey-dark` | `#5E5B54` | Body text on light sections |
| `--color-border` | `#2A2A28` | Hairline dividers |
| `--color-success` | `#5C8A5C` | Muted — form success state |
| `--color-error` | `#A64B4B` | Muted — form error state |

Guide: roughly 70% black/charcoal, 20% white/ivory, 10% gold as accent only. Gold is never a large background fill — it reads cheap at scale. Reserve it for lines, icons, small CTA fills, and hover states.

---

## 6. Typography

- **Display/Headings:** Playfair Display (serif, high-contrast strokes). 700 for hero, 600 for section titles.
- **Body/UI:** Inter — 400/500/600 for paragraphs, nav, buttons, forms.
- **Eyebrow/labels:** Inter, uppercase, `letter-spacing: 0.15em`, 12–13px, gold.

Fluid type scale via `clamp()`, ~1.25 (major third) ratio, e.g. `--fs-h1: clamp(2.5rem, 5vw, 4.5rem)`.

Both fonts self-hosted in `assets/fonts/` (woff2) rather than pulled from a Google Fonts CDN — avoids a third-party render-blocking request.

---

## 7. Icon Library

**Lucide Icons** (MIT license, consistent 1.5–2px stroke, minimal geometric style). ~25–30 hand-picked icons combined into one inline SVG sprite (`assets/icons/sprite.svg`), referenced via `<use href="#icon-name">` — one HTTP request, fully recolorable via `currentColor`. Custom brand icons (dumbbell, flame, heartbeat-pulse) drawn to match the same stroke weight and added to the sprite.

---

## 8. Image Categories Needed

Logo (full mark, icon-only, white/black variants, favicon set) · Hero imagery/video per page · Trainer portraits (consistent studio lighting) · Facility interiors (weight floor, studio, pool, spa, locker rooms, recovery lounge) · Class action shots · Member lifestyle shots · Gallery/event photography · Blog cover images · Background textures (subtle, low-opacity) · OG/social share images (1200×630).

All raster images delivered as WebP with JPEG fallback, `loading="lazy"` below the fold.

---

## 9. JavaScript Modules

Vanilla ES modules (`type="module"`), each exporting an `init()` that checks for its own DOM target so it's safe to import on any page:

`navbar.js` · `mobile-menu.js` · `scroll-reveal.js` (IntersectionObserver) · `count-up.js` · `slider.js` · `lightbox.js` · `modal.js` · `tabs.js` · `accordion.js` · `form-validation.js` · `back-to-top.js` · `preloader.js` · `lazy-load.js` · `dom-utils.js` / `helpers.js` (shared utilities) · `main.js` (per-page conditional bootstrapper).

---

## 10. Responsive Design Strategy

Mobile-first authoring. Breakpoints:

| Name | Width |
|---|---|
| Base | 0–479px |
| sm | 480px |
| md | 768px (tablet) |
| lg | 1024px (small laptop) |
| xl | 1280px (desktop) |
| 2xl | 1536px (large/ultra-wide) |

Fluid typography/spacing via `clamp()`. CSS Grid/Flexbox layouts, no fixed-pixel containers. Minimum 44×44px tap targets on mobile. Container max-width ~1320px with responsive gutters. Test matrix: iPhone SE/14, iPad, iPad Pro, 1366 & 1920 laptop/desktop, 2560 ultra-wide.

---

## 11. Animation Plan

Luxury = restrained, slow, deliberate — never bouncy.

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` throughout.
- Durations: 300–500ms micro-interactions, 800–1400ms scroll-reveals/hero.
- Scroll-triggered fade-up/slide-in per section (staggered in grids) via IntersectionObserver.
- Hero: slow Ken-Burns background zoom, word/line-staggered headline fade-in.
- Navbar: smooth transparent→solid+blur transition on scroll.
- Buttons: gold underline/fill sweep on hover, subtle 1.02 scale.
- Cards: soft lift + shadow + contained image zoom on hover.
- Stat counters: count up on viewport entry.
- Preloader: brief logo animation on first load only (sessionStorage-gated).
- All animation gated behind `prefers-reduced-motion: no-preference` — reduced-motion users get instant states, no exceptions.

---

## 12. Naming Conventions

- Files/folders: `kebab-case`
- CSS classes: BEM — `.card__title`, `.btn--outline`, `.navbar__link--active`
- CSS custom properties: `--color-gold`, `--space-4`, `--font-display`
- JS: `camelCase` variables/functions, `PascalCase` classes, `UPPER_SNAKE_CASE` constants
- JS DOM hooks: prefixed `js-`, kept separate from styling classes
- Images: `category-descriptor-number.ext` (e.g. `trainer-marcus-reed.webp`, `facility-pool-01.webp`)

---

## 13. Development Roadmap

1. Phase 1 — Planning & Architecture *(this document)* ✅
2. Phase 2 — Design System Foundation: variables, reset, typography, spacing scale, base buttons, icon sprite
3. Phase 3 — Core Layout Components: navbar, mobile menu, footer, hero template, section-heading
4. Phase 4 — Home Page: full build, all sections, animations wired
5. Phase 5 — Interior Pages Batch 1: About, Programs, Trainers
6. Phase 6 — Interior Pages Batch 2: Membership, Facilities, Gallery, Blog + Blog Single, Contact, 404
7. Phase 7 — JavaScript Interactivity Pass: wire all modules site-wide, form validation/submission
8. Phase 8 — Responsive QA: full breakpoint sweep
9. Phase 9 — Accessibility Pass: semantic/ARIA audit, keyboard nav, WCAG AA contrast, reduced-motion
10. Phase 10 — Performance Optimization: image compression/WebP, lazy-loading, minification, Lighthouse ≥90
11. Phase 11 — Cross-Browser Testing: Chrome, Safari, Firefox, Edge, iOS Safari
12. Phase 12 — SEO Setup: meta/OG tags, sitemap.xml, robots.txt, LocalBusiness structured data
13. Phase 13 — Final QA & Content Polish
14. Phase 14 — Deployment: GitHub → Netlify/Vercel/Pages, domain + SSL
15. Phase 15 — Post-Launch: privacy-friendly analytics, monitoring, iteration backlog
