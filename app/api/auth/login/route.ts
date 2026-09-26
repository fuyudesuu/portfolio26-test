import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, setSessionCookie } from "@/lib/session";

const MAX_FIELD_LENGTH = 200;

// Failed-attempt limiter: fixed window per client IP. In-memory, so it is
// per-instance and resets on redeploy — acceptable for a single-admin site.
const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_TRACKED_IPS = 10_000;
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function pruneExpired(now: number) {
  failedAttempts.forEach((entry, ip) => {
    if (entry.resetAt <= now) failedAttempts.delete(ip);
  });
  // Hard cap: drop oldest entries (Map keeps insertion order)
  for (const ip of Array.from(failedAttempts.keys())) {
    if (failedAttempts.size <= MAX_TRACKED_IPS) break;
    failedAttempts.delete(ip);
  }
}

/** Seconds until the IP may retry, or 0 if not currently blocked */
function retryAfterSeconds(ip: string, now: number): number {
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt <= now) return 0;
  if (entry.count < MAX_FAILED_ATTEMPTS) return 0;
  return Math.ceil((entry.resetAt - now) / 1000);
}

function recordFailure(ip: string, now: number) {
  pruneExpired(now);
  const entry = failedAttempts.get(ip);
  if (entry && entry.resetAt > now) {
    entry.count += 1;
  } else {
    failedAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }
}

function internalError() {
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();

    // Check the limit before any bcrypt work
    const retryAfter = retryAfterSeconds(ip, now);
    if (retryAfter > 0) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { username, password } = (body ?? {}) as Record<string, unknown>;
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username ||
      !password ||
      username.length > MAX_FIELD_LENGTH ||
      password.length > MAX_FIELD_LENGTH
    ) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash || !process.env.SESSION_SECRET) {
      console.error(
        "[login] Missing ADMIN_USERNAME, ADMIN_PASSWORD_HASH or SESSION_SECRET"
      );
      return internalError();
    }

    // Always run bcrypt against the real hash (same cost factor) so a wrong
    // username takes as long as a wrong password
    const usernameValid = username === adminUsername;
    const passwordValid = await bcrypt.compare(password, adminPasswordHash);

    if (!usernameValid || !passwordValid) {
      recordFailure(ip, now);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    failedAttempts.delete(ip);

    // Create session token and set cookie
    const token = createSessionToken(username);
    await setSessionCookie(token);

    return NextResponse.json({ success: true, user: username });
  } catch (err) {
    console.error("[login]", err);
    return internalError();
  }
}
