# Phase 2 — UI/UX Blueprint
## IRON ELITE FITNESS CLUB — "Train Beyond Limits."

Text-wireframe blueprint for every page, plus the global component system they share. No HTML/CSS/JS yet — this is the visual and interaction contract Phase 3 will build against.

---

# PART A — GLOBAL SYSTEMS

## A.1 Navigation Bar

**Structure (desktop, ≥1024px):**

```
┌──────────────────────────────────────────────────────────────────────┐
│  IRON ELITE     About  Programs  Trainers  Membership  Facilities    │
│  (logo mark)    Journal                          Contact  [Book a Tour]│
└──────────────────────────────────────────────────────────────────────┘
```

- **Left:** logo mark (icon + wordmark), always links to Home.
- **Center:** About · Programs · Trainers · Membership · Facilities · Journal (Blog) — uppercase, 13px, `letter-spacing: 0.1em`, Inter Medium.
- **Right:** Contact (text link) + **Book a Tour** primary gold button.
- **Gallery** is not a top-level nav item — it's reachable from Facilities and the footer, keeping the primary nav to 6 links + CTA (luxury nav bars stay lean; 8+ links reads discount-retail, not private-club).
- **Behavior:** transparent/blur-free over the hero, transitions to solid `--color-black` + backdrop blur + hairline gold-tinted bottom border once scrolled past ~80px. Active page link gets a thin gold underline. Height shrinks slightly (e.g. 88px → 72px) on scroll for a tighter, more premium feel.
- **Mobile (<1024px):** logo + hamburger icon only. Tapping opens a full-screen dark drawer: links stacked vertically in large Playfair type, gold hairline dividers between them, social icons + "Book a Tour" button pinned at the bottom. Drawer slides in from the right with a fade+slide, body scroll locked while open, closes on link tap, outside tap, or Esc.

## A.2 Footer

```
┌──────────────────────────────────────────────────────────────────────┐
│  IRON ELITE FITNESS CLUB                                              │
│  Train Beyond Limits.              [social icons: IG · FB · TikTok]  │
│                                                                        │
│  EXPLORE            MEMBERSHIP           JOURNAL         VISIT US    │
│  About               Plans & Pricing     Latest Articles  Address    │
│  Programs            Book a Tour         Categories        Phone     │
│  Trainers            FAQ                                   Email     │
│  Facilities                                                 Hours    │
│  Gallery                                          [Newsletter input] │
│                                                          [ Subscribe ]│
│ ──────────────────────────────────────────────────────────────────── │
│  © 2026 Iron Elite Fitness Club     Privacy · Terms      ↑ Back to Top│
└──────────────────────────────────────────────────────────────────────┘
```

- 4-column layout on desktop (brand / explore / membership+journal / visit-us+newsletter) → 2-column on tablet → single stacked column on mobile, accordion-collapsed link groups on mobile to keep footer short.
- Bottom bar is a hairline-separated strip: copyright left, legal links center, back-to-top right.
- No heavy animation here — footer should feel calm, signaling "end of page."

## A.3 Buttons

| Style | Use | Look |
|---|---|---|
| **Primary** | Main conversions (Join Now, Book a Tour) | Gold fill, black text, pill or slight-radius rectangle |
| **Outline** | Secondary CTAs (Explore Programs) | Transparent bg, gold 1.5px border, white text → fills gold + text turns black on hover |
| **Ghost/Text** | Low-emphasis links (Learn More, View All) | No border/fill, gold text, underline sweeps in from left on hover |
| **Icon button** | Carousel arrows, back-to-top, social | Circular, hairline border, gold icon, fills gold on hover |

Sizes: Large (hero), Medium (section CTAs), Small (in-card). States: default → hover (scale 1.02, soft shadow lift, 250ms) → active (scale 0.98) → focus-visible (2px gold outline, offset 2px, for keyboard users) → disabled (40% opacity, no hover).

## A.4 Card System

One base `.card` (charcoal surface, hairline border, generous padding, subtle shadow), with modifiers:

- **Program Card** — image top (4:3, zooms 1.05 on hover), gold icon badge overlapping image bottom-left, title, 2-line description, "Learn More" ghost link.
- **Trainer Card** — portrait (4:5), name (serif), specialty (gold uppercase small), 2-line bio, social row, "View Profile" outline button.
- **Blog Card** — image top (16:9), category tag (small gold pill), title, excerpt, date + read-time meta row.
- **Facility Card** — used inline within alternating feature blocks rather than a grid (see Facilities page).
- **Pricing Card** — distinct treatment, see A.7.
- **Testimonial Card** — used in the carousel, see A.8.

