import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecret(): string {
  // Use password hash as signing secret — it's already in env vars
  return process.env.ADMIN_PASSWORD_HASH || "fallback-secret-do-not-use";
}

/** Create a signed session token */
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
  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
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
    secure: process.env.NODE_ENV === "production",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
