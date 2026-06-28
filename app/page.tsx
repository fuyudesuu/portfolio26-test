import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import HobbiesPreview from "@/components/sections/HobbiesPreview";
import EventsPreview from "@/components/sections/EventsPreview";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <HobbiesPreview />
      <EventsPreview />
      <Contact />
    </>
  );
}
