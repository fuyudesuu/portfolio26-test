# Security Test Checklist — portfolio26-test

Scope: this repository (Next.js 14 App Router). Authenticated admin CMS at `/admin`
writing markdown to the repo via the GitHub Contents API.

**Authorization:** owner-requested assessment of the owner's own site. Testing is
limited to this codebase and a locally-run instance. No testing against third-party
infrastructure (github.com, Vercel) beyond the app's own code paths.

## Architecture facts that shape this checklist

- **There is no SQL database.** No SQL, no ORM, no query builder anywhere in the
  project. Content is markdown files in `content/`, read and written through
  `lib/github.ts` using the GitHub Contents API.
- The **injection surface that replaces SQLi** is *path traversal* — user input
  (`slug`) is concatenated into a GitHub API path, and the server holds a
  `GITHUB_TOKEN` with **Contents: read and write** on the repo.
- Auth is a self-rolled HMAC cookie (`lib/session.ts`), not a vetted library.
- There is **no `middleware.ts`** — no edge-level route guard and no security headers.

Severity: **C**ritical / **H**igh / **M**edium / **L**ow.

---

## A. Injection (the "SQL injection" concern, mapped to this stack)

| # | Sev | Check | How to test | Pass = |
|---|-----|-------|-------------|--------|
| A1 | — | Confirm no SQL sink exists | Grep for `query(`, `execute(`, `knex`, `prisma`, `sequelize`, `pg`, `mysql`, `sqlite`, `SELECT `, `UNION` across `app/ lib/ components/` | No SQL sink found; SQLi formally N/A |
| A2 | **C** | **Path traversal in `[slug]` GET** — read arbitrary repo files | `GET /api/content/events/..%2F..%2Fcontent%2Fabout%2Fprofile` and `%2e%2e%2f` variants against `app/api/content/events/[slug]/route.ts:16` | 400/404, not the contents of another file |
| A3 | **C** | **Path traversal in `[slug]` PUT** — overwrite arbitrary repo files | Authenticated `PUT /api/content/events/..%2F..%2Fapp%2Fpage` with a body | Rejected before reaching `writeFile` |
| A4 | **C** | **Path traversal in `[slug]` DELETE** — delete arbitrary repo files | Authenticated `DELETE /api/content/hobbies/..%2F..%2Fpackage` | Rejected before reaching `deleteFile` |
| A5 | **H** | **URL/query injection into the GitHub API call** — slug containing `?`, `#`, `&` truncates or rewrites the request URL built in `lib/github.ts:61` | slug = `x%3Fref%3Dsome-other-branch`, `x%23`, `x%26` | Slug is validated/encoded; `ref` cannot be influenced |
| A6 | M | Slug is never validated against an allowlist | Code review: is there a `^[a-z0-9-]+$` guard on `slug` before it reaches `readFile`/`writeFile`/`deleteFile`? | Allowlist regex present on every route |
| A7 | M | **Frontmatter/YAML injection** — attacker-controlled fields serialized by `matter.stringify` | POST an event with `title` containing `\n---\nadmin: true\n`, newlines, and YAML metacharacters | Round-trips as a literal string; no new YAML keys |
| A8 | M | Commit-message injection | POST an event whose `title` contains newlines; inspect the resulting commit message | Message sanitized to a single line |
| A9 | L | XSS via markdown content | Confirm no `dangerouslySetInnerHTML` anywhere; POST content containing `<img src=x onerror=alert(1)>` and view the public page | Rendered as escaped text by React |
| A10 | M | `image` frontmatter accepts a `javascript:` or `data:` URL | Set `image` to `javascript:alert(1)` and to an attacker host; view `HobbiesPageClient.tsx:33` | Non-http(s) schemes rejected |

## B. Admin dashboard & authentication (the "penetratable dashboard" concern)

| # | Sev | Check | How to test | Pass = |
|---|-----|-------|-------------|--------|
| B1 | **C** | **Hardcoded fallback signing secret** — `lib/session.ts:9` falls back to `"fallback-secret-do-not-use"` when `ADMIN_PASSWORD_HASH` is unset | Run the app with `ADMIN_PASSWORD_HASH` unset; forge a token with the known literal secret; call `GET /api/auth/session` and a write route | App refuses to start / all requests 500 — never accepts a forged token |
| B2 | **H** | **Session secret is the password hash itself** — one leaked env var yields both offline password cracking and session forgery | Code review of `getSecret()` | A dedicated `SESSION_SECRET`, independent of the password hash |
| B3 | **H** | **No rate limiting on `/api/auth/login`** | Script 200 rapid POSTs with wrong passwords | Throttled / locked out well before 200 |
| B4 | **M** | **Username enumeration via timing** — `login/route.ts:28` returns before bcrypt runs on a wrong username | Compare response latency for a valid vs. invalid username (50 samples each) | No statistically meaningful difference (dummy bcrypt compare on the miss path) |
| B5 | **M** | **Timing-unsafe signature comparison** — `session.ts:39` uses `!==` on the HMAC | Code review; replace with `crypto.timingSafeEqual` | Constant-time comparison |
| B6 | **H** | **Dashboard auth guard is client-side only** — `app/admin/dashboard/page.tsx` guards in a `useEffect`; there is no `middleware.ts` | `curl` the dashboard HTML unauthenticated; disable JS and load `/admin/dashboard` | Server-side redirect/401 before any dashboard markup ships |
| B7 | **M** | **No session revocation** — logout only clears the cookie; a captured token stays valid for its full 7 days | Capture a cookie, log out, replay the cookie | Replayed token rejected |
| B8 | **M** | Token lifetime is 7 days with no idle timeout or rotation | Code review of `SESSION_DURATION` | Shorter lifetime + rotation on privilege use |
| B9 | **M** | Forged/tampered token handling | Flip bits in the payload; strip the signature; supply `alg`-style tricks; supply a token with `exp` far in the future | All rejected by `verifySessionToken` |
| B10 | L | `exp` is read from the client-supplied payload but only checked after signature verification | Code review — confirm order is verify-then-parse | Signature checked first (currently correct — regression guard) |
| B11 | M | CSRF on state-changing routes | Cross-origin `POST`/`PUT`/`DELETE` from a different origin with `credentials: include` | Blocked (`SameSite` holds, plus an explicit origin check) |
| B12 | L | Login page reveals whether credentials are configured | Unset env vars, attempt login — `login/route.ts:21` returns "Admin credentials not configured" (500) | Generic error to the client; detail only in server logs |