All cards: lift + shadow-deepen on hover, image scale contained via `overflow:hidden`, 250–350ms ease-out-expo.

## A.5 Forms

- Floating-label inputs: label sits inside the field at rest, animates up-and-shrinks on focus/filled.
- Dark input background (`--color-charcoal`), 1px border, border turns gold on focus (no harsh outline glow).
- Height ≥48px for touch comfort. Full-width stacked on mobile; 2-column grid for paired fields (Name/Email, Phone/Preferred Time) on tablet+.
- Inline validation message directly under the field, muted red/green, appears on blur not on every keystroke (avoid nagging the user mid-type).
- Submit button: full-width primary gold on mobile, auto-width right-aligned on desktop, shows an inline spinner state on submit.

## A.6 Gallery Layout

- Filter pill row above the grid: All · Facility · Classes · Events · Members — active pill filled gold, others outline.
- CSS Grid masonry effect via varied `grid-row-span` per image for visual rhythm (not a uniform boring grid).
- Click opens a full-screen lightbox: image centered, prev/next arrows, close (X) top-right, caption bottom, keyboard arrow-key + Esc support, swipe on touch.
- Filtering animates out (fade+scale down) removed items and reflows the rest, not an instant cut.

## A.7 Membership Pricing Section

```
        ┌───────────────┐   ┌───────────────────┐   ┌───────────────┐
        │   SIGNATURE   │   │   ★ MOST POPULAR  │   │  PRIVATE CLUB │
        │               │   │       ELITE        │   │               │
        │    $149/mo    │   │      $249/mo        │   │    $499/mo    │
        │  ─────────    │   │   ─────────────     │   │  ─────────    │
        │  ✓ Feature    │   │   ✓ Feature (more)   │   │  ✓ Feature    │
        │  ✓ Feature    │   │   ✓ Feature          │   │  ✓ Feature    │
        │  ✓ Feature    │   │   ✓ Feature          │   │  ✓ Feature    │
        │               │   │   ✓ Feature          │   │  ✓ Feature    │
        │ [Choose Plan] │   │  [ Choose Elite ]     │   │ [Choose Plan] │
        └───────────────┘   └───────────────────┘   └───────────────┘
```

- 3-column grid on desktop, stacks vertically on mobile with the Elite (recommended) card shown first.
- Center card is visually elevated: scaled ~1.05, gold border instead of hairline grey, small gold "Most Popular" ribbon/badge overlapping the top edge.
- Price in large Playfair numerals, "/mo" in small Inter beside it.
- Feature list uses gold check icons; greyed-out items with a muted dash icon show what's *not* included in lower tiers (transparency builds trust at this price point).
- Below the cards: an expandable full comparison table ("Compare All Features ↓") for users who want the exhaustive breakdown without cluttering the default view.

## A.8 Trainer Profile Card

```
┌───────────────────┐
│                    │
│   [ portrait 4:5 ] │
│                    │
├───────────────────┤
│ Marcus Reed        │  ← Playfair, 20px
│ HEAD STRENGTH COACH│  ← gold, uppercase, 11px tracked
│                    │
│ 10+ years coaching  │
│ powerlifters toward │
│ measurable results.  │
│                    │
│ [IG] [LinkedIn]     │
│ [ View Profile → ]  │
└───────────────────┘
```

Clicking "View Profile" opens a modal (not a new page): larger portrait, full bio, certifications list, training philosophy pull-quote, Instagram link, "Book a Session with Marcus" CTA.

## A.9 Testimonial Section

```
┌──────────────────────────────────────────────────────────────────┐
│                              "                                     │
│      The coaching here changed how I think about training          │
│           entirely. Six months in, I'm stronger at 40               │
│                  than I was at 25.                                   │
│                                                                       │
│         [photo]   Sarah Whitfield · Elite Member since 2023          │
│                                                                       │
│                    ●  ○  ○  ○  ○                                     │
└──────────────────────────────────────────────────────────────────┘
```

Full-width dark band, single large centered quote (Playfair italic), oversized gold quotation-mark glyph behind/above the text at low opacity, member photo + name + tenure below, dot navigation (or subtle arrows on hover), autoplay ~6s with pause-on-hover/focus, swipe on mobile.

## A.10 FAQ Layout

```
┌──────────────────────────────────────────────┐
│  How do I book a personal training session? +│
├──────────────────────────────────────────────┤
│  What's included in the Elite membership?   + │
├──────────────────────────────────────────────┤
│  Can I freeze or cancel my membership?       + │
└──────────────────────────────────────────────┘
```

Single-open accordion (opening one closes the previous — keeps the page tidy), gold `+`/`×` icon rotates 45° on open, answer slides+fades open (height auto-animation), hairline divider between rows, centered max-width ~760px on desktop. If a page has >8 FAQs, split into two visual columns rather than one long list.

