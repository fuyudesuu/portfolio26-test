# Security

## Required environment variables

See `.env.example`. Set these in Vercel (Project > Settings > Environment Variables):

| Variable | Notes |
| --- | --- |
| `ADMIN_USERNAME` | Admin login name |
| `ADMIN_PASSWORD_HASH` | bcrypt hash (see `.env.example` for the generate command) |
| `SESSION_SECRET` | Random, >= 32 chars (`openssl rand -base64 32`), distinct from the password hash |
| `GITHUB_TOKEN` | Fine-grained PAT, scoped as below |
| `GITHUB_REPO` | `owner/name` |
| `GITHUB_BRANCH` | Optional, defaults to `main` |

**Before deploying:** the owner must add `SESSION_SECRET` in Vercel. Without it, admin login
fails closed (no sessions can be issued).

## GitHub token scope

- Use a **fine-grained** personal access token limited to **this repository only**.
- Permissions: **Contents: read and write**. Nothing else.
- Never grant `workflows`, administration, or any org/account-wide scope.
- PATs cannot be restricted to a directory. The path guard in `lib/github.ts` is what keeps
  writes inside `content/`; do not remove or loosen it.

## Security headers

CSP, HSTS, frame, referrer and permissions headers are set in `next.config.mjs` (`headers()`).
Adding a new external script, font, or image host requires updating the CSP there.

## Reporting a vulnerability

Open a private security advisory on this repository (Security > Advisories > Report a vulnerability).
