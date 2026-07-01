import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readFile, writeFile, deleteFile } from "@/lib/github";

const DIR = "content/events";

/** GET — read a single event */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read event" },
      { status: 500 }
    );
  }
}

/** PUT — update an existing event */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const path = `${DIR}/${slug}.md`;

    const existing = await readFile(path);
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, date, location, type, tags, summary, content, image } = body;

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
      `Update event: ${frontmatter.title}`,
      existing.sha
    );

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update event" },
      { status: 500 }
    );
  }
}

/** DELETE — remove an event */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const path = `${DIR}/${slug}.md`;

    const existing = await readFile(path);
    if (!existing || !existing.sha) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await deleteFile(path, `Delete event: ${slug}`, existing.sha);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete event" },
      { status: 500 }
    );
  }
}
