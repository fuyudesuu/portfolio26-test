import { NextRequest, NextResponse } from "next/server";
import { listFiles, writeFile, readFile, slugify } from "@/lib/github";
import {
  guard,
  readJsonBody,
  hasOptionalStrings,
  isOptionalAccentIndex,
  isSafeImageValue,
  isValidSlug,
  sanitizeCommitMessage,
  jsonError,
  internalError,
} from "@/lib/validate";

export const dynamic = "force-dynamic";

const DIR = "content/hobbies";

/** GET — list all hobbies */
export async function GET(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;

  try {
    const files = await listFiles(DIR);
    const hobbies = files.map((f) => ({
      slug: f.slug,
      title: f.frontmatter.title || "",
      icon: f.frontmatter.icon || "Code2",
      accentIndex: f.frontmatter.accentIndex || 1,
      summary: f.frontmatter.summary || "",
      image: f.frontmatter.image || "",
      content: f.body,
    }));
    return NextResponse.json({ hobbies });
  } catch (err) {
    return internalError("Failed to list hobbies", err);
  }
}

/** POST — create a new hobby */
export async function POST(request: NextRequest) {
  const denied = await guard(request, { write: true });
  if (denied) return denied;

  const parsed = await readJsonBody(request);
  if ("error" in parsed) return parsed.error;
  const body = parsed.body;

  if (!hasOptionalStrings(body, ["title", "icon", "summary", "content", "image"]) || !isOptionalAccentIndex(body.accentIndex)) {
    return jsonError("Invalid request body", 400);
  }
  const { icon, accentIndex, summary, image } = body;
  const title = body.title as string | null | undefined;
  const content = body.content as string | null | undefined;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!isSafeImageValue(image)) {
    return jsonError("Invalid image URL", 400);
  }

  const slug = slugify(title);
  if (!isValidSlug(slug)) {
    return jsonError("Title must contain at least one letter or number", 400);
  }
  const path = `${DIR}/${slug}.md`;

  try {
    const existing = await readFile(path);
    if (existing) {
      return NextResponse.json(
        { error: "A hobby with this title already exists" },
        { status: 409 }
      );
    }

    const frontmatter = {
      title,
      icon: icon || "Code2",
      accentIndex: accentIndex || 1,
      summary: summary || "",
      image: image || "",
    };

    await writeFile(path, frontmatter, content || "", sanitizeCommitMessage(`Add hobby: ${title}`));

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return internalError("Failed to create hobby", err);
  }
}