## A.11 Contact Page Layout

```
┌───────────────────────────┬────────────────────────────┐
│  Get In Touch               │  Visit The Club             │
│                              │  128 Riverside Ave           │
│  [ Name           ]         │  Phone · Email                │
│  [ Email          ]         │  Hours (table)                 │
│  [ Phone          ]         │                                  │
│  [ Interested In ▾]         │  [ embedded map ]                │
│  [ Message            ]     │                                  │
│  [ Message cont.      ]     │                                  │
│                              │                                  │
│  [       Send Message      ]│                                  │
└───────────────────────────┴────────────────────────────┘
```

Two-column on desktop (form left, info + map right), stacks form-then-info on mobile. A small tab/toggle above the form lets users switch between "General Inquiry" and "Book a Tour" (swaps the field set and submit label, same visual container).

## A.12 Scroll Animation Timeline

A single reference for how motion unfolds down any page:

1. **Page load:** brief logo preloader (first visit only, `sessionStorage`-gated) fades out → hero content stagger-fades in (headline by word, then sub-copy, then CTAs), 600–900ms total.
2. **0–80px scroll:** navbar transitions transparent → solid + blur, height compresses slightly.
3. **Each new section entering viewport (~20% visible, IntersectionObserver):** fades up 24px over 700–900ms, ease-out-expo.
4. **Grids/card rows:** children stagger in left→right or top→bottom, 80–120ms delay increments — never all at once.
5. **Stat counters:** count from 0 to target value once the stats strip crosses ~30% visibility, 1200–1600ms duration, ease-out.
6. **CTA banners:** gold divider line "draws in" (width 0→100%) alongside a scale-in of the text block.
7. **Hero background (desktop only):** subtle parallax, translateY at ~0.3× scroll speed.
8. **Footer:** simple fade-in only — deliberately the calmest moment on the page.
9. **`prefers-reduced-motion: reduce`:** every rule above collapses to an instant opacity/position change — no exceptions.

---

# PART B — PAGE-BY-PAGE BLUEPRINTS

## B.1 Home

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar — transparent over hero]                            │
├────────────────────────────────────────────────────────────┤
│                                                                │
│              (full-bleed hero video/image, dark overlay)       │
│                                                                │
│                 IRON ELITE FITNESS CLUB                        │
│                  Train Beyond Limits.                           │
│                                                                │
│        [ Book a Tour ]      [ Explore Programs ]                │
│                          ↓                                       │
├────────────────────────────────────────────────────────────┤
│      12+            3,200+           40+            18           │
│  Years Legacy    Elite Members   Weekly Classes    Coaches         │
├────────────────────────────────────────────────────────────┤
│  THE IRON ELITE STANDARD                                          │
│  Beyond a Gym. A Discipline.                                       │
│                                                                     │
│  [ image ]        Body copy on philosophy / craftsmanship...        │
│                    [ Discover Our Story → ]                          │
├────────────────────────────────────────────────────────────┤
│  TRAINING DISCIPLINES                                               │
│  Programs Built For Elite Results                                    │
│  [Card][Card][Card][Card]                                             │
│                [ View All Programs ]                                   │
├────────────────────────────────────────────────────────────┤
│  OUR COACHES                                                          │
│  Trained By The Best                                                   │
│  [Trainer][Trainer][Trainer][Trainer]                                   │
│                [ Meet The Team ]                                         │
├────────────────────────────────────────────────────────────┤
│  MEMBERSHIP                                                             │
│  Choose Your Level of Elite                                             │
│  [Signature] [Elite ★] [Private Club]                                    │
│                [ View Full Membership Details ]                           │
├────────────────────────────────────────────────────────────┤
│  (full-width testimonial carousel — see A.9)                             │
├────────────────────────────────────────────────────────────┤
│  INSIDE THE CLUB                                                         │
│  [img][img][img][img][img][img]                                          │
│                [ View Full Gallery ]                                       │
├────────────────────────────────────────────────────────────┤
│  (gold-bordered CTA band) Your Transformation Starts Here.                │
│                [ Book Your Tour Today ]                                     │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                    │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Hero | First impression, brand statement, primary conversion | Full-width, full-viewport | Ken Burns bg zoom + staggered text fade-in |
| 2 | Stats strip | Instant credibility/social proof | 4-col grid | Count-up on scroll |
| 3 | Brand statement | Communicate philosophy, differentiate from commodity gyms | 2-column (image / text) | Fade-up, image parallax |
| 4 | Programs preview | Funnel to Programs page | 4-col card grid | Staggered card fade-up |
| 5 | Trainers preview | Build trust in coaching quality | Horizontal card strip | Staggered fade-up |
| 6 | Membership preview | Pre-sell pricing before dedicated page | 3-col pricing cards | Center card scale-in slightly delayed |
| 7 | Testimonials | Social proof via peer voice | Full-width carousel | Crossfade between quotes |
| 8 | Gallery teaser | Visual proof of the space | 6-image grid | Staggered fade-up |
| 9 | CTA banner | Final conversion push before footer | Full-width band | Gold divider draw-in |
| 10 | Footer | Navigation safety net, secondary conversion (newsletter) | 4-col | Fade-in only |

