# Portfolio Website — Project Documentation

## Overview

A personal portfolio website designed to showcase professional information, hobbies, and event participation. The site prioritizes expressive kinetic design, warm visual identity, and responsive behavior across all screen sizes. Multi-page architecture with dedicated pages for Hobbies and Events, a condensed home page, and client-side dark/light theming.

---

## Tech Stack

### Current (Phase 3 — Next.js Production Build)

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | File-based routing, static export (SSG), image optimization, SEO metadata |
| **Language** | TypeScript (strict) | Type safety across components, data, and hooks |
| **Styling** | Tailwind CSS v3 + CSS custom properties | Utility classes for layout, custom properties for theming (dark/light swap) |
| **Animation** | Framer Motion + CSS transitions | FM: `useScroll`/`useTransform` for parallax, `whileInView` for scroll reveals, `AnimatePresence` for menu/search overlays, kinetic shape animations. CSS transitions: navbar bar→orb morphing |
| **Icons** | lucide-react | Lightweight icon set for nav, hobby cards, social links, UI controls |
| **Deployment** | GitHub Pages (static export) | Free hosting via GitHub Actions CI/CD, auto-deploys on push to `main` |

### Planned (Future Phases)

| Layer | Technology | Purpose |
|---|---|---|
| **CMS** | Sanity | Hosted admin dashboard (studio) for editing About, Hobbies, and Events content via GROQ queries |
| **Deployment (alt)** | Vercel | If dynamic features are needed later (ISR, API routes, server components) |

### Previous (Phase 1 — Prototype)

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | React (JSX artifact) | Single-file prototype for rapid design iteration |
| **Styling** | Inline CSS + CSS custom properties | Quick theming without build tools |
| **Animation** | CSS transitions + JS scroll listeners | Prototype-grade scroll animations |

---

## Design System

### Visual Direction

**Personality:** Kinetic and expressive — motion-forward, layered elements, creative scroll interactions. Not the standard dark-glass template.

**Color palette (CSS custom properties, defined in `globals.css`):**

```
Light mode (default):
  --bg:       #FAF7F2   (warm cream)
  --bg-2:     #F0EBE3   (muted warm)
  --bg-card:  #ffffff   (card surface)
  --fg:       #1A1613   (rich dark brown)
  --fg-2:     #5C534A   (secondary text)
  --fg-3:     #9A918A   (tertiary/muted)
  --accent-1: #E8943A   (amber — primary accent)
  --accent-2: #E85D4A   (coral)
  --accent-3: #C45A3C   (terracotta)

Dark mode (toggled via .dark class on <html>):
  --bg:       #141210   (deep warm black)
  --bg-2:     #1E1B18   (elevated surface)
  --bg-card:  #1E1B18   (card surface)
  --fg:       #F0EBE3   (warm white)
  --fg-2:     #A89E95   (secondary)
  --fg-3:     #6B6158   (muted)
  --accent-1: #F0A54E   (brighter amber)
  --accent-2: #F06E5C   (brighter coral)
  --accent-3: #D4694F   (brighter terracotta)
```

**Typography:** Inter (loaded via Google Fonts CDN, comment in `layout.tsx` shows how to switch to `next/font`). Weight range 400–900. Display headings: 900 weight, letter-spacing -0.04em to -0.05em. Body: 400–500 weight.

**Corners:** `rounded-card` (20px) on cards, `rounded-pill` (50px) on buttons and navbar. Defined in `tailwind.config.ts`.

**Spacing:** Sections use py-20 to py-24. Cards use p-7 internal padding.

### Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `sm` (640px, Tailwind default) | Static top navbar with text links + sliding highlight, search button, theme toggle |
| `< sm` (below 640px) | Navbar becomes a floating bottom dock (icons + active section label + theme toggle) |
| `max-sm` (below 640px) | Hobbies grid goes single column, About grid goes single column |

---

## Site Structure

### Pages

| Route | Content | Key Interactions |
|---|---|---|
| `/` (Home) | Hero + About + Hobbies preview (2 cards) + Events preview (3 items) + Contact | Parallax hero, scroll-triggered reveals, "View all" links to sub-pages |
| `/hobbies` | Full list of hobbies with expanded descriptions | Back button, fade-in cards, accent color bars |
| `/events` | Timeline with all events, filter by type, expandable cards | Type filter pills, click-to-expand with AnimatePresence, timeline dots |

### Components

