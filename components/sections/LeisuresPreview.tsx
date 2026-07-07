"use client";

import { SectionHeader } from "@/components/ui";
import HobbiesPreview from "./HobbiesPreview";
import EventsPreview from "./EventsPreview";
import type { ComponentProps } from "react";

type LeisuresProps = {
  hobbies: ComponentProps<typeof HobbiesPreview>["hobbies"];
  events: ComponentProps<typeof EventsPreview>["events"];
};

export default function LeisuresPreview({ hobbies, events }: LeisuresProps) {
  return (
    <section id="leisures" className="py-20 px-5">
      <SectionHeader title="Leisures" subtitle="Beyond the desk" />
      <div className="flex flex-col gap-14">
        <HobbiesPreview hobbies={hobbies} />
        <EventsPreview events={events} />
      </div>
    </section>
  );
}