**Content hierarchy:** H1 (hero tagline) → eyebrow labels (gold, uppercase) precede every H2 → H2 section titles (Playfair) → body copy (Inter) → CTA buttons → supporting icons/images.
**CTA placement:** two in the hero (primary + secondary), one per preview section ("View All…"), one dedicated full-width CTA band near the footer — never more than one primary-style button visible in the same viewport.
**Mobile:** stat strip becomes 2×2 grid; program/trainer strips become horizontal swipe-carousels instead of wrapping grids; gallery teaser drops to a 2-column grid.
**UX:** keep the hero CTA pair visible without requiring scroll on common laptop viewports (test at 1366×768); every "preview" section must link out to its full page — home should never dead-end.
**Spacing:** generous section padding (`clamp(80px, 10vw, 140px)` vertical) — the biggest tell of "cheap gym site" is cramped sections; luxury reads through whitespace.
**Premium touch:** hero video (silent, looping, 8–12s) of ambient gym motion rather than a static photo; subtle grain/vignette overlay on all hero imagery for a cinematic, non-stock-photo feel.

---

## B.2 About

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar — solid, page context]                               │
├────────────────────────────────────────────────────────────┤
│         (mini-hero, shorter than Home)                         │
│         OUR STORY                                                │
│         Built On Discipline, Not Trends.                          │
├────────────────────────────────────────────────────────────┤
│  OUR ORIGIN                                                        │
│  2014 ──● Founded in a single warehouse space                       │
│  2017 ──● First Elite Coaching program launched                      │
│  2021 ──● Iron Elite Signature facility opens                          │
│  2026 ──● 3,200+ members, 18 coaches                                    │
├────────────────────────────────────────────────────────────┤
│  OUR VALUES                                                             │
│  [Icon: Discipline] [Icon: Excellence] [Icon: Community] [Icon: Legacy]  │
├────────────────────────────────────────────────────────────┤
│  A MESSAGE FROM OUR FOUNDER                                              │
│  [ portrait ]     "Quote about vision and standards..."                    │
│                    — James Calloway, Founder                                │
├────────────────────────────────────────────────────────────┤
│  RECOGNIZED EXCELLENCE                                                       │
│  [award logo] [award logo] [award logo] [award logo]                          │
├────────────────────────────────────────────────────────────┤
│  (video teaser, full-width) See The Club For Yourself                          │
│                [ Book a Tour ]                                                    │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                          │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Mini-hero | Set page context, shorter than Home hero | Full-width, ~50vh | Fade-up only, no video |
| 2 | Timeline | Establish legacy/credibility | Vertical timeline (horizontal on wide desktop) | Line draws down as user scrolls, nodes pop in |
| 3 | Values grid | Communicate brand ethos | 4-col icon grid | Staggered fade-up |
| 4 | Founder message | Humanize the brand | 2-column (portrait / quote) | Fade-up, portrait subtle parallax |
| 5 | Awards strip | Third-party validation | Horizontal logo row | Fade-in, no motion (logos shouldn't move) |
| 6 | Video CTA | Convert browsers into tour bookings | Full-width band w/ bg video | Play-on-hover preview, CTA scale-in |
| 7 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** Eyebrow → H1 (page title) → H2 per section → timeline year labels (gold, Playfair) → body paragraphs → founder quote (large italic Playfair) → CTA.
**CTA placement:** single CTA at the end (video/tour band) — About is a trust-building page, not a hard-sell page; avoid interrupting the story with CTAs.
**Mobile:** timeline becomes a single vertical line with left-aligned content; values grid becomes 2×2; founder section stacks portrait-then-quote.
**UX:** keep paragraphs short (3–4 lines max) — this is a scanning page, not a long-form read.
**Spacing:** timeline needs generous vertical rhythm between nodes (~120px+) so it doesn't feel cramped.
**Premium touch:** hand-drawn-style thin gold line connecting timeline nodes; founder portrait in the same moody lighting as trainer photography for visual consistency.

---

## B.3 Programs

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         PROGRAMS                                                │
│         Training Disciplines For Every Goal                       │
├────────────────────────────────────────────────────────────┤
│   [All] [Strength] [Boxing] [Yoga] [HIIT] [Recovery]  ← tabs      │
│                                                                     │
│   [Program Card] [Program Card] [Program Card]                      │
│   [Program Card] [Program Card] [Program Card]                       │
├────────────────────────────────────────────────────────────┤
│  WEEKLY SCHEDULE                                                       │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐                            │
│  │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │                              │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                              │
│  │ ...class timetable grid...                │                              │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘                              │
├────────────────────────────────────────────────────────────┤
│  (CTA band) Not Sure Where To Start?                                         │
│              [ Book a Free Assessment ]                                        │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                        │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient the user | Full-width, compact | Fade-up |
| 2 | Filter tabs + card grid | Let users browse by training goal | Tab bar + 3-col card grid | Grid cross-fades/reflows on filter change |
| 3 | Timetable | Practical scheduling info | Full-width table | Rows fade-in on scroll |
| 4 | CTA band | Convert undecided visitors | Full-width | Scale-in |
| 5 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → filter tabs (equal visual weight, active = gold underline) → card title (H3) → card description → "Learn More" per card opens a modal with full detail (duration, intensity meter, assigned coaches).
**CTA placement:** one clear CTA at page end ("Book a Free Assessment") for anyone who browsed but didn't commit to a specific program.
**Mobile:** tabs become a horizontally scrollable pill row; card grid drops to 1-column; timetable becomes a day-by-day accordion instead of a wide table (tables don't survive narrow viewports).
**UX:** default filter is "All"; clicking a program card's "Learn More" should not navigate away — use a modal so users keep their filter/scroll context.
**Spacing:** consistent card gutter (~24–32px) regardless of filtered count, so grid never looks lopsided with 1–2 results.
**Premium touch:** each program card's icon and accent color subtly themed per discipline (e.g. Boxing = deeper red-gold, Yoga = softer warm gold) while staying within the overall palette — a refined way to differentiate without breaking brand cohesion.

---

## B.4 Trainers

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         OUR COACHES                                              │
│         Trained By The Best, For The Best                          │
├────────────────────────────────────────────────────────────┤
│   [All] [Strength] [Boxing] [Yoga] [HIIT] [Recovery]  ← filter    │
│                                                                     │
│   [Trainer][Trainer][Trainer][Trainer]                               │
│   [Trainer][Trainer][Trainer][Trainer]                                │
├────────────────────────────────────────────────────────────┤
│  (CTA band) Train Under Someone Who's Been There.                        │
│              [ Book a Session ]                                            │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                    │
└────────────────────────────────────────────────────────────┘
```

(Trainer card detail → modal, per A.8, triggered from any card's "View Profile".)

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient | Full-width, compact | Fade-up |
| 2 | Filter + grid | Browse coaches by specialty | Filter pills + 4-col grid | Staggered fade-up, reflow on filter |
| 3 | CTA band | Drive session bookings | Full-width | Scale-in |
| 4 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → filter pills → trainer name (H3) → role/specialty (gold label) → excerpt → "View Profile" → modal (full bio, certifications, philosophy).
**CTA placement:** page-level CTA at the bottom; per-card CTA ("View Profile") is a discovery action, not a conversion action — the real conversion happens inside the modal ("Book a Session with [Name]").
**Mobile:** 4-col → 2-col → 1-col as viewport narrows; filter pills scroll horizontally.
**UX:** modal must trap focus and be closeable via Esc/backdrop-click/X — this is the page's primary interaction, so it needs to feel instant and frictionless.
**Spacing:** equal card height regardless of bio length (truncate excerpt consistently) so the grid stays visually even.
**Premium touch:** consistent portrait treatment (same backdrop, lighting, crop ratio) across every trainer — visual consistency across a roster is a strong luxury-brand signal; mismatched photography is the fastest way to look amateur.

---

## B.5 Membership

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         MEMBERSHIP                                               │
│         Choose Your Level of Elite                                 │
├────────────────────────────────────────────────────────────┤
│   [Signature]      [ ★ Elite ]      [Private Club]  ← pricing (A.7)│
├────────────────────────────────────────────────────────────┤
│         [ Compare All Features ↓ ]  (expandable table)                │
├────────────────────────────────────────────────────────────┤
│  WHY MEMBERS STAY                                                        │
│  [Icon: Recovery Lounge] [Icon: 1:1 Coaching] [Icon: Priority Booking]      │
├────────────────────────────────────────────────────────────┤
│  FREQUENTLY ASKED                                                            │
│  (FAQ accordion — A.10)                                                        │
├────────────────────────────────────────────────────────────┤
│  (CTA band) Ready to Commit to Elite?                                            │
│              [ Book a Tour ]   [ Apply Now ]                                       │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                            │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient | Full-width, compact | Fade-up |
| 2 | Pricing cards | Core conversion decision | 3-col cards, center elevated | Staggered fade-up, center delayed+scaled |
| 3 | Comparison table | Serve detail-oriented buyers | Expandable full-width table | Height-expand on toggle |
| 4 | Perks strip | Reinforce value beyond price | 3-col icon row | Fade-up |
| 5 | FAQ | Remove final objections | Accordion | Slide-open per item |
| 6 | CTA band | Final conversion | Full-width, dual CTA | Scale-in |
| 7 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → tier name (H2) → price (largest numeral on the page) → feature list → CTA per card → FAQ questions (H3-weight) → answers (body).
**CTA placement:** one CTA per pricing card (primary conversion), plus a closing dual-CTA band ("Book a Tour" for the undecided, "Apply Now" for the ready-to-commit) — this is the one page allowed multiple CTAs since it's the money page.
**Mobile:** cards stack Elite-first; comparison table becomes a swipeable horizontal scroll or a stacked feature-by-tier accordion.
**UX:** be explicit and non-manipulative about pricing — no fake urgency countdowns or "3 spots left" scarcity tricks; luxury trust is earned through restraint, not pressure tactics.
**Spacing:** extra breathing room around the Elite card (it needs to visually "win" through space and elevation, not clutter).
**Premium touch:** subtle gold foil-style gradient sheen on the Elite card border on hover; pricing numerals in Playfair for a bespoke, non-SaaS feel (avoid anything that looks like a software pricing page).

---

## B.6 Facilities

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         FACILITIES                                               │
│         Every Detail, Considered.                                  │
├────────────────────────────────────────────────────────────┤
│  [ image ]              THE STRENGTH FLOOR                          │
│                          Body copy...                                │
├────────────────────────────────────────────────────────────┤
│                          THE RECOVERY LOUNGE           [ image ]      │
│                          Body copy...                                 │
├────────────────────────────────────────────────────────────┤
│  [ image ]              THE STUDIO                                     │
│                          Body copy...                                   │
├────────────────────────────────────────────────────────────┤
│                          THE POOL & SPA               [ image ]          │
│                          Body copy...                                     │
├────────────────────────────────────────────────────────────┤
│  AT A GLANCE                                                                │
│  [icon+label][icon+label][icon+label][icon+label][icon+label][icon+label]    │
├────────────────────────────────────────────────────────────┤
│  (CTA band) See It In Person.                                                  │
│              [ Book a Tour ]                                                     │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                          │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient | Full-width, compact | Fade-up |
| 2–5 | Alternating feature blocks (image/text, text/image) | Showcase each amenity in depth | 2-column, alternating sides | Image slides in from its side, text fades up, staggered |
| 6 | Icon summary strip | Quick-scan amenity checklist | 6-col icon grid | Staggered fade-up |
| 7 | CTA band | Convert to tour booking | Full-width | Scale-in |
| 8 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → amenity name (H2, alternating alignment) → body copy → icon-label pairs in the summary strip → CTA.
**CTA placement:** single CTA at the end — Facilities is a showcase page, let the imagery do the persuading.
**Mobile:** alternating blocks always go image-then-text (never text-then-image) for consistent scroll rhythm; icon strip becomes 2- or 3-col.
**UX:** each feature block should feel like its own mini-moment — don't let five blocks blur into an undifferentiated scroll; vary image treatment slightly (crop, framing) between blocks.
**Spacing:** largest section padding on the site (this page sells on atmosphere) — err toward more whitespace, not less.
**Premium touch:** a subtle full-bleed background texture (brushed concrete/marble at ~4% opacity) behind alternating blocks to add tactile depth without competing with photography.

---

## B.7 Gallery

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         GALLERY                                                  │
│         Inside The Club                                            │
├────────────────────────────────────────────────────────────┤
│   [All] [Facility] [Classes] [Events] [Members]  ← filter pills     │
│                                                                       │
│   [img][img][img]                                                     │
│   [img][img][img]      ← masonry grid (varied heights)                  │
│   [img][img][img]                                                        │
├────────────────────────────────────────────────────────────┤
│  (CTA band) Follow Us For More                                              │
│              [ @ironelitefitness ]                                            │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                        │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient | Full-width, compact | Fade-up |
| 2 | Filter + masonry grid | Visual proof, browsable by category | Filter pills + masonry grid (A.6) | Staggered fade-up, reflow on filter |
| 3 | Social CTA | Extend engagement to Instagram | Full-width band | Fade-up |
| 4 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → filter pills → images only (no captions cluttering the grid; captions live in the lightbox).
**CTA placement:** single social-follow CTA — this page's job is visual, not conversion-heavy.
**Mobile:** masonry collapses to 2 columns, still varied heights; lightbox becomes full-screen with swipe gestures.
**UX:** lazy-load everything below the fold; show a low-quality image placeholder (blurred) while full images load so the grid never pops in jarringly.
**Spacing:** tight grid gutters (8–12px) here, unlike the generous spacing elsewhere — a gallery reads richer when images feel like a contiguous mosaic.
**Premium touch:** a very subtle uniform color-grade/filter applied across all gallery images so a mixed set of photos still reads as one consistent visual brand.

---

## B.8 Blog (Journal)

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         JOURNAL                                                  │
│         Insights on Training, Recovery & Discipline                 │
├────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐                       │
│  │        (featured post, large image)          │                       │
│  │        Title / excerpt / [ Read Article ]     │                       │
│  └───────────────────────────────────────────┘                       │
├──────────────────────────────────────┬───────────────────────┤
│  [Blog Card] [Blog Card]                │  RECENT POSTS           │
│  [Blog Card] [Blog Card]                │  CATEGORIES              │
│  [Blog Card] [Blog Card]                │  [ Newsletter signup ]     │
│                                          │                             │
│              [ 1  2  3  → ]  ← pagination                                │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                  │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient | Full-width, compact | Fade-up |
| 2 | Featured post | Highlight the flagship article | Large full-width card | Fade-up, image subtle zoom |
| 3 | Card grid + sidebar | Browse/discover articles | 2-col grid (main) + 1-col sidebar | Staggered fade-up |
| 4 | Pagination | Navigate archive | Centered numbered controls | None (instant, functional) |
| 5 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → featured post title (H2, largest) → card titles (H3) → excerpt → date/read-time meta → sidebar headings (small caps gold).
**CTA placement:** "Read Article" on the featured post; newsletter signup CTA lives in the sidebar (secondary, not competing with article discovery).
**Mobile:** sidebar moves below the card grid (not hidden — newsletter signup still matters on mobile); featured post image shortens to maintain above-the-fold balance.
**UX:** show estimated read time on every card — a small but real trust signal for editorial content.
**Spacing:** generous line-height and paragraph spacing anywhere body copy appears; blog is the most text-heavy page on the site, so typography rhythm matters most here.
**Premium touch:** drop-cap first letter treatment carried from the single-article page down into the featured-post excerpt for visual continuity.

---

## B.9 Blog Single (Article)

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│  Journal / Training  ← breadcrumb                                 │
│                                                                       │
│              (full-width article hero image)                          │
│         Article Title (large Playfair)                                  │
│         By [Author] · Jul 12, 2026 · 6 min read                          │
├────────────────────────────────────────────────────────────┤
│                    ┌─────────────────────────┐                             │
│                    │   Article body copy,       │                             │
│                    │   drop-cap first letter,    │  ← centered, max-width 720px │
│                    │   pull-quotes, inline images │                             │
│                    └─────────────────────────┘                             │
├────────────────────────────────────────────────────────────┤
│  [ author photo ]  About [Author Name]  — short bio                          │
├────────────────────────────────────────────────────────────┤
│  RELATED ARTICLES                                                              │
│  [Blog Card] [Blog Card] [Blog Card]                                             │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                          │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Breadcrumb | Orientation/wayfinding | Small text row | None |
| 2 | Article hero | Set tone, title, meta | Full-width image + centered title block | Fade-up |
| 3 | Article body | Deliver content | Single centered column, max-width ~720px | Paragraphs fade-up as read (subtle, optional) |
| 4 | Author bio | Build editorial credibility | Small horizontal block | Fade-up |
| 5 | Related articles | Retain the reader on-site | 3-col card grid | Staggered fade-up |
| 6 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** breadcrumb → H1 (title) → byline/meta → body (H2/H3 subheads within, pull-quotes in Playfair italic) → author bio → related articles.
**CTA placement:** a social-share row (icon buttons) floats alongside the article on desktop (sticky on scroll) or sits below the title on mobile — no hard sales CTA interrupts editorial content; a single soft CTA ("Ready to put this into practice? Explore Programs") can close the article body.
**Mobile:** share icons move to a horizontal row below the title instead of a floating sidebar; body column becomes full-width with standard margins.
**UX:** reading progress indicator (thin gold bar at the top of the viewport) gives the reader a sense of article length — a small, tasteful touch appropriate for long-form content.
**Spacing:** widest line-height on the site (1.7–1.8) for body copy; comfortable paragraph spacing (~1.5em between paragraphs).
**Premium touch:** editorial drop-cap on the article's opening paragraph, matching a print-magazine sensibility rather than a generic blog template.

---

## B.10 Contact

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│         CONTACT                                                  │
│         Let's Start Your Story.                                    │
├────────────────────────────────────────────────────────────┤
│   [ General Inquiry ]  [ Book a Tour ]  ← tab toggle                 │
│                                                                         │
│  ┌───────────────────────────┬────────────────────────────┐             │
│  │  (form — A.11)              │  Visit Us                    │             │
│  │                              │  Address / Phone / Email       │             │
│  │                              │  Hours table                    │             │
│  │                              │  [ embedded map ]                 │             │
│  └───────────────────────────┴────────────────────────────┘             │
├────────────────────────────────────────────────────────────┤
│  QUICK ANSWERS                                                             │
│  (short FAQ — 3-4 items, links to full Membership FAQ)                        │
├────────────────────────────────────────────────────────────┤
│  [Footer]                                                                         │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Page header | Orient | Full-width, compact | Fade-up |
| 2 | Tab toggle + form/info | Core interaction — capture the lead | 2-column (A.11) | Fade-up; tab switch cross-fades field set |
| 3 | Quick FAQ | Deflect common questions before they email | 3–4 item accordion | Slide-open |
| 4 | Footer | — | 4-col | Fade-in |

**Content hierarchy:** H1 → tab labels → form labels/inputs → info block headings (small caps gold) → address/phone/email/hours → map → FAQ questions.
**CTA placement:** the form submit button *is* the CTA — no competing buttons on this page.
**Mobile:** form stacks above info/map; map becomes a static image with a "Get Directions" link rather than a heavy interactive embed (performance + mobile usability).
**UX:** confirm submission with an inline success state (not just an alert) — replace the form with a "Thank you, we'll be in touch within 24 hours" message so the user isn't left wondering if it worked.
**Spacing:** tighter than showcase pages (Facilities/Gallery) — Contact is transactional, it should feel efficient, not sprawling.
**Premium touch:** map styled with a custom dark/gold-accented theme (via map style JSON) rather than default Google Maps colors, so it doesn't visually clash with the rest of the site.

---

## B.11 404 (Not Found)

```
┌────────────────────────────────────────────────────────────┐
│  [Navbar]                                                     │
├────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                        IRON ELITE                                 │
│                                                                  │
│                          404                                       │
│              Even Elite Athletes Miss Sometimes.                     │
│                                                                  │
│          [ Back to Home ]   [ View Membership ]                      │
│                                                                  │
│                                                                  │
├────────────────────────────────────────────────────────────┤
│  [Footer — minimal]                                                  │
└────────────────────────────────────────────────────────────┘
```

| # | Section | Purpose | Layout | Animation |
|---|---|---|---|---|
| 1 | Centered message | Recover the user gracefully, on-brand | Full-viewport centered, minimal | Fade-up only |
| 2 | Footer (minimal) | Wayfinding | Simplified single row | Fade-in |

**Content hierarchy:** logo mark → large "404" (Playfair, largest numeral treatment on the site) → one-line on-brand message → two CTAs.
**CTA placement:** two equal-weight options — Home (primary) and Membership (outline) — both plausible next steps for a lost visitor.
**Mobile:** buttons stack vertically, full-width.
**UX:** keep the tone confident and light without breaking brand voice — no generic "Oops!" or clip-art illustrations; the luxury brand voice holds even in error states.
**Spacing:** maximal whitespace — this page is defined by restraint, a single centered moment.
**Premium touch:** the same subtle Ken-Burns background treatment as the Home hero, at very low opacity, so even the error page still feels like "the club," not a broken generic page.

---

# Approval Checkpoint

That's the complete Phase 2 UI/UX blueprint: global systems (nav, footer, buttons, cards, forms, gallery, pricing, trainer cards, testimonials, FAQ, contact layout, scroll timeline) plus full page-by-page wireframes for all 11 pages.

**Please review and confirm before Phase 3 begins (actual HTML/CSS/JS coding).** Specifically worth flagging for your sign-off:

1. Trimmed the primary nav to 6 links + CTA (Gallery reached via Facilities/footer instead of a 7th/8th top-level item) — confirm that's acceptable, or you'd rather it be a top-level link.
2. Single-open FAQ accordion (not multi-open) — confirm that's the preferred behavior.
3. Trainer/Program detail views are modals, not separate pages — confirm, or you'd prefer dedicated detail pages (e.g. `/trainers/marcus-reed.html`).

Once approved, Phase 3 starts with the Design System Foundation (CSS variables, reset, typography, spacing scale, base buttons, icon sprite) per the Phase 1 roadmap.
