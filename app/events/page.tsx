import { getEvents } from "@/lib/content";
import EventsPageClient from "./EventsPageClient";

export default function EventsPage() {
  const events = getEvents().map((e) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    location: e.location,
    type: e.type,
    tags: e.tags,
    summary: e.summary,
    content: e.content,
  }));

  return <EventsPageClient events={events} />;
}
