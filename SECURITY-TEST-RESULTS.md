# Security Test Results — portfolio26-test

**Scope:** Owner-requested assessment of the owner's own Next.js 14 App Router site.
**Method:** Static code analysis + dynamic testing against a locally-run dev server
(`next dev`) with **dummy** env vars and a `globalThis.fetch` interceptor that logs
and stubs every `api.github.com` call. No real GitHub token was used; `GITHUB_REPO`
was set to `example/nonexistent-test-repo`; no request ever reached github.com.
Path-traversal and write findings are proven by the **constructed outbound URL**
captured by the interceptor, never by a real API call.

**Test date:** 2026-08-25 · **Branch:** `claude/blog-security-checklist-6emoqz`

Dummy credentials used: `ADMIN_USERNAME=admin`, password `correct-horse-battery-staple`,
`ADMIN_PASSWORD_HASH=$2b$10$68AL.iRXC/MOZPqTMCxV4e4MkhPd7b11Qh.32m/7ylXl7LkUq97VO`.

---

## Results table

| ID | Sev | Verdict | Evidence |
|----|-----|---------|----------|
| A1 | — | **PASS** | `grep -rE "query\(|execute\(|knex|prisma|sequelize|pg|mysql|sqlite|SELECT|UNION" app lib components` → no SQL sink. SQLi is formally N/A; the injection surface is path traversal (see A2–A5). |
| A2 | C | **VULNERABLE** | URL-encoded traversal in the GET `[slug]` route reaches the handler **decoded** and builds an escaping GitHub path. `GET /api/content/events/..%2F..%2Fcontent%2Fabout%2Fprofile` → HTTP 200, outbound URL `.../contents/content/events/../../content/about/profile.md?ref=main`. Same with `%2e%2e%2f`: `GET /api/content/events/%2e%2e%2f%2e%2e%2fcontent%2fabout%2fprofile` → outbound `.../content/events/../../content/about/profile.md`. **Framework note (empirical):** a *literal* `../..` (`GET /api/content/events/../../content/about/profile`) is collapsed by dot-segment normalization → HTTP 404, **no outbound call**. **Double-encoded** `%252e%252e%252f` is decoded only once → literal `%2e%2e%2f` in the path (`.../events/%2e%2e%2f...md`) which does **not** traverse on GitHub. Working vector = single URL-encoding of the slashes/dots. Root cause: no allowlist on `slug` (A6). |
| A3 | C | **VULNERABLE** | Authenticated PUT with encoded traversal writes an arbitrary repo path. `PUT /api/content/events/..%2F..%2Fapp%2Fpage` with a full event body → HTTP 200 `{"success":true,"slug":"../../app/page"}`; captured outbound **`PUT .../contents/content/events/../../app/page.md`** with base64 body `LS0t...UFdORUQgQk9EWQo=` (decodes to the attacker markdown incl. `PWNED BODY`). Reaches `writeFile` with the escaped path — arbitrary file overwrite (e.g. `app/`, workflows, `package.json` → deploy-time RCE, see D3). |
| A4 | C | **VULNERABLE** | Authenticated DELETE with encoded traversal deletes an arbitrary repo path. `DELETE /api/content/hobbies/..%2F..%2Fpackage` → HTTP 200 `{"success":true}`; captured outbound `GET .../contents/content/hobbies/../../package.md` then **`DELETE .../contents/content/hobbies/../../package.md`** with body `{"message":"Delete hobby...","sha":"stubsha","branch":"main"}`. Reaches `deleteFile` on the escaped path. |
| A5 | H | **VULNERABLE** | An encoded `?`/`&` in the slug splits the constructed URL and lets the attacker control `?ref=`. `GET /api/content/events/x%3Fref%3Devil-branch%26z%3D` → outbound `.../contents/content/events/x?ref=evil-branch&z=.md?ref=main` — the attacker's `ref=evil-branch` becomes the first (effective) query param, and the intended `.md?ref=main` is pushed into the query string. Encoded `#` (`x%23`) truncates: `.../events/x#.md?ref=main`. The `slug` is neither validated nor re-encoded before string-concatenation in `lib/github.ts`. |
| A6 | M | **VULNERABLE** | No allowlist guard on the incoming `slug`. The only regex in the codebase is inside `slugify()` (`lib/github.ts:139`, applied to a POST *title* → slug), never to the `[slug]` route param. `readFile`/`writeFile`/`deleteFile` receive `` `${DIR}/${slug}.md` `` with `slug` unvalidated. This is the root cause of A2–A5. |
| A7 | M | **PASS (mitigated by gray-matter/js-yaml)** | Harness: `matter.stringify(body, {title:"Legit Title\n---\nadmin: true\ninjected: pwned\n", ...})`. Output serializes the title as a YAML block scalar (`title: |`), and re-parsing yields frontmatter keys `[title,date,location,type,tags,summary,image]` only — `admin`/`injected` are **not** present. No new top-level YAML keys can be injected. |
| A8 | M | **VULNERABLE (low)** | Commit message is `` `Add event: ${title}` `` / `` `Delete event: ${slug}` `` with no sanitization. Harness for `title="Release\nMerge branch master\nrm -rf"` yields the literal message `"Add event: Release\nMerge branch master\nrm -rf"` — newlines pass straight into the GitHub commit message (commit-log injection / multi-line message spoofing). Impact limited to commit history cosmetics. |
| A9 | L | **PASS** | No `dangerouslySetInnerHTML` anywhere in `app/`, `components/`, `lib/`. Content is rendered as `{ev.content}` / `{h.content}` (`EventsPageClient.tsx:80`, `HobbiesPageClient.tsx:45`) — React escapes it as text. No markdown-to-HTML step. `<img src=x onerror=...>` would render as inert escaped text. |
| A10 | M | **VULNERABLE (low, no scheme validation)** | `image` is placed in `<Image src={h.image} ... unoptimized/>` (`HobbiesPageClient.tsx:33`) with **no** scheme allowlist. A `javascript:` URL is inert in an `<img>` src (does not execute), but `data:` and arbitrary external hosts are accepted (privacy/exfil pixel). Only settable by an authenticated admin, so real impact is low. Fails the "non-http(s) schemes rejected" criterion. |
| B1 | C | **VULNERABLE (confirmed end-to-end)** | With `ADMIN_PASSWORD_HASH` **unset** the app starts and `getSecret()` returns the literal `"fallback-secret-do-not-use"`. Forged token = `base64url({"user":"attacker","exp":...})` + HMAC-SHA256 over it keyed with that literal string. `GET /api/auth/session` with the forged cookie → **HTTP 200 `{"authenticated":true,"user":"attacker"}`**. A write route with the forged cookie passed the auth gate and reached GitHub: `DELETE /api/content/events/react-summit-2026` → HTTP 200, captured outbound `DELETE .../contents/content/events/react-summit-2026.md`. Control (no cookie) → 401. Full account takeover whenever the hash env var is missing. |
| B2 | H | **VULNERABLE** | `getSecret()` returns `process.env.ADMIN_PASSWORD_HASH` as the HMAC signing key (`lib/session.ts:7-10`). One leaked env var yields **both** offline bcrypt cracking **and** direct session forgery. Demonstrated: a token HMAC'd with the known hash value is accepted (`{"authenticated":true,"user":"admin"}`). No independent `SESSION_SECRET`. |
| B3 | H | **VULNERABLE** | 100 rapid wrong-password POSTs to `/api/auth/login` (username `admin`): all **100 → HTTP 401**, zero `429`, no lockout, no delay growth. No rate limiting or account lockout of any kind. |
| B4 | M | **VULNERABLE** | Username-enumeration timing oracle. 50 samples each, `curl -w %{time_total}`: **valid** username (`admin`, wrong pw, bcrypt runs) mean **119.40 ms** / median 117.36 ms; **invalid** username (`nobodyxyz`, returns before bcrypt at `login/route.ts:28`) mean **9.92 ms** / median 9.56 ms. **Mean diff ≈ 109 ms, median diff ≈ 108 ms** — trivially observable. No dummy compare on the miss path. |
| B5 | M | **VULNERABLE** | `session.ts:39` compares HMACs with `signature !== expectedSig` — non-constant-time. Should use `crypto.timingSafeEqual`. (Remote exploitability of a base64url hash compare is low, but the primitive is timing-unsafe as flagged.) |
| B6 | H | **VULNERABLE** | Auth guard is client-side only (`app/admin/dashboard/page.tsx` `useEffect` → `/api/auth/session`); there is no `middleware.ts`. `curl /admin/dashboard` with no cookie → **HTTP 200** and ships the dashboard markup/shell (`Loading dashboard...`) plus all Manager JS bundles. No server-side redirect/401 before markup. (Content itself is fetched client-side and that fetch is 401-gated, so no data leak — but there is no server-side route guard.) |
| B7 | M | **VULNERABLE** | No session revocation. Logout only clears the cookie (`clearSessionCookie`); tokens are stateless. Captured a valid token, `POST /api/auth/logout`, then replayed the same token → `GET /api/auth/session` = **`{"authenticated":true,"user":"admin"}`**. A stolen token stays valid its full 7 days. |
| B8 | M | **VULNERABLE** | `SESSION_DURATION = 60*60*24*7` (7 days), no idle timeout, no rotation (`lib/session.ts:5,16`). Combined with B7 (no revocation), a captured token is valid for a week. |
| B9 | L | **PASS** | Tamper matrix against `/api/auth/session` (secret = the known hash): valid token → 200 authenticated; **all** forgeries → 401 `{"authenticated":false}`: bit-flipped payload, stripped signature, empty signature, wrong-key signature, junk signature. `verifySessionToken` rejects every tampered/forged token. (The weaknesses are the *secret* itself — B1/B2 — not the verify logic.) |
| B10 | L | **PASS** | Order is verify-then-parse: signature is checked at `session.ts:39` **before** `JSON.parse`/`exp` at `session.ts:42-43`. A future-`exp` payload with a bad signature is rejected at the signature step (confirmed in B9). Regression guard holds. |
| B11 | M | **MITIGATED (SameSite=lax only; no server-side check)** | No `Origin`/`Referer`/CSRF-token check anywhere in `app/`/`lib/`. Cross-origin `DELETE /api/content/events/react-summit-2026` with a valid cookie and `Origin: https://evil.example.com` → **HTTP 200** (server acts regardless of Origin). Real CSRF is blocked by the browser via the cookie's `SameSite=lax`, but there is no server-side defense-in-depth and no protection against same-site/subdomain attacks. |
| B12 | L | **VULNERABLE (low)** | With env unset, `POST /api/auth/login` → `{"error":"Admin credentials not configured"}` (HTTP 500) — leaks configuration state to the client (`login/route.ts:21`). Should be a generic error. |
| C1 | H | **PASS (intentional public read)** | Unauthenticated `GET /api/content/events` / `/hobbies` / `/about` return content (by design for a public site). The `[slug]` GET spreads `...file.frontmatter` and also returns `sha` — harmless but it echoes the whole frontmatter. No credential/private field exposure observed. Acceptable, but see C2 for the amplification risk on these same endpoints. |
| C2 | H | **VULNERABLE** | `listFiles()` (`lib/github.ts:38-56`) does **1 directory call + 1 `readFile` per file**, all `cache:"no-store"`, unauthenticated. One `GET /api/content/events` against a 6-file stub produced **7 outbound GitHub calls** (`grep -c '"url"'` = 7): 1 listing + `a.md`…`f.md`. **Amplification = N+1** (≈ requests × (files+1)). With GitHub's 5000/hr token budget, ~700 unauthenticated list requests exhaust it → content API DoS. No caching, no rate limit. |
| C3 | M | **PASS** | Every write method with no cookie → 401: `POST /events`, `POST /hobbies`, `PUT /about`, `PUT/DELETE /events/x`, `PUT/DELETE /hobbies/x` all returned **401**. |
| C4 | M | **MITIGATED (optimistic concurrency via `sha`)** | Not exercised against the real API, but by code: each write re-reads the file for its `sha` and passes it to the GitHub Contents API, which rejects a stale `sha` with 409. Two concurrent PUTs → the loser gets a GitHub 409, surfaced (as a 500 with `err.message`, see D4) rather than silently clobbered. A small read→write race window exists but a lost update is not silent. |
| C5 | M | **VULNERABLE** | No request-body size or field-length limit. An authenticated `POST /api/content/events` with a **10 MB** body was fully read and `request.json()`-parsed (reached the 409 existing-title check; `len_sent 10485825`). No 413, no cap. Next 14 route handlers impose no default body limit; a large body is buffered into memory. |
| C6 | L | **PASS** | `slugify()` collisions confirmed (`"Hello World"`, `"Hello... World!"`, `"HELLO   world"` all → `hello-world`), but POST guards with a `readFile` existence check → **409** "already exists" before writing. Collision is detected, not silently overwritten. Regression guard holds. |
| D1 | C | **PASS** | Scanned all 39 commits (`git log -p --all`). No `ghp_`/`github_pat_` tokens, no real `$2a/$2b/$2y` bcrypt hashes, no `.env` files ever committed. The only matches are documentation placeholders in a markdown doc (`ADMIN_PASSWORD_HASH = (the bcrypt hash from step 6a)`). Working tree and history are clean of live secrets. |
| D2 | H | **VULNERABLE** | `.gitignore` = `/node_modules`, `/.next`, `/tsconfig.tsbuildinfo`, `npm-debug.log*`, `.DS_Store`. **`.env` / `.env.local` are NOT ignored.** A future local env file holding the real token/hash could be committed by accident. (None committed yet — D1 — but the guard is missing.) |
| D3 | H | **VULNERABLE (design)** | The server token is documented as `Contents: read and write` on the whole repo. Combined with the **confirmed** traversal writes/deletes (A3/A4), an authenticated attacker can overwrite `app/`, CI workflow files, or `package.json`; a commit auto-deploys on Vercel → build/deploy-time RCE. Token is not scoped to a content-only path/branch. Blocking A3/A4 is the mitigation. |
| D4 | M | **VULNERABLE** | Every route catch returns `err.message` to the client. `lib/github.ts` throws `` `GitHub write failed: ${res.status} ${err}` `` (raw GitHub response body) and `GitHub read/list failed: ${status}`. Demonstrated leak: the A5 malformed-slug request returned the raw internal error `{"error":"The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined"}` (HTTP 500) to the client. Upstream/internal detail should be server-side only. |
| D5 | M | **VULNERABLE** | No boot-time env validation. With `ADMIN_PASSWORD_HASH` unset the app started and served requests, silently using the insecure fallback secret (see B1). `getConfig()` / login only throw at request time. No fail-fast. |
| D6 | L | **PASS** | No `NEXT_PUBLIC_*` usage in `app/`/`lib/`/`components/`. Nothing sensitive exposed to the client bundle. |
| D7 | M | **VULNERABLE (hygiene)** | `out/` (a stale static-export build) is committed — **30 tracked files** (`git ls-files out/`). Scanned for secrets: none found. Stale/unnecessary in a server-rendered app; should be removed and gitignored. |
| D8 | L | **PASS** | `generate-password-hash.js` (referenced by `NEXT-SESSION.md`) is absent from the working tree and never appears in git history. |
| E1 | H | **VULNERABLE** | No security headers. `next.config.mjs` defines no `headers()`, and there is no middleware. Response headers on `/` and `/api/*` contain **none** of CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`. Only `X-Powered-By: Next.js` (version info disclosure) is added. |
| E2 | M | **VULNERABLE** | No Content-Security-Policy (subset of E1). An injected script would run unconstrained. (React escaping — A9 — is the only current defense against injected markup.) |
| E3 | M | **VULNERABLE (low)** | Cookie `secure` is `process.env.NODE_ENV === "production"` (`session.ts:55,79`). Observed dev `Set-Cookie: ... HttpOnly; SameSite=lax` with **no `Secure`**. Correct on Vercel prod (which sets `NODE_ENV=production`), but any HTTP preview/self-host ships a non-Secure session cookie. `HttpOnly` and `SameSite=lax` are correctly present. |
| E4 | M | **VULNERABLE** | Clickjacking: no `X-Frame-Options`/`frame-ancestors` (subset of E1), so `/admin` login can be framed by any origin. |
| E5 | L | **VULNERABLE** | `npm audit --omit=dev` → **4 high, 0 critical** (`{"high":4,"critical":0,"total":4}`). Next.js 14.2.35 advisories (SSRF via rewrites GHSA-p9j2-gv94-2wf4, unauthenticated Server-Function endpoint disclosure GHSA-955p-x3mx-jcvp, unbounded Server-Action payload GHSA-4c39-4ccg-62r3) and transitive postcss `<=8.5.22` (source-map path traversal / XSS). Fix requires a Next major bump. |
| E6 | L | **PASS (conditional)** | No `robots.txt`/`sitemap` route and `/admin` is not linked, so it is only "security by obscurity." Acceptable **only** because it is not; B3 (no rate limit) and B6 (no server guard) both fail, so `/admin` is effectively an unthrottled, discoverable attack surface. Treat as not-acceptable until B3/B6 are fixed. |

---

## Verdict summary (42 items: A1–A10, B1–B12, C1–C6, D1–D8, E1–E6)

- **VULNERABLE: 28** — A2, A3, A4, A5, A6, A8, A10, B1, B2, B3, B4, B5, B6, B7, B8, B12, C2, C5, D2, D3, D4, D5, D7, E1, E2, E3, E4, E5
- **PASS: 12** — A1, A7, A9, B9, B10, C1, C3, C6, D1, D6, D8, E6
- **MITIGATED: 2** — B11, C4
- **NOT-TESTED: 0**

## Confirmed exploitable, in severity order

**Critical**
1. **B1 — Fallback signing secret → full auth bypass.** Proven end-to-end: with `ADMIN_PASSWORD_HASH` unset, a token forged with the literal `"fallback-secret-do-not-use"` yields `authenticated:true` and passes write routes (DELETE reached GitHub). This is the single highest-value finding.
2. **A2 — Path-traversal read** (arbitrary repo file via `..%2F..%2F`), outbound URL confirmed.
3. **A3 — Path-traversal write** (authenticated `PUT` overwrites arbitrary repo file, e.g. `app/page.md`), outbound `PUT` + payload confirmed.
4. **A4 — Path-traversal delete** (authenticated `DELETE` removes arbitrary repo file), outbound `DELETE` confirmed.
   - A3/A4 + **D3** (broad `Contents: write` token) chain to deploy-time RCE on Vercel.

**High**
5. **A5 — Query injection into the GitHub call** — attacker controls `?ref=<branch>` via an encoded `?`/`&` in the slug.
6. **B3 — No login rate limiting** — 100/100 attempts returned 401, no throttle.
7. **B6 — Dashboard guard is client-side only** — no `middleware.ts`; `/admin/dashboard` returns 200 markup unauthenticated.
8. **C2 — Token-exhaustion DoS** — N+1 outbound calls per content request (7 calls / 6 files), uncached, unauthenticated.
9. **E1 — No security headers** (CSP / XFO / nosniff / Referrer-Policy / HSTS all absent).

**Medium (confirmed)**
10. **B4 — Username enumeration by timing** — ~108 ms mean/median gap (119 ms valid vs 10 ms invalid).
11. **B7 — No session revocation** — token replays after logout.
12. **C5 — No body-size limit** — 10 MB body parsed without a 413.
13. **D2 — `.env` not gitignored**, **D4 — upstream error leakage to client**, **D5 — no boot env validation**.

---

## Prioritized remediation

1. **Kill the fallback secret and split it from the password hash (B1, B2, D5).** Require a dedicated `SESSION_SECRET` (≥32 random bytes) and a separate `ADMIN_PASSWORD_HASH`; validate all required env vars at boot and refuse to start if any are missing. Never fall back to a literal string.
2. **Add a strict `slug` allowlist on every content route (A2–A6).** Reject anything not matching `^[a-z0-9-]+$` *before* it reaches `readFile`/`writeFile`/`deleteFile`, and additionally `path.posix.normalize` + verify the final path stays within `content/<section>/`. This closes the traversal read/write/delete and the `?ref=` query injection in one place.
3. **Add `middleware.ts` (B6, C3 defense-in-depth, E1, E4, B11).** Server-side guard on `/admin/**` and write methods of `/api/content/**` (verify the session cookie, redirect/401 before any markup). In the same middleware (or `next.config` `headers()`) set CSP, `X-Frame-Options: DENY`/`frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and HSTS, and add an `Origin` check on state-changing requests.
4. **Scope the GitHub token (D3).** Restrict to a content-only path/branch (or a fine-grained token limited to the content directory) so even a bypass cannot touch `app/`, workflows, or `package.json`.
5. **Rate-limit `/api/auth/login` and add a constant-time miss path (B3, B4, B5).** Lockout/backoff per IP+username; run a dummy `bcrypt.compare` when the username is unknown; use `crypto.timingSafeEqual` for the HMAC compare.
6. **Cache/limit the content GET path (C2, C5).** Cache `listFiles` results (or use the tree API / a single call), rate-limit unauthenticated reads, and cap request body size (413 over a few hundred KB).
7. **Session hygiene (B7, B8, E3).** Shorten lifetime, add rotation, make the cookie always `Secure`; if revocation matters, add a server-side token version/nonce.
8. **Config & dependency hygiene (D2, D4, D7, E5).** Add `.env*` to `.gitignore`; return generic client errors and log detail server-side; remove the committed `out/` build; plan the Next.js upgrade to clear the 4 high-severity advisories.

---

*All dynamic evidence was produced against a local `next dev` instance with a
fetch interceptor; no request reached github.com and no real token was used.
Findings marked PASS/MITIGATED were confirmed empirically where a running test
was feasible, and by code inspection where noted (C4, D3, B8).*
