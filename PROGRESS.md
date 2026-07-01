# Progress Checklist

## Project Phases

- [x] **Phase 1:** Frontend prototype (hardcoded content, single-file React artifact)
- [x] **Phase 2:** Design exploration and redesign (warm palette, light-first, kinetic direction)
- [x] **Phase 3:** Next.js project setup, component extraction, multi-page routing
- [x] **Phase 4:** GitHub Pages deployment (live at `fuyudesuu.github.io/portfolio26-test`)
- [ ] **Phase 5:** Design polish and finalization (in progress)
- [ ] **Phase 6:** Sanity CMS integration (schemas for About, Hobbies, Events)
- [ ] **Phase 7:** Admin dashboard setup
- [ ] **Phase 8:** Production deployment (Vercel or keep GitHub Pages)

**Current phase:** Phase 4 complete, Phase 5 in progress

---

## Phase 1 — Frontend Prototype (Complete)

### Navbar
- [x] Glass/frosted bar with backdrop-filter blur
- [x] Active section highlighting (scroll-tracked)
- [x] Smooth retraction animation into floating orb on scroll past hero
- [x] Right-anchored positioning (width-only CSS transition, no position jumping)
- [x] Full-width stretch on any screen size (no max-width cap)
- [x] Click orb to open dropdown menu overlay
- [x] Auto-expand when scrolling back to hero
- [x] Search icon and dropdown (fade-from-top animation)
- [x] Dark/light mode toggle in navbar
- [x] Floating theme toggle button when navbar is collapsed
- [x] Responsive: hamburger circle on mobile
- [x] Dropdown menu with icons for each nav item
- [x] "Back to top" button in dropdown menu with divider

### Hero Section
- [x] Large bold split-line name typography (900 weight)
- [x] Eyebrow label ("designer · developer · creator")
- [x] Tagline text
- [x] Two CTA buttons (primary amber, ghost outline)
- [x] Parallax scroll effect (content fades and translates on scroll)
- [x] Scroll-down hint chevron with bounce animation

### About Section
- [x] Two-column grid (stacks to single column on mobile)
- [x] "Who I am" card with avatar emoji and bio text
- [x] "Skills & tools" card with pill-style skill tags
- [x] Footnote card with current learning interests
- [x] Scroll-triggered stagger animation on card entrance

### Hobbies Section
- [x] 2x2 grid layout (stacks to single column on mobile)
- [x] Colored accent bar at top of each card
- [x] Icon with matching accent color
- [x] 3D tilt-on-hover effect (perspective + rotateX/Y)
- [x] Scroll-triggered stagger animation

### Events Section
- [x] Vertical card list with left-side accent stripe
- [x] Type badges: Speaker (coral), Organizer (terracotta), Attendee (amber)
- [x] Date and location metadata
- [x] Slide-in-from-left scroll animation

### Contact Section
- [x] Centered card with message text
- [x] Social pill links (Email, GitHub, LinkedIn) with hover color shift

### Theming
- [x] CSS custom properties for all colors
- [x] Light mode as default (warm cream palette)
- [x] Dark mode toggle (deep warm black palette)
- [x] Smooth 0.4s transition on theme switch

---

## Phase 2 — Design Exploration (Complete)

- [x] Built v1 prototype (dark-only glassmorphism) — saved as backup
- [x] Redesigned to warm palette (amber/coral/terracotta) with light default
- [x] Chose kinetic & expressive design direction over minimal-glass
- [x] Tested and removed hero blob shapes (too dominant)
- [x] Fixed card rendering glitch (removed backdrop-filter from cards, solid backgrounds)
- [x] Fixed navbar retraction (right-anchored, width-only transition)
- [x] Fixed mobile responsiveness (CSS media queries instead of JS width)
- [x] Rewrote all code in ES5-compatible syntax for artifact runtime

---

## Phase 3 — Next.js Migration (Complete)

### Project Setup
- [x] Scaffolded Next.js 14 with App Router + TypeScript + Tailwind
- [x] Installed Framer Motion and lucide-react
- [x] Configured Tailwind with custom color palette, animations, border-radius tokens
- [x] Set up CSS custom properties in `globals.css` for dark/light theming
- [x] Created `ThemeProvider` context with localStorage persistence and system preference detection

