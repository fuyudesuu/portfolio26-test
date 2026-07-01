import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listFiles, writeFile, readFile, slugify } from "@/lib/github";

const DIR = "content/hobbies";

/** GET — list all hobbies */
export async function GET() {
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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list hobbies" },
      { status: 500 }
    );
  }
}

/** POST — create a new hobby */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, icon, accentIndex, summary, content, image } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = slugify(title);
    const path = `${DIR}/${slug}.md`;

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

    await writeFile(path, frontmatter, content || "", `Add hobby: ${title}`);

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create hobby" },
      { status: 500 }
    );
  }
}
