# Security Remediation — Instructions for the Website Agent

You are fixing confirmed security vulnerabilities in this Next.js 14 (App Router)
site. Every item below was **empirically verified** — see `SECURITY-TEST-RESULTS.md`
for the evidence and `SECURITY-CHECKLIST.md` for the full test matrix.

## Ground rules

1. Work through the phases **in order**. Phase 1 items are actively exploitable — do those first.
2. After each phase, run `npm run build` and `npm run lint`; both must pass before moving on.
3. Do **not** widen scope: no refactors, no dependency bumps except where an item calls for one.
4. There is **no database** in this project — do not add one, and ignore any "SQL" framing.
   Content is markdown written to the repo via the GitHub Contents API (`lib/github.ts`).
5. Make one commit per phase with a clear message. Do not commit secrets or `.env` files.
6. When done, re-run the relevant tests from `SECURITY-CHECKLIST.md` and confirm each fixed item now passes.

---

## Phase 1 — Critical (exploitable now, fix first)

### 1.1 Path traversal in content `[slug]` routes → arbitrary repo read/write/delete
**Files:** `app/api/content/events/[slug]/route.ts`, `app/api/content/hobbies/[slug]/route.ts`
(all of GET/PUT/DELETE), and any other route that receives a `slug`.

**Problem:** URL-encoded `..%2F..%2F` arrives in `slug` **decoded** and is concatenated into
the GitHub API path (`${DIR}/${slug}.md`), escaping `content/`. Confirmed: an authenticated
PUT builds `PUT .../contents/content/events/../../app/page.md`. Combined with the repo-wide
write token, this overwrites app code → deploy-time RCE.

**Fix:** validate the slug against a strict allowlist at the top of **every** handler that
uses it, before it reaches `lib/github.ts`. Reject anything else with 400.

```ts
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// inside each handler, after `const { slug } = await params;`
if (!SLUG_RE.test(slug)) {
  return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
}
```

**Defence in depth (also do this):** in `lib/github.ts`, add a guard in `readFile`,
`writeFile`, and `deleteFile` that rejects any `path` containing `..` or not starting with
`content/`. This protects every caller, not just the routes you edit today.

```ts
function assertContentPath(path: string) {
  if (path.includes("..") || !path.startsWith("content/")) {
    throw new Error("Illegal content path");
  }
}
```

**Verify:** `GET /api/content/events/..%2F..%2Fcontent%2Fabout%2Fprofile` must return 400,
and no outbound GitHub URL may contain `..`.

### 1.2 URL/query injection via slug (`?`, `#`, `&`)
Same routes. The allowlist in 1.1 already blocks this (encoded `?`/`#`/`&` fail `SLUG_RE`).
**Verify:** `GET /api/content/events/x%3Fref%3Devil` returns 400; the constructed URL's
`?ref=` cannot be attacker-controlled.

### 1.3 Fallback HMAC signing secret → session forgery / full auth bypass
**File:** `lib/session.ts` (`getSecret`, line ~7-10).

**Problem:** when `ADMIN_PASSWORD_HASH` is unset, `getSecret()` returns the literal
`"fallback-secret-do-not-use"`. Confirmed: a cookie signed with that public string returns
`{"authenticated":true,"user":"attacker"}`. Any missing/mistyped env var = takeover.

**Fix:** introduce a dedicated `SESSION_SECRET` env var, and **throw** (never fall back) if
it is missing. Do not reuse the password hash as the signing key (see 2.1).

```ts
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is not configured (min 32 chars)");
  }
  return secret;
}
```

**Also:** add these to your env docs / Vercel project settings:
`SESSION_SECRET` = a fresh 32+ char random value (`openssl rand -base64 32`).

**Verify:** with `SESSION_SECRET` unset the app must fail requests rather than accept a
forged token; a cookie signed with the old literal must return 401.

### 1.4 Dashboard has no server-side auth guard
**Files:** create `middleware.ts` at the repo root; `app/admin/dashboard/page.tsx` keeps its
client check as UX only.

**Problem:** the only guard is a `useEffect`; `curl /admin/dashboard` with no cookie returns
200 and ships the dashboard shell. No `middleware.ts` exists.

