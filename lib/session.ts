import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

// Secure everywhere except `next dev` (plain-http localhost, where a Secure
// cookie would not be stored). Any other NODE_ENV, including unset, is secure.
const COOKIE_SECURE = process.env.NODE_ENV !== "development";

/** Dedicated HMAC signing key — throws rather than ever falling back */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is not configured (min 32 chars)");
  }
  return secret;
}

/** Create a signed session token (throws if SESSION_SECRET is missing) */
export function createSessionToken(username: string): string {
  const payload = JSON.stringify({
    user: username,
    exp: Date.now() + SESSION_DURATION * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");
  return encoded + "." + signature;
}

/** Verify a session token and return the payload if valid */
export function verifySessionToken(
  token: string
): { user: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;

  // Fail closed: a missing secret means nothing verifies
  let secret: string;
  try {
    secret = getSecret();
  } catch (err) {
    console.error("[session]", err);
    return null;
  }

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(encoded)
    .digest("base64url");

  // Constant-time compare; timingSafeEqual throws on length mismatch
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (typeof payload.user !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

/** Set the session cookie */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

/** Get and verify the current session from cookies */
export async function getSession(): Promise<{ user: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;

  const payload = verifySessionToken(cookie.value);
  if (!payload) return null;

  return { user: payload.user };
}

/** Clear the session cookie */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
