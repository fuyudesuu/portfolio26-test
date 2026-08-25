/* ─── Types ─── */
export type EventType = "speaker" | "organizer" | "attendee";

/* ─── Navbar search ─── */
export type SearchCategory = "Section" | "Skill" | "Hobby" | "Event" | "Project";

export type SearchEntry = {
  label: string;
  category: SearchCategory;
  /** Nav id passed to the navbar's navigate(): a scroll target or a page route. */
  navId: string;
};

/* ─── Dates ─── */
/** Render an ISO yyyy-mm-dd date as "Mar 15, 2026"; passes through anything unparsable. */
export function formatEventDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/* ─── Accent colors (CSS variable references) ─── */
export const ACCENT_COLORS: Record<number, string> = {
  1: "var(--accent-1)",
  2: "var(--accent-2)",
  3: "var(--accent-3)",
};

/* ─── Event badge config ─── */
/** `jp` is the quiet bilingual label rendered next to the English one. */
export const EVENT_BADGE_CONFIG: Record<EventType, { label: string; jp: string; accentIndex: number }> = {
  speaker: { label: "Speaker", jp: "登壇", accentIndex: 2 },
  organizer: { label: "Organizer", jp: "主催", accentIndex: 3 },
  attendee: { label: "Attendee", jp: "参加", accentIndex: 1 },
};