### Component Extraction
- [x] `Navbar.tsx` — full navbar with CSS transition morphing, routing logic, search, theme toggle
- [x] `Hero.tsx` — parallax via `useScroll`/`useTransform`, kinetic floating shapes
- [x] `About.tsx` — 2-column grid with skill tags
- [x] `HobbiesPreview.tsx` — 2-card image preview with "View all" link
- [x] `EventsPreview.tsx` — 3-event preview with "View all" link
- [x] `Contact.tsx` — social pill links
- [x] `FadeIn`, `TiltCard`, `SectionHeader`, `PageHeader` — shared UI components
- [x] `useScrollY`, `useActiveSection`, `useInView` — custom hooks
- [x] `lib/data.ts` — all content data with TypeScript types (includes image URLs)

### Multi-Page Routing
- [x] Home page (`/`) — condensed with "View all" buttons
- [x] Hobbies page (`/hobbies`) — full cards with image headers and expanded descriptions
- [x] Events page (`/events`) — timeline with filters + expandable details
- [x] Navbar routing: scroll targets (About/Contact) vs page navigation (Hobbies/Events)
- [x] "Home" button in dropdown menu when on sub-pages

### Build Verification
- [x] Project compiles with zero TypeScript errors
- [x] Static export generates all 3 routes
- [x] Bundle sizes: Home 155kB, Events 138kB, Hobbies 140kB first load

---

## Phase 4 — GitHub Pages Deployment (Complete)

