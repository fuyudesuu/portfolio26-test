/**
 * GitHub Contents API helper.
 * Reads, creates, updates, and deletes markdown files in the repo.
 * Uses GITHUB_TOKEN (server-side only, never exposed to browser).
 * Each write creates a commit, which triggers a Vercel redeploy.
 */

import matter from "gray-matter";
import {
  assertContentDir,
  assertContentPath,
  isValidSlug,
  sanitizeCommitMessage,
} from "@/lib/validate";

const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "fuyudesuu/portfolio26-test"
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO must be configured");
  }
  return { token, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

/** Log the upstream response body server-side only; the thrown error carries just the status */
async function upstreamError(action: string, res: Response): Promise<Error> {
  const detail = await res.text().catch(() => "");
  console.error(`GitHub ${action} failed: ${res.status}`, detail.slice(0, 1000));
  return new Error(`GitHub ${action} failed: ${res.status}`);
}

export type ContentFile = {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  sha?: string; // needed for updates/deletes
};

/** List all markdown files in a content directory (e.g. "content/events") */
export async function listFiles(dir: string): Promise<ContentFile[]> {
  assertContentDir(dir);
  const { token, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${repo}/contents/${dir}?ref=${branch}`;

  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) return [];
  if (!res.ok) throw await upstreamError("list", res);

  const items = (await res.json()) as Array<{ name: string; type: string }>;
  const mdFiles = items.filter((i) => i.type === "file" && i.name.endsWith(".md"));

  const results: ContentFile[] = [];
  for (const file of mdFiles) {
    const slug = file.name.replace(/\.md$/, "");
    if (!isValidSlug(slug)) {
      console.warn(`Skipping content file with invalid name: ${dir}/${file.name}`);
      continue;
    }
    const content = await readFile(`${dir}/${slug}.md`);
    if (content) results.push({ ...content, slug });
  }
  return results;
}

/** Read a single file's content and parse frontmatter */
export async function readFile(path: string): Promise<ContentFile | null> {
  assertContentPath(path);
  const { token, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${branch}`;

  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw await upstreamError("read", res);

  const data = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const { data: frontmatter, content: body } = matter(decoded);

  const slug = path.split("/").pop()!.replace(".md", "");
  return { slug, frontmatter, body: body.trim(), sha: data.sha };
}

/** Build a markdown file string from frontmatter + body */
export function buildMarkdown(frontmatter: Record<string, unknown>, body: string): string {
  return matter.stringify(body, frontmatter);
}

/** Create or update a markdown file (commits to the repo) */
export async function writeFile(
  path: string,
  frontmatter: Record<string, unknown>,
  body: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  assertContentPath(path);
  const { token, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}`;

  const markdown = buildMarkdown(frontmatter, body);
  const encoded = Buffer.from(markdown, "utf-8").toString("base64");

  const payload: Record<string, unknown> = {
    message: sanitizeCommitMessage(commitMessage),
    content: encoded,
    branch,
  };
  if (sha) payload.sha = sha; // required when updating existing files

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await upstreamError("write", res);
}

/** Delete a markdown file (commits the deletion) */
export async function deleteFile(
  path: string,
  commitMessage: string,
  sha: string
): Promise<void> {
  assertContentPath(path);
  const { token, repo, branch } = getConfig();
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(token),
    body: JSON.stringify({ message: sanitizeCommitMessage(commitMessage), sha, branch }),
  });

  if (!res.ok) throw await upstreamError("delete", res);
}

/** Convert a title into a URL-safe slug (callers still check it with isValidSlug) */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-+|-+$/g, "");
}
