import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, deleteFile } from "@/lib/github";
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

/** GET — read a single hobby */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await guard(request);
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) {
    return jsonError("Invalid slug", 400);
  }

  try {
    const file = await readFile(`${DIR}/${slug}.md`);
    if (!file) {
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 });
    }
    return NextResponse.json({
      slug: file.slug,
      ...file.frontmatter,
      content: file.body,
      sha: file.sha,
    });
  } catch (err) {
    return internalError("Failed to read hobby", err);
  }
}

/** PUT — update an existing hobby */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await guard(request, { write: true });
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) {
    return jsonError("Invalid slug", 400);
  }

  const parsed = await readJsonBody(request);
  if ("error" in parsed) return parsed.error;
  const body = parsed.body;

  if (!hasOptionalStrings(body, ["title", "icon", "summary", "content", "image"]) || !isOptionalAccentIndex(body.accentIndex)) {
    return jsonError("Invalid request body", 400);
  }
  if (!isSafeImageValue(body.image)) {
    return jsonError("Invalid image URL", 400);
  }
  const { title, icon, accentIndex, summary, image } = body;
  const content = body.content as string | null | undefined;

  try {
    const path = `${DIR}/${slug}.md`;

    const existing = await readFile(path);
    if (!existing) {
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 });
    }

    const frontmatter = {
      title: title ?? existing.frontmatter.title,
      icon: icon ?? existing.frontmatter.icon,
      accentIndex: accentIndex ?? existing.frontmatter.accentIndex,
      summary: summary ?? existing.frontmatter.summary,
      image: image ?? existing.frontmatter.image,
    };

    await writeFile(
      path,
      frontmatter,
      content ?? existing.body,
      sanitizeCommitMessage(`Update hobby: ${frontmatter.title}`),
      existing.sha
    );

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return internalError("Failed to update hobby", err);
  }
}

/** DELETE — remove a hobby */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await guard(request, { write: true });
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) {
    return jsonError("Invalid slug", 400);
  }

  try {
    const path = `${DIR}/${slug}.md`;

    const existing = await readFile(path);
    if (!existing || !existing.sha) {
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 });
    }

    await deleteFile(path, sanitizeCommitMessage(`Delete hobby: ${slug}`), existing.sha);

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError("Failed to delete hobby", err);
  }
}
