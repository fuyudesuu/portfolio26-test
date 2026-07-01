# Next Session — Deploy & Polish

## CMS Build Status: COMPLETE ✅

Steps 1–5 are all done. The admin dashboard is fully built and the project compiles cleanly. The only remaining task is deployment (Step 6), which is a user task on Vercel's website.

---

## Step 6 — Deploy to Vercel (USER TASK)

### 6a. Generate your password hash
```bash
cd portfolio-site
node ../generate-password-hash.js "your-chosen-password"
# Copy the printed hash — that's your ADMIN_PASSWORD_HASH
```
(The `generate-password-hash.js` script is in the outputs folder. bcryptjs is already installed in the project.)

### 6b. Generate a GitHub Personal Access Token
- Go to github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
- Generate a token with **Contents: Read and write** permission scoped to the `portfolio26-test` repo
- Copy it — that's your GITHUB_TOKEN

### 6c. Push the updated project to GitHub
```bash
cd portfolio-site
git add .
git commit -m "feat: markdown CMS + admin dashboard"
git push
```

### 6d. Import to Vercel
- Go to vercel.com, sign in with GitHub
- Click "Add New → Project", import `fuyudesuu/portfolio26-test`
- Before deploying, add these Environment Variables:
  ```
  ADMIN_USERNAME       = your_chosen_username
  ADMIN_PASSWORD_HASH  = (the bcrypt hash from step 6a)
  GITHUB_TOKEN         = (the token from step 6b)
  GITHUB_REPO          = fuyudesuu/portfolio26-test
  GITHUB_BRANCH        = main
  ```
- Click Deploy

### 6e. Test
- Visit `your-project.vercel.app` — the site should look identical to GitHub Pages version
- Visit `your-project.vercel.app/admin` — log in with your username/password
- Create a test event, verify it commits to your repo and the site updates (~1 min for Vercel redeploy)

### 6f. Cleanup (optional)
- Once Vercel works, you can disable the old GitHub Pages deployment (repo Settings → Pages → Source: None)
- Update any links pointing to the old github.io URL

---

## After Deployment: Polish Backlog (Phase 5 leftovers)

These design-polish items were deferred earlier and can be picked up anytime:

- [ ] Add hover lift + shadow to cards site-wide
- [ ] Animate the sun/moon theme toggle icon (rotation/morph)
- [ ] Add page transition animations between routes (Framer Motion)
- [ ] Wire up the navbar search (filter sections/skills/events)
- [ ] Switch from CDN `<link>` to `next/font` for Inter (removes build warning, improves perf)
- [ ] Replace Unsplash placeholder images with real photos (via admin dashboard now!)
- [ ] Test dark mode contrast for WCAG AA
- [ ] Run Lighthouse audit, target 95+
- [ ] Add more icon options to `lib/icons.ts` ICON_MAP if you want hobbies beyond Camera/Music/Code2/Bike

---

## Architecture Reference (for any future work)

### Content flow
```
content/*.md  →  lib/content.ts (build-time read)  →  page.tsx (server)  →  client components
                 lib/github.ts (runtime read/write via API routes)  →  admin dashboard
```

### Auth flow
```
/admin login form  →  POST /api/auth/login  →  bcrypt verify  →  HMAC cookie set
/admin/dashboard   →  GET /api/auth/session  →  verify cookie  →  render or redirect
```

### File map
```
lib/
  content.ts     — build-time markdown reader (gray-matter), used by pages
  github.ts      — runtime GitHub Contents API (list/read/write/delete)
  session.ts     — HMAC session tokens + HTTP-only cookies
  constants.ts   — shared types/constants (no fs — safe for client)
  icons.ts       — icon name string → Lucide component (client)
  data.ts        — NAV_ITEMS only
components/admin/
  ui.tsx         — Field, TextArea, Select, TagInput, Button, Toast
app/admin/
  page.tsx                    — login
  dashboard/page.tsx          — tabbed shell + auth guard
  dashboard/EventsManager.tsx — events CRUD
  dashboard/HobbiesManager.tsx— hobbies CRUD
  dashboard/AboutManager.tsx  — profile edit
app/api/
  auth/{login,session,logout}/route.ts
  content/events/route.ts + [slug]/route.ts
  content/hobbies/route.ts + [slug]/route.ts
  content/about/route.ts
```

### Environment variables (Vercel)
```
ADMIN_USERNAME, ADMIN_PASSWORD_HASH, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH
```

---

## Notes for the AI Assistant

```
## Current Status
- CMS BUILD COMPLETE (Steps 1–5). Only Step 6 (Vercel deploy) remains — a user task.
- Full admin dashboard at /admin with Events/Hobbies/About CRUD via GitHub API
- Project archive: portfolio-site.tar.gz
- Backup: portfolio-site-pre-vercel-backup.tar.gz (GitHub Pages static version)
- Password hash helper: generate-password-hash.js (in outputs)
- Known minor issue: build shows a Google Fonts minify warning (CDN link) — harmless, but switching to next/font would remove it
- Tech: Next.js 14, TypeScript, Tailwind, Framer Motion, gray-matter, bcryptjs
- If continuing: pick from the Polish Backlog above, or help user through Vercel deploy
```
