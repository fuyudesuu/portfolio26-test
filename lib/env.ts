/**
 * Server-side environment validation.
 * Only variable NAMES are ever logged — never their values.
 */

export const REQUIRED_ENV = ["GITHUB_TOKEN", "GITHUB_REPO", "SESSION_SECRET"] as const;

/**
 * Returns true when every required variable is set. Otherwise logs the
 * missing names and returns false so the caller can answer with a generic 500.
 */
export function assertEnv(names: readonly string[] = REQUIRED_ENV): boolean {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(`Missing required environment variable(s): ${missing.join(", ")}`);
    return false;
  }
  return true;
}
