/**
 * Input validation + shared request guards for the admin content API.
 * Everything that ends up in a GitHub Contents API path, a commit message,
 * or an <img src> goes through one of these checks first.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { assertEnv } from "@/lib/env";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_BODY_BYTES = 256 * 1024;

const CONTENT_PATH_RE = /^content\/[a-z0-9-]+\/[a-z0-9-]+\.md$/;
const CONTENT_DIR_RE = /^content\/[a-z0-9-]+$/;
const MAX_COMMIT_MESSAGE = 200;

/** Lowercase kebab-case, 1–100 chars. Rejects anything that could alter a path or URL. */
export function isValidSlug(s: unknown): s is string {
  return typeof s === "string" && s.length > 0 && s.length <= 100 && SLUG_RE.test(s);
}

function hasUnsafePathChars(path: string): boolean {
  return path.includes("..") || /[?#%]/.test(path);
}

/** Throws unless path looks like "content/<dir>/<slug>.md" */
export function assertContentPath(path: string): void {
  if (typeof path !== "string" || hasUnsafePathChars(path) || !CONTENT_PATH_RE.test(path)) {
    throw new Error("Illegal content path");
  }
}

/** Throws unless dir looks like "content/<dir>" */
export function assertContentDir(dir: string): void {
  if (typeof dir !== "string" || hasUnsafePathChars(dir) || !CONTENT_DIR_RE.test(dir)) {
    throw new Error("Illegal content directory");
  }
}

/** Single line, no control characters, capped length — safe to use as a git commit message */
export function sanitizeCommitMessage(s: unknown): string {
  return String(s ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\s\x00-\x1f\x7f]+/g, " ")
    .trim()
    .slice(0, MAX_COMMIT_MESSAGE);
}

/** Empty, a same-site path ("/images/x.jpg"), or an absolute https: URL */
export function isSafeImageValue(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return true;
  if (typeof v !== "string") return false;
  if (v.startsWith("/")) {
    // "//host" and "/\host" are both treated as protocol-relative by browsers
    return !v.startsWith("//") && !v.startsWith("/\\");
  }
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

/** Origin header must be present and match the host this request was sent to */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const forwarded = request.headers.get("x-forwarded-host");
  const host = (forwarded ? forwarded.split(",")[0] : request.headers.get("host"))
    ?.trim()
    .toLowerCase();
  if (!host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/** Log the real error server-side, return a generic 500 to the client */
export function internalError(context: string, err?: unknown) {
  if (err !== undefined) console.error(context, err);
  else console.error(context);
  return jsonError("Internal error", 500);
}

/**
 * Common checks for every content handler, in order:
 * env → same-origin (writes only) → session.
 * Returns an error response to send, or null when the request may proceed.
 */
export async function guard(
  request: Request,
  { write = false }: { write?: boolean } = {}
): Promise<NextResponse | null> {
  try {
    if (!assertEnv()) return jsonError("Internal error", 500);
    if (write && !isSameOrigin(request)) return jsonError("Forbidden", 403);
    const session = await getSession();
    if (!session) return jsonError("Unauthorized", 401);
    return null;
  } catch (err) {
    return internalError("Request guard failed", err);
  }
}

/**
 * Read a JSON object body with a size cap.
 * 413 when too large, 400 when not valid JSON or not an object.
 */
export async function readJsonBody(
  request: Request
): Promise<{ body: Record<string, unknown> } | { error: NextResponse }> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { error: jsonError("Request body too large", 413) };
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return { error: jsonError("Invalid request body", 400) };
  }
  // content-length may be absent (chunked) or wrong, so check what was actually sent
  if (Buffer.byteLength(text, "utf-8") > MAX_BODY_BYTES) {
    return { error: jsonError("Request body too large", 413) };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: jsonError("Invalid JSON", 400) };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { error: jsonError("Invalid request body", 400) };
  }
  return { body: parsed as Record<string, unknown> };
}

/** True when every listed field is absent/null or a string */
export function hasOptionalStrings(body: Record<string, unknown>, fields: string[]): boolean {
  return fields.every((f) => body[f] === undefined || body[f] === null || typeof body[f] === "string");
}
