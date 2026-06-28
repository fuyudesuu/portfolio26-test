import {
  Camera, Music, Code2, Bike, User, Heart, CalendarDays, Phone,
  type LucideIcon,
} from "lucide-react";

/* ─── Navigation ─── */
export type NavItem = {
  label: string;
  id: string;
  icon: LucideIcon;
  type: "scroll" | "page";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "About", id: "about", icon: User, type: "scroll" },
  { label: "Hobbies", id: "hobbies", icon: Heart, type: "page" },
  { label: "Events", id: "events", icon: CalendarDays, type: "page" },
  { label: "Contact", id: "contact", icon: Phone, type: "scroll" },
];

/* ─── Skills ─── */
export const SKILLS: string[] = [
  "React", "TypeScript", "Next.js", "Tailwind",
  "Figma", "Swift", "Node.js", "Python",
];

/* ─── Hobbies ─── */
export type Hobby = {
  icon: LucideIcon;
  title: string;
  desc: string;
  long: string;
  accentIndex: 1 | 2 | 3;
  image: string;
};

export const HOBBIES: Hobby[] = [
  {
    icon: Camera,
    title: "Photography",
    desc: "Street & landscape photography across Southeast Asia",
    long: "I picked up a camera in 2019 during a solo trip through Vietnam and never put it down. These days I shoot mostly on a Fujifilm X-T5, chasing golden hour in alleyways and rice fields. My work leans toward moody street photography and wide landscape compositions.",
    accentIndex: 1,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  },
  {
    icon: Music,
    title: "Music Production",
    desc: "Lo-fi beats and ambient soundscapes in Ableton",
    long: "Music production started as a way to unwind after coding sessions. I work in Ableton Live, layering field recordings with soft synths and vinyl crackle. A few tracks have found their way onto lo-fi playlists.",
    accentIndex: 2,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
  },
  {
    icon: Code2,
    title: "Open Source",
    desc: "Contributing to tools that make dev life better",
    long: "I contribute to several open-source projects focused on developer tooling and accessibility. Most recently I've been working on a Figma-to-code plugin and a CLI tool for scaffolding design systems.",
    accentIndex: 3,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    icon: Bike,
    title: "Cycling",
    desc: "Weekend century rides and bike-packing adventures",
    long: "Road cycling is my moving meditation. I ride a Canyon Endurace and do regular century rides around the Mekong Delta. Last year I completed a 5-day bike-packing trip from Saigon to Dalat through the Central Highlands.",
    accentIndex: 1,
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
  },
];

/* ─── Events ─── */
export type EventType = "speaker" | "organizer" | "attendee";

export type PortfolioEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  desc: string;
  long: string;
  type: EventType;
  tags: string[];
};

export const EVENTS: PortfolioEvent[] = [
  {
    id: "e1",
    title: "React Summit 2026",
    date: "Mar 15, 2026",
    location: "Amsterdam, Netherlands",
    desc: "Speaker — Building scroll-driven UIs with modern React patterns",
    long: "Presented a 30-minute talk on using IntersectionObserver, CSS scroll-timeline, and React hooks to build performant scroll-driven interfaces. The talk covered real-world patterns from production apps and included live coding demos. Over 2,000 attendees across the main stage and livestream.",
    type: "speaker",
    tags: ["React", "Performance", "Animation"],
  },
  {
    id: "e2",
    title: "Saigon Design Meetup",
    date: "Jan 22, 2026",
    location: "Ho Chi Minh City, Vietnam",
    desc: "Organized monthly meetup for 120+ designers and developers",
    long: "Co-organized and MC'd the January edition of Saigon Design Meetup at the WeWork Bitexco space. Featured three speakers covering design tokens, motion design principles, and cross-platform typography. Grew attendance from 40 to 120+ over six months.",
    type: "organizer",
    tags: ["Design", "Community", "Leadership"],
  },
  {
    id: "e3",
    title: "JSConf Asia",
    date: "Nov 8, 2025",
    location: "Singapore",
    desc: "Workshop on animation performance in production apps",
    long: "Led a 3-hour hands-on workshop where participants built a scroll-animated portfolio page from scratch. Covered Framer Motion, FLIP animations, GPU-accelerated transforms, and measuring animation jank with Chrome DevTools. 45 participants, fully booked.",
    type: "speaker",
    tags: ["JavaScript", "Workshop", "Animation"],
  },
  {
    id: "e4",
    title: "Hack for Good",
    date: "Sep 12, 2025",
    location: "Bangkok, Thailand",
    desc: "48h hackathon — built an accessibility auditing tool, won 2nd place",
    long: "Teamed up with three other developers to build AccessLens, a browser extension that overlays WCAG compliance issues directly on any webpage in real-time. We used Chrome Extension APIs, axe-core, and React for the popup UI. Won second place out of 32 teams.",
    type: "attendee",
    tags: ["Hackathon", "Accessibility", "Chrome Extension"],
  },
  {
    id: "e5",
    title: "Apple WWDC Watch Party",
    date: "Jun 10, 2025",
    location: "Ho Chi Minh City, Vietnam",
    desc: "Hosted a community watch party with 80+ iOS enthusiasts",
    long: "Organized a WWDC 2025 keynote watch party at a local co-working space. Set up a projector, arranged food and drinks, and facilitated a post-keynote discussion panel with three local iOS developers. Great energy around the new SwiftUI features.",
    type: "organizer",
    tags: ["iOS", "Swift", "Community"],
  },
];

/* ─── Accent color mapping ─── */
export const ACCENT_COLORS: Record<number, string> = {
  1: "var(--accent-1)",
  2: "var(--accent-2)",
  3: "var(--accent-3)",
};

export const EVENT_BADGE_CONFIG: Record<EventType, { label: string; accentIndex: number }> = {
  speaker: { label: "Speaker", accentIndex: 2 },
  organizer: { label: "Organizer", accentIndex: 3 },
  attendee: { label: "Attendee", accentIndex: 1 },
};
