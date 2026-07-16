# Image Asset Manifest

Every image on the site is a **real photograph sourced from Unsplash**, downloaded under the free [Unsplash License](https://unsplash.com/license) (free for commercial use, no attribution legally required). Photographer credit is kept below anyway as good practice and so the original source can be found again if needed.

**To replace any image with different photography:** drop the new file in at the same path with the same name, keep the same aspect ratio, done — no code changes needed.

## hero/

| File | Used in | Credit |
|---|---|---|
| `hero-main.jpg` | `HeroSection.tsx` | Photo by [George Pagan III](https://unsplash.com/@gpthree) on Unsplash |
| `about-strength-floor.jpg` | `AboutPreviewSection.tsx` | Photo by [Vitaly Gariev](https://unsplash.com/@vitalygariev) on Unsplash |

## trainers/

| File | Trainer | Credit |
|---|---|---|
| `marcus-reed.jpg` | Marcus Reed — Head Strength Coach | Photo by [Anastase Maragos](https://unsplash.com/@visualsbyroyalz) on Unsplash |
| `alina-cruz.jpg` | Alina Cruz — HIIT & Conditioning | Photo by [Brian Lawson](https://unsplash.com/@brianlawsonimages) on Unsplash |
| `daniel-osei.jpg` | Daniel Osei — Functional Movement | Photo by [Patrick Daley](https://unsplash.com/@patrickdaley) on Unsplash |
| `priya-nair.jpg` | Priya Nair — Nutrition & Wellness | Photo by [Spencer Davis](https://unsplash.com/@spencerdavis) on Unsplash |

## classes/

| File | Class | Credit |
|---|---|---|
| `strength-training.jpg` | Strength Training | Photo by [Ali Choubin](https://unsplash.com/@alichoubin) on Unsplash |
| `cross-training.jpg` | Cross Training | Photo by [Jan Gunnar Nygård](https://unsplash.com/@jannygaard) on Unsplash |
| `yoga.jpg` | Yoga | Photo by [Christian Harb](https://unsplash.com/@c7arb) on Unsplash |
| `personal-training.jpg` | Personal Training | Photo by [Annie Spratt](https://unsplash.com/@anniespratt) on Unsplash |

## equipment/

Used by `EquipmentSection.tsx` on the Home page.

| File | Feature | Credit |
|---|---|---|
| `free-weight-zone.jpg` | Elite Free-Weight Zone | Photo by [Jelmer Assink](https://unsplash.com/@jelmerassink) on Unsplash |
| `recovery-suite.jpg` | Recovery & Cryotherapy Suite | Photo by [Simon HUMLER](https://unsplash.com/@simonhumlr) on Unsplash |
| `cardio-deck.jpg` | Precision Cardio Deck | Photo by [Alex Tyson](https://unsplash.com/@alextyson195) on Unsplash |
| `functional-turf-zone.jpg` | Functional Turf Zone | Photo by [Long Chung](https://unsplash.com/@chungj07) on Unsplash |

## gallery/

Six images feeding the masonry grid — mix of tall (4:5) and square (1:1) shots creates the staggered layout, so keep that alternation if you swap any of these. Three carry a "transformation story" caption (member name + a brief result) that reveals on hover, defined in `constants/gallery.ts` as text data, not baked into the image.

| File | Aspect | Credit | Caption? |
|---|---|---|---|
| `gallery-01.jpg` | 4:5 | Photo by Ali Choubin on Unsplash (reused from `classes/strength-training.jpg`) | — |
| `gallery-02.jpg` | 1:1 | Photo by [Anastase Maragos](https://unsplash.com/@visualsbyroyalz) on Unsplash | — |
| `gallery-03.jpg` | 4:5 | Photo by Jan Gunnar Nygård on Unsplash (reused from `classes/cross-training.jpg`) | Yes |
| `gallery-04.jpg` | 1:1 | Photo by Simon HUMLER on Unsplash (reused from `equipment/recovery-suite.jpg`) | — |
| `gallery-05.jpg` | 4:5 | Photo by Vitaly Gariev on Unsplash (reused from `hero/about-strength-floor.jpg`) | Yes |
| `gallery-06.jpg` | 1:1 | Photo by [Diego Corona](https://unsplash.com/@cldiego) on Unsplash | Yes |

## testimonials/

Small avatar next to each quote — these are generic Unsplash portraits standing in for real members; swap for actual member photos (with their consent) when available.

| File | Member | Credit |
|---|---|---|
| `sarah-whitfield.jpg` | Sarah Whitfield | Photo by [Scott Webb](https://unsplash.com/@scottwebb) on Unsplash |
| `james-keller.jpg` | James Keller | Photo by [Farkas Mario](https://unsplash.com/@photosbyfrk) on Unsplash |
| `maria-gomez.jpg` | Maria Gomez | Photo by [Meagan Stone](https://unsplash.com/@meagan_stone) on Unsplash |

## supplements/

Used by `SupplementCard.tsx` on the Supplements page (`/supplements`).

| File | Product | Credit |
|---|---|---|
| `whey-protein-isolate.jpg` | Whey Protein Isolate | Photo by [Alex Saks](https://unsplash.com/@alexsaks) on Unsplash |
| `creatine-monohydrate.jpg` | Creatine Monohydrate | Photo by [FitNish Media](https://unsplash.com/@fitnish) on Unsplash |
| `pre-workout-igniter.jpg` | Pre-Workout Igniter | Photo by [Alex Saks](https://unsplash.com/@alexsaks) on Unsplash |
| `bcaa-recovery-blend.jpg` | BCAA Recovery Blend | Photo by [Alex Saks](https://unsplash.com/@alexsaks) on Unsplash |
| `daily-multivitamin.jpg` | Daily Multivitamin | Photo by [Mockup Free](https://unsplash.com/@mockupfreenet) on Unsplash |
| `electrolyte-hydration-mix.jpg` | Electrolyte Hydration Mix | Photo by [NutraSeller Manufacturing](https://unsplash.com/@nutraseller) on Unsplash |

## branding/ *(reserved, not yet wired to a component)*

The Navbar/Footer currently render the wordmark as styled text, not an image — there's no logo file to replace yet. If a real logo mark is designed, add `logo-gold.svg` (for dark backgrounds) here and update `Navbar.tsx`/`Footer.tsx` to render it via `<Image>` instead of text — a small, contained change.

## og/ *(reserved, not yet wired)*

Social-share preview images (1200×630) for each page's `openGraph.images` metadata — not yet configured per-page.