## C. Authorization on the content API

| # | Sev | Check | How to test | Pass = |
|---|-----|-------|-------------|--------|
| C1 | **H** | **Unauthenticated GET on every content route** proxies the server's GitHub token | `GET /api/content/events`, `/hobbies`, `/about` with no cookie | Intentional for public content — but confirm it exposes *only* published fields |
| C2 | **H** | **Token-exhaustion DoS** — `listFiles()` (`lib/github.ts:50`) issues one API call *per file*, unauthenticated and uncached (`cache: "no-store"`) | Hammer `GET /api/content/events` and count outbound GitHub calls; GitHub's limit is 5000/hr | Caching and/or rate limiting; a flood cannot exhaust the token budget |
| C3 | M | Write routes verify session on every method | Call POST/PUT/DELETE on all six content routes with no cookie | Every one returns 401 |
| C4 | M | `sha` handling — lost-update / race between read and write | Two concurrent PUTs to the same slug | Conflict surfaced, not silently clobbered |
| C5 | M | No request-body size or field-length limits | POST an event with a 50 MB body and a 1 MB title | Rejected with 413 |
| C6 | L | `slugify()` collisions let one post overwrite another | POST `"Hello World"` then `"Hello... World!"` — both slugify to `hello-world` | Collision detected (the 409 check covers this — regression guard) |

## D. Secrets & configuration

| # | Sev | Check | How to test | Pass = |
|---|-----|-------|-------------|--------|
| D1 | **C** | Secrets committed to git history | Scan all 38 commits for `ghp_`, `github_pat_`, `$2a$`/`$2b$` bcrypt hashes, `.env` files | Nothing found; `.env*` in `.gitignore` |
| D2 | **H** | `.gitignore` does not list `.env` / `.env.local` | Read `.gitignore` | `.env*` ignored |
| D3 | **H** | **GitHub token scope is over-broad** — `Contents: read and write` on the whole repo means a traversal write can modify `app/`, CI workflows, or `package.json`, which auto-deploys → RCE on the build | Review token scope; confirm A3/A4 are blocked | Token restricted, ideally to a content-only branch |
| D4 | M | **Error messages leak upstream detail** — routes return `err.message`, which includes raw GitHub API responses (`GitHub write failed: 403 {...}`) | Trigger a GitHub failure (bad token) and read the client response | Generic message to client; detail server-side only |
| D5 | M | No env-var validation at boot | Start with each of `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `GITHUB_TOKEN`, `GITHUB_REPO` missing | Fails fast and loudly (ties to B1) |
| D6 | L | `NEXT_PUBLIC_*` leakage | Grep for `NEXT_PUBLIC_` holding anything sensitive | None |
| D7 | M | Build output `out/` (1.2 MB) is committed | Inspect `out/` for stale or sensitive content | Not committed, or verified clean |
| D8 | L | `generate-password-hash.js` referenced by `NEXT-SESSION.md:14` | Confirm it is not in the repo and never was | Absent from working tree and history |

## E. Transport, headers, platform

| # | Sev | Check | How to test | Pass = |
|---|-----|-------|-------------|--------|
| E1 | **H** | **No security headers** — `next.config.mjs` defines no `headers()` and there is no middleware | Inspect response headers | CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, HSTS |
| E2 | M | No CSP means an injected script would run unconstrained | Ties to A9/A10 | CSP present, no `unsafe-inline` for scripts |
| E3 | M | Cookie `secure` flag is conditional on `NODE_ENV === "production"` (`session.ts:55`) | Confirm production builds set `NODE_ENV=production` | Cookie always `Secure` in any deployed environment |
| E4 | M | Clickjacking on `/admin` | Frame the login page | Blocked by frame-ancestors/XFO |
| E5 | L | Dependency vulnerabilities | `npm audit --omit=dev` | No high/critical |
| E6 | L | `/admin` is discoverable and unthrottled | Check `robots.txt` and route exposure | Acceptable if B3/B6 hold |

---

## How to run this

The app cannot reach the real GitHub API without a token, and **must not** be
pointed at the live repo. Test locally with dummy env vars and a stubbed or
intercepted GitHub layer, so that a successful traversal is *observed in the
outbound request URL* rather than actually committing to the repository.

**Do not** run destructive write tests (A3, A4) against the real repo or a real
token. Assert on the URL `lib/github.ts` would call.
