import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "@/lib/github";
import {
  guard,
  readJsonBody,
  hasOptionalStrings,
  isOptionalStringArray,
  isSafeImageValue,
  jsonError,
  internalError,
} from "@/lib/validate";

export const dynamic = "force-dynamic";

const PROFILE_PATH = "content/about/profile.md";
const NOTE_PATH = "content/about/learning.md";

/** GET — read profile + learning note */
export async function GET(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;

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
    return internalError("Failed to read about", err);
  }
}

/** PUT — update profile and/or learning note */
export async function PUT(request: NextRequest) {
  const denied = await guard(request, { write: true });
  if (denied) return denied;

  const parsed = await readJsonBody(request);
  if ("error" in parsed) return parsed.error;
  const body = parsed.body;

  if (!hasOptionalStrings(body, ["name", "title", "tagline", "eyebrow", "photo", "bio", "note"]) || !isOptionalStringArray(body.skills)) {
    return jsonError("Invalid request body", 400);
  }
  if (!isSafeImageValue(body.photo)) {
    return jsonError("Invalid image URL", 400);
  }

  const { name, title, tagline, eyebrow, skills, photo } = body;
  const bio = body.bio as string | null | undefined;
  const note = body.note as string | null | undefined;

  try {
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
    if (note !== undefined && note !== null) {
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
    return internalError("Failed to update about", err);
  }
}
