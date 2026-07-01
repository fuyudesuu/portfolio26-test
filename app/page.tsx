import { getAboutProfile, getAboutNote, getHobbies, getEvents } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import HobbiesPreview from "@/components/sections/HobbiesPreview";
import EventsPreview from "@/components/sections/EventsPreview";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  const profile = getAboutProfile();
  const note = getAboutNote();
  const hobbies = getHobbies().map((h) => ({
    slug: h.slug,
    title: h.title,
    iconName: h.iconName,
    accentIndex: h.accentIndex,
    summary: h.summary,
    image: h.image,
    content: h.content,
  }));
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

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} note={note} />
      <HobbiesPreview hobbies={hobbies.slice(0, 2)} />
      <EventsPreview events={events.slice(0, 3)} />
      <Contact />
    </>
  );
}
