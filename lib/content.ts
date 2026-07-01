import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Code2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Camera, Music, Bike } from "lucide-react";
import type { EventType } from "./constants";

export type { EventType } from "./constants";
export { ACCENT_COLORS, EVENT_BADGE_CONFIG } from "./constants";

const contentDir = path.join(process.cwd(), "content");

const ICON_MAP: Record<string, LucideIcon> = { Camera, Music, Code2, Bike };

/* ═══ EVENTS ═══ */
export type PortfolioEvent = {
  slug: string; title: string; date: string; location: string;
  type: EventType; tags: string[]; summary: string; image: string; content: string;
};

export function getEvents(): PortfolioEvent[] {
  const dir = path.join(contentDir, "events");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const events = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: file.replace(".md", ""),
      title: data.title || "", date: data.date ? String(data.date).split("T")[0] : "",
      location: data.location || "", type: (data.type || "attendee") as EventType,
      tags: data.tags || [], summary: data.summary || "",
      image: data.image || "", content: content.trim(),
    };
  });
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return events;
}

/* ═══ HOBBIES ═══ */
export type Hobby = {
  slug: string; title: string; icon: LucideIcon; iconName: string;
  accentIndex: number; summary: string; image: string; content: string;
};

export function getHobbies(): Hobby[] {
  const dir = path.join(contentDir, "hobbies");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const iconName = data.icon || "Code2";
    return {
      slug: file.replace(".md", ""), title: data.title || "",
      icon: ICON_MAP[iconName] || Code2, iconName,
      accentIndex: data.accentIndex || 1, summary: data.summary || "",
      image: data.image || "", content: content.trim(),
    };
  });
}

/* ═══ ABOUT ═══ */
export type AboutProfile = {
  name: string; title: string; tagline: string; eyebrow: string;
  skills: string[]; photo: string; bio: string;
};
export type AboutNote = { content: string };

export function getAboutProfile(): AboutProfile {
  const fp = path.join(contentDir, "about", "profile.md");
  if (!fs.existsSync(fp)) return { name: "", title: "", tagline: "", eyebrow: "", skills: [], photo: "", bio: "" };
  const { data, content } = matter(fs.readFileSync(fp, "utf-8"));
  return { name: data.name || "", title: data.title || "", tagline: data.tagline || "",
    eyebrow: data.eyebrow || "", skills: data.skills || [], photo: data.photo || "", bio: content.trim() };
}

export function getAboutNote(): AboutNote {
  const fp = path.join(contentDir, "about", "learning.md");
  if (!fs.existsSync(fp)) return { content: "" };
  const { content } = matter(fs.readFileSync(fp, "utf-8"));
  return { content: content.trim() };
}
