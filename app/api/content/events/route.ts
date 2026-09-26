import { NextRequest, NextResponse } from "next/server";
import { listFiles, writeFile, readFile, slugify } from "@/lib/github";
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

/** GET — list all events */
export async function GET(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;

  try {
    const files = await listFiles(DIR);
    const events = files.map((f) => ({
      slug: f.slug,
      title: f.frontmatter.title || "",
      date: f.frontmatter.date ? String(f.frontmatter.date).split("T")[0] : "",
      location: f.frontmatter.location || "",
      type: f.frontmatter.type || "attendee",
      tags: f.frontmatter.tags || [],
      summary: f.frontmatter.summary || "",
      image: f.frontmatter.image || "",
      content: f.body,
    }));
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json({ events });
  } catch (err) {
    return internalError("Failed to list events", err);
  }
}

/** POST — create a new event */
export async function POST(request: NextRequest) {
  const denied = await guard(request, { write: true });
  if (denied) return denied;

  const parsed = await readJsonBody(request);
  if ("error" in parsed) return parsed.error;
  const body = parsed.body;

  if (!hasOptionalStrings(body, ["title", "date", "location", "type", "summary", "content", "image"]) || !isOptionalStringArray(body.tags)) {
    return jsonError("Invalid request body", 400);
  }
  const { location, type, tags, summary, image } = body;
  const title = body.title as string | null | undefined;
  const date = body.date as string | null | undefined;
  const content = body.content as string | null | undefined;

  if (!title || !date) {
    return NextResponse.json(
      { error: "Title and date are required" },
      { status: 400 }
    );
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
    // Prevent overwriting an existing event
    const existing = await readFile(path);
    if (existing) {
      return NextResponse.json(
        { error: "An event with this title already exists" },
        { status: 409 }
      );
    }

    const frontmatter = {
      title,
      date,
      location: location || "",
      type: type || "attendee",
      tags: tags || [],
      summary: summary || "",
      image: image || "",
    };

    await writeFile(path, frontmatter, content || "", sanitizeCommitMessage(`Add event: ${title}`));

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return internalError("Failed to create event", err);
  }
}
