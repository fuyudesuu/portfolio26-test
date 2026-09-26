import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, deleteFile } from "@/lib/github";
import {
  guard,
  readJsonBody,
  hasOptionalStrings,
  isOptionalStringArray,
  isSafeImageValue,
  isValidSlug,
  sanitizeCommitMessage,
  jsonError,
  internalError,
} from "@/lib/validate";

export const dynamic = "force-dynamic";

const DIR = "content/events";

/** GET — read a single event */
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
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({
      slug: file.slug,
      ...file.frontmatter,
      content: file.body,
      sha: file.sha,
    });
  } catch (err) {
    return internalError("Failed to read event", err);
  }
}

/** PUT — update an existing event */
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

  if (!hasOptionalStrings(body, ["title", "date", "location", "type", "summary", "content", "image"]) || !isOptionalStringArray(body.tags)) {
    return jsonError("Invalid request body", 400);
  }
  if (!isSafeImageValue(body.image)) {
    return jsonError("Invalid image URL", 400);
  }
  const { title, date, location, type, tags, summary, image } = body;
  const content = body.content as string | null | undefined;

  try {
    const path = `${DIR}/${slug}.md`;

    const existing = await readFile(path);
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const frontmatter = {
      title: title ?? existing.frontmatter.title,
      date: date ?? existing.frontmatter.date,
      location: location ?? existing.frontmatter.location,
      type: type ?? existing.frontmatter.type,
      tags: tags ?? existing.frontmatter.tags,
      summary: summary ?? existing.frontmatter.summary,
      image: image ?? existing.frontmatter.image,
    };

    await writeFile(
      path,
      frontmatter,
      content ?? existing.body,
      sanitizeCommitMessage(`Update event: ${frontmatter.title}`),
      existing.sha
    );

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return internalError("Failed to update event", err);
  }
}

/** DELETE — remove an event */
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
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await deleteFile(path, sanitizeCommitMessage(`Delete event: ${slug}`), existing.sha);

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError("Failed to delete event", err);
  }
}
