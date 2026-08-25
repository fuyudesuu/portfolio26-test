import { getAboutProfile, getAboutNote, getHobbies, getEvents, getResume } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ResumePreview from "@/components/sections/ResumePreview";
import LeisuresPreview from "@/components/sections/LeisuresPreview";
import Contact from "@/components/sections/Contact";
import Instruments from "@/components/ui/Instruments";

export default function HomePage() {
  const profile = getAboutProfile();
  const note = getAboutNote();
  const resume = getResume();
  const hobbies = getHobbies().map((h) => ({
    slug: h.slug,
    title: h.title,
    iconName: h.iconName,
    accentIndex: h.accentIndex,
    summary: h.summary,
    image: h.image,
    kanjiTag: h.kanjiTag,
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
      <Instruments />
      <Hero profile={profile} />
      <About profile={profile} note={note} />
      <ResumePreview resume={resume} />
      <LeisuresPreview hobbies={hobbies.slice(0, 2)} events={events.slice(0, 3)} />
      <Contact />
    </>
  );
}
