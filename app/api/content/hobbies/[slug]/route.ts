import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readFile, writeFile, deleteFile } from "@/lib/github";

const DIR = "content/hobbies";

/** GET — read a single hobby */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read hobby" },
      { status: 500 }
    );
  }
}

/** PUT — update an existing hobby */
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
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, icon, accentIndex, summary, content, image } = body;

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
      `Update hobby: ${frontmatter.title}`,
      existing.sha
    );

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update hobby" },
      { status: 500 }
    );
  }
}

/** DELETE — remove a hobby */
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
      return NextResponse.json({ error: "Hobby not found" }, { status: 404 });
    }

    await deleteFile(path, `Delete hobby: ${slug}`, existing.sha);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete hobby" },
      { status: 500 }
    );
  }
}