- [x] Configured `next.config.mjs` with `output: "export"`, `basePath`, `assetPrefix`
- [x] Disabled Next.js image optimization (`images.unoptimized: true`)
- [x] Added `.nojekyll` file in `public/` directory
- [x] Created `.github/workflows/deploy.yml` workflow file
- [x] Created GitHub repository (`fuyudesuu/portfolio26-test`)
- [x] Pushed code to `main` branch
- [x] Enabled GitHub Pages with "GitHub Actions" source in repo Settings → Pages
- [x] Fixed initial 404 deployment error (Pages source wasn't set to GitHub Actions)
- [x] Verified live deployment

---

## Phase 5 — Design Polish (In Progress)

### Hero — Kinetic Treatment
- [x] Added 6 floating geometric shapes (amber, coral, terracotta) with CSS animation loops
- [x] Each shape has independent scroll-linked parallax speed and rotation
- [x] Added 3 small accent dots with pulsing opacity animation
- [x] Added ambient radial glow behind the name
- [x] Added staggered entrance animation on page load (eyebrow → name → tagline → buttons)
- [ ] Consider a photo or illustration instead of emoji avatar
- [ ] Refine CTA button sizing and spacing for mobile
- [ ] Test on very tall and very short viewports

### Hobby Cards — Image Overlay Treatment
- [x] Added Unsplash placeholder images to all 4 hobbies (landscape, music, code, cycling)
- [x] Home preview: 280px tall image cards with gradient overlay (transparent → dark)
- [x] Full page: image header (200–240px) + card body for long description
- [x] Frosted glass icon pill on top of images (`backdrop-blur-md bg-white/10`)
- [x] Hover zoom effect on images (`scale-105` over 700ms)
- [ ] Replace placeholder images with user's own photos

### Navbar — Production Bug Fixes
- [x] Removed Framer Motion `layout` prop (was stretching icons during morphing)
- [x] Switched to CSS `transition: width 0.5s` for bar → orb animation
- [x] Added `stopPropagation` to all interactive children (fixed click-through bug)
- [x] Kept Framer Motion only for AnimatePresence on menu/search overlays
- [ ] Test retraction smoothness on Safari iOS and Chrome Android
- [ ] Wire up search functionality

### Remaining
- [ ] Add hover state to cards (subtle lift + shadow increase)
- [ ] Add expansion animation to events (currently instant show/hide)
- [ ] Animate the sun/moon toggle icon (rotation or morph)
- [ ] Test dark mode contrast ratios for WCAG AA accessibility
- [ ] Switch from CDN `<link>` to `next/font` for Inter
- [ ] Run Lighthouse audit, target 95+ all categories

---

## Bugs Fixed During Development

| Issue | Root Cause | Fix |
|---|---|---|
| Navbar text overflow ("Contact" clipped) | Fixed max-width too narrow | Removed max-width cap, full-width bar |
| Navbar retraction instant, not animated | Position jumping `left:50%` → `right:16px` | Right-anchored nav, animate width only |
| Card content invisible | `backdrop-filter` rendering glitch in iframe | Removed backdrop-filter from cards, solid bg |
| Mobile navbar showed garbled text | JS `window.innerWidth` detection unreliable | Switched to CSS `@media` queries |
| Grid stretching on mobile | `min-height:100vh` on sections | Removed min-height, padding-based layout |
| "returnReact is not defined" | Arrow functions/template literals mangled by bundler | Rewrote in ES5-compatible syntax |
| Hero shapes too large (prototype) | Floating blobs dominated viewport | Removed shapes, later re-added as subtle accents in Next.js version |
| Mobile hobbies 2-col too cramped | Breakpoint at 400px too narrow | Changed to 520px (sm) breakpoint |
| `Github` icon missing in lucide-react | Icon removed in newer versions | Replaced with `ExternalLink` |
| `Linkedin` icon missing in lucide-react | Icon removed in newer versions | Replaced with `Link` |
| Google Fonts fetch failed in container | `next/font` requires network access during build | Switched to CDN `<link>` import |
| `useTransform` in `.map()` callback | React hooks can't be called inside callbacks | Extracted into individual top-level hook calls |
| Navbar icons stretched during retraction | Framer Motion `layout` distorts children during morph | Removed `layout` prop, used CSS transitions |
| Navbar clicks not working in production | Child click events bubbling to parent orb handler | Added `e.stopPropagation()` to all child buttons |
| GitHub Pages deploy 404 | Pages source not set to "GitHub Actions" | Changed source in repo Settings → Pages |

---

## Important Decisions Made

1. **Chose Sanity over Payload CMS** — hosted studio, generous free tier, visual editor, GROQ queries
2. **Inter font as SF Pro substitute** — closest web font to Apple's system font
3. **Light default, dark as option** — warm cream is the primary brand identity
4. **Kinetic & expressive design direction** — motion-forward, not standard dark-glass template
5. **Warm accent palette** — amber (#E8943A), coral (#E85D4A), terracotta (#C45A3C)
6. **Right-anchored navbar** — enables smooth width-based retraction without position jumps
7. **No backdrop-filter on content cards** — causes rendering glitches; solid backgrounds more reliable
8. **Kept v1 dark glassmorphism as backup** — saved as `portfolio-prototype-v1-backup.jsx`
9. **Condensed home page** — preview sections with "View all" links to dedicated pages
10. **Events page: timeline with expandable cards** — chronological, filterable by type
11. **Hobbies + Events get dedicated pages, About stays on home** — user preference
12. **GitHub Pages over Vercel (for now)** — free, simple, sufficient for static site
13. **Static export** — no server-side features needed yet; keeps deployment simple
14. **Framer Motion for scroll/entrance animations, CSS for navbar morphing** — FM `layout` prop caused icon distortion; CSS transitions are more reliable for the bar→orb morph
15. **Unsplash placeholder images for hobbies** — to be replaced with user's own photos later

---

## CMS Migration — Content Pipeline (Complete)

### Step 1 — Vercel Configuration
- [x] Removed `output: "export"` from `next.config.mjs`
- [x] Removed `basePath` and `assetPrefix` (no longer needed for Vercel)
- [x] Removed GitHub Actions workflow (Vercel handles deploys)
- [x] Re-enabled Next.js image optimization
- [x] Created pre-Vercel backup archive

### Step 2 — Markdown Content System
- [x] Created `content/events/` with 5 markdown files (frontmatter + body)
- [x] Created `content/hobbies/` with 4 markdown files
- [x] Created `content/about/` with profile.md and learning.md
- [x] Installed `gray-matter` for frontmatter parsing
- [x] Created `lib/content.ts` — server-only parser (reads fs, returns typed data)
- [x] Created `lib/constants.ts` — shared types and constants (no fs, safe for client)
- [x] Created `lib/icons.ts` — client-side icon name string → Lucide component resolver
- [x] Refactored all page files to be server components that read content and pass serializable props
- [x] Split hobbies and events pages into server (data) + client (UI) components
- [x] Updated all client component imports to use `constants.ts` instead of `content.ts` (avoids fs bundling)
- [x] Verified build passes with zero errors
- [x] Bundle sizes: Home 152kB, Events 134kB, Hobbies 137kB

### Step 3 — Server-Side Auth (Complete)
- [x] Installed `bcryptjs` + `@types/bcryptjs` for password hashing
- [x] Created `lib/session.ts` — session utility:
  - HMAC-signed tokens (base64url payload + sha256 signature)
  - Uses `ADMIN_PASSWORD_HASH` env var as signing secret
  - HTTP-only, secure, SameSite cookies with 7-day expiry
  - Functions: `createSessionToken`, `verifySessionToken`, `setSessionCookie`, `getSession`, `clearSessionCookie`
- [x] Created `app/api/auth/login/route.ts`:
  - POST endpoint accepts `{ username, password }`
  - Verifies username against `ADMIN_USERNAME` env var
  - Verifies password against `ADMIN_PASSWORD_HASH` env var using bcrypt.compare
  - Sets HTTP-only session cookie on success
  - Returns 401 with generic "Invalid credentials" on failure
- [x] Created `app/api/auth/session/route.ts`:
  - GET endpoint checks session cookie validity
  - Returns `{ authenticated: true, user }` or `{ authenticated: false }` with 401
- [x] Created `app/api/auth/logout/route.ts`:
  - POST endpoint clears session cookie (sets maxAge: 0)
- [x] Build passes with zero errors

### Step 4 — Content API Routes (Complete)
- [x] Created `lib/github.ts` — GitHub Contents API helper:
  - `listFiles(dir)` — list all .md files in a content directory
  - `readFile(path)` — read + parse frontmatter, returns sha for updates
  - `writeFile(path, frontmatter, body, message, sha?)` — create/update (commits)
  - `deleteFile(path, message, sha)` — delete (commits)
  - `buildMarkdown()` / `slugify()` helpers
  - Uses `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` env vars
- [x] Created `app/api/content/events/route.ts` — GET list, POST create
- [x] Created `app/api/content/events/[slug]/route.ts` — GET/PUT/DELETE single
- [x] Created `app/api/content/hobbies/route.ts` — GET list, POST create
- [x] Created `app/api/content/hobbies/[slug]/route.ts` — GET/PUT/DELETE single
- [x] Created `app/api/content/about/route.ts` — GET/PUT (profile + learning note, singleton)
- [x] All write operations (POST/PUT/DELETE) check session cookie, return 401 if unauthorized
- [x] GET operations are public (needed for the site to read content)
- [x] Slug generated from title via slugify(); prevents duplicate creation (409)
- [x] Updates use file sha from GitHub to avoid conflicts
- [x] Build passes — all 8 API routes register as dynamic server functions
- [x] Next.js 15 async params handled (`params: Promise<{ slug }>`)

**Note:** These routes only work on Vercel (or any Node host), not GitHub Pages static export. The GitHub API writes trigger a redeploy automatically.

### Step 5 — Admin Dashboard UI (Complete)
- [x] Created `components/admin/ui.tsx` — shared form primitives:
  - `Field` (text/date/password input), `TextArea`, `Select`, `TagInput` (multi-tag with Enter-to-add), `Button` (primary/ghost/danger + loading state), `Toast` (success/error notifications)
- [x] Created `app/admin/page.tsx` — login page:
  - Checks existing session on mount, auto-redirects to dashboard if logged in
  - Username + password form, calls `/api/auth/login`, redirects on success
- [x] Created `app/admin/dashboard/page.tsx` — dashboard shell:
  - Auth guard (redirects to /admin if not authenticated)
  - Header with "View site" link + logout button
  - Three tabs (Events, Hobbies, About)
- [x] Created `app/admin/dashboard/EventsManager.tsx`:
  - List view with type badge, date, location, edit/delete buttons
  - Form: title, date, type dropdown, location, tags, summary, full write-up, image URL
  - Create (POST) / update (PUT) / delete (DELETE) with confirmation
- [x] Created `app/admin/dashboard/HobbiesManager.tsx`:
  - List view with title + summary, edit/delete
  - Form: title, icon dropdown, accent color dropdown, summary, description, image URL
- [x] Created `app/admin/dashboard/AboutManager.tsx`:
  - Single form: name, title, eyebrow, tagline, bio, skills (tags), learning note, photo URL
  - Loads current values on mount, saves via PUT
- [x] Added `slideUp` toast keyframe to globals.css
- [x] Build passes — /admin and /admin/dashboard render, all API routes registered
- [x] Created `generate-password-hash.js` helper for producing ADMIN_PASSWORD_HASH

**CMS BUILD COMPLETE.** All that remains is Step 6 — deploy to Vercel and set env vars (user task).
