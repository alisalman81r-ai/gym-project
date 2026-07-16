# Iron Elite Fitness Club

*Train Beyond Limits.*

A production-quality, fully responsive marketing website for a fictional luxury fitness club — built as an end-to-end practice/portfolio project covering the full product lifecycle: UX planning, semantic HTML/CSS/JS foundations, and a complete migration to a modern Next.js stack with real content, accessibility fixes, SEO, and a full QA pass.

This is a local practice project and is intentionally not deployed live. It runs fully with `npm run dev` — see [Getting Started](#getting-started) below.

## Overview

Iron Elite Fitness Club is a marketing site for a premium gym brand: a home page, seven interior pages (About, Membership, Trainers, Classes, Gallery, Blog, Contact), a dynamic blog with individual post routes, and supporting utility pages (Privacy, Terms, custom 404/error screens). The project was built in deliberate phases — planning and UX blueprocking first, then a static HTML/CSS/JS build, then a full migration to Next.js/TypeScript/Tailwind CSS/Framer Motion with real licensed photography, accessibility and SEO fixes, and a final production QA pass.

## Features

- **11 fully built routes** — Home, About, Membership, Trainers, Classes, Gallery, Blog (index + 4 dynamic post pages), Contact, Privacy, Terms — plus on-brand custom 404 and error pages
- **Real content throughout** — no lorem ipsum: trainer bios, class schedules, membership tiers, blog posts, and 21 real licensed photographs (Unsplash License, see [web/public/images/README.md](web/public/images/README.md) for full photographer credits)
- **Interactive tools** — BMI calculator, testimonial slider, FAQ accordion, animated stats counters, mobile-responsive navigation drawer
- **Client-validated contact form** — inline validation, error states, and a success confirmation screen (see [Future Improvements](#future-improvements) for backend wiring)
- **Premium motion design** — Framer Motion scroll reveals, hover states, and page transitions, all respecting `prefers-reduced-motion`
- **SEO-complete** — per-page metadata (title/description/Open Graph/Twitter cards) via a shared metadata helper, JSON-LD structured data, dynamic `sitemap.xml`/`robots.txt`
- **Accessibility-checked** — WCAG AA color contrast verified by calculation (not eyeballed), visible focus states on every interactive element, semantic landmarks throughout
- **Fully responsive** — mobile, tablet, laptop, and ultra-wide breakpoints, with horizontally-scrollable tables instead of broken layouts on narrow screens

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript (`strict` mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme`, no config file) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Images | `next/image` with a custom fade-in reveal wrapper |
| Hosting target | [Vercel](https://vercel.com/) |

## Screenshots

_Screenshots aren't included in this repo yet — this environment has no headless browser available to capture them. To add your own: run the site locally (see below), screenshot the Home, Trainers, and Gallery pages in both light desktop and mobile viewport sizes, and drop them into a `docs/screenshots/` folder, then reference them here, e.g.:_

```md
![Home page](docs/screenshots/home.png)
![Mobile navigation](docs/screenshots/mobile-nav.png)
```

## Project Structure

```
gym-website/
├── web/              ← the live Next.js application (see web/README.md for full details)
├── docs/             ← planning docs: phase-by-phase UX blueprint and migration architecture
├── archive/          ← the original static HTML/CSS/JS MVP, kept for reference, not part of the live site
└── index.html, about.html, ...   ← the pre-migration static site (superseded by web/, kept for history)
```

The active, deployed project lives entirely in **[`web/`](web/)**. Everything at the repository root outside `web/` and `docs/` is the original static-site build this project evolved from.

## Getting Started

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts (run from `web/`)

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (static prerender of every route) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |

## Deployment (optional reference)

This project isn't deployed — it's kept local for practice. If you ever want to deploy it, it's set up to work on [Vercel](https://vercel.com) with no extra configuration: because the Next.js app lives in the `web/` subfolder rather than the repo root, set the Vercel project's **Root Directory** to `web` — the framework preset, build command, and output are auto-detected from there. No environment variables are required.

## Future Improvements

- Wire the contact form to a real backend endpoint (email service or CRM) — the form's validation and UX are complete; only the submit handler needs a live endpoint
- Replace stock photography with real branded photography of the actual space, trainers, and members
- Add a real logo mark (currently a styled text wordmark) — see the `branding/` section of [web/public/images/README.md](web/public/images/README.md)
- Add Open Graph share images per page (`og/` folder is reserved but not yet wired)
- Add automated tests (component/unit tests, and end-to-end tests once a headless-browser environment is available)
- Wire an error-reporting service (e.g. Sentry) into the existing error boundary — the hook point is already in place in `web/app/error.tsx`

## Credits

All photography is sourced from Unsplash under the free [Unsplash License](https://unsplash.com/license) (free for commercial use). Full per-image photographer credit is in [web/public/images/README.md](web/public/images/README.md).

## License

This is a portfolio/demo project. No license file is currently included — add one (MIT is a common default) if you intend to open-source or reuse this code.
