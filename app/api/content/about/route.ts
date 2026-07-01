import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readFile, writeFile } from "@/lib/github";

const PROFILE_PATH = "content/about/profile.md";
const NOTE_PATH = "content/about/learning.md";

/** GET — read profile + learning note */
export async function GET() {
  try {
    const profile = await readFile(PROFILE_PATH);
    const note = await readFile(NOTE_PATH);

    return NextResponse.json({
      profile: profile
        ? { ...profile.frontmatter, bio: profile.body, sha: profile.sha }
        : null,
      note: note ? { content: note.body, sha: note.sha } : null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read about" },
      { status: 500 }
    );
  }
}

/** PUT — update profile and/or learning note */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, title, tagline, eyebrow, skills, photo, bio, note } = body;

    // Update profile.md
    const existingProfile = await readFile(PROFILE_PATH);
    const profileFrontmatter = {
      name: name ?? existingProfile?.frontmatter.name ?? "",
      title: title ?? existingProfile?.frontmatter.title ?? "",
      tagline: tagline ?? existingProfile?.frontmatter.tagline ?? "",
      eyebrow: eyebrow ?? existingProfile?.frontmatter.eyebrow ?? "",
      skills: skills ?? existingProfile?.frontmatter.skills ?? [],
      photo: photo ?? existingProfile?.frontmatter.photo ?? "",
    };

    await writeFile(
      PROFILE_PATH,
      profileFrontmatter,
      bio ?? existingProfile?.body ?? "",
      "Update about profile",
      existingProfile?.sha
    );

    // Update learning.md if a note was provided
    if (note !== undefined) {
      const existingNote = await readFile(NOTE_PATH);
      await writeFile(
        NOTE_PATH,
        { type: "note" },
        note,
        "Update learning note",
        existingNote?.sha
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update about" },
      { status: 500 }
    );
  }
}
