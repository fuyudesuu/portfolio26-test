import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listFiles, writeFile, readFile, slugify } from "@/lib/github";

const DIR = "content/events";

/** GET — list all events */
export async function GET() {
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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list events" },
      { status: 500 }
    );
  }
}

/** POST — create a new event */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, date, location, type, tags, summary, content, image } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const path = `${DIR}/${slug}.md`;

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

    await writeFile(path, frontmatter, content || "", `Add event: ${title}`);

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create event" },
      { status: 500 }
    );
  }
}