**Fix:** add middleware that verifies the session cookie for `/admin/dashboard` (and any
future protected admin route) and redirects to `/admin` when absent/invalid.

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/dashboard/:path*"] };
```

Note: `verifySessionToken` uses `crypto` — ensure it runs in the Node.js runtime, not Edge
(add `export const runtime = "nodejs"` in the route/layout if Next selects Edge). Verify the
import works in middleware; if `next/headers` is pulled in transitively, split the pure
verify logic into a headers-free helper.

**Verify:** `curl -i /admin/dashboard` with no cookie returns a 307 redirect to `/admin`.

---

## Phase 2 — High

### 2.1 Session secret is the password hash
Covered structurally by 1.3 — once `SESSION_SECRET` is separate, the password hash is no
longer the signing key. Confirm `getSecret()` no longer references `ADMIN_PASSWORD_HASH`.

### 2.2 No rate limiting on `/api/auth/login`
**File:** `app/api/auth/login/route.ts`.
**Problem:** 100 wrong-password POSTs all return 401, no throttle.
**Fix:** add a simple in-memory fixed-window limiter keyed by client IP
(`request.headers.get("x-forwarded-for")`), e.g. max 5 failed attempts per 15 min → 429.
A module-level `Map` is acceptable for a single-admin site; note it resets on redeploy and
is per-instance. If you prefer durability, note it as a follow-up rather than adding infra.

### 2.3 Username enumeration via timing
**File:** `app/api/auth/login/route.ts` (~line 28, the early return on wrong username).
**Problem:** valid username ~119 ms (bcrypt runs) vs invalid ~10 ms (returns early).
**Fix:** always run a `bcrypt.compare` against a fixed dummy hash on the wrong-username path
so both branches take comparable time, then return the same generic 401.

### 2.4 Token-exhaustion DoS on public content API
**File:** `lib/github.ts` (`listFiles`) and the content GET routes.
**Problem:** `listFiles` makes 1 + N uncached GitHub calls per request (`cache: "no-store"`),
unauthenticated. ~700 requests exhaust the 5000/hr token budget.
**Fix:** cache the list/read responses. Simplest: set `cache` with a revalidate window
(`fetch(url, { next: { revalidate: 300 } })`) instead of `"no-store"`, or wrap the route with
`export const revalidate = 300`. Writes already bust cache via redeploy. Keep write paths
uncached.

### 2.5 No security headers
**File:** `next.config.mjs`.
**Problem:** no CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS.
**Fix:** add an async `headers()` returning these for all routes. Start with:
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
and a `Content-Security-Policy`. Next needs `'unsafe-inline'` for its injected styles; test
the CSP in report-only mode first if unsure, then enforce. Remove `X-Powered-By` via
`poweredByHeader: false`.

### 2.6 `.env` not gitignored
**File:** `.gitignore`. Add `.env`, `.env.local`, `.env*.local`. (Nothing is committed yet —
this is a guard.)

### 2.7 Over-broad GitHub token
**Docs/config, not code.** Recommend scoping the fine-grained PAT to **Contents: read/write on
this repo only** (already the case) and, ideally, restricting writes to the `content/`
directory is not possible with GitHub PAT scopes — so 1.1's path guard is the real mitigation.
Document that the token must never gain `workflows` or broader repo scopes.

---

## Phase 3 — Medium / hardening

- **3.1 Timing-unsafe HMAC compare** — `lib/session.ts:~39`: replace `signature !== expectedSig`
  with `crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))`, guarding for
  equal length first.
- **3.2 Leaky error messages** — every content/auth route returns `err.message` (raw GitHub
  responses). Return a generic `"Internal error"` to the client; `console.error` the detail
  server-side.
- **3.3 No boot/request env validation** — add a small `assertEnv()` checking
  `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO`;
  call it at the top of each API route so misconfiguration fails loudly.
- **3.4 Request body size limit** — reject content POST/PUT bodies over a sane cap (e.g. 256 KB)
  before `request.json()`; check `content-length`.
- **3.5 No session revocation + 7-day lifetime** — shorten `SESSION_DURATION` (e.g. 24h) and,
  optionally, add a `SESSION_VERSION` env var mixed into the payload so bumping it invalidates
  all issued tokens (a poor-man's revocation without a store).
- **3.6 Cookie `Secure` flag** — currently gated on `NODE_ENV === "production"`. Acceptable on
  Vercel, but set `Secure` unconditionally unless running plain-HTTP localhost.
- **3.7 CSRF defence in depth** — `SameSite=lax` blocks the basic attack; add an `Origin`
  header check on state-changing routes rejecting cross-origin requests.
- **3.8 `image` field scheme validation** — in the content POST/PUT handlers, reject any
  `image` value whose scheme is not `https:` (or a repo-relative path).
- **3.9 Commit-message injection** — strip newlines from `title`/`slug` before interpolating
  into commit messages in `lib/github.ts`.
- **3.10 Remove committed `out/`** — delete the tracked `out/` build directory (30 files) and
  add `/out` to `.gitignore`.

## Phase 4 — Dependencies

- **4.1** `npm audit --omit=dev` reports 4 high (Next.js 14.2.35 SSRF/endpoint advisories +
  transitive postcss). Plan a Next.js patch/minor bump and re-audit. Treat as a separate,
  tested change — do not bundle with the code fixes above.

---

## Definition of done

- [ ] Phase 1 complete; the four verifications in 1.1–1.4 pass.
- [ ] `npm run build` and `npm run lint` clean.
- [ ] `SESSION_SECRET` added to Vercel env (tell the owner — you cannot set it).
- [ ] Re-tested items in `SECURITY-CHECKLIST.md` now read PASS.
- [ ] One commit per phase, no secrets committed.

## Items that already PASS (do not "fix" — regression-guard only)
XSS (React escaping, no `dangerouslySetInnerHTML`), YAML/frontmatter injection (gray-matter
block scalars), token tamper-resistance (verify-before-parse), slug-collision overwrite (409
guard), no secrets in git history. Don't change these; just don't regress them.