| Component | Location | Purpose |
|---|---|---|
| `Navbar` | `components/nav/Navbar.tsx` | Signature glass bar → orb retraction (CSS transitions), routing, search, theme toggle |
| `Hero` | `components/sections/Hero.tsx` | Parallax via `useScroll`/`useTransform`, kinetic floating shapes with scroll-linked rotation |
| `About` | `components/sections/About.tsx` | 2-col grid with bio + skills |
| `HobbiesPreview` | `components/sections/HobbiesPreview.tsx` | 2 image cards with gradient overlay + "View all" link |
| `EventsPreview` | `components/sections/EventsPreview.tsx` | 3 events + "View all" link |
| `Contact` | `components/sections/Contact.tsx` | Social pill links |
| `FadeIn` | `components/ui/index.tsx` | Scroll-triggered reveal (Framer Motion `whileInView`) |
| `TiltCard` | `components/ui/index.tsx` | 3D perspective tilt on hover |
| `SectionHeader` | `components/ui/index.tsx` | Reusable subtitle + title block |
| `PageHeader` | `components/ui/index.tsx` | Sub-page header with back button |

### Shared Utilities

| File | Purpose |
|---|---|
| `lib/data.ts` | All content data, TypeScript-typed (NavItem, Hobby, PortfolioEvent) |
| `lib/hooks.ts` | `useScrollY`, `useActiveSection`, `useInView`, `clamp` |
| `lib/theme.tsx` | ThemeProvider context, localStorage persistence, `prefers-color-scheme` detection |

---

## Navbar Behavior

The navbar is static (no bar→orb retraction) with an iOS-style sliding highlight that tracks scroll position:

1. **Desktop (≥ `sm`)** — static full-width glass bar anchored at `top: 14px; left/right: 16px`. Contains logo ("portfolio."), centered nav links, search button, and dark/light mode toggle.
2. **Sliding highlight** — the active nav item shows a rounded pill highlight rendered via Framer Motion `layoutId="nav-highlight-desktop"`. As the user scrolls between sections the pill glides to the next item with a spring transition (iOS segmented-control feel), instead of instantly swapping.
3. **Scroll → nav mapping** — on the home page, `SECTION_TO_NAV` maps scroll sections to nav items so the highlight moves through all four: `about`→About, `hobbies-preview`→Hobbies, `events-preview`→Events, `contact`→Contact (`hero` highlights nothing). On sub-pages the highlight follows the route.
4. **Mobile (< `sm`)** — floating pill **dock fixed at the bottom center** of the screen. Icon-only buttons for each nav item; the active item expands to reveal its **section name** (width/opacity animation) as the user scrolls, so the current section is always labeled. Uses `layoutId="nav-highlight-mobile"` for the same sliding highlight.
5. **Dark mode on mobile** — the bottom dock includes a sun/moon theme toggle (after a divider), so theming is reachable on phones (previously only on desktop).
6. **Search** — desktop-only dropdown, opened from the search icon (`AnimatePresence` fade-from-top).
7. **Routing** — About/Contact are scroll targets on the home page. Hobbies/Events are Next.js page navigations. If on a sub-page and you tap About, it navigates home then scrolls.
8. **Content spacing** — `main` gets `pb-24 sm:pb-0` so the floating bottom dock never covers the last section on mobile.

---

## Deployment

### GitHub Pages (Static Export)

The project is configured for static export via `output: "export"` in `next.config.mjs`.

**Key configuration:**
- `basePath` and `assetPrefix` must match the GitHub repo name (e.g., `/portfolio-site`)
- `images.unoptimized: true` since GitHub Pages doesn't support Next.js image optimization
- `.nojekyll` file in `public/` prevents GitHub Pages from ignoring the `_next` directory
- GitHub Actions workflow at `.github/workflows/deploy.yml` auto-builds and deploys on push to `main`

**Live URL:** `https://fuyudesuu.github.io/portfolio26-test/`

---

## File Inventory

### Production Project (`portfolio-site/`)

| File | Description |
|---|---|
| `app/layout.tsx` | Root layout with ThemeProvider, Navbar, Inter font |
| `app/page.tsx` | Home page (Hero + About + previews + Contact) |
| `app/hobbies/page.tsx` | Full hobbies page |
| `app/events/page.tsx` | Timeline events page with filters |
| `app/globals.css` | Tailwind base + CSS custom properties |
| `components/nav/Navbar.tsx` | Signature navbar with all behaviors |
| `components/sections/*.tsx` | 5 section components |
| `components/ui/index.tsx` | 4 shared UI components |
| `lib/data.ts` | All content data (typed) |
| `lib/hooks.ts` | Custom React hooks |
| `lib/theme.tsx` | Theme context + provider |
| `tailwind.config.ts` | Custom palette, animations, tokens |
| `next.config.mjs` | Static export + GitHub Pages config |

### Prototype Files (archive)

| File | Description |
|---|---|
| `portfolio-prototype.jsx` | Final prototype (v2 — warm/kinetic, multi-page, dark mode) |
| `portfolio-prototype-v1-backup.jsx` | Backup of v1 (dark-only glassmorphism, single page) |

### Documentation

| File | Description |
|---|---|
| `PROJECT.md` | This file |
| `PROGRESS.md` | Checklist of completed work |
| `NEXT-SESSION.md` | Priorities for next building session |
