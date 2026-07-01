/* ─── Types ─── */
export type EventType = "speaker" | "organizer" | "attendee";

/* ─── Accent colors (CSS variable references) ─── */
export const ACCENT_COLORS: Record<number, string> = {
  1: "var(--accent-1)",
  2: "var(--accent-2)",
  3: "var(--accent-3)",
};

/* ─── Event badge config ─── */
export const EVENT_BADGE_CONFIG: Record<EventType, { label: string; accentIndex: number }> = {
  speaker: { label: "Speaker", accentIndex: 2 },
  organizer: { label: "Organizer", accentIndex: 3 },
  attendee: { label: "Attendee", accentIndex: 1 },
};
