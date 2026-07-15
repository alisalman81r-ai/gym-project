# Image Asset Manifest

Every image currently on the site is a **hand-drawn SVG placeholder** — abstract gold/black gradients standing in for real photography. None of this is stock photography; nothing here needs a license. This file is the exact shopping list for replacing them with real gym photography.

**To swap a placeholder for a real photo:** drop the real file in at the same path with the same name (e.g. replace `hero/hero-main.svg` with `hero/hero-main.jpg`), update the one `src` reference listed below, and remove the `unoptimized` prop on that `<Image>` (only needed because local SVGs skip Next's optimizer). No other code changes required — every component already reads `width`/`height`/`alt`/`sizes` correctly.

## hero/

| File | Used in | Recommended size | Shot description |
|---|---|---|---|
| `hero-main.svg` | `HeroSection.tsx` | 1920×1080 (16:9) | Full-bleed, moody/low-key lighting. Luxury gym interior or an athlete mid-lift. Needs to stay dark enough for white headline text to sit on top (a dark gradient overlay is already layered on top in code, so a mid-tone photo still works). |
| `about-strength-floor.svg` | `AboutPreviewSection.tsx` | 800×1000 (4:5) | A coach spotting a member on a barbell lift, or a clean shot of the strength floor itself. |

## trainers/

One portrait per coach, all shot with **consistent lighting/backdrop** — mismatched trainer photography is the fastest way to look amateur on a page showing them side-by-side.

| File | Trainer | Recommended size |
|---|---|---|
| `marcus-reed.svg` | Marcus Reed — Head Strength Coach | 640×800 (4:5) |
| `alina-cruz.svg` | Alina Cruz — HIIT & Conditioning | 640×800 (4:5) |
| `daniel-osei.svg` | Daniel Osei — Functional Movement | 640×800 (4:5) |
| `priya-nair.svg` | Priya Nair — Nutrition & Wellness | 640×800 (4:5) |

## classes/

| File | Class | Recommended size | Shot description |
|---|---|---|---|
| `strength-training.svg` | Strength Training | 800×600 (4:3) | Barbell squat, bench, or deadlift in progress. |
| `cross-training.svg` | Cross Training | 800×600 (4:3) | Kettlebells, battle ropes, or a functional circuit. |
| `yoga.svg` | Yoga | 800×600 (4:3) | A guided flow or stretch, calmer lighting than the strength shots. |
| `personal-training.svg` | Personal Training | 800×600 (4:3) | A coach and one client, one-on-one. |

## gallery/

Six images feeding the masonry grid — mix of tall (4:5) and square (1:1) shots is what creates the staggered layout, so keep that alternation if you add/replace images. Three carry a "transformation story" caption (member name + a brief result) that reveals on hover, defined in `constants/gallery.ts` — not stored as separate files, just text data attached to the image entry.

| File | Aspect | Shot description | Caption? |
|---|---|---|---|
| `gallery-01.svg` | 4:5 | Strength floor | — |
| `gallery-02.svg` | 1:1 | Boxing/class in session | — |
| `gallery-03.svg` | 4:5 | Member training moment | Yes |
| `gallery-04.svg` | 1:1 | Recovery lounge | — |
| `gallery-05.svg` | 4:5 | Personal training session | Yes |
| `gallery-06.svg` | 1:1 | Group class / community moment | Yes |

## testimonials/

Small avatar next to each quote — real member photos need consent; stock headshots work as a fallback if real photos aren't available.

| File | Member | Recommended size |
|---|---|---|
| `sarah-whitfield.svg` | Sarah Whitfield | 200×200 (1:1) |
| `james-keller.svg` | James Keller | 200×200 (1:1) |
| `maria-gomez.svg` | Maria Gomez | 200×200 (1:1) |

## equipment/

Used by `EquipmentSection.tsx` on the Home page.

| File | Feature | Recommended size | Shot description |
|---|---|---|---|
| `free-weight-zone.svg` | Elite Free-Weight Zone | 800×600 (4:3) | Racked plates/barbells, the free-weight floor. |
| `recovery-suite.svg` | Recovery & Cryotherapy Suite | 800×600 (4:3) | The recovery lounge or cryotherapy equipment. |
| `cardio-deck.svg` | Precision Cardio Deck | 800×600 (4:3) | Row of connected cardio machines. |
| `functional-turf-zone.svg` | Functional Turf Zone | 800×600 (4:3) | The turf lane used for sled work/sprints. |

## branding/ *(reserved, not yet wired to a component)*

The Navbar/Footer currently render the wordmark as styled text, not an image — there's no logo file to replace yet. If a real logo mark is designed, add `logo-gold.svg` (for dark backgrounds) here and update `Navbar.tsx`/`Footer.tsx` to render it via `<Image>` instead of text — a small, contained change.

## og/ *(reserved, not yet wired)*

Social-share preview images (1200×630) for each page's `openGraph.images` metadata — not yet configured per-page.
